<div align="center">

# Exercise 3: Monitoring and Alerting

</div>

<div align="center">

**[⬅️ Back to Exercises](./README.md) | [📚 Back to Chapter](../README.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Overview

In this exercise, you'll set up a comprehensive monitoring and alerting system for your application using industry-standard tools. You'll configure Prometheus for metrics collection, Grafana for visualization, and implement alerting for important events. This exercise builds on the Kubernetes setup from Exercise 2.

## Learning Objectives

By the end of this exercise, you will be able to:

1. Deploy and configure Prometheus and Grafana in a Kubernetes cluster
2. Instrument a sample application to expose metrics
3. Create custom Grafana dashboards for monitoring
4. Configure alerting rules for common failure scenarios
5. Implement proper logging strategies for application observability

## Prerequisites

- Kubernetes cluster running (from Exercise 2)
- Helm installed on your local machine
- kubectl configured to access your cluster
- Basic understanding of metrics and observability concepts

## Exercise Steps

### Step 1: Install Prometheus and Grafana using Helm

1. Add the Prometheus community Helm repository:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   ```

2. Create a namespace for monitoring:
   ```bash
   kubectl create namespace monitoring
   ```

3. Install the kube-prometheus-stack chart:
   ```bash
   helm install monitoring prometheus-community/kube-prometheus-stack \
     --namespace monitoring \
     --set grafana.adminPassword=admin123 \
     --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
     --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false
   ```

4. Verify that all components are running:
   ```bash
   kubectl -n monitoring get pods
   ```

5. Set up port forwarding to access Grafana:
   ```bash
   kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
   ```

6. Open a browser and go to `http://localhost:3000`. Log in with:
   - Username: `admin`
   - Password: `admin123`

### Step 2: Create a Sample Application with Metrics

1. Create a file named `metric-app.yaml` with the following content:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metric-app
  namespace: exercise-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: metric-app
  template:
    metadata:
      labels:
        app: metric-app
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: "/metrics"
        prometheus.io/port: "8080"
    spec:
      securityContext:
        runAsNonRoot: true
        fsGroup: 1000
      containers:
      - name: metric-app
        image: prom/prometheus:v2.45.0
        args:
        - --config.file=/etc/prometheus/prometheus.yml
        - --storage.tsdb.path=/prometheus
        - --web.console.libraries=/usr/share/prometheus/console_libraries
        - --web.console.templates=/usr/share/prometheus/consoles
        - --web.listen-address=:8080
        ports:
        - containerPort: 8080
          name: metrics
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          runAsUser: 65534  # nobody user
          runAsGroup: 65534
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /-/healthy
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /-/ready
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5
        volumeMounts:
        - name: config-volume
          mountPath: /etc/prometheus
        - name: storage-volume
          mountPath: /prometheus
      volumes:
      - name: config-volume
        configMap:
          name: prometheus-config
      - name: storage-volume
        emptyDir: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: exercise-app
data:
  prometheus.yml: |-
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:8080']
---
apiVersion: v1
kind: Service
metadata:
  name: metric-app
  namespace: exercise-app
spec:
  selector:
    app: metric-app
  ports:
  - name: metrics
    port: 8080
    targetPort: 8080
  type: ClusterIP
```

2. Apply the configuration:
   ```bash
   kubectl apply -f metric-app.yaml
   ```

3. Create a ServiceMonitor to make Prometheus scrape your application:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: metric-app-monitor
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: metric-app
  namespaceSelector:
    matchNames:
      - exercise-app
  endpoints:
  - port: metrics
    interval: 15s
```

4. Save this as `service-monitor.yaml` and apply it:
   ```bash
   kubectl apply -f service-monitor.yaml
   ```

### Step 3: Create a Grafana Dashboard

1. In Grafana (http://localhost:3000), navigate to "Dashboards" > "Import"

2. Create a new dashboard with a JSON model. Copy this JSON and paste it:

```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": {
          "type": "datasource",
          "uid": "grafana"
        },
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "target": {
          "limit": 100,
          "matchAny": false,
          "tags": [],
          "type": "dashboard"
        },
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "fiscalYearStartMonth": 0,
  "graphTooltip": 0,
  "id": null,
  "links": [],
  "liveNow": false,
  "panels": [
    {
      "datasource": {
        "type": "prometheus",
        "uid": "prometheus"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisCenteredZero": false,
            "axisColorMode": "text",
            "axisLabel": "",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "short"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 0
      },
      "id": 2,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom",
          "showLegend": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "pluginVersion": "9.5.0",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "prometheus"
          },
          "editorMode": "code",
          "expr": "sum(rate(prometheus_http_requests_total{namespace=\"exercise-app\"}[5m])) by (handler)",
          "legendFormat": "{{handler}}",
          "range": true,
          "refId": "A"
        }
      ],
      "title": "HTTP Request Rate",
      "type": "timeseries"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "prometheus"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "thresholds"
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "short"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 0
      },
      "id": 4,
      "options": {
        "colorMode": "value",
        "graphMode": "area",
        "justifyMode": "auto",
        "orientation": "auto",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": false
        },
        "textMode": "auto",
        "wideLayout": true
      },
      "pluginVersion": "9.5.0",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "prometheus"
          },
          "editorMode": "code",
          "expr": "prometheus_tsdb_head_samples_appended_total{namespace=\"exercise-app\"}",
          "legendFormat": "Samples",
          "range": true,
          "refId": "A"
        }
      ],
      "title": "Total Samples",
      "type": "stat"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "prometheus"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisCenteredZero": false,
            "axisColorMode": "text",
            "axisLabel": "",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "bytes"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 0,
        "y": 8
      },
      "id": 6,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom",
          "showLegend": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "pluginVersion": "9.5.0",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "prometheus"
          },
          "editorMode": "code",
          "expr": "container_memory_working_set_bytes{namespace=\"exercise-app\", pod=~\"metric-app.*\", container!=\"\"}",
          "legendFormat": "{{pod}}",
          "range": true,
          "refId": "A"
        }
      ],
      "title": "Memory Usage",
      "type": "timeseries"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "prometheus"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "axisCenteredZero": false,
            "axisColorMode": "text",
            "axisLabel": "",
            "axisPlacement": "auto",
            "barAlignment": 0,
            "drawStyle": "line",
            "fillOpacity": 10,
            "gradientMode": "none",
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            },
            "lineInterpolation": "linear",
            "lineWidth": 1,
            "pointSize": 5,
            "scaleDistribution": {
              "type": "linear"
            },
            "showPoints": "never",
            "spanNulls": false,
            "stacking": {
              "group": "A",
              "mode": "none"
            },
            "thresholdsStyle": {
              "mode": "off"
            }
          },
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              },
              {
                "color": "red",
                "value": 80
              }
            ]
          },
          "unit": "percentunit"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 8,
        "w": 12,
        "x": 12,
        "y": 8
      },
      "id": 8,
      "options": {
        "legend": {
          "calcs": [],
          "displayMode": "list",
          "placement": "bottom",
          "showLegend": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "pluginVersion": "9.5.0",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "prometheus"
          },
          "editorMode": "code",
          "expr": "rate(container_cpu_usage_seconds_total{namespace=\"exercise-app\", pod=~\"metric-app.*\", container!=\"\"}[5m])",
          "legendFormat": "{{pod}}",
          "range": true,
          "refId": "A"
        }
      ],
      "title": "CPU Usage",
      "type": "timeseries"
    }
  ],
  "refresh": "5s",
  "schemaVersion": 38,
  "style": "dark",
  "tags": [
    "kubernetes",
    "prometheus"
  ],
  "templating": {
    "list": []
  },
  "time": {
    "from": "now-1h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "Metric App Dashboard",
  "uid": "vibe-coding-exercise",
  "version": 1,
  "weekStart": ""
}
```

3. Click "Import" to create the dashboard

4. Navigate to your new dashboard and observe the metrics

### Step 4: Configure Prometheus Alerts

1. Create a file named `prometheus-alerts.yaml` with the following content:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: metric-app-alerts
  namespace: monitoring
  labels:
    prometheus: monitoring
    role: alert-rules
spec:
  groups:
  - name: metric-app.rules
    rules:
    - alert: HighMemoryUsage
      expr: container_memory_working_set_bytes{namespace="exercise-app", pod=~"metric-app.*", container!=""} / container_spec_memory_limit_bytes{namespace="exercise-app", pod=~"metric-app.*", container!=""} > 0.8
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High memory usage detected"
        description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} is using more than 80% of its memory limit."
    
    - alert: HighCpuUsage
      expr: rate(container_cpu_usage_seconds_total{namespace="exercise-app", pod=~"metric-app.*", container!=""}[5m]) / container_spec_cpu_quota{namespace="exercise-app", pod=~"metric-app.*", container!=""} * 1e5 > 80
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High CPU usage detected"
        description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} is using more than 80% of its CPU limit."
    
    - alert: PodRestarting
      expr: rate(kube_pod_container_status_restarts_total{namespace="exercise-app", pod=~"metric-app.*"}[15m]) > 0
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "Pod restarting frequently"
        description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} is restarting frequently."
