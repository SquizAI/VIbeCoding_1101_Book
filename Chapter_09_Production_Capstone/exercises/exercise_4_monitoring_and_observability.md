# Exercise 4: Implementing Monitoring and Observability

## Overview

In this exercise, you will implement a comprehensive monitoring and observability solution for the task management application to track performance, detect issues, and gain insights into system behavior in production.

## Learning Objectives

- Design a holistic monitoring strategy for production applications
- Implement metrics collection using Prometheus
- Create visualization dashboards with Grafana
- Set up log aggregation and analysis
- Configure alerting for proactive issue detection
- Implement distributed tracing for request flows

## Prerequisites

- Completed task management application from Chapter 8
- Deployed application from Exercises 1-2
- Basic understanding of monitoring concepts
- Kubernetes cluster (local or cloud-based)

## Exercise

### Part 1: Design Monitoring Strategy

1. **Create a Monitoring Plan**:

Document a comprehensive monitoring strategy that includes:
- Key metrics to track for each component (frontend, backend, database)
- SLIs (Service Level Indicators) and SLOs (Service Level Objectives)
- Log collection and retention policy
- Alerting thresholds and escalation procedures
- Dashboard requirements for different stakeholders

2. **Instrumenting the Application**:

Update your application to expose relevant metrics:

```javascript
// backend/src/middleware/metrics.js
const promClient = require('prom-client');
const express = require('express');

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const databaseOperationDurationSeconds = new promClient.Histogram({
  name: 'database_operation_duration_seconds',
  help: 'Duration of database operations in seconds',
  labelNames: ['operation', 'success'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

const activeSessions = new promClient.Gauge({
  name: 'active_sessions',
  help: 'Number of active user sessions'
});

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestTotal);
register.registerMetric(databaseOperationDurationSeconds);
register.registerMetric(activeSessions);

// Middleware to measure request duration
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Record end time and metrics on response finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
      
    httpRequestTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });
  
  next();
};

// Create metrics endpoint
const metricsEndpoint = express.Router();

metricsEndpoint.get('/', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
  register,
  metrics: {
    httpRequestDurationMicroseconds,
    httpRequestTotal,
    databaseOperationDurationSeconds,
    activeSessions
  }
};
```

3. **Add Metrics Middleware to Application**:

```javascript
// backend/src/app.js
const express = require('express');
const { metricsMiddleware, metricsEndpoint } = require('./middleware/metrics');

const app = express();

// Apply metrics middleware
app.use(metricsMiddleware);

// Register routes
app.use('/api/v1/tasks', require('./routes/tasks'));
app.use('/api/v1/users', require('./routes/users'));
// ... other routes

// Add metrics endpoint
app.use('/metrics', metricsEndpoint);

// Export the app
module.exports = app;
```

### Part 2: Set Up Prometheus and Grafana

1. **Deploy Prometheus to Kubernetes**:

Create a file `monitoring/prometheus-config.yaml`:

```yaml
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
          
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:9090']
          
      - job_name: 'taskmanager-backend'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: taskmanager-backend
          - source_labels: [__meta_kubernetes_pod_container_port_name]
            action: keep
            regex: http
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name
        metrics_path: /metrics
```

Create a file `monitoring/prometheus-deployment.yaml`:

```yaml
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
      containers:
      - name: prometheus
        image: prom/prometheus:v2.37.0
        args:
          - "--config.file=/etc/prometheus/prometheus.yml"
          - "--storage.tsdb.path=/prometheus"
          - "--web.console.libraries=/usr/share/prometheus/console_libraries"
          - "--web.console.templates=/usr/share/prometheus/consoles"
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
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
  labels:
    app: prometheus
spec:
  ports:
  - port: 9090
    targetPort: 9090
  selector:
    app: prometheus
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-storage
  namespace: monitoring
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

2. **Deploy Grafana to Kubernetes**:

Create a file `monitoring/grafana-deployment.yaml`:

```yaml
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
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
        - name: grafana-datasources
          mountPath: /etc/grafana/provisioning/datasources
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
      volumes:
      - name: grafana-storage
        persistentVolumeClaim:
          claimName: grafana-storage
      - name: grafana-datasources
        configMap:
          name: grafana-datasources
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
  labels:
    app: grafana
spec:
  ports:
  - port: 3000
    targetPort: 3000
  selector:
    app: grafana
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: grafana-storage
  namespace: monitoring
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
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

3. **Create Grafana Dashboards**:

Create a dashboard for application metrics with the following panels:
- Request rate by endpoint
- Request duration by endpoint
- Error rate
- Database operation duration
- Active sessions
- System resource usage (CPU, memory)

### Part 3: Set Up Centralized Logging

1. **Deploy Elasticsearch, Fluentd, and Kibana (EFK Stack)**:

Create a file `monitoring/fluentd-configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: monitoring
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/taskmanager-*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
        time_format %Y-%m-%dT%H:%M:%S.%NZ
      </parse>
    </source>
    
    <filter kubernetes.**>
      @type kubernetes_metadata
      kubernetes_url https://kubernetes.default.svc
      bearer_token_file /var/run/secrets/kubernetes.io/serviceaccount/token
      ca_file /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    </filter>
    
    <match kubernetes.var.log.containers.taskmanager-**>
      @type elasticsearch
      host elasticsearch
      port 9200
      logstash_format true
      logstash_prefix taskmanager
      <buffer>
        @type file
        path /var/log/fluentd-buffers/kubernetes.system.buffer
        flush_mode interval
        retry_type exponential_backoff
        flush_thread_count 2
        flush_interval 5s
        retry_forever
        retry_max_interval 30
        chunk_limit_size 2M
        queue_limit_length 8
        overflow_action block
      </buffer>
    </match>
```

