<div align="center">

# Exercise 2: Kubernetes Configuration

</div>

<div align="center">

**[⬅️ Back to Exercises](./README.md) | [📚 Back to Chapter](../README.md)**

</div>

<div align="center">

## Vibe Coding: Where Human Creativity Meets AI Capabilities

</div>

## Overview

In this exercise, you'll set up a local Kubernetes environment and deploy a microservices application with proper configuration for production readiness. You'll implement security contexts, resource limits, network policies, and other Kubernetes best practices covered in Chapter 9.

## Learning Objectives

By the end of this exercise, you will be able to:

1. Configure and deploy applications to Kubernetes
2. Implement security best practices for Kubernetes workloads
3. Set up proper resource management and limits
4. Configure network policies for secure service communication
5. Implement health checks and readiness probes

## Prerequisites

- Docker Desktop, Minikube, or kind installed on your local machine
- kubectl CLI tool installed
- Basic understanding of Kubernetes concepts
- Completion of Exercise 1 (recommended)

## Exercise Steps

### Step 1: Set Up a Local Kubernetes Cluster

1. Start your local Kubernetes cluster:

   **For Docker Desktop:**
   - Enable Kubernetes in Docker Desktop settings

   **For Minikube:**
   ```bash
   minikube start --driver=docker --cpus=2 --memory=4g
   ```

   **For kind:**
   ```bash
   kind create cluster --name exercise-cluster
   ```

2. Verify your cluster is running:
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

### Step 2: Create a Namespace

1. Create a namespace for this exercise:
   ```bash
   kubectl create namespace exercise-app
   ```

2. Set this namespace as your default context:
   ```bash
   kubectl config set-context --current --namespace=exercise-app
   ```

### Step 3: Deploy a Simple Application

1. Create a file named `deployment.yaml` with the following content:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: exercise-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
```

2. Create a file named `service.yaml` with the following content:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app
  namespace: exercise-app
spec:
  selector:
    app: web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

3. Apply these configurations:
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```

4. Verify the deployment:
   ```bash
   kubectl get pods
   kubectl get svc
   ```

### Step 4: Enhance Security with Pod Security Context

1. Update your `deployment.yaml` to include security context:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: exercise-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      # Pod security context
      securityContext:
        runAsNonRoot: true
        fsGroup: 1000
      containers:
      - name: web-app
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        # Container security context
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL
          readOnlyRootFilesystem: true
          runAsUser: 101  # nginx user
          runAsGroup: 101
        volumeMounts:
        - name: nginx-cache
          mountPath: /var/cache/nginx
        - name: nginx-run
          mountPath: /var/run
      volumes:
      - name: nginx-cache
        emptyDir: {}
      - name: nginx-run
        emptyDir: {}
```

2. Apply the updated configuration:
   ```bash
   kubectl apply -f deployment.yaml
   ```

3. Verify the changes:
   ```bash
   kubectl describe pod -l app=web-app
   ```

### Step 5: Implement Resource Limits

1. Update your `deployment.yaml` to include resource requests and limits:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: exercise-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      securityContext:
        runAsNonRoot: true
        fsGroup: 1000
      containers:
      - name: web-app
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL
          readOnlyRootFilesystem: true
          runAsUser: 101
          runAsGroup: 101
        # Resource requests and limits
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        volumeMounts:
        - name: nginx-cache
          mountPath: /var/cache/nginx
        - name: nginx-run
          mountPath: /var/run
      volumes:
      - name: nginx-cache
        emptyDir: {}
      - name: nginx-run
        emptyDir: {}
```

2. Apply the updated configuration:
   ```bash
   kubectl apply -f deployment.yaml
   ```

3. Check the resource settings:
   ```bash
   kubectl describe pod -l app=web-app
   ```

### Step 6: Add Health Checks and Probes

1. Update your `deployment.yaml` to include liveness and readiness probes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: exercise-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      securityContext:
        runAsNonRoot: true
        fsGroup: 1000
      containers:
      - name: web-app
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL
          readOnlyRootFilesystem: true
          runAsUser: 101
          runAsGroup: 101
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        # Liveness probe
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 2
          failureThreshold: 3
        # Readiness probe
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 2
          successThreshold: 1
          failureThreshold: 2
        # Startup probe
        startupProbe:
          httpGet:
            path: /
            port: 80
          failureThreshold: 30
          periodSeconds: 2
        volumeMounts:
        - name: nginx-cache
          mountPath: /var/cache/nginx
        - name: nginx-run
          mountPath: /var/run
      volumes:
      - name: nginx-cache
        emptyDir: {}
      - name: nginx-run
        emptyDir: {}
