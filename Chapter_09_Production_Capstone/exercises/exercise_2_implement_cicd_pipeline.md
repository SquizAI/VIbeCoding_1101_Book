# Exercise 2: Implementing a CI/CD Pipeline for the Task Management Application

## Overview

In this exercise, you will set up a comprehensive CI/CD pipeline for the task management application built in Chapter 8. You'll use GitHub Actions to automate testing, building, and deploying both the frontend and backend components of the application.

## Learning Objectives

- Design and implement a multi-stage CI/CD pipeline
- Configure automated testing for frontend and backend code
- Set up infrastructure for staging and production environments
- Implement secure handling of credentials and secrets
- Configure deployment automation with approval gates

## Prerequisites

- Complete task management application from Chapter 8
- GitHub account with repository containing the application code
- AWS account (free tier is sufficient)
- Basic understanding of GitHub Actions and CI/CD concepts

## Exercise

### Part 1: Design the CI/CD Pipeline

1. **Create Pipeline Architecture**:

Sketch out the CI/CD pipeline architecture with the following stages:
- Code commit and pull request
- Automated code linting and static analysis
- Unit and integration testing
- Build artifacts
- Deploy to staging environment
- Manual approval gate
- Deploy to production environment
- Post-deployment verification

2. **Set Up GitHub Repository Structure**:

Organize your repository with the following structure:
```
/
├── frontend/          # React frontend code
├── backend/           # Node.js backend code
├── infra/             # Infrastructure code (Terraform)
├── .github/
│   └── workflows/     # GitHub Actions workflow files
└── scripts/           # Deployment and utility scripts
```

### Part 2: Configure GitHub Actions for CI

1. **Create a Continuous Integration Workflow**:

Create a file `.github/workflows/ci.yml`:

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Lint Frontend
        run: |
          cd frontend
          npm ci
          npm run lint
          
      - name: Lint Backend
        run: |
          cd backend
          npm ci
          npm run lint
  
  test:
    name: Run Tests
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
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
          
      - name: Frontend Tests
        run: |
          cd frontend
          npm ci
          npm test -- --watchAll=false
          
      - name: Backend Tests
        run: |
          cd backend
          npm ci
          npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          JWT_SECRET: test-secret
  
  build:
    name: Build Artifacts
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Build Backend
        run: |
          cd backend
          npm ci
          npm run build
          
      - name: Upload Frontend Artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/build
          
      - name: Upload Backend Artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-build
          path: backend/dist
```

### Part 3: Configure Deployment to Staging

1. **Create AWS Credentials Secret**:

In your GitHub repository:
- Go to Settings > Secrets and variables > Actions
- Add the following repository secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `STAGING_S3_BUCKET` (for frontend)
  - `STAGING_EB_APP_NAME` (for backend)
  - `STAGING_EB_ENV_NAME` (for backend)

2. **Create Staging Deployment Workflow**:

Create a file `.github/workflows/deploy-staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]
    
jobs:
  deploy-backend:
    name: Deploy Backend to Staging
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd backend
          npm ci
          
      - name: Build Backend
        run: |
          cd backend
          npm run build
          
      - name: Generate Elastic Beanstalk Package
        run: |
          cd backend
          zip -r deploy.zip . -x "node_modules/*" "src/*" ".git*"
          
      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: ${{ secrets.STAGING_EB_APP_NAME }}
          environment_name: ${{ secrets.STAGING_EB_ENV_NAME }}
          version_label: "staging-${{ github.sha }}"
          region: us-west-2
          deployment_package: backend/deploy.zip
          
  deploy-frontend:
    name: Deploy Frontend to Staging
    runs-on: ubuntu-latest
    needs: deploy-backend
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build Frontend
        run: |
          cd frontend
          REACT_APP_API_URL=${{ secrets.STAGING_API_URL }} npm run build
          
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Deploy to S3
        run: |
          aws s3 sync frontend/build s3://${{ secrets.STAGING_S3_BUCKET }} --delete
          
      - name: Invalidate CloudFront Distribution
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.STAGING_CF_DISTRIBUTION }} --paths "/*"
```

### Part 4: Configure Production Deployment with Approval

1. **Create a Production Deployment Workflow**:

Create a file `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Production

on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Type "yes" to confirm deployment to production'
        required: true
  push:
    branches: [ main ]

