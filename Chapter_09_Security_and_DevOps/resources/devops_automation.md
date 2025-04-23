<div align="center">

# DevOps Automation Techniques

</div>

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_09_Main.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Introduction

This document covers advanced automation techniques for modern DevOps practices, focusing on GitOps, Infrastructure as Code (IaC), and Platform Engineering approaches that represent industry best practices in 2025.

## GitOps Workflows

GitOps is a paradigm that uses Git as the single source of truth for declarative infrastructure and applications. When implemented correctly, it provides:

1. Improved developer experience
2. Enhanced auditability
3. Greater reliability through consistent deployments
4. Self-healing infrastructure and applications

### GitOps Implementation with Flux

```yaml
# flux-system/gotk-components.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: GitRepository
metadata:
  name: app-repo
  namespace: flux-system
spec:
  interval: 1m0s
  url: https://github.com/your-org/your-app
  ref:
    branch: main
  secretRef:
    name: github-credentials

---
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: app-kustomization
  namespace: flux-system
spec:
  interval: 10m0s
  path: "./k8s/overlays/production"
  prune: true
  sourceRef:
    kind: GitRepository
    name: app-repo
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: app-deployment
      namespace: app-production
  timeout: 2m0s
```

### GitOps Pull Request Workflow

1. **Developer Flow**:
   - Create feature branch
   - Make infrastructure/application changes
   - Submit PR to environment branch (e.g., staging, production)

2. **Automated PR Checks**:
   - Manifests validation
   - Security scanning
   - Preview environment deployment
   - Integration tests

3. **Post-Merge Actions**:
   - Flux detects changes
   - Changes are applied to cluster
   - Drift detection and reconciliation

## Infrastructure as Code (IaC)

### Terraform Multi-Environment Setup

```terraform
# main.tf
module "networking" {
  source = "./modules/networking"
  
  vpc_cidr           = var.vpc_cidr
  environment        = var.environment
  availability_zones = var.availability_zones
  
  tags = local.common_tags
}

module "kubernetes" {
  source = "./modules/kubernetes"
  
  cluster_name    = "${var.project_name}-${var.environment}"
  cluster_version = var.kubernetes_version
  vpc_id          = module.networking.vpc_id
  subnet_ids      = module.networking.private_subnet_ids
  
  node_groups = {
    general = {
      desired_capacity = 3
      min_capacity     = 3
      max_capacity     = 10
      instance_types   = ["m5.large"]
      disk_size        = 50
    }
  }
  
  tags = local.common_tags
}

module "observability" {
  source = "./modules/observability"
  
  cluster_name      = module.kubernetes.cluster_name
  grafana_admin_pwd = var.grafana_admin_pwd
  
  tags = local.common_tags
}
```

### Terragrunt for Configuration Organization

```hcl
# terragrunt.hcl in environments/production
include {
  path = find_in_parent_folders()
}

terraform {
  source = "${get_parent_terragrunt_dir()}/modules//app_infrastructure"
}

inputs = {
  environment        = "production"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]
  kubernetes_version = "1.28"
  
  node_groups = {
    general = {
      desired_capacity = 5
      min_capacity     = 3
      max_capacity     = 20
      instance_types   = ["m5.2xlarge"]
      disk_size        = 100
    }
    compute = {
      desired_capacity = 3
      min_capacity     = 1
      max_capacity     = 10
      instance_types   = ["c5.2xlarge"]
      disk_size        = 50
    }
  }
}
```

## CI/CD Pipeline Automation

### GitHub Actions for Complete Workflow

