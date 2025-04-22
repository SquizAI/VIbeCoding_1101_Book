# Production Deployment: Ninja Level (Part 2)

## Advanced Observability Implementation

A ninja-level production environment requires comprehensive observability beyond basic monitoring, incorporating distributed tracing, advanced logging, and AI-driven anomaly detection.

### Advanced OpenTelemetry Integration

Let's implement full-stack OpenTelemetry instrumentation:

```javascript
// telemetry/tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');
const { B3Propagator } = require('@opentelemetry/propagator-b3');
const { JaegerPropagator } = require('@opentelemetry/propagator-jaeger');
const { CompositePropagator } = require('@opentelemetry/core');

// Define the service name and version
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME || 'taskmanager-api',
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production',
  region: process.env.AWS_REGION || 'unknown',
  instanceId: process.env.INSTANCE_ID || 'unknown',
});

// Create and configure SDK
const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/traces',
    headers: {},
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://otel-collector:4318/v1/metrics',
      headers: {},
    }),
    // Export metrics every 15 seconds
    exportIntervalMillis: 15000,
  }),
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/traces',
  })),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Enable all instrumentations
      '@opentelemetry/instrumentation-fs': { enabled: true },
      '@opentelemetry/instrumentation-dns': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
      '@opentelemetry/instrumentation-redis': { enabled: true },
      '@opentelemetry/instrumentation-winston': { enabled: true },
      '@opentelemetry/instrumentation-aws-sdk': { enabled: true },
    }),
  ],
  textMapPropagator: new CompositePropagator({
    propagators: [
      new AWSXRayPropagator(),
      new B3Propagator(),
      new JaegerPropagator(),
    ],
  }),
});

// Start the instrumentation
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.error('Error initializing tracing', error));

// Graceful shutdown
const shutdown = () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = sdk;
```

### Advanced OpenTelemetry Collector Configuration

```yaml
# monitoring/otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

  prometheus:
    config:
      scrape_configs:
        - job_name: 'otel-collector'
          scrape_interval: 10s
          static_configs:
            - targets: ['0.0.0.0:8888']
        - job_name: 'k8s-pods'
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
            - source_labels: [__meta_kubernetes_namespace]
              action: replace
              target_label: kubernetes_namespace
            - source_labels: [__meta_kubernetes_pod_name]
              action: replace
              target_label: kubernetes_pod_name

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024

  memory_limiter:
    check_interval: 1s
    limit_percentage: 80
    spike_limit_percentage: 25

  k8s_attributes:
    auth_type: "serviceAccount"
    passthrough: false
    filter:
      node_from_env_var: KUBE_NODE_NAME
    extract:
      metadata:
        - k8s.pod.name
        - k8s.pod.uid
        - k8s.deployment.name
        - k8s.namespace.name
        - k8s.node.name
        - k8s.container.name

  resource:
    attributes:
      - action: insert
        key: telemetry.sdk.name
        value: opentelemetry

  probabilistic_sampler:
    hash_seed: 22
    sampling_percentage: 20

  tail_sampling:
    decision_wait: 10s
    num_traces: 100
    expected_new_traces_per_sec: 10
    policies:
      [
        {
          name: error-policy,
          type: status_code,
          status_code: { status_codes: [ERROR] }
        },
        {
          name: slow-traces-policy,
          type: latency,
          latency: { threshold_ms: 500 }
        }
      ]

exporters:
  jaeger:
    endpoint: jaeger-collector:14250
    tls:
      insecure: true

  prometheus:
    endpoint: 0.0.0.0:8889

  elasticsearch:
    endpoints: ["https://elasticsearch:9200"]
    index: traces
    
  logging:
    verbosity: detailed

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, k8s_attributes, resource, probabilistic_sampler, tail_sampling, batch]
      exporters: [jaeger, elasticsearch, logging]
    
    metrics:
      receivers: [otlp, prometheus]
      processors: [memory_limiter, k8s_attributes, resource, batch]
      exporters: [prometheus]

  telemetry:
    logs:
      level: info
```

## Advanced Security Implementation

### Zero Trust Security Architecture

Implement a sophisticated zero trust architecture with advanced authentication and authorization:

