<div align="center">

# Exercise 1: Simple Deployment Pipeline

</div>

<div align="center">

**[⬅️ Back to Exercises](./README.md) | [📚 Back to Chapter](../README.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Overview

In this exercise, you'll create a complete CI/CD pipeline using GitHub Actions for a simple web application. You'll implement the entire pipeline from code commits to production deployment, including quality gates and environment promotion strategies.

## Learning Objectives

By the end of this exercise, you will be able to:

1. Configure a multi-stage CI/CD pipeline using GitHub Actions
2. Implement automated testing and quality gates
3. Set up environment-specific deployments with promotion strategies
4. Secure your pipeline with proper secret management

## Prerequisites

- GitHub account
- Basic knowledge of YAML
- Familiarity with web application development (Node.js, Python, or similar)
- Text editor or IDE

## Exercise Steps

### Step 1: Create a Simple Web Application

1. Create a new GitHub repository named `simple-deploy-exercise`
2. Initialize a simple Express.js application with the following structure:

```
simple-deploy-exercise/
├── .github/
│   └── workflows/
├── src/
│   ├── app.js
│   └── routes/
│       └── index.js
├── test/
│   └── app.test.js
├── package.json
├── .gitignore
└── README.md
```

3. In `src/app.js`, create a basic Express application:

```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the deployment pipeline!',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
```

4. Create a test file in `test/app.test.js`:

```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Application endpoints', () => {
  test('GET / should return 200 and correct message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Hello');
  });

  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
  });
});
```

5. Set up your `package.json` with the necessary dependencies and scripts:

```json
{
  "name": "simple-deploy-exercise",
  "version": "1.0.0",
  "description": "A simple deployment pipeline exercise",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "eslint": "^8.40.0",
    "jest": "^29.5.0",
    "nodemon": "^2.0.22",
    "supertest": "^6.3.3"
  }
}
```

### Step 2: Create a CI Workflow

1. Create a file at `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
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
        run: npm run test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: coverage/
          retention-days: 5
```

2. Commit and push this file to GitHub
3. Verify that the CI workflow runs when you push changes

### Step 3: Add Container Build

1. Create a `Dockerfile` in the root of your project:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/app.js"]
```

2. Update your CI workflow to include a build job:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
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
        run: npm run test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: coverage/
          retention-days: 5

  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Build image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          outputs: type=docker,dest=/tmp/app-image.tar
      
      - name: Upload image
        uses: actions/upload-artifact@v3
        with:
          name: app-image
          path: /tmp/app-image.tar
          retention-days: 1
```

3. Commit and push these changes to verify the build job works

### Step 4: Create a CD Workflow

1. Create a file at `.github/workflows/cd.yml`:

```yaml
name: CD Pipeline

on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types:
      - completed
    branches:
      - main
      - develop

jobs:
  deploy-staging:
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.head_branch == 'develop' }}
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Download artifact
        uses: dawidd6/action-download-artifact@v2
        with:
          workflow: ci.yml
          workflow_conclusion: success
          name: app-image
      
      - name: Load Docker image
        run: docker load --input app-image.tar
      
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # In a real scenario, this would connect to your staging environment
          # and deploy the application
          echo "Version: ${{ github.sha }}"
          echo "Environment: staging"
          # Demo successful deployment
          echo "Deployment to staging completed successfully!"
  
  deploy-production:
    if: ${{ github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.head_branch == 'main' }}
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Download artifact
        uses: dawidd6/action-download-artifact@v2
        with:
          workflow: ci.yml
          workflow_conclusion: success
          name: app-image
      
      - name: Load Docker image
        run: docker load --input app-image.tar
      
      - name: Deploy to production
        run: |
          echo "Deploying to production environment..."
          # In a real scenario, this would connect to your production environment
          # and deploy the application
          echo "Version: ${{ github.sha }}"
          echo "Environment: production"
          # Demo successful deployment
          echo "Deployment to production completed successfully!"
```

2. Configure environments in your GitHub repository:
   - Go to your repository settings
   - Navigate to "Environments"
   - Create "staging" and "production" environments
   - For production, add a protection rule that requires approval

3. Commit and push these changes to your repository

### Step 5: Implement a Feature Branch Workflow

1. Create a new branch from `develop` called `feature/new-endpoint`
2. Add a new endpoint to the application in `src/app.js`:

```javascript
app.get('/info', (req, res) => {
  res.json({
    name: 'simple-deploy-exercise',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

3. Add a test for this endpoint in `test/app.test.js`:

```javascript
test('GET /info should return application information', async () => {
  const response = await request(app).get('/info');
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('name');
  expect(response.body).toHaveProperty('uptime');
  expect(response.body).toHaveProperty('timestamp');
});
```

4. Commit your changes and push the branch to GitHub
5. Create a pull request from `feature/new-endpoint` to `develop`
6. Observe the CI pipeline running on your pull request
7. Merge the pull request to trigger the deployment to staging
8. Create a pull request from `develop` to `main` 
9. Merge to trigger the deployment to production (which will require approval)

## Expected Outcomes

- A functional CI/CD pipeline with separate workflows for CI and CD
- Automated build, test, and deployment to multiple environments
- Environment protection rules requiring approval for production
- Ability to follow a feature branch workflow with proper testing

## Extra Challenges

1. Add code coverage requirements to your CI pipeline
2. Implement automated security scanning using OWASP Dependency Check
3. Configure release tagging for production deployments
4. Set up automated rollbacks in case of deployment failures
5. Implement semantic versioning for your application

## Conclusion

In this exercise, you've built a complete CI/CD pipeline using GitHub Actions. This provides you with hands-on experience implementing the deployment pipeline concepts discussed in Chapter 9. In a real-world scenario, you would connect this pipeline to actual infrastructure, but the workflow principles remain the same.

The next exercises will build on this foundation by deploying to Kubernetes and implementing monitoring for your application.

---

<div align="center">

**[⬅️ Back to Exercises](./README.md) | [📚 Back to Chapter](../README.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
