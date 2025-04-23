<div align="center">

# Chapter 09: Security and DevOps - Ninja Level (Part 1)

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

<div align="center">

> *"The true ninja masters both the visible and invisible aspects of production systems."*

</div>

---

<div align="center">

**[⬅️ Previous Chapter](../Chapter_08_Advanced_Machine_Learning/Chapter_08_Main.md) | [📚 Table of Contents](../README.md) | [➡️ Next Chapter](../README.md)**

</div>

<div align="center">

**[🔰 Beginner](./Chapter_09_Beginner.md) | [⚙️ Advanced](./Chapter_09_Advanced.md) | [⚔️ Ninja Part 1](./Chapter_09_Ninja_Part1.md) | [⚔️ Ninja Part 2](./Chapter_09_Ninja_Part2.md) | [📝 Main](./Chapter_09_Main.md)**

</div>

## 🔷 Introduction to Ninja-Level Production Systems

Welcome to the ninja level of our security and DevOps chapter. Here, we explore cutting-edge techniques for building, securing, and operating enterprise-grade production systems at scale. We'll cover advanced topics like multi-cluster Kubernetes federation, service mesh implementation, GitOps automation, advanced security practices, and chaos engineering.

These techniques represent the state of the art in 2025 for organizations operating mission-critical systems where reliability, security, and operational excellence are paramount.

## 🔷 Multi-Cluster Kubernetes Architecture

### 🔹 Federation with KubeFed

KubeFed (Kubernetes Federation) allows you to coordinate multiple Kubernetes clusters:

```yaml
# kubefed-config.yaml
apiVersion: core.kubefed.io/v1beta1
kind: KubeFedConfig
metadata:
  name: kubefed
  namespace: kube-federation-system
spec:
  featureGates:
  - name: SchedulerPreferences
    configuration: "Enabled"
  - name: PushReconciler
    configuration: "Enabled"
  - name: RawResourceStatusCollection
    configuration: "Enabled"
  scope: Namespaced
  controllerDuration:
    availableDelay: 20s
    unavailableDelay: 60s
  leaderElect:
    resourceLock: configmaps
    leaseDuration: 15s
    renewDeadline: 10s
    retryPeriod: 5s
  clusterHealthCheck:
    period: 10s
    failureThreshold: 3
    successThreshold: 1
    timeout: 3s
```

### 🔹 Federation Types and Workload Distribution

Create federated namespaces, deployments, and services:

```yaml
# federated-namespace.yaml
apiVersion: types.kubefed.io/v1beta1
kind: FederatedNamespace
metadata:
  name: federated-app
  namespace: kube-federation-system
spec:
  placement:
    clusters:
    - name: cluster-us-west
    - name: cluster-us-east
    - name: cluster-eu-central
  template:
    metadata:
      labels:
        environment: production
        federation: multi-region
```

```yaml
# federated-deployment.yaml
apiVersion: types.kubefed.io/v1beta1
kind: FederatedDeployment
metadata:
  name: federated-app
  namespace: federated-app
spec:
  template:
    metadata:
      labels:
        app: federated-app
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: federated-app
      template:
        metadata:
          labels:
            app: federated-app
        spec:
          containers:
          - name: nginx
            image: nginx:1.21
            resources:
              requests:
                memory: "64Mi"
                cpu: "250m"
              limits:
                memory: "128Mi"
                cpu: "500m"
  placement:
    clusters:
    - name: cluster-us-west
    - name: cluster-us-east
    - name: cluster-eu-central
  overrides:
  - clusterName: cluster-us-west
    clusterOverrides:
    - path: "/spec/replicas"
      value: 5
  - clusterName: cluster-us-east
    clusterOverrides:
    - path: "/spec/replicas"
      value: 5
  - clusterName: cluster-eu-central
    clusterOverrides:
    - path: "/spec/replicas"
      value: 3
```

### 🔹 Multi-Cluster Service Mesh with Istio

Configure Istio for a multi-cluster service mesh deployment:

```yaml
# istio-multicluster.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: istio-controlplane
spec:
  profile: default
  components:
    base:
      enabled: true
    pilot:
      enabled: true
      k8s:
        resources:
          requests:
            cpu: 500m
            memory: 2048Mi
    ingressGateways:
    - name: istio-ingressgateway
      enabled: true
      k8s:
        service:
          type: LoadBalancer
          ports:
          - port: 80
            name: http2
          - port: 443
            name: https
  meshConfig:
    accessLogFile: /dev/stdout
    enableTracing: true
    defaultConfig:
      tracing:
        sampling: 100
        zipkin:
          address: jaeger-collector.observability:9411
    trustDomain: cluster.local
    enableAutoMtls: true
    defaultProviders:
      metrics:
      - prometheus
  values:
    global:
      multiCluster:
        enabled: true
        clusterName: cluster-us-west
      meshID: mesh1
      network: network1
```