```yaml
# security/authz-policy.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: taskmanager-authorization
  namespace: taskmanager
spec:
  selector:
    matchLabels:
      app: taskmanager
  action: ALLOW
  rules:
  # Public API endpoints accessible to authenticated users
  - from:
    - source:
        requestPrincipals: ["*"]
    to:
    - operation:
        methods: ["GET"]
        paths: ["/api/v1/public/*"]

  # User-specific endpoints require valid user
  - from:
    - source:
        requestPrincipals: ["*"]
    to:
    - operation:
        methods: ["GET"]
        paths: ["/api/v1/users/me*", "/api/v1/tasks*"]
    when:
    - key: request.auth.claims[sub]
      notValues: ["null", ""]

  # Admin endpoints require admin role
  - from:
    - source:
        requestPrincipals: ["*"]
    to:
    - operation:
        methods: ["*"]
        paths: ["/api/v1/admin/*"]
    when:
    - key: request.auth.claims[roles]
      values: ["admin"]

  # Health endpoint for monitoring
  - to:
    - operation:
        methods: ["GET"]
        paths: ["/health", "/metrics"]
```

### Advanced AWS Security Configuration

Implement sophisticated AWS security controls:

```hcl
# security/aws-shield.tf
resource "aws_shield_protection" "api_gateway" {
  name         = "taskmanager-api-protection"
  resource_arn = aws_api_gateway_stage.api.arn

  tags = var.common_tags
}

resource "aws_shield_protection" "cloudfront" {
  name         = "taskmanager-frontend-protection"
  resource_arn = aws_cloudfront_distribution.frontend.arn

  tags = var.common_tags
}

# security/aws-guardduty.tf
resource "aws_guardduty_detector" "main" {
  enable                       = true
  finding_publishing_frequency = "SIX_HOURS"

  datasources {
    s3_logs {
      enable = true
    }
    kubernetes {
      audit_logs {
        enable = true
      }
    }
    malware_protection {
      scan_ec2_instance_with_findings {
        ebs_volumes {
          enable = true
        }
      }
    }
  }

  tags = var.common_tags
}

# security/aws-securityhub.tf
resource "aws_securityhub_account" "main" {}

resource "aws_securityhub_standards_subscription" "cis" {
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.2.0"
}

resource "aws_securityhub_standards_subscription" "pci_dss" {
  depends_on    = [aws_securityhub_account.main]
  standards_arn = "arn:aws:securityhub:${var.aws_region}::standards/pci-dss/v/3.2.1"
}
```

### Advanced Secrets Management with Vault

Implement Hashicorp Vault for advanced secrets management:

```yaml
# security/vault-kubernetes-auth.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: vault-auth
  namespace: vault
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: vault-auth-tokenreview
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:auth-delegator
subjects:
- kind: ServiceAccount
  name: vault-auth
  namespace: vault
```

```hcl
# security/vault-policies.tf
resource "vault_policy" "taskmanager" {
  name = "taskmanager"

  policy = <<EOT
# DB credentials
path "database/creds/taskmanager" {
  capabilities = ["read"]
}

# JWT auth
path "auth/jwt/login" {
  capabilities = ["create", "read"]
}

# KV secrets
path "secret/data/taskmanager/*" {
  capabilities = ["read"]
}

# Transit encryption
path "transit/encrypt/taskmanager" {
  capabilities = ["create", "update"]
}

path "transit/decrypt/taskmanager" {
  capabilities = ["create", "update"]
}
EOT
}

# Grant kubernetes service account access to specific secrets
resource "vault_kubernetes_auth_backend_role" "taskmanager" {
  backend                          = vault_auth_backend.kubernetes.path
  role_name                        = "taskmanager"
  bound_service_account_names      = ["taskmanager"]
  bound_service_account_namespaces = ["taskmanager"]
  token_ttl                        = 3600
  token_policies                   = [vault_policy.taskmanager.name]
}
```

### Zero-Downtime Database Migration Strategy

Implement a sophisticated database migration strategy:

```javascript
// migrations/runner.js
const { migrate } = require('node-pg-migrate');
const path = require('path');
const { executeWrite, executeRead } = require('../db/database');

// Distributed locking mechanism to prevent concurrent migrations
async function acquireMigrationLock() {
  try {
    const result = await executeWrite(
      `INSERT INTO migration_locks (lock_name, locked_at) 
       VALUES ('migration_lock', NOW()) 
       ON CONFLICT (lock_name) 
       DO UPDATE SET locked_at = NOW(), locked_by = $1 
       WHERE migration_locks.locked_at < NOW() - INTERVAL '10 minutes' 
       RETURNING id`,
      [process.env.HOSTNAME || 'unknown']
    );

    return result.rowCount > 0;
  } catch (err) {
    console.error('Failed to acquire migration lock:', err);
    return false;
  }
}

async function releaseMigrationLock() {
  try {
    await executeWrite(
      `UPDATE migration_locks 
       SET locked_at = NULL, locked_by = NULL 
       WHERE lock_name = 'migration_lock' AND locked_by = $1`,
      [process.env.HOSTNAME || 'unknown']
    );
    return true;
  } catch (err) {
    console.error('Failed to release migration lock:', err);
    return false;
  }
}

// Get current database version to determine compatible migrations
async function getDatabaseVersion() {
  try {
    const result = await executeRead(
      `SELECT version FROM database_version ORDER BY updated_at DESC LIMIT 1`
    );
    return result.rows[0]?.version || '0.0.0';
  } catch (err) {
    // Table might not exist in new deployments
    if (err.code === '42P01') {
      return '0.0.0';
    }
    throw err;
  }
}

// Run migrations with safety checks
async function runMigrations() {
  console.log('Starting database migration process');
  
  // Check compatible version
  const dbVersion = await getDatabaseVersion();
  console.log(`Current database version: ${dbVersion}`);
  
  // Acquire lock to prevent concurrent migrations
  const lockAcquired = await acquireMigrationLock();
  if (!lockAcquired) {
    console.warn('Could not acquire migration lock. Another migration might be in progress.');
    return false;
  }
  
  console.log('Migration lock acquired. Starting migrations.');
  
  try {
    // Run migrations with forward-only strategy
    const result = await migrate({
      dir: path.resolve(__dirname, 'scripts'),
      direction: 'up',
      migrationsTable: 'pgmigrations',
      count: Infinity,
      createSchema: true,
      createMigrationsSchema: true,
      verbose: true,
      singleTransaction: false, // For large migrations, do not use a single transaction
      ignorePattern: '.*map$' // Ignore source maps
    });
    
    // Update database version after migration
    await executeWrite(
      `INSERT INTO database_version (version, updated_at, updated_by) 
       VALUES ($1, NOW(), $2)`,
      [process.env.APP_VERSION || '1.0.0', process.env.HOSTNAME || 'unknown']
    );
    
    console.log(`Migrations completed successfully. ${result.length} migrations applied.`);
    return true;
  } catch (err) {
    console.error('Migration failed:', err);
    return false;
  } finally {
    await releaseMigrationLock();
    console.log('Migration lock released');
  }
}

// Handle graceful exit
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, releasing migration lock before exit');
  await releaseMigrationLock();
  process.exit(0);
});

module.exports = { runMigrations };
```

## Chaos Engineering Integration

Implement chaos engineering to test production resilience:

```yaml
# chaos/pod-failure-experiment.yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: backend-pod-failure
  namespace: chaos-testing
spec:
  action: pod-failure
  mode: one
  value: ''
  duration: '5m'
  selector:
    namespaces:
      - taskmanager
    labelSelectors:
      'app': 'taskmanager'
      'component': 'backend'
  scheduler:
    cron: '@every 24h'
---
# chaos/network-chaos-experiment.yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: database-latency
  namespace: chaos-testing
spec:
  action: delay
  mode: one
  selector:
    namespaces:
      - taskmanager
    labelSelectors:
      'app': 'taskmanager'
      'component': 'backend'
  delay:
    latency: '200ms'
    correlation: '25'
    jitter: '50ms'
  target:
    selector:
      namespaces:
        - taskmanager
      labelSelectors:
        'app': 'taskmanager'
        'component': 'database'
    mode: one
  duration: '10m'
  scheduler:
    cron: '@every 72h'
```

### Chaos Experiment Automation

