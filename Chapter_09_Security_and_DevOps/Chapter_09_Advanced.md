<div align="center">

# Chapter 09: Security and DevOps - Advanced Level

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

<div align="center">

> *"Modern DevOps is where automation meets security, enabling velocity without sacrificing quality."*

</div>

---

<div align="center">

**[⬅️ Previous Chapter](../Chapter_08_Advanced_Machine_Learning/Chapter_08_Main.md) | [📚 Table of Contents](../README.md) | [➡️ Next Chapter](../README.md)**

</div>

<div align="center">

**[🔰 Beginner](./Chapter_09_Beginner.md) | [⚙️ Advanced](./Chapter_09_Advanced.md) | [⚔️ Ninja](./Chapter_09_Ninja.md) | [📝 Main](./Chapter_09_Main.md)**

</div>

## 🔷 Introduction to Advanced Production Deployment

Welcome to the advanced section of our security and DevOps chapter! In this section, we'll dive deeper into sophisticated deployment strategies, infrastructure management, and security practices that power modern production applications. We'll focus on CI/CD pipelines, Kubernetes deployment, Infrastructure as Code, and advanced monitoring solutions.

## 🔷 CI/CD Pipelines

### 🔹 Setting Up a Robust CI/CD Pipeline

A comprehensive CI/CD pipeline is essential for modern application development and deployment:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Run security scan
        run: npm run security-scan
        
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: build/
          
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_TOKEN }}
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/app-name:latest
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v1
        with:
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml
          images: |
            username/app-name:latest
          kubectl-version: 'latest'
```

### 🔹 Implementing Quality Gates

Quality gates help ensure only high-quality code makes it to production:

```yaml
# Additional job for the CI/CD pipeline

  quality-gate:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@v1.8
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          args: >
            -Dsonar.projectKey=my-organization_my-project
            -Dsonar.organization=my-organization
      
      - name: Check code coverage
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Code coverage is below threshold: $COVERAGE%"
            exit 1
          fi
          echo "Code coverage meets threshold: $COVERAGE%"
          
      - name: Check bundle size
        uses: sarthak-saxena/JSBundleSize@v1.1
        with:
          build-command: npm run build
          threshold: 1000000 # 1MB in bytes
          token: ${{ secrets.GITHUB_TOKEN }}
```

## 🔷 Infrastructure as Code (IaC)

### 🔹 Terraform for Cloud Infrastructure

Terraform allows you to define and provision your infrastructure using declarative configuration files:

```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

# VPC and network configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "3.14.0"

  name = "app-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false
  one_nat_gateway_per_az = true
  
  tags = {
    Environment = "production"
    Terraform = "true"
  }
}

# ECR repository for Docker images
resource "aws_ecr_repository" "app_repo" {
  name                 = "app-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# EKS cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "18.20.5"

  cluster_name    = "app-eks-cluster"
  cluster_version = "1.23"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    default = {
      min_size     = 3
      max_size     = 10
      desired_size = 5
      
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
    }
  }
  
  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}

# RDS PostgreSQL database
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14.3"
  instance_class       = "db.t3.medium"
  db_name              = "appdb"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres14"
  db_subnet_group_name = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot  = false
  final_snapshot_identifier = "app-db-final-snapshot"
  backup_retention_period = 7
  
  tags = {
    Environment = "production"
  }
}

# Output values
output "eks_cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.app_repo.repository_url
}

output "rds_hostname" {
  description = "RDS instance hostname"
  value       = aws_db_instance.postgres.address
}
```

### 🔹 GitOps with ArgoCD

GitOps is a deployment methodology that uses Git as the single source of truth for infrastructure declarations:

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/my-org/my-app-k8s-manifests.git
    targetRevision: HEAD
    path: overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

## 🔷 Kubernetes Deployment

### 🔹 Kubernetes Manifests

Define your application's Kubernetes resources:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: production
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: my-app
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: app
        image: username/app-name:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 15
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
      securityContext:
        fsGroup: 1000
        runAsUser: 1000
        runAsNonRoot: true
      serviceAccountName: app-service-account
```

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service
  namespace: production
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - app.example.com
    secretName: app-tls
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80
```

### 🔹 Kustomize for Environment Management

Manage configurations across environments with Kustomize:

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- deployment.yaml
- service.yaml
- ingress.yaml

commonLabels:
  app: my-app

namePrefix: my-app-
```

```yaml
# overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base

namespace: production

patches:
- path: production-patch.yaml

images:
- name: username/app-name
  newName: username/app-name
  newTag: latest

replicas:
- name: app-deployment
  count: 5
```

```yaml
# overlays/production/production-patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  template:
    spec:
      containers:
      - name: app
        resources:
          requests:
            cpu: "200m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1Gi"
```

## 🔷 Advanced Monitoring and Observability

### 🔹 Prometheus and Grafana Setup

Configure a comprehensive monitoring stack:

```yaml
# prometheus.yaml
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
    
    rule_files:
      - /etc/prometheus/rules/*.rules
    
    alerting:
      alertmanagers:
      - static_configs:
        - targets:
          - alertmanager:9093
    
    scrape_configs:
      - job_name: 'kubernetes-apiservers'
        kubernetes_sd_configs:
        - role: endpoints
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
        - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
          action: keep
          regex: default;kubernetes;https
      
      - job_name: 'kubernetes-nodes'
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        kubernetes_sd_configs:
        - role: node
        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
      
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
        - action: labelmap
          regex: __meta_kubernetes_pod_label_(.+)
```

### 🔹 Distributed Tracing with Jaeger

