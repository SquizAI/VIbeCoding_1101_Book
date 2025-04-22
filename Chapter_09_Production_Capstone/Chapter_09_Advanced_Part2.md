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


## 🔷 Advanced Kubernetes Deployment Strategies

For production-grade applications, we need sophisticated deployment strategies to ensure reliability and zero downtime.


### 🔹 Implementing Kubernetes Deployments

Let's set up Kubernetes deployment manifests for our task management application:

```yaml
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


### 🔹 Implementing Kubernetes Services

```yaml
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


### 🔹 Implementing Kubernetes Ingress

```yaml
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


### 🔹 Blue-Green Deployment Implementation

For zero-downtime deployments, let's implement a blue-green deployment strategy:

```yaml
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


### 🔹 Blue-Green Deployment Script

```bash
#!/bin/bash

set -e

CURRENT_DEPLOYMENT=$(kubectl get service backend -n production -o jsonpath='{.spec.selector.deployment}')

if [ "$CURRENT_DEPLOYMENT" == "blue" ]; then
  TARGET_DEPLOYMENT="green"
  INACTIVE_DEPLOYMENT="blue"
else
  TARGET_DEPLOYMENT="green"
  INACTIVE_DEPLOYMENT="blue"
fi

echo "Current deployment is $CURRENT_DEPLOYMENT, switching to $TARGET_DEPLOYMENT"

kubectl set image deployment/backend-$TARGET_DEPLOYMENT backend=${ECR_REGISTRY}/taskmanager-backend:${IMAGE_TAG} -n production

kubectl rollout status deployment/backend-$TARGET_DEPLOYMENT -n production

echo "Running smoke tests on $TARGET_DEPLOYMENT"

kubectl patch service backend -n production -p "{\"spec\":{\"selector\":{\"deployment\":\"$TARGET_DEPLOYMENT\"}}}"

echo "Successfully switched from $CURRENT_DEPLOYMENT to $TARGET_DEPLOYMENT"

```


## 🔷 Advanced Monitoring and Observability

Production applications require comprehensive monitoring for reliability and performance.


### 🔹 Setting Up Prometheus for Metrics Collection

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


### 🔹 Kubernetes Prometheus Deployment

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


### 🔹 Setting Up Grafana for Visualization

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


### 🔹 Grafana Data Sources Configuration

```yaml
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


## 🔷 Implementing Distributed Tracing

For complex applications, distributed tracing helps diagnose performance issues.


### 🔹 Setting Up OpenTelemetry for Tracing

```yaml
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