jobs:
  approval:
    name: Production Deployment Approval
    runs-on: ubuntu-latest
    steps:
      - name: Manual Approval Check
        if: github.event_name == 'push'
        uses: trstringer/manual-approval@v1
        with:
          secret: ${{ github.TOKEN }}
          approvers: yourusername
          minimum-approvals: 1
          issue-title: "Deploy to Production - ${{ github.sha }}"
          issue-body: "Please approve or deny the deployment to production"
          exclude-workflow-initiator-as-approver: false
  
  deploy-backend:
    name: Deploy Backend to Production
    needs: approval
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      # Similar steps as staging deployment but with production values
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd backend
          npm ci
          
      - name: Build Backend
        run: |
          cd backend
          npm run build
          
      - name: Generate Elastic Beanstalk Package
        run: |
          cd backend
          zip -r deploy.zip . -x "node_modules/*" "src/*" ".git*"
          
      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v21
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: ${{ secrets.PROD_EB_APP_NAME }}
          environment_name: ${{ secrets.PROD_EB_ENV_NAME }}
          version_label: "prod-${{ github.sha }}"
          region: us-west-2
          deployment_package: backend/deploy.zip
  
  deploy-frontend:
    name: Deploy Frontend to Production
    needs: deploy-backend
    runs-on: ubuntu-latest
    
    steps:
      # Similar steps as staging but with production values
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build Frontend
        run: |
          cd frontend
          REACT_APP_API_URL=${{ secrets.PROD_API_URL }} npm run build
          
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Deploy to S3
        run: |
          aws s3 sync frontend/build s3://${{ secrets.PROD_S3_BUCKET }} --delete
          
      - name: Invalidate CloudFront Distribution
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.PROD_CF_DISTRIBUTION }} --paths "/*"
```

### Part 5: Set Up Infrastructure with Terraform (Optional)

1. **Create basic Terraform configurations**:

Create a file `infra/main.tf`:

```hcl
provider "aws" {
  region = var.aws_region
}

module "s3_frontend" {
  source = "./modules/s3-frontend"
  
  bucket_name       = var.frontend_bucket_name
  environment       = var.environment
  cloudfront_enable = true
}

module "elastic_beanstalk" {
  source = "./modules/elastic-beanstalk"
  
  app_name     = var.app_name
  environment  = var.environment
  instance_type = "t3.micro"
  min_instances = 1
  max_instances = 2
}

module "rds" {
  source = "./modules/rds"
  
  db_name       = var.db_name
  db_username   = var.db_username
  db_password   = var.db_password
  environment   = var.environment
  instance_type = "db.t3.micro"
}
```

2. **Add Terraform Workflow**:

Create a file `.github/workflows/terraform.yml`:

```yaml
name: Terraform Infrastructure

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy (staging/production)'
        required: true
        default: 'staging'
      action:
        description: 'Action to perform (plan/apply/destroy)'
        required: true
        default: 'plan'

jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.4.6
          
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
          
      - name: Terraform Init
        run: |
          cd infra
          terraform init
          
      - name: Terraform Plan
        if: github.event.inputs.action == 'plan' || github.event.inputs.action == 'apply'
        run: |
          cd infra
          terraform plan -var-file="${{ github.event.inputs.environment }}.tfvars" -out=tfplan
          
      - name: Terraform Apply
        if: github.event.inputs.action == 'apply'
        run: |
          cd infra
          terraform apply -auto-approve tfplan
          
      - name: Terraform Destroy
        if: github.event.inputs.action == 'destroy'
        run: |
          cd infra
          terraform destroy -auto-approve -var-file="${{ github.event.inputs.environment }}.tfvars"
```

## Deliverables

1. A fully configured GitHub repository with CI/CD workflows
2. Screenshots of:
   - Successful CI workflow run
   - Successful staging deployment
   - Production approval process
   - Successful production deployment
3. A detailed write-up (2-3 pages) documenting:
   - Your CI/CD pipeline architecture
   - Security considerations in your implementation
   - How you handled environment-specific configurations
   - Challenges encountered and how you resolved them
   - How you would improve the pipeline for a larger-scale application

## Assessment Criteria

- Completeness of CI/CD pipeline implementation
- Proper handling of secrets and environment variables
- Implementation of approval gates for production deployment
- Quality of documentation and architecture diagrams
- Consideration of security and best practices

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html)
- [Terraform Documentation](https://www.terraform.io/docs)
- [CI/CD Best Practices Guide](https://about.gitlab.com/topics/ci-cd/)

## Next Steps

After completing this exercise, consider:
- Adding automated security scanning to your pipeline
- Implementing canary deployments
- Setting up advanced monitoring and alerting
- Creating a disaster recovery plan for your infrastructure