2. **Implement Structured Logging in Application**:

```javascript
// backend/src/util/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'taskmanager-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
      )
    })
  ]
});

// Add request context to all logs
const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || require('uuid').v4();
  req.requestId = requestId;
  
  // Add request context to logger
  req.logger = logger.child({
    requestId,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Log request
  req.logger.info('Request received');
  
  // Log response
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    req.logger.info('Response sent', {
      statusCode: res.statusCode,
      duration,
      contentLength: res.get('Content-Length')
    });
  });
  
  next();
};

module.exports = {
  logger,
  requestLogger
};
```

### Part 4: Implement Distributed Tracing

1. **Add OpenTelemetry Tracing to Application**:

```javascript
// backend/src/tracing.js
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');

// Configure the SDK with auto instrumentation
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'taskmanager-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'production'
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://jaeger:4318/v1/traces'
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
      '@opentelemetry/instrumentation-redis': { enabled: true }
    })
  ]
});

// Initialize the SDK
sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

module.exports = sdk;
```

2. **Deploy Jaeger for Tracing Visualization**:

Create a file `monitoring/jaeger.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: monitoring
  labels:
    app: jaeger
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:1.35
        ports:
        - containerPort: 16686
          name: http
        - containerPort: 4317
          name: otlp-grpc
        - containerPort: 4318
          name: otlp-http
        env:
        - name: COLLECTOR_OTLP_ENABLED
          value: "true"
---
apiVersion: v1
kind: Service
metadata:
  name: jaeger
  namespace: monitoring
  labels:
    app: jaeger
spec:
  ports:
  - port: 16686
    targetPort: 16686
    name: http
  - port: 4317
    targetPort: 4317
    name: otlp-grpc
  - port: 4318
    targetPort: 4318
    name: otlp-http
  selector:
    app: jaeger
```

### Part 5: Set Up Alerting

1. **Create Alerting Rules in Prometheus**:

Create a file `monitoring/prometheus-rules.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-rules
  namespace: monitoring
data:
  alert-rules.yml: |
    groups:
    - name: taskmanager
      rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High Error Rate"
          description: "Error rate is above 5% for the last 2 minutes"
          
      - alert: SlowAPIResponse
        expr: http_request_duration_seconds{quantile="0.9"} > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow API Response"
          description: "90th percentile of API response time is above 1 second for 5 minutes"
          
      - alert: HighDatabaseLatency
        expr: database_operation_duration_seconds{quantile="0.9"} > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High Database Latency"
          description: "90th percentile of database operation time is above 0.5 second for 5 minutes"
```

2. **Deploy Alert Manager**:

Create a file `monitoring/alertmanager.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: alertmanager
  namespace: monitoring
  labels:
    app: alertmanager
spec:
  replicas: 1
  selector:
    matchLabels:
      app: alertmanager
  template:
    metadata:
      labels:
        app: alertmanager
    spec:
      containers:
      - name: alertmanager
        image: prom/alertmanager:v0.24.0
        args:
          - "--config.file=/etc/alertmanager/alertmanager.yml"
        ports:
        - containerPort: 9093
        volumeMounts:
        - name: alertmanager-config
          mountPath: /etc/alertmanager
      volumes:
      - name: alertmanager-config
        configMap:
          name: alertmanager-config
---
apiVersion: v1
kind: Service
metadata:
  name: alertmanager
  namespace: monitoring
  labels:
    app: alertmanager
spec:
  ports:
  - port: 9093
    targetPort: 9093
  selector:
    app: alertmanager
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m
      slack_api_url: 'https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX'
      
    route:
      group_by: ['alertname', 'job']
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 4h
      receiver: 'slack-notifications'
      routes:
      - match:
          severity: critical
        receiver: 'slack-critical'
        
    receivers:
    - name: 'slack-notifications'
      slack_configs:
      - channel: '#alerts'
        send_resolved: true
        title: '{{ .GroupLabels.alertname }}'
        text: "{{ range .Alerts }}{{ .Annotations.description }}\n{{ end }}"
        
    - name: 'slack-critical'
      slack_configs:
      - channel: '#critical-alerts'
        send_resolved: true
        title: 'CRITICAL: {{ .GroupLabels.alertname }}'
        text: "{{ range .Alerts }}{{ .Annotations.description }}\n{{ end }}"
```

## Deliverables

1. Fully configured monitoring stack with Prometheus, Grafana, EFK, and Jaeger
2. Screenshots of:
   - Grafana dashboards showing application metrics
   - Kibana interface with application logs
   - Jaeger UI with distributed traces
   - Alert Manager configuration
3. Documentation describing:
   - Monitoring strategy and architecture
   - Key metrics and their significance
   - Alert thresholds and rationale
   - Procedure for investigating issues using the monitoring tools

## Assessment Criteria

- Completeness of monitoring implementation
- Quality of dashboards and visualizations
- Appropriateness of alerting thresholds
- Effectiveness of logging implementation
- Clarity of documentation

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [EFK Stack Tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes)

## Next Steps

After completing this exercise, consider:
- Implementing SLO monitoring and error budgets
- Setting up synthetic monitoring for key user journeys
- Creating runbooks for common issues
- Implementing anomaly detection using machine learning