Remote cluster configuration:

```yaml
# istio-remote-cluster.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: istio-remote
spec:
  profile: remote
  components:
    base:
      enabled: true
    pilot:
      enabled: false
    ingressGateways:
    - name: istio-ingressgateway
      enabled: true
      k8s:
        service:
          type: LoadBalancer
          ports:
          - port: 80
            name: http2
          - port: 443
            name: https
  values:
    global:
      multiCluster:
        enabled: true
        clusterName: cluster-us-east
      meshID: mesh1
      network: network2
      remotePilotAddress: istiod.istio-system.svc:15012
```

## 🔷 Advanced Service Mesh Capabilities

### 🔹 Traffic Management with Istio

Implement sophisticated traffic routing patterns:

```yaml
# canary-deployment.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service
  namespace: production
spec:
  hosts:
  - app.example.com
  gateways:
  - app-gateway
  http:
  - match:
    - headers:
        user-type:
          exact: beta-tester
    route:
    - destination:
        host: app-service-v2
        port:
          number: 80
      weight: 100
  - match:
    - uri:
        prefix: /experimental
    route:
    - destination:
        host: app-service-experimental
        port:
          number: 80
      weight: 100
  - route:
    - destination:
        host: app-service-v1
        port:
          number: 80
      weight: 90
    - destination:
        host: app-service-v2
        port:
          number: 80
      weight: 10
```

### 🔹 Circuit Breaking and Fault Injection

Implement resilience patterns with service mesh:

```yaml
# circuit-breaker.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: app-service
  namespace: production
spec:
  host: app-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
        connectTimeout: 30ms
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 10
        http2MaxRequests: 1000
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
```

```yaml
# fault-injection.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-service-fault-injection
  namespace: production
spec:
  hosts:
  - app-service
  http:
  - fault:
      delay:
        fixedDelay: 7s
        percentage:
          value: 10
      abort:
        httpStatus: 500
        percentage:
          value: 5
    route:
    - destination:
        host: app-service
        subset: v1
```

### 🔹 Service Mesh Observability

Configure advanced tracing and metrics:

```yaml
# telemetry.yaml
apiVersion: telemetry.istio.io/v1alpha1
kind: Telemetry
metadata:
  name: mesh-telemetry
  namespace: istio-system
spec:
  tracing:
  - providers:
    - name: jaeger
    randomSamplingPercentage: 100.0
  metrics:
  - providers:
    - name: prometheus
    overrides:
    - match:
        metric: REQUEST_COUNT
        mode: CLIENT_AND_SERVER
      tagOverrides:
        response_code:
          operation: UPSERT
        http.status_code:
          operation: UPSERT
  accessLogging:
  - providers:
    - name: envoy
```

## 🔷 GitOps at Scale

### 🔹 Advanced Argo CD Configuration

Set up a sophisticated GitOps pipeline with Argo CD:

```yaml
# argocd-app-of-apps.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: app-of-apps
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/organization/gitops-config.git
    targetRevision: HEAD
    path: environments/production
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    - PruneLast=true
    - ApplyOutOfSyncOnly=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### 🔹 Multi-Environment GitOps with Kustomize

Structure your GitOps repository for multi-environment deployments:

```
gitops-repo/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── components/
│   ├── monitoring/
│   │   ├── kustomization.yaml
│   │   ├── prometheus.yaml
│   │   └── grafana.yaml
│   └── security/
│       ├── kustomization.yaml
│       └── network-policy.yaml
└── environments/
    ├── dev/
    │   ├── kustomization.yaml
    │   └── patches/
    │       └── deployment-patch.yaml
    ├── staging/
    │   ├── kustomization.yaml
    │   └── patches/
    │       └── deployment-patch.yaml
    └── production/
        ├── kustomization.yaml
        ├── patches/
        │   └── deployment-patch.yaml
        └── apps/
            ├── app1.yaml
            ├── app2.yaml
            └── app3.yaml
```

Example environment kustomization:

```yaml
# environments/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base
- apps/app1.yaml
- apps/app2.yaml
- apps/app3.yaml

components:
- ../../components/monitoring
- ../../components/security

namespace: production

patches:
- path: patches/deployment-patch.yaml

configMapGenerator:
- name: app-config
  behavior: merge
  literals:
  - LOG_LEVEL=info
  - FEATURE_FLAGS={"newFeature":false,"betaFeature":false}

secretGenerator:
- name: app-secrets
  files:
  - secrets/api-keys.env

images:
- name: organization/app-image
  newName: organization/app-image
  newTag: v1.2.3