```javascript
// chaos/experiment-runner.js
const k8s = require('@kubernetes/client-node');
const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

class ChaosExperimentRunner {
  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();
    this.k8sApi = this.kc.makeApiClient(k8s.CustomObjectsApi);
    
    // Initialize notification clients
    this.slackWebhook = process.env.SLACK_WEBHOOK_URL;
    this.prometheusAlertEndpoint = process.env.PROMETHEUS_ALERT_ENDPOINT;
  }
  
  async runExperiment(experimentFile) {
    try {
      console.log(`Starting chaos experiment from ${experimentFile}`);
      
      // Load experiment definition
      const experimentYaml = fs.readFileSync(
        path.resolve(__dirname, experimentFile), 
        'utf8'
      );
      const experiment = yaml.load(experimentYaml);
      
      // Notify team about experiment
      await this.notifyExperimentStart(experiment);
      
      // Submit experiment to chaos-mesh
      const result = await this.k8sApi.createNamespacedCustomObject(
        'chaos-mesh.org',
        'v1alpha1',
        experiment.metadata.namespace,
        this.getChaosResourceType(experiment.kind),
        experiment
      );
      
      console.log(`Experiment ${experiment.metadata.name} started successfully`);
      
      // Set up monitoring for the experiment
      const experimentEndTime = new Date(
        Date.now() + this.parseDuration(experiment.spec.duration)
      );
      
      const experimentId = result.body.metadata.uid;
      
      // Schedule experiment cleanup
      setTimeout(() => {
        this.checkExperimentResults(experimentId, experiment);
      }, this.parseDuration(experiment.spec.duration) + 60000); // Add 1 minute buffer
      
      return experimentId;
    } catch (error) {
      console.error('Failed to run experiment:', error);
      throw error;
    }
  }
  
  getChaosResourceType(kind) {
    const mapping = {
      PodChaos: 'podchaos',
      NetworkChaos: 'networkchaos',
      IOChaos: 'iochaos',
      TimeChaos: 'timechaos',
      KernelChaos: 'kernelchaos',
      StressChaos: 'stresschaos'
    };
    
    return mapping[kind] || kind.toLowerCase();
  }
  
  parseDuration(duration) {
    if (duration.endsWith('m')) {
      return parseInt(duration) * 60 * 1000;
    } else if (duration.endsWith('h')) {
      return parseInt(duration) * 60 * 60 * 1000;
    } else if (duration.endsWith('s')) {
      return parseInt(duration) * 1000;
    }
    return 300000; // Default 5 minutes
  }
  
  async notifyExperimentStart(experiment) {
    if (this.slackWebhook) {
      try {
        await axios.post(this.slackWebhook, {
          text: `🔥 *Chaos Experiment Starting* 🔥\n*Name:* ${experiment.metadata.name}\n*Type:* ${experiment.kind}\n*Duration:* ${experiment.spec.duration}\n*Target:* ${JSON.stringify(experiment.spec.selector)}`
        });
      } catch (err) {
        console.error('Failed to send Slack notification:', err);
      }
    }
  }
  
  async checkExperimentResults(experimentId, experiment) {
    try {
      // Get metrics around the experiment timeframe
      const metrics = await this.getMetricsDuringExperiment(
        experiment.spec.selector.namespaces[0],
        experiment.spec.selector.labelSelectors
      );
      
      // Analyze metrics and send report
      const report = this.generateExperimentReport(experiment, metrics);
      await this.notifyExperimentComplete(report);
      
      console.log(`Experiment ${experiment.metadata.name} completed and analyzed`);
    } catch (error) {
      console.error('Failed to check experiment results:', error);
    }
  }
  
  async getMetricsDuringExperiment(namespace, labels) {
    // Implementation would depend on your monitoring system
    // This is a placeholder for Prometheus query
    if (this.prometheusAlertEndpoint) {
      try {
        const labelSelector = Object.entries(labels)
          .map(([k, v]) => `${k}="${v}"`)
          .join(',');
        
        const response = await axios.get(this.prometheusAlertEndpoint, {
          params: {
            query: `sum by (pod) (rate(http_requests_total{namespace="${namespace}",${labelSelector}}[5m]))`,
            start: Math.floor(Date.now() / 1000) - 3600,
            end: Math.floor(Date.now() / 1000),
            step: '15s'
          }
        });
        
        return response.data;
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        return null;
      }
    }
    
    return null;
  }
  
  generateExperimentReport(experiment, metrics) {
    // Implementation depends on what metrics you want to analyze
    // This is a simple placeholder
    return {
      name: experiment.metadata.name,
      type: experiment.kind,
      duration: experiment.spec.duration,
      target: experiment.spec.selector,
      metrics: metrics,
      timestamp: new Date().toISOString()
    };
  }
  
  async notifyExperimentComplete(report) {
    if (this.slackWebhook) {
      try {
        await axios.post(this.slackWebhook, {
          text: `✅ *Chaos Experiment Completed* ✅\n*Name:* ${report.name}\n*Type:* ${report.type}\n*Duration:* ${report.duration}\n*Timestamp:* ${report.timestamp}\n\nCheck monitoring dashboards for detailed analysis.`
        });
      } catch (err) {
        console.error('Failed to send completion notification:', err);
      }
    }
  }
}

module.exports = new ChaosExperimentRunner();
```
