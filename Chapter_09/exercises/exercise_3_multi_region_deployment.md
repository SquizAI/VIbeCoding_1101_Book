# Exercise 3: Implementing a Multi-Region Production Architecture

## Overview

In this advanced ninja-level exercise, you will design and implement a multi-region architecture for the task management application to achieve high availability, disaster recovery capabilities, and global performance optimization.

## Learning Objectives

- Design a multi-region infrastructure architecture
- Implement data replication across regions
- Configure global traffic routing
- Set up cross-region monitoring
- Create disaster recovery procedures

## Prerequisites

- Completed Exercises 1 and 2
- Advanced knowledge of AWS services
- Experience with Infrastructure as Code
- Understanding of distributed systems concepts

## Exercise

### Part 1: Design Multi-Region Architecture

1. **Create Architecture Diagram**:

Design a complete multi-region architecture that includes:
- Primary and secondary AWS regions
- Data replication strategy
- Global traffic routing
- Failover mechanisms
- Backup and recovery processes

2. **Document Design Decisions**:

Create a detailed technical specification document (2-3 pages) that explains:
- Region selection criteria
- Active-active vs. active-passive strategy
- Data consistency approach
- Latency considerations
- Cost optimization strategy

### Part 2: Implement Infrastructure as Code

1. **Create Terraform Configuration for Multi-Region Setup**:

```hcl
# multi-region/providers.tf
terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  
  backend "s3" {
    bucket         = "taskmanager-terraform-state"
    key            = "global/terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = "us-west-2"
  alias  = "primary"
}

provider "aws" {
  region = "us-east-1"
  alias  = "secondary"
}

# multi-region/networking.tf
module "vpc_primary" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"
  
  providers = {
    aws = aws.primary
  }
  
  name = "taskmanager-vpc-primary"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  
  tags = {
    Environment = "production"
    Region      = "primary"
  }
}

module "vpc_secondary" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 3.0"
  
  providers = {
    aws = aws.secondary
  }
  
  name = "taskmanager-vpc-secondary"
  cidr = "10.1.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  public_subnets  = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]
  
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  
  tags = {
    Environment = "production"
    Region      = "secondary"
  }
}
```

2. **Implement Global Database with Cross-Region Replication**:

```hcl
# multi-region/database.tf
resource "aws_rds_global_cluster" "taskmanager" {
  global_cluster_identifier = "taskmanager-global"
  engine                    = "aurora-postgresql"
  engine_version            = "13.6"
  database_name             = "taskmanager"
  storage_encrypted         = true
}

module "aurora_primary" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 7.0"
  
  providers = {
    aws = aws.primary
  }
  
  name                  = "taskmanager-primary"
  engine                = "aurora-postgresql"
  engine_version        = "13.6"
  instance_type         = "db.r6g.large"
  instance_type_replica = "db.r6g.large"
  
  vpc_id                = module.vpc_primary.vpc_id
  subnets               = module.vpc_primary.database_subnets
  
  replica_count         = 2
  storage_encrypted     = true
  apply_immediately     = true
  
  global_cluster_identifier = aws_rds_global_cluster.taskmanager.id
  is_primary_cluster        = true
  
  # ... other configuration
}

module "aurora_secondary" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "~> 7.0"
  
  providers = {
    aws = aws.secondary
  }
  
  name                  = "taskmanager-secondary"
  engine                = "aurora-postgresql"
  engine_version        = "13.6"
  instance_type         = "db.r6g.large"
  instance_type_replica = "db.r6g.large"
  
  vpc_id                = module.vpc_secondary.vpc_id
  subnets               = module.vpc_secondary.database_subnets
  
  replica_count         = 2
  storage_encrypted     = true
  apply_immediately     = true
  
  global_cluster_identifier = aws_rds_global_cluster.taskmanager.id
  is_primary_cluster        = false
  
  # ... other configuration
}
```

### Part 3: Implement Global Traffic Routing

1. **Set Up Route 53 Global Routing**:

```hcl
# multi-region/routing.tf
resource "aws_route53_zone" "primary" {
  name = "taskmanager.example.com"
}

resource "aws_route53_health_check" "primary" {
  fqdn              = "api-primary.taskmanager.example.com"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30
  
  tags = {
    Name = "primary-health-check"
  }
}

resource "aws_route53_health_check" "secondary" {
  fqdn              = "api-secondary.taskmanager.example.com"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30
  
  tags = {
    Name = "secondary-health-check"
  }
}

resource "aws_route53_record" "api_primary" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api-primary.taskmanager.example.com"
  type    = "A"
  
  alias {
    name                   = module.api_gateway_primary.apigatewayv2_domain_name_target_domain_name
    zone_id                = module.api_gateway_primary.apigatewayv2_domain_name_hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api_secondary" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api-secondary.taskmanager.example.com"
  type    = "A"
  
  alias {
    name                   = module.api_gateway_secondary.apigatewayv2_domain_name_target_domain_name
    zone_id                = module.api_gateway_secondary.apigatewayv2_domain_name_hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.taskmanager.example.com"
  type    = "A"
  
  failover_routing_policy {
    type = "PRIMARY"
  }
  
  set_identifier = "primary"
  health_check_id = aws_route53_health_check.primary.id
  
  alias {
    name                   = module.api_gateway_primary.apigatewayv2_domain_name_target_domain_name
    zone_id                = module.api_gateway_primary.apigatewayv2_domain_name_hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api_secondary_failover" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.taskmanager.example.com"
  type    = "A"
  
  failover_routing_policy {
    type = "SECONDARY"
  }
  
  set_identifier = "secondary"
  health_check_id = aws_route53_health_check.secondary.id
  
  alias {
    name                   = module.api_gateway_secondary.apigatewayv2_domain_name_target_domain_name
    zone_id                = module.api_gateway_secondary.apigatewayv2_domain_name_hosted_zone_id
    evaluate_target_health = true
  }
}
```

### Part 4: Implement Application-Level Multi-Region Support

1. **Create Database Connection Manager**:

```javascript
// backend/src/db/connection-manager.js
const { Pool } = require('pg');
const retry = require('async-retry');

class DatabaseManager {
  constructor() {
    this.currentRegion = process.env.AWS_REGION || 'us-west-2';
    this.primaryRegion = 'us-west-2';
    this.secondaryRegion = 'us-east-1';
    
    this.pools = {
      primary: this.createPool(process.env.PRIMARY_DB_URL),
      secondary: this.createPool(process.env.SECONDARY_DB_URL)
    };
    
    // Set up health check interval
    setInterval(() => this.checkPoolHealth(), 60000);
  }
  
  createPool(connectionString) {
    const pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool.unhealthy = true;
    });
    
    return pool;
  }
  
  async checkPoolHealth() {
    for (const region in this.pools) {
      try {
        const client = await this.pools[region].connect();
        await client.query('SELECT 1');
        client.release();
        
        // Mark as healthy
        this.pools[region].unhealthy = false;
      } catch (err) {
        console.error(`Health check failed for ${region} database pool`, err);
        this.pools[region].unhealthy = true;
      }
    }
  }
  
  getWritePool() {
    // Always use primary for writes, unless unhealthy
    if (!this.pools.primary.unhealthy) {
      return this.pools.primary;
    }
    
    // Fallback to secondary if primary is down
    console.warn('Primary database unavailable, failing over to secondary');
    return this.pools.secondary;
  }
  
  getReadPool() {
    // Use regional preference for reads
    const preferredRegion = this.currentRegion === this.primaryRegion ? 'primary' : 'secondary';
    
    if (!this.pools[preferredRegion].unhealthy) {
      return this.pools[preferredRegion];
    }
    
    // Fallback to other region
    const fallbackRegion = preferredRegion === 'primary' ? 'secondary' : 'primary';
    return this.pools[fallbackRegion];
  }
  
  async executeWrite(text, params) {
    return retry(async (bail) => {
      try {
        const pool = this.getWritePool();
        return await pool.query(text, params);
      } catch (err) {
        console.error('Database write error, retrying:', err);
        throw err;
      }
    }, {
      retries: 3,
      minTimeout: 300,
      maxTimeout: 3000,
    });
  }
  
  async executeRead(text, params) {
    return retry(async () => {
      try {
        const pool = this.getReadPool();
        return await pool.query(text, params);
      } catch (err) {
        console.error('Database read error, retrying:', err);
        throw err;
      }
    }, {
      retries: 3,
      minTimeout: 300,
      maxTimeout: 3000,
    });
  }
}

module.exports = new DatabaseManager();
```