Implement distributed tracing for complex microservice architectures:

```yaml
# jaeger.yaml
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: jaeger
  namespace: monitoring
spec:
  strategy: production
  storage:
    type: elasticsearch
    options:
      es:
        server-urls: http://elasticsearch:9200
  ingress:
    enabled: true
    hosts:
      - jaeger.example.com
  agent:
    strategy: DaemonSet
```

Configure your application to use Jaeger:

```javascript
// tracer.js
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Configure the trace provider
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'my-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
});

// Configure the Jaeger exporter
const exporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger-collector:14268/api/traces',
});

// Register the span processor with the provider
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Register automatic instrumentations
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// Initialize the provider
provider.register();

// Get a tracer
const tracer = provider.getTracer('my-service-tracer');

module.exports = { tracer };
```

## 🔷 Security Best Practices

### 🔹 Implementing Secure Networking

Set up network policies to restrict traffic between pods:

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: my-app
      tier: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: my-app
          tier: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: my-app
          tier: database
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9090
```

### 🔹 Secrets Management with HashiCorp Vault

Integrate with Vault for secure secrets management:

```yaml
# vault-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: vault-config
  namespace: vault
data:
  config.json: |
    {
      "listener": {
        "tcp": {
          "address": "0.0.0.0:8200",
          "tls_disable": 1
        }
      },
      "storage": {
        "file": {
          "path": "/vault/data"
        }
      },
      "ui": true
    }
```

Configure your application to retrieve secrets from Vault:

```javascript
// vault-client.js
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
  token: process.env.VAULT_TOKEN
});

async function getSecret(path) {
  try {
    const { data } = await vault.read(`secret/data/${path}`);
    return data.data;
  } catch (error) {
    console.error(`Error retrieving secret from path ${path}:`, error);
    throw error;
  }
}

module.exports = { getSecret };
```

### 🔹 Container Security with Trivy

Scan your container images for vulnerabilities:

```yaml
# container-scan-job.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: trivy-scan
  namespace: security
spec:
  schedule: "0 0 * * *"  # Run daily at midnight
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: trivy
            image: aquasec/trivy:latest
            args:
            - image
            - --severity
            - HIGH,CRITICAL
            - --format
            - json
            - --output
            - /results/scan-$(date +%Y%m%d).json
            - username/app-name:latest
            volumeMounts:
            - name: results
              mountPath: /results
          volumes:
          - name: results
            persistentVolumeClaim:
              claimName: scan-results-pvc
          restartPolicy: OnFailure
```

## 🔷 Performance Optimization

### 🔹 Horizontal Pod Autoscaling

Automatically scale your application based on metrics:

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: 100
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
      - type: Pods
        value: 5
        periodSeconds: 60
      selectPolicy: Max
```

### 🔹 Redis for Caching

Implement Redis for caching to improve performance:

```yaml
# redis.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: production
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
          name: redis
        volumeMounts:
        - name: redis-data
          mountPath: /data
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "300m"
            memory: "512Mi"
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

Integrate Redis with your Node.js application:

```javascript
// cache.js
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

// Cache middleware
function cacheMiddleware(duration) {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedResponse = await redis.get(key);
      
      if (cachedResponse) {
        const data = JSON.parse(cachedResponse);
        return res.json(data);
      }
      
      // Store original res.json method
      const originalJson = res.json;
      
      // Override res.json method
      res.json = function(data) {
        // Cache the response
        redis.set(key, JSON.stringify(data), 'EX', duration);
        
        // Call original method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
}

module.exports = { redis, cacheMiddleware };
```

## 🔷 Advanced Exercise: Implementing a Complete CI/CD Pipeline

For this exercise, you'll implement a complete CI/CD pipeline for a microservice architecture:

1. Set up GitHub Actions workflows for:
   - Automated testing
   - Security scanning
   - Docker image building
   - Deployment to Kubernetes

2. Implement Infrastructure as Code using Terraform:
   - VPC and networking
   - Kubernetes cluster
   - Databases and cache services

3. Configure GitOps with ArgoCD:
   - Repository for Kubernetes manifests
   - Application definitions
   - Progressive delivery strategies

4. Implement comprehensive monitoring:
   - Prometheus for metrics
   - Loki for logs
   - Jaeger for distributed tracing
   - Grafana dashboards

5. Implement security best practices:
   - Network policies
   - Secret management
   - Container scanning
   - RBAC configurations

This exercise will help you gain hands-on experience with advanced DevOps practices and production-grade deployment strategies.

## 🔷 Next Steps

After mastering these advanced deployment techniques, you might want to explore:

1. **Multicluster Management**: Managing multiple Kubernetes clusters across regions
2. **Service Mesh**: Implementing Istio or Linkerd for advanced traffic management
3. **Canary Deployments**: Implementing progressive delivery with tools like Flagger
4. **Chaos Engineering**: Testing system resilience with controlled failures
5. **GitOps-based CD**: Advanced GitOps practices for continuous deployment

These topics are covered in the Ninja level section of this chapter.

---

<div align="center">

**[⬅️ Previous Chapter](../Chapter_08_Advanced_Machine_Learning/Chapter_08_Main.md) | [📚 Table of Contents](../README.md) | [➡️ Next Chapter](../README.md)**

</div>

<div align="center">

**[🔰 Beginner](./Chapter_09_Beginner.md) | [⚙️ Advanced](./Chapter_09_Advanced.md) | [⚔️ Ninja](./Chapter_09_Ninja.md) | [📝 Main](./Chapter_09_Main.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
