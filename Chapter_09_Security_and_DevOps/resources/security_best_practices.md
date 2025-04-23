<div align="center">

# Security Best Practices for Production Systems

</div>

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_09_Main.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Introduction

This resource outlines comprehensive security best practices for production systems in 2025. These recommendations represent industry-standard approaches to securing modern applications across the entire development and deployment lifecycle.

## 1. Build-Time Security

### 1.1 Supply Chain Security

```yaml
# Example GitHub workflow for supply chain security
name: Supply Chain Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Dependency Review
        uses: actions/dependency-review-action@v3
      
      - name: SBOM Generation
        uses: anchore/sbom-action@v0
        with:
          format: spdx-json
          output-file: sbom.spdx.json
      
      - name: Upload SBOM
        uses: actions/upload-artifact@v3
        with:
          name: sbom
          path: sbom.spdx.json
  
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Build image
        run: docker build -t app:${{ github.sha }} .
      
      - name: Scan for vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: app:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      
      - name: Upload scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### 1.2 Secure Coding Practices

- **Input Validation**: All user inputs must be validated at both client and server sides
- **Output Encoding**: Properly encode outputs based on their context (HTML, JS, URL, etc.)
- **Parameterized Queries**: Always use parameterized queries or prepared statements
- **Proper Error Handling**: Don't expose sensitive information in error messages

```javascript
// Example of secure coding practices in Node.js
const express = require('express');
const { validationResult, check } = require('express-validator');
const router = express.Router();

// Input validation
router.post('/user',
  [
    check('username').isAlphanumeric().isLength({ min: 5, max: 20 }),
    check('email').isEmail().normalizeEmail(),
    check('password').isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
  ],
  async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Parameterized query
      const user = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [req.body.username, req.body.email, await bcrypt.hash(req.body.password, 10)]
      );
      
      // Don't return sensitive data
      res.status(201).json({ 
        id: user.rows[0].id,
        username: req.body.username
      });
    } catch (err) {
      // Proper error handling
      console.error('Database error:', err);
      res.status(500).json({ 
        error: 'An error occurred while creating the user'
      });
    }
  }
);
```

### 1.3 Code Security Analysis

Deploy SAST (Static Application Security Testing) tools in your pipeline:

```yaml
# Example GitHub workflow for code security scanning
name: Code Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
      
      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'app'
          path: '.'
          format: 'HTML'
          out: 'reports'
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-report
          path: reports
```

## 2. Container Security

### 2.1 Secure Container Images

Use minimal base images and follow these best practices:

```dockerfile
# Secure Dockerfile example
FROM node:18-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 appuser && \
    adduser -D -u 1001 -G appuser appuser

WORKDIR /app

# Install dependencies as root
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY --chown=appuser:appuser . .

# Build the application
RUN npm run build

# Multi-stage build for smaller final image
FROM node:18-alpine AS runtime

# Create same user in runtime image
RUN addgroup -g 1001 appuser && \
    adduser -D -u 1001 -G appuser appuser

WORKDIR /app

# Copy only production dependencies and built files
COPY --from=builder --chown=appuser:appuser /app/node_modules /app/node_modules
COPY --from=builder --chown=appuser:appuser /app/dist /app/dist

# Use non-root user
USER appuser

# Define healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Run with Node's secure-heap option
CMD ["node", "--secure-heap=on", "dist/server.js"]
```

### 2.2 Container Runtime Security

```yaml
# Pod Security Context Example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: secure-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: secure-app
  template:
    metadata:
      labels:
        app: secure-app
    spec:
      # Service account with minimal permissions
      serviceAccountName: secure-app-sa
      # Security context for all containers
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: app
        image: your-registry/secure-app:latest
        # Container-specific security context
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL
          readOnlyRootFilesystem: true
        # Resource limits prevent DoS
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        # Specify needed volumes
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: tmp
        emptyDir: {}
      - name: config
        configMap:
          name: app-config
```

## 3. Network Security

### 3.1 Zero Trust Architecture

Implement a comprehensive zero trust model:

```yaml
# Network Policy example for zero trust
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
# Allow specific communication between services
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api-service
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: frontend
      podSelector:
        matchLabels:
          app: frontend-service
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
      podSelector:
        matchLabels:
          app: postgres
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

### 3.2 TLS Everywhere

Ensure TLS for all communications:

```yaml
# Istio TLS Policy
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT
```

### 3.3 API Security

```javascript
// Express API Security Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cors = require('cors');
const jwt = require('express-jwt');

// Apply security headers
app.use(helmet());

// Configure CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  }
});

// Apply to all API routes
app.use('/api/', apiLimiter);

// Speed limiting (gradually slows down responses)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes without delay
  delayMs: (hits) => hits * 100, // add 100ms of delay per hit
});

app.use('/api/', speedLimiter);

// JWT authentication
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true,
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }).unless({
    path: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register'
    ]
  })
);
```

## 4. Secrets Management

### 4.1 External Secrets Management