```

2. Apply the updated configuration:
   ```bash
   kubectl apply -f deployment.yaml
   ```

3. Verify the probes are configured:
   ```bash
   kubectl describe pod -l app=web-app
   ```

### Step 7: Implement Network Policies

1. Create a file named `network-policy.yaml` with the following content:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: exercise-app
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web-app
  namespace: exercise-app
spec:
  podSelector:
    matchLabels:
      app: web-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 0.0.0.0/0
    ports:
    - protocol: TCP
      port: 80
  egress:
  - to:
    - ipBlock:
        cidr: 0.0.0.0/0
    ports:
    - protocol: TCP
      port: 53  # DNS
    - protocol: UDP
      port: 53  # DNS
```

2. Apply the network policies:
   ```bash
   kubectl apply -f network-policy.yaml
   ```

3. Verify the network policies:
   ```bash
   kubectl get networkpolicies
   ```

### Step 8: Create a ConfigMap and Secret

1. Create a file named `config.yaml` with the following content:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-app-config
  namespace: exercise-app
data:
  nginx.conf: |
    server {
      listen 80;
      server_name localhost;
      
      location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
      }
      
      location /health {
        access_log off;
        return 200 "healthy\n";
      }
    }

---
apiVersion: v1
kind: Secret
metadata:
  name: web-app-secret
  namespace: exercise-app
type: Opaque
data:
  api-key: U3VwZXJTZWNyZXRBUElLZXkxMjM0NTY=  # Base64 encoded value
```

2. Apply the configurations:
   ```bash
   kubectl apply -f config.yaml
   ```

3. Verify they were created:
   ```bash
   kubectl get configmaps
   kubectl get secrets
   ```

4. Update your `deployment.yaml` to use these configurations:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  namespace: exercise-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      securityContext:
        runAsNonRoot: true
        fsGroup: 1000
      containers:
      - name: web-app
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        securityContext:
          allowPrivilegeEscalation: false
          capabilities:
            drop:
              - ALL
          readOnlyRootFilesystem: true
          runAsUser: 101
          runAsGroup: 101
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 2
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 2
        # Environment variables from ConfigMap and Secret
        env:
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: web-app-secret
              key: api-key
        volumeMounts:
        - name: nginx-cache
          mountPath: /var/cache/nginx
        - name: nginx-run
          mountPath: /var/run
        - name: nginx-config
          mountPath: /etc/nginx/conf.d/default.conf
          subPath: nginx.conf
      volumes:
      - name: nginx-cache
        emptyDir: {}
      - name: nginx-run
        emptyDir: {}
      - name: nginx-config
        configMap:
          name: web-app-config
```

5. Apply the updated deployment:
   ```bash
   kubectl apply -f deployment.yaml
   ```

### Step 9: Test Your Application

1. Create a port-forward to access your service:
   ```bash
   kubectl port-forward svc/web-app 8080:80
   ```

2. In a web browser or using curl, visit `http://localhost:8080` to see your application
3. Test the health endpoint at `http://localhost:8080/health`

## Expected Outcomes

- A properly configured Kubernetes deployment with:
  - Security contexts for both pod and container
  - Resource requests and limits
  - Health checks (liveness, readiness, and startup probes)
  - Network policies controlling traffic flow
  - ConfigMaps and Secrets for configuration

## Extra Challenges

1. Implement pod disruption budgets to ensure high availability
2. Set up horizontal pod autoscaling based on CPU utilization
3. Create an Ingress resource to expose your application
4. Implement a service mesh (like Linkerd or Istio) for advanced networking
5. Configure a PodSecurityPolicy (or equivalent in newer K8s versions)

## Conclusion

In this exercise, you've learned how to properly configure Kubernetes resources for a production environment. You've implemented security contexts, resource management, network policies, and health checks – all essential components of a production-ready Kubernetes deployment.

These configurations follow the best practices discussed in Chapter 9 and will provide a solid foundation for deploying real-world applications to Kubernetes.

---

<div align="center">

**[⬅️ Back to Exercises](./README.md) | [📚 Back to Chapter](../README.md)**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>