```yaml
# .github/workflows/ci-cd.yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  validate:
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
      - name: Lint code
        run: npm run lint
      - name: Run tests
        run: npm run test
      - name: Validate infrastructure
        run: |
          cd infrastructure
          terraform init -backend=false
          terraform validate

  build:
    needs: validate
    runs-on: ubuntu-latest
    if: github.event_name == 'push' || github.event.pull_request.head.repo.full_name == github.repository
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to container registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-preview:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to preview
        uses: hashicorp/setup-terraform@v2
      - name: Terraform Init
        run: terraform init
        working-directory: ./infrastructure/environments/preview
      - name: Terraform Apply
        run: |
          terraform apply -auto-approve \
          -var="image_tag=${{ github.sha }}" \
          -var="pr_number=${{ github.event.pull_request.number }}"
        working-directory: ./infrastructure/environments/preview
      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            const url = process.env.PREVIEW_URL
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview environment deployed: ${url}`
            })
        env:
          PREVIEW_URL: ${{ steps.deploy.outputs.preview_url }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Setup Flux CLI
        uses: fluxcd/flux2/action@v0.32.0
      - name: Apply image update
        run: |
          flux create image update app-automation \
          --git-repo-ref=app-repo \
          --git-repo-path="./k8s/overlays/production" \
          --git-author-name="Flux Automation" \
          --git-author-email="flux@example.com" \
          --git-commit-message="Update image to {{.NewTag}}" \
          --checkout-branch=main \
          --push-branch=main \
          --image-policy=app-policy \
          --image=ghcr.io/${{ github.repository }}:${{ github.sha }}
```

## Platform Engineering

### Internal Developer Platform (IDP)

```yaml
# Backstage configuration
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: user-service
  description: User management service
  annotations:
    github.com/project-slug: my-org/user-service
    backstage.io/techdocs-ref: dir:.
    backstage.io/kubernetes-id: user-service
    jenkins.io/job-full-name: user-service/main
    sonarqube.org/project-key: my-org_user-service
    sentry.io/project-slug: user-service
spec:
  type: service
  lifecycle: production
  owner: team-a
  system: user-management
  providesApis:
    - user-api
  consumesApis:
    - auth-api
  dependsOn:
    - resource:user-db
    - component:auth-service

---
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  name: microservice-template
  title: Microservice Template
  description: Create a new microservice with standardized CI/CD
spec:
  owner: platform-team
  type: service
  parameters:
    - title: Service Information
      required:
        - name
        - description
        - owner
      properties:
        name:
          title: Name
          type: string
          pattern: '^[a-z0-9]+(-[a-z0-9]+)*$'
        description:
          title: Description
          type: string
        owner:
          title: Owner
          type: string
          ui:field: OwnerPicker
          ui:options:
            allowedKinds:
              - Group
  steps:
    - id: template
      name: Fetch Template
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
          description: ${{ parameters.description }}
          owner: ${{ parameters.owner }}
    - id: publish
      name: Publish to GitHub
      action: publish:github
      input:
        repoUrl: github.com?repo=${{ parameters.name }}&owner=my-org
        description: ${{ parameters.description }}
        defaultBranch: main
        protectDefaultBranch: true
```

### Self-Service Infrastructure

```yaml
# Crossplane composite resource definition
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xwebapps.platform.example.org
spec:
  group: platform.example.org
  names:
    kind: XWebApp
    plural: xwebapps
  claimNames:
    kind: WebApp
    plural: webapps
  versions:
    - name: v1alpha1
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                name:
                  type: string
                environment:
                  type: string
                  enum: [development, staging, production]
                size:
                  type: string
                  enum: [small, medium, large]
                domain:
                  type: string
              required:
                - name
                - environment
                - size
---
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: webapp-aws
  labels:
    provider: aws
spec:
  compositeTypeRef:
    apiVersion: platform.example.org/v1alpha1
    kind: XWebApp
  resources:
    - name: vpc
      base:
        apiVersion: ec2.aws.crossplane.io/v1beta1
        kind: VPC
        spec:
          forProvider:
            region: us-west-2
            cidrBlock: 10.0.0.0/16
            enableDnsSupport: true
            enableDnsHostNames: true
          providerConfigRef:
            name: aws-provider
    # Additional resources omitted for brevity
```

## Kubernetes Operator Pattern

Custom operators automate application-specific tasks:

```go
// pkg/controller/memcached/memcached_controller.go
func (r *MemcachedReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    log := r.Log.WithValues("memcached", req.NamespacedName)
    
    // Fetch the Memcached instance
    memcached := &cachev1alpha1.Memcached{}
    err := r.Get(ctx, req.NamespacedName, memcached)
    if err != nil {
        if errors.IsNotFound(err) {
            // No need to requeue
            return ctrl.Result{}, nil
        }
        // Error reading the object - requeue the request
        return ctrl.Result{}, err
    }
    
    // Check if the deployment already exists, if not create a new one
    found := &appsv1.Deployment{}
    err = r.Get(ctx, types.NamespacedName{Name: memcached.Name, Namespace: memcached.Namespace}, found)
    if err != nil && errors.IsNotFound(err) {
        // Define a new deployment
        dep := r.deploymentForMemcached(memcached)
        log.Info("Creating a new Deployment", "Deployment.Namespace", dep.Namespace, "Deployment.Name", dep.Name)
        err = r.Create(ctx, dep)
        if err != nil {
            log.Error(err, "Failed to create new Deployment", "Deployment.Namespace", dep.Namespace, "Deployment.Name", dep.Name)
            return ctrl.Result{}, err
        }
        // Deployment created successfully - return and requeue
        return ctrl.Result{Requeue: true}, nil
    } else if err != nil {
        log.Error(err, "Failed to get Deployment")
        return ctrl.Result{}, err
    }
    
    // Ensure the deployment size is the same as the spec
    size := memcached.Spec.Size
    if *found.Spec.Replicas != size {
        found.Spec.Replicas = &size
        err = r.Update(ctx, found)
        if err != nil {
            log.Error(err, "Failed to update Deployment", "Deployment.Namespace", found.Namespace, "Deployment.Name", found.Name)
            return ctrl.Result{}, err
        }
        // Spec updated - return and requeue
        return ctrl.Result{Requeue: true}, nil
    }
    
    // Update the Memcached status with the pod names
    podList := &corev1.PodList{}
    listOpts := []client.ListOption{
        client.InNamespace(memcached.Namespace),
        client.MatchingLabels(labelsForMemcached(memcached.Name)),
    }
    if err = r.List(ctx, podList, listOpts...); err != nil {
        log.Error(err, "Failed to list pods", "Memcached.Namespace", memcached.Namespace, "Memcached.Name", memcached.Name)
        return ctrl.Result{}, err
    }
    podNames := getPodNames(podList.Items)
    
    // Update status.Nodes if needed
    if !reflect.DeepEqual(podNames, memcached.Status.Nodes) {
        memcached.Status.Nodes = podNames
        err := r.Status().Update(ctx, memcached)
        if err != nil {
            log.Error(err, "Failed to update Memcached status")
            return ctrl.Result{}, err
        }
    }
    
    return ctrl.Result{}, nil
}
```

## Conclusion

These DevOps automation techniques represent the cutting edge of the field in 2025. Implementing these practices will allow your team to focus on delivering value rather than managing infrastructure, while maintaining high standards for security, reliability, and performance.

---

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_09_Main.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
