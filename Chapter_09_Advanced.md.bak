# Production Deployment: Advanced Level (Part 1)

## Introduction to Advanced Production Deployment

Welcome to the advanced section of our production deployment capstone! This part covers sophisticated deployment strategies and infrastructure for the task management application we built in Chapter 8. We'll focus on CI/CD pipelines, Kubernetes deployment, and advanced monitoring.

## Advanced Development and Deployment Platforms

Before we dive into deployment strategies, let's explore some advanced platforms that are transforming how developers build and deploy applications in 2025:

### Windsurf

[Windsurf](https://windsurf.com/editor) by Codeium is an AI-powered development environment focused on enterprise-grade production applications:

- **Key Features**:
  - Cascade AI assistant for agile code development
  - End-to-end autonomous programming capabilities
  - Extensive language and IDE support (over 70 languages)
  - Deep codebase understanding for context-aware assistance
  - Seamless integration with deployment workflows

- **Deployment Advantages**:
  - AI-assisted CI/CD pipeline configuration
  - Automated error detection and fixing during deployment
  - Intelligent infrastructure recommendations
  - Proactive monitoring and alerting suggestions
  - Enterprise-grade security compliance tools

- **When to Use**: When building complex, production-grade applications that require sophisticated CI/CD pipelines and monitoring solutions.

### Cursor

[Cursor](https://cursor.com) is an advanced code editor with powerful AI capabilities that extends to deployment:

- **Key Features**:
  - Agent Mode for end-to-end task execution
  - Custom context retrieval across entire codebases
  - Automated terminal command generation
  - Intelligent error detection and fixing
  - Visual context with image input capabilities

- **Deployment Advantages**:
  - Automated Infrastructure as Code (IaC) generation
  - Deployment script optimization and validation
  - Runtime error prediction and prevention
  - Multi-environment configuration management
  - Seamless cloud service integration

- **When to Use**: For teams that need deep code analysis capabilities and intelligent deployment automation in complex environments.

### Cline

[Cline](https://cline.so) is an AI-powered CLI tool designed for professional developers handling complex deployments:

- **Key Features**:
  - Command-line intelligence with natural language
  - Integration with cloud providers and CI/CD systems
  - Advanced bash automation capabilities
  - Secure credential handling for deployment
  - Context-aware infrastructure management

- **Deployment Advantages**:
  - Zero-downtime deployment orchestration
  - Blue-green and canary deployment configuration
  - Multi-cloud deployment synchronization
  - Production rollback management
  - Infrastructure drift detection and resolution

- **When to Use**: For DevOps professionals and backend developers who prefer command-line workflows and need powerful automation for complex deployment scenarios.

> **2025 Update**: Immutable infrastructure, GitOps, and AI-assisted operations have become standard practices for modern production environments, enabling more reliable and secure deployments with reduced operational overhead.

## Implementing a Professional CI/CD Pipeline

Advanced deployments require robust CI/CD pipelines to automate testing, building, and deployment processes.

### Setting Up GitHub Actions for CI/CD

Let's implement a comprehensive GitHub Actions workflow:

```yaml
# .github/workflows/ci-cd.yml
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

### Adding Deployment Stages

Let's add deployment stages to our CI/CD pipeline:

```yaml
# Additional deployment jobs for .github/workflows/ci-cd.yml

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

## Infrastructure as Code Implementation

Advanced deployments should use Infrastructure as Code (IaC) to manage cloud resources.

### Setting Up Terraform for AWS Infrastructure

Create a structured Terraform project:

```hcl
# main.tf
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

# VPC and networking
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

# Security groups
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

### Database Infrastructure

```hcl
# database.tf
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

### EKS Cluster Configuration

```hcl
# eks.tf
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

# OIDC Provider for service account IAM roles
module "eks_oidc_provider" {
  source  = "terraform-aws-modules/eks/aws//modules/oidc-provider"
  version = "18.20.5"

  cluster_name = module.eks.cluster_name
  
  depends_on = [module.eks]
}
```
# Production Deployment: Advanced Level (Part 2)

## Advanced Kubernetes Deployment Strategies

For production-grade applications, we need sophisticated deployment strategies to ensure reliability and zero downtime.

### Implementing Kubernetes Deployments

Let's set up Kubernetes deployment manifests for our task management application:

```yaml
# kubernetes/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: production
  labels:
    app: taskmanager
    component: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taskmanager
      component: backend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: taskmanager
        component: backend
    spec:
      containers:
      - name: backend
        image: ${ECR_REGISTRY}/taskmanager-backend:${IMAGE_TAG}
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 20
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "8080"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
```

### Implementing Kubernetes Services

```yaml
# kubernetes/backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: production
  labels:
    app: taskmanager
    component: backend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: taskmanager
    component: backend
```

### Implementing Kubernetes Ingress

```yaml
# kubernetes/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: taskmanager-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
spec:
  tls:
  - hosts:
    - api.taskmanager.example.com
    secretName: taskmanager-tls
  rules:
  - host: api.taskmanager.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 80
```

### Blue-Green Deployment Implementation

For zero-downtime deployments, let's implement a blue-green deployment strategy:

```yaml
# kubernetes/blue-green/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: production
  labels:
    app: taskmanager
    component: backend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: taskmanager
    component: backend
    # This selector dynamically changes between blue and green
    deployment: blue  # or green
```

```yaml
# kubernetes/blue-green/blue-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-blue
  namespace: production
  labels:
    app: taskmanager
    component: backend
    deployment: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taskmanager
      component: backend
      deployment: blue
  template:
    metadata:
      labels:
        app: taskmanager
        component: backend
        deployment: blue
    spec:
      # Same container spec as regular deployment
```

```yaml
# kubernetes/blue-green/green-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-green
  namespace: production
  labels:
    app: taskmanager
    component: backend
    deployment: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taskmanager
      component: backend
      deployment: green
  template:
    metadata:
      labels:
        app: taskmanager
        component: backend
        deployment: green
    spec:
      # Same container spec as regular deployment
```

### Blue-Green Deployment Script

```bash
#!/bin/bash
# blue-green-deploy.sh

set -e

# Determine current active deployment (blue or green)
CURRENT_DEPLOYMENT=$(kubectl get service backend -n production -o jsonpath='{.spec.selector.deployment}')

if [ "$CURRENT_DEPLOYMENT" == "blue" ]; then
  TARGET_DEPLOYMENT="green"
  INACTIVE_DEPLOYMENT="blue"
else
  TARGET_DEPLOYMENT="green"
  INACTIVE_DEPLOYMENT="blue"
fi

echo "Current deployment is $CURRENT_DEPLOYMENT, switching to $TARGET_DEPLOYMENT"

# Update the inactive deployment
kubectl set image deployment/backend-$TARGET_DEPLOYMENT backend=${ECR_REGISTRY}/taskmanager-backend:${IMAGE_TAG} -n production

# Wait for deployment to be ready
kubectl rollout status deployment/backend-$TARGET_DEPLOYMENT -n production

# Verify the new deployment with tests
echo "Running smoke tests on $TARGET_DEPLOYMENT"
# Run your smoke tests here

# Switch the service to the new deployment
kubectl patch service backend -n production -p "{\"spec\":{\"selector\":{\"deployment\":\"$TARGET_DEPLOYMENT\"}}}"

echo "Successfully switched from $CURRENT_DEPLOYMENT to $TARGET_DEPLOYMENT"

# Scale down the old deployment (optional)
# kubectl scale deployment backend-$INACTIVE_DEPLOYMENT --replicas=0 -n production
```

## Advanced Monitoring and Observability

Production applications require comprehensive monitoring for reliability and performance.

### Setting Up Prometheus for Metrics Collection

```yaml
# monitoring/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
      
    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          - alertmanager:9093
          
    rule_files:
      - /etc/prometheus/rules/*.rules
      
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:9090']
          
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name
```

### Kubernetes Prometheus Deployment

```yaml
# monitoring/prometheus-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
  labels:
    app: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      serviceAccountName: prometheus
      containers:
      - name: prometheus
        image: prom/prometheus:v2.37.0
        args:
          - "--config.file=/etc/prometheus/prometheus.yml"
          - "--storage.tsdb.path=/prometheus"
          - "--storage.tsdb.retention.time=15d"
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-config
          mountPath: /etc/prometheus
        - name: prometheus-storage
          mountPath: /prometheus
      volumes:
      - name: prometheus-config
        configMap:
          name: prometheus-config
      - name: prometheus-storage
        persistentVolumeClaim:
          claimName: prometheus-storage
```

### Setting Up Grafana for Visualization

```yaml
# monitoring/grafana-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
  labels:
    app: grafana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:9.1.0
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: GF_SECURITY_ADMIN_USER
          valueFrom:
            secretKeyRef:
              name: grafana-credentials
              key: admin-user
        - name: GF_SECURITY_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: grafana-credentials
              key: admin-password
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
        - name: grafana-datasources
          mountPath: /etc/grafana/provisioning/datasources
        - name: grafana-dashboards
          mountPath: /etc/grafana/provisioning/dashboards
      volumes:
      - name: grafana-storage
        persistentVolumeClaim:
          claimName: grafana-storage
      - name: grafana-datasources
        configMap:
          name: grafana-datasources
      - name: grafana-dashboards
        configMap:
          name: grafana-dashboards
```

### Grafana Data Sources Configuration

```yaml
# monitoring/grafana-datasources.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: monitoring
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        access: proxy
        url: http://prometheus:9090
        isDefault: true
```

## Implementing Distributed Tracing

For complex applications, distributed tracing helps diagnose performance issues.

### Setting Up OpenTelemetry for Tracing

```yaml
# monitoring/otel-collector.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: otel-collector-config
  namespace: monitoring
data:
  otel-collector-config.yaml: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
    
    processors:
      batch:
        timeout: 1s
        send_batch_size: 1024
      
      memory_limiter:
        check_interval: 1s
        limit_mib: 1800
    
    exporters:
      jaeger:
        endpoint: jaeger-collector:14250
        tls:
          insecure: true
      
      prometheus:
        endpoint: 0.0.0.0:8889
    
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [jaeger]
        metrics:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [prometheus]
```
# Production Deployment: Advanced Level (Part 3)

## Advanced Security Implementation

Securing production applications requires a comprehensive approach across infrastructure, application, and operational levels.

### Implementing Network Security Policies

Kubernetes Network Policies restrict communication between pods for improved security:

```yaml
# security/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: taskmanager
      component: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: taskmanager
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: taskmanager
          component: database
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: taskmanager
          component: redis
    ports:
    - protocol: TCP
      port: 6379
```

### Implementing Security Context Constraints

```yaml
# security/security-context.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-secure
  namespace: production
spec:
  # ... other deployment specs
  template:
    spec:
      securityContext:
        runAsUser: 1000
        runAsGroup: 3000
        fsGroup: 2000
      containers:
      - name: backend
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        # ... other container specs
        volumeMounts:
        - name: tmp-volume
          mountPath: /tmp
      volumes:
      - name: tmp-volume
        emptyDir: {}
```

### Implementing Pod Security Policies

```yaml
# security/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: 'docker/default,runtime/default'
    apparmor.security.beta.kubernetes.io/allowedProfileNames: 'runtime/default'
    seccomp.security.alpha.kubernetes.io/defaultProfileName:  'runtime/default'
    apparmor.security.beta.kubernetes.io/defaultProfileName:  'runtime/default'
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: true
```

### Secret Management with AWS Secrets Manager

```javascript
// config/secrets.js
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'us-west-2'
});

async function getSecrets() {
  try {
    const secretName = process.env.SECRET_NAME || 'taskmanager/production';
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    let secretString;
    
    if ('SecretString' in data) {
      secretString = data.SecretString;
    } else {
      const buff = Buffer.from(data.SecretBinary, 'base64');
      secretString = buff.toString('ascii');
    }
    
    return JSON.parse(secretString);
  } catch (err) {
    console.error('Error retrieving secrets:', err);
    throw err;
  }
}

module.exports = { getSecrets };
```

### Implementing AWS WAF for API Protection

```yaml
# security/waf-cloudformation.yaml
Resources:
  TaskManagerWAF:
    Type: AWS::WAFv2::WebACL
    Properties:
      Name: TaskManagerWebACL
      Scope: REGIONAL
      DefaultAction:
        Allow: {}
      VisibilityConfig:
        SampledRequestsEnabled: true
        CloudWatchMetricsEnabled: true
        MetricName: TaskManagerWebACL
      Rules:
        - Name: AWSManagedRulesCommonRuleSet
          Priority: 0
          OverrideAction:
            None: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWSManagedRulesCommonRuleSet
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesCommonRuleSet
        
        - Name: AWSManagedRulesKnownBadInputsRuleSet
          Priority: 1
          OverrideAction:
            None: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWSManagedRulesKnownBadInputsRuleSet
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesKnownBadInputsRuleSet
        
        - Name: AWSManagedRulesSQLiRuleSet
          Priority: 2
          OverrideAction:
            None: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWSManagedRulesSQLiRuleSet
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesSQLiRuleSet
              
        - Name: RateBasedRule
          Priority: 3
          Action:
            Block: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: RateBasedRule
          Statement:
            RateBasedStatement:
              Limit: 1000
              AggregateKeyType: IP
```

## Performance Optimization

### Database Performance Tuning

Setting up connection pooling and optimizing PostgreSQL:

```javascript
// db/connection.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '10000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10),
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Add instrumentation for monitoring
pool.on('connect', () => {
  console.debug('New database connection established');
});

pool.on('acquire', () => {
  console.debug('Database connection acquired from pool');
});

pool.on('remove', () => {
  console.debug('Database connection removed from pool');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Override release method to track release time
    client.release = () => {
      client.lastReleaseTime = Date.now();
      return release.apply(client);
    };
    
    // Override query method to track query time
    client.query = (...args) => {
      client.lastQueryTime = Date.now();
      return query.apply(client, args);
    };
    
    return client;
  },
  end: () => pool.end(),
};
```

### PostgreSQL Configuration for Production

```ini
# postgresql.conf
max_connections = 200
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
work_mem = 5MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_parallel_maintenance_workers = 4
synchronous_commit = off
autovacuum = on
log_min_duration_statement = 100ms
```

### Setting up Redis Caching

```javascript
// cache/redis.js
const Redis = require('ioredis');

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: 3,
  connectTimeout: 5000,
  enableReadyCheck: true,
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined
};

// Create Redis client
const redisClient = new Redis(redisOptions);

redisClient.on('connect', () => {
  console.info('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

// Cache wrapper with TTL in seconds
async function cacheSet(key, value, ttl = 3600) {
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    return true;
  } catch (error) {
    console.error('Redis cache set error:', error);
    return false;
  }
}

// Get value from cache
async function cacheGet(key) {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
}

// Delete value from cache
async function cacheDelete(key) {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis cache delete error:', error);
    return false;
  }
}

// Clear cache by pattern
async function cacheClear(pattern = '*') {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis cache clear error:', error);
    return false;
  }
}

module.exports = {
  redisClient,
  cacheSet,
  cacheGet,
  cacheDelete,
  cacheClear
};
```

### API Response Caching Middleware

```javascript
// middleware/cache.js
const { cacheGet, cacheSet } = require('../cache/redis');

// Cache middleware
function cacheMiddleware(ttl = 3600) {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Skip caching for authenticated requests with specific user data
    if (req.user && !req.query.allowCache) {
      return next();
    }
    
    // Create a cache key based on the URL and query params
    const cacheKey = `api:${req.originalUrl}`;
    
    try {
      // Try to get from cache
      const cachedResponse = await cacheGet(cacheKey);
      
      if (cachedResponse) {
        // Return cached response
        return res.status(200).json({
          ...cachedResponse,
          _cached: true
        });
      }
      
      // Store the original res.json method
      const originalJson = res.json;
      
      // Override res.json method to cache the response
      res.json = function(data) {
        // Cache the response
        cacheSet(cacheKey, data, ttl).catch(err => {
          console.error('Cache middleware error:', err);
        });
        
        // Call the original method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

module.exports = cacheMiddleware;
```