### Part 5: Implement Disaster Recovery Procedures

1. **Create Disaster Recovery Documentation**:

Create a comprehensive disaster recovery plan that includes:
- Failure scenarios and response procedures
- Regional failover process
- Data recovery procedures
- Communication templates
- Testing schedule

2. **Implement Regional Failover Script**:

```bash
#!/bin/bash
# regional-failover.sh

set -e

# Check if the primary region is available
primary_status=$(aws cloudwatch get-metric-data \
  --metric-data-queries '[{"id":"m1","metricStat":{"metric":{"namespace":"AWS/Route53","metricName":"HealthCheckStatus","dimensions":[{"name":"HealthCheckId","value":"'"$PRIMARY_HEALTH_CHECK_ID"'"}]},"period":60,"stat":"Average"},"returnData":true}]' \
  --start-time $(date -u -v-5M +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --output json \
  --query 'MetricDataResults[0].Values[0]')

# If primary is down, trigger manual failover
if [[ "$primary_status" == "0" ]]; then
  echo "Primary region is down, initiating failover to secondary region"
  
  # Promote the secondary database to primary
  aws rds failover-global-cluster \
    --global-cluster-identifier taskmanager-global \
    --target-db-cluster-identifier arn:aws:rds:us-east-1:123456789012:cluster:taskmanager-secondary
  
  # Update DNS routing policy to direct traffic to secondary region
  aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch '{
      "Changes": [
        {
          "Action": "UPSERT",
          "ResourceRecordSet": {
            "Name": "api.taskmanager.example.com",
            "Type": "A",
            "SetIdentifier": "primary",
            "Failover": "PRIMARY",
            "AliasTarget": {
              "HostedZoneId": "'"$SECONDARY_HOSTED_ZONE_ID"'",
              "DNSName": "api-secondary.taskmanager.example.com",
              "EvaluateTargetHealth": true
            }
          }
        }
      ]
    }'
  
  # Send notification about the failover
  aws sns publish \
    --topic-arn $SNS_TOPIC_ARN \
    --subject "ALERT: Automatic failover to secondary region initiated" \
    --message "Automatic failover to the secondary region has been initiated due to primary region failure. Please investigate the root cause."
  
  echo "Failover to secondary region completed"
else
  echo "Primary region is healthy, no failover needed"
fi
```

## Deliverables

1. Complete Terraform configuration for multi-region architecture
2. Working application with cross-region capabilities
3. Global traffic routing implementation
4. Comprehensive documentation including:
   - Architecture diagram and rationale
   - Data replication strategy
   - Traffic routing implementation
   - Disaster recovery procedures
   - Failover testing results
5. Video demonstration of a regional failover scenario

## Assessment Criteria

- Robustness of multi-region architecture
- Implementation of proper data replication
- Effectiveness of global traffic routing
- Comprehensiveness of disaster recovery procedures
- Quality of documentation and diagrams

## Resources

- [AWS Global Tables Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html)
- [AWS Global Aurora Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html)
- [Route 53 Failover Routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-failover.html)
- [Multi-Region Application Architecture](https://d1.awsstatic.com/whitepapers/aws-multi-region-application-architecture.pdf)

## Next Steps

After completing this exercise, consider:
- Implementing multi-region cache synchronization
- Adding global CDN distribution
- Creating automated regional failover
- Implementing chaos engineering tests for multi-region resilience
