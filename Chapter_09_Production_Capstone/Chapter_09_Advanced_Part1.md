<div align="center">

# ⚡ Production_Capstone: Advanced Level ⚡

</div>

<div align="center">

![Vibe Coding Banner](https://i.imgur.com/XYZ123.png)

</div>

<div align="center">

> *"The future belongs to those who blend human creativity with AI capabilities"*

</div>

---


## 🔷 Introduction to Advanced Production Deployment

Welcome to the advanced section of our production deployment capstone! This part covers sophisticated deployment strategies and infrastructure for the task management application we built in Chapter 8. We'll focus on CI/CD pipelines, Kubernetes deployment, and advanced monitoring.

> **2025 Update**: Immutable infrastructure, GitOps, and AI-assisted operations have become standard practices for modern production environments, enabling more reliable and secure deployments with reduced operational overhead.


## 🔷 Implementing a Professional CI/CD Pipeline

Advanced deployments require robust CI/CD pipelines to automate testing, building, and deployment processes.


### 🔹 Setting Up GitHub Actions for CI/CD

Let's implement a comprehensive GitHub Actions workflow:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Lint code
        run: |
          cd backend
          npm run lint
          
      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          DATABASE_URL: postgresql://testuser:testpassword@localhost:5432/testdb
          JWT_SECRET: test-secret-key
          
  build:
    name: Build
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies and build backend
        run: |
          cd backend
          npm ci
          npm run build
          
      - name: Install dependencies and build frontend
        run: |
          cd frontend
          npm ci
          npm run build
          
      - name: Upload backend artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-build
          path: backend/dist
          
      - name: Upload frontend artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/build
```


### 🔹 Adding Deployment Stages

Let's add deployment stages to our CI/CD pipeline:

```yaml

  deploy-staging:
    name: Deploy to Staging
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.taskmanager.example.com
    steps:
      - uses: actions/checkout@v3
      
      - name: Download backend artifact
        uses: actions/download-artifact@v3
        with:
          name: backend-build
          path: backend/dist
          
      - name: Download frontend artifact
        uses: actions/download-artifact@v3
        with:
          name: frontend-build
          path: frontend/build
          
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
        
      - name: Build and push backend Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: taskmanager-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          
      - name: Update Kubernetes deployment
        run: |
          aws eks update-kubeconfig --name taskmanager-staging-cluster --region us-west-2
          kubectl set image deployment/backend backend=${{ steps.login-ecr.outputs.registry }}/taskmanager-backend:${{ github.sha }} -n staging
          
      - name: Deploy frontend to S3
        run: |
          cd frontend/build
          aws s3 sync . s3://taskmanager-staging-frontend --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID_STAGING }} --paths "/*"
          
  deploy-production:
    name: Deploy to Production
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://taskmanager.example.com
    steps:
      - uses: actions/checkout@v3
      
      # Similar steps as staging but with production-specific variables and safeguards
      # Include approval step before production deployment
```


## 🔷 Infrastructure as Code Implementation

Advanced deployments should use Infrastructure as Code (IaC) to manage cloud resources.


### 🔹 Setting Up Terraform for AWS Infrastructure

Create a structured Terraform project:

```hcl
provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    bucket         = "taskmanager-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.10"
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = "${var.prefix}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = var.common_tags
}

resource "aws_security_group" "api" {
  name        = "${var.prefix}-api-sg"
  description = "Security group for API servers"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.common_tags
}
```


### 🔹 Database Infrastructure

```hcl
module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "5.0.0"

  identifier = "${var.prefix}-db"

  engine               = "postgres"
  engine_version       = "14.4"
  family               = "postgres14"
  major_engine_version = "14"
  instance_class       = "db.t3.medium"

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = var.db_name
  username = var.db_username
  port     = 5432

  password = var.db_password

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.database.id]

  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 7

  tags = var.common_tags
}

resource "aws_security_group" "database" {
  name        = "${var.prefix}-database-sg"
  description = "Security group for database"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.common_tags
}
```


### 🔹 EKS Cluster Configuration

```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "18.20.5"

  cluster_name    = "${var.prefix}-cluster"
  cluster_version = "1.24"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true

  # Extend cluster security group rules
  cluster_security_group_additional_rules = {
    egress_all = {
      description      = "Egress all"
      protocol         = "-1"
      from_port        = 0
      to_port          = 0
      type             = "egress"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }
  }

  eks_managed_node_groups = {
    main = {
      desired_size = 2
      min_size     = 2
      max_size     = 5

      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"

      update_config = {
        max_unavailable_percentage = 50
      }
    }
  }

  tags = var.common_tags
}

module "eks_oidc_provider" {
  source  = "terraform-aws-modules/eks/aws//modules/oidc-provider"
  version = "18.20.5"

  cluster_name = module.eks.cluster_name
  
  depends_on = [module.eks]
}
```

---

<div align="center">

**[⬅️ Previous Chapter](../Chapter__*) | [📚 Table of Contents](../../README.md) | [➡️ Next Chapter](../Chapter__*)**

</div>

<div align="center">

**🔰 [Beginner](./Chapter_09_Beginner.md) | ⚙️ [Advanced](./Chapter_09_Advanced.md) | ⚔️ [Ninja](./Chapter_09_Ninja.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