```

2. Apply the alerts configuration:
   ```bash
   kubectl apply -f prometheus-alerts.yaml
   ```

3. Verify that the alerts are configured:
   - Navigate to Prometheus UI (forward port: `kubectl -n monitoring port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090`)
   - Go to "Alerts" tab to see your configured alerts

### Step 5: Set Up Log Collection with Loki

1. Add the Grafana Helm repository (if not already added):
   ```bash
   helm repo add grafana https://grafana.github.io/helm-charts
   helm repo update
   ```

2. Install Loki with default settings:
   ```bash
   helm install loki grafana/loki-stack \
     --namespace monitoring \
     --set grafana.enabled=false \
     --set promtail.enabled=true
   ```

3. Verify that Loki and Promtail are running:
   ```bash
   kubectl -n monitoring get pods -l app=loki
   kubectl -n monitoring get pods -l app=promtail
   ```

4. Configure Loki as a data source in Grafana:
   - In Grafana, go to "Configuration" > "Data sources"
   - Click "Add data source" and select "Loki"
   - Set the URL to `http://loki.monitoring.svc:3100`
   - Click "Save & test"

5. Create a simple application that generates logs:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-generator
  namespace: exercise-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: log-generator
  template:
    metadata:
      labels:
        app: log-generator
    spec:
      containers:
      - name: log-generator
        image: busybox:1.36
        command: ["/bin/sh", "-c"]
        args:
        - >
          while true; do
            echo "[INFO] This is a sample log message $(date)"
            echo "[ERROR] This is a sample error message $(date)"
            sleep 5
          done
        resources:
          requests:
            memory: "16Mi"
            cpu: "10m"
          limits:
            memory: "32Mi"
            cpu: "20m"