```yaml
# Vault Integration with Kubernetes
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: vault-database
  namespace: production
spec:
  provider: vault
  parameters:
    vaultAddress: "https://vault.example.com:8200"
    roleName: "api-service"
    objects: |
      - objectName: "db-username"
        secretPath: "database/creds/api-service"
        secretKey: "username"
      - objectName: "db-password"
        secretPath: "database/creds/api-service"
        secretKey: "password"
      - objectName: "api-key"
        secretPath: "secret/api-service"
        secretKey: "api-key"
  secretObjects:
    - data:
      - key: DB_USERNAME
        objectName: db-username
      - key: DB_PASSWORD
        objectName: db-password
      - key: API_KEY
        objectName: api-key
      secretName: app-secrets
      type: Opaque
```

### 4.2 Kubernetes Secrets Encryption

```yaml
# Encryption configuration for kube-apiserver
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
metadata:
  name: encryption-config
spec:
  resources:
    - resources:
        - secrets
      providers:
        - aescbc:
            keys:
              - name: key1
                secret: <base64-encoded-key>
        - identity: {}
```

## 5. Identity and Access Management

### 5.1 Kubernetes RBAC

```yaml
# RBAC Configuration
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: api-service-role
rules:
- apiGroups: [""]
  resources: ["secrets"]
  resourceNames: ["api-service-secrets"]
  verbs: ["get"]
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["api-service-config"]
  verbs: ["get"]
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  resourceNames: ["api-service"]
  verbs: ["get", "update"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-service-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: api-service-account
  namespace: production
roleRef:
  kind: Role
  name: api-service-role
  apiGroup: rbac.authorization.k8s.io
```

### 5.2 Authentication Integration

```yaml
# Authentication with OIDC
apiVersion: v1
kind: ConfigMap
metadata:
  name: auth-config
  namespace: production
data:
  AUTH_DOMAIN: "auth.example.com"
  AUTH_AUDIENCE: "api.example.com"
  AUTH_ISSUER: "https://auth.example.com/"
  JWKS_URI: "https://auth.example.com/.well-known/jwks.json"
```

## 6. Monitoring and Incident Response

### 6.1 Security Monitoring

```yaml
# Falco Security Monitoring
apiVersion: falco.security.falcosecurity.org/v1beta1
kind: FalcoRule
metadata:
  name: custom-rules
  namespace: security
spec:
  rules:
    - rule: Shell running in a container
      desc: Detect shells running in a container
      condition: >
        container.id != ""
        and proc.name in (shell_binaries)
        and not proc.pname in (shell_binaries)
        and not container.image.repository in (shell_allowed_images)
      output: >
        Shell executed in container (user=%user.name container_id=%container.id
        container_name=%container.name shell=%proc.name parent=%proc.pname
        cmdline=%proc.cmdline image=%container.image.repository)
      priority: WARNING
      tags: ["container", "shell", "mitre_execution"]
    
    - rule: Sensitive file read in container
      desc: Detect attempts to access sensitive files in a container
      condition: >
        container.id != ""
        and open_read
        and fd.name in (sensitive_files)
        and not container.image.repository in (sensitive_files_allowed_images)
      output: >
        Sensitive file accessed in container (user=%user.name container_id=%container.id
        container_name=%container.name file=%fd.name image=%container.image.repository)
      priority: WARNING
      tags: ["container", "file_access", "mitre_credential_access"]
```

### 6.2 Incident Response Plan

Create and document a comprehensive incident response plan that includes:

1. **Preparation**:
   - Pre-defined roles and responsibilities
   - Contact information for all stakeholders
   - Communication channels and templates
   - Runbooks for common incidents

2. **Detection**:
   - Monitoring systems and alerting thresholds
   - Log aggregation and analysis
   - Anomaly detection mechanisms

3. **Containment**:
   - Isolation procedures for compromised systems
   - Methods to limit lateral movement
   - Credential rotation procedures

4. **Eradication**:
   - Forensic investigation guidelines
   - Evidence collection procedures
   - Malware/backdoor removal guidelines

5. **Recovery**:
   - Restoration from backups
   - Verification steps for system integrity
   - Phased return to production

6. **Lessons Learned**:
   - Post-incident review template
   - Timeline creation tools
   - Process improvement workflow

## 7. Compliance and Governance

### 7.1 Automated Compliance Checks

```yaml
# OPA Gatekeeper Constraint Template
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
      validation:
        openAPIV3Schema:
          properties:
            labels:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        violation[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("You must provide labels: %v", [missing])
        }

---
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: require-security-labels
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment", "StatefulSet"]
    namespaces:
      - "production"
  parameters:
    labels: ["owner", "app", "environment", "security-reviewed"]
```

### 7.2 Automated Security Scanning

Implement a continuous security scanning workflow:

```yaml
# Security Scanning Workflow
name: Security Scanning

on:
  schedule:
    - cron: '0 0 * * *'  # Daily scan
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: OWASP ZAP Scan
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'https://staging.example.com'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
      
      - name: Infrastructure scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          format: 'sarif'
          output: 'trivy-results.sarif'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'
      
      - name: License compliance scan
        uses: fossas/fossa-action@v1
        with:
          api-key: ${{ secrets.FOSSA_API_KEY }}
```

## Conclusion

Implementing these security best practices will significantly enhance your production system's security posture. Remember that security is a continuous process that requires ongoing attention, updates, and improvements. Regularly review and update your security measures to adapt to the evolving threat landscape.

---

<div align="center">

**[⬅️ Back to Resources](./README.md) | [📚 Back to Chapter](../Chapter_09_Main.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