```

### 🔹 Progressive Delivery with Argo Rollouts

Implement advanced deployment strategies:

```yaml
# rollout.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: app-rollout
  namespace: production
spec:
  replicas: 10
  selector:
    matchLabels:
      app: app-service
  template:
    metadata:
      labels:
        app: app-service
    spec:
      containers:
      - name: app
        image: organization/app-image:v1.2.3
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "300m"
  strategy:
    canary:
      stableService: app-stable
      canaryService: app-canary
      trafficRouting:
        istio:
          virtualService:
            name: app-vsvc
            routes:
            - primary
      steps:
      - setWeight: 5
      - pause: {duration: 10m}
      - setWeight: 20
      - pause: {duration: 10m}
      - setWeight: 50
      - pause: {duration: 10m}
      - setWeight: 80
      - pause: {duration: 10m}
      analysis:
        templates:
        - templateName: success-rate
        startingStep: 2
        args:
        - name: service-name
          value: app-canary
```

Define the analysis template:

```yaml
# analysis-template.yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: success-rate
  namespace: production
spec:
  metrics:
  - name: success-rate
    interval: 30s
    count: 10
    successCondition: result[0] >= 0.95
    failureLimit: 3
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          sum(rate(http_requests_total{status=~"2.*", service="{{args.service-name}}"}[2m])) 
          / 
          sum(rate(http_requests_total{service="{{args.service-name}}"}[2m]))
  - name: latency-p95
    interval: 30s
    count: 10
    successCondition: result[0] <= 500
    failureLimit: 3
    provider:
      prometheus:
        address: http://prometheus-server.monitoring:9090
        query: |
          histogram_quantile(0.95, sum(rate(http_request_duration_ms_bucket{service="{{args.service-name}}"}[2m])) by (le))
```

## 🔷 Advanced Security Controls

### 🔹 Zero Trust Implementation

Configure a comprehensive zero trust architecture:

```yaml
# authz-policy.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: app-authz-policy
  namespace: production
spec:
  selector:
    matchLabels:
      app: app-service
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/frontend/sa/frontend-service-account"]
        namespaces: ["frontend"]
    to:
    - operation:
        methods: ["GET"]
        paths: ["/api/public/*"]
  - from:
    - source:
        principals: ["cluster.local/ns/backend/sa/backend-service-account"]
    to:
    - operation:
        methods: ["GET", "POST", "PUT", "DELETE"]
        paths: ["/api/internal/*"]
    when:
    - key: request.auth.claims[groups]
      values: ["backend-admins", "system-operators"]
```

### 🔹 OPA Gatekeeper Policies

Implement policy-as-code with OPA Gatekeeper:

```yaml
# require-probes-constraint.yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredprobes
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredProbes
      validation:
        openAPIV3Schema:
          properties:
            probes:
              type: array
              items:
                type: string
            probeTypes:
              type: array
              items:
                type: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredprobes
        
        violation[{"msg": msg}] {
          container := input.review.object.spec.template.spec.containers[_]
          required_probes := {probe | probe := input.parameters.probes[_]}
          probe_types := {probe | probe := input.parameters.probeTypes[_]}
          
          # Check if probe exists
          missing_probes := required_probes - probe_types_defined(container, probe_types)
          count(missing_probes) > 0
          
          msg := sprintf("Container %v is missing required probes: %v", [container.name, missing_probes])
        }
        
        # Get set of probe types defined in container
        probe_types_defined(container, probe_types) = result {
          result := {probe_type | 
            probe_type := probe_types[_]
            probe_field := concat("", [probe_type, "Probe"])
            container[probe_field]
          }
        }
```

Create a constraint using this template:

```yaml
# pod-probes-constraint.yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredProbes
metadata:
  name: pods-must-have-probes
spec:
  match:
    kinds:
      - apiGroups: ["apps"]
        kinds: ["Deployment", "StatefulSet", "DaemonSet"]
    namespaces: ["production"]
  parameters:
    probes: ["liveness", "readiness"]
    probeTypes: ["liveness", "readiness", "startup"]
```

---

<div align="center">

**[⚔️ Continue to Ninja Level Part 2](./Chapter_09_Ninja_Part2.md)**

</div>

---

<div align="center">

**[⬅️ Previous Chapter](../Chapter_08_Advanced_Machine_Learning/Chapter_08_Main.md) | [📚 Table of Contents](../README.md) | [➡️ Next Chapter](../README.md)**

</div>

<div align="center">

**[🔰 Beginner](./Chapter_09_Beginner.md) | [⚙️ Advanced](./Chapter_09_Advanced.md) | [⚔️ Ninja Part 1](./Chapter_09_Ninja_Part1.md) | [⚔️ Ninja Part 2](./Chapter_09_Ninja_Part2.md) | [📝 Main](./Chapter_09_Main.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