```

6. Save this as `log-generator.yaml` and apply it:
   ```bash
   kubectl apply -f log-generator.yaml
   ```

7. Create a new Grafana dashboard for logs:
   - In Grafana, go to "Explore"
   - Select "Loki" as the data source
   - Enter the query: `{namespace="exercise-app", app="log-generator"}`
   - Run the query to see logs from your application
   - Click "Add to dashboard" and select "New dashboard"

### Step 6: Create a Combined Dashboard for Metrics and Logs

1. In Grafana, create a new dashboard
2. Add a panel with your Prometheus metrics
3. Add a panel with your Loki logs
4. Create a template variable for namespace to allow filtering
5. Save the dashboard with a meaningful name

### Step 7: Simulate a Problem and Observe Alerts

1. Create a file named `load-generator.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: load-generator
  namespace: exercise-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: load-generator
  template:
    metadata:
      labels:
        app: load-generator
    spec:
      containers:
      - name: load-generator
        image: busybox:1.36
        command: ["/bin/sh", "-c"]
        args:
        - >
          while true; do
            for i in $(seq 1 100); do
              wget -q -O- http://metric-app:8080/
              wget -q -O- http://metric-app:8080/metrics
            done
            echo "Generated load burst"
            sleep 5
          done
```

2. Apply the load generator:
   ```bash
   kubectl apply -f load-generator.yaml
   ```

3. Observe the changes in your Grafana dashboard
4. Wait to see if any alerts are triggered

## Expected Outcomes

- A fully functional monitoring system with Prometheus and Grafana
- Custom dashboards for application metrics
- Properly configured alerting rules
- Log collection and visualization with Loki
- Understanding of how to use observability tools to monitor and debug applications

## Extra Challenges

1. Add Distributed Tracing with Jaeger or Tempo
2. Configure notification channels for alerts (e.g., Slack or email)
3. Create a custom metric exporter for a specific application
4. Implement advanced Loki log queries with LogQL
5. Set up an on-call rotation system with PagerDuty or OpsGenie

## Conclusion

In this exercise, you've learned how to set up a comprehensive monitoring and observability stack for your applications. You now have the skills to collect metrics, visualize them, set up alerts, and gather logs from your applications.

This completes the trio of exercises for Chapter 9, giving you practical experience with the key concepts of DevOps and Security in production environments. You now have hands-on knowledge of:

1. Building CI/CD pipelines (Exercise 1)
2. Configuring Kubernetes for production (Exercise 2)
3. Implementing monitoring and observability (Exercise 3)

These skills form the foundation of modern DevOps practices and will serve you well in real-world production environments.

---

<div align="center">

**[⬅️ Back to Exercises](./README.md) | [📚 Back to Chapter](../README.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
