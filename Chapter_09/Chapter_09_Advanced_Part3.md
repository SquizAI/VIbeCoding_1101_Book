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


## 🔷 Advanced Security Implementation

Securing production applications requires a comprehensive approach across infrastructure, application, and operational levels.


### 🔹 Implementing Network Security Policies

Kubernetes Network Policies restrict communication between pods for improved security:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: taskmanager
      component: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: taskmanager
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: taskmanager
          component: database
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector:
        matchLabels:
          name: production
      podSelector:
        matchLabels:
          app: taskmanager
          component: redis
    ports:
    - protocol: TCP
      port: 6379
```


### 🔹 Implementing Security Context Constraints

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-secure
  namespace: production
spec:
  # ... other deployment specs
  template:
    spec:
      securityContext:
        runAsUser: 1000
        runAsGroup: 3000
        fsGroup: 2000
      containers:
      - name: backend
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        # ... other container specs
        volumeMounts:
        - name: tmp-volume
          mountPath: /tmp
      volumes:
      - name: tmp-volume
        emptyDir: {}
```


### 🔹 Implementing Pod Security Policies

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: 'docker/default,runtime/default'
    apparmor.security.beta.kubernetes.io/allowedProfileNames: 'runtime/default'
    seccomp.security.alpha.kubernetes.io/defaultProfileName:  'runtime/default'
    apparmor.security.beta.kubernetes.io/defaultProfileName:  'runtime/default'
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: true
```


### 🔹 Secret Management with AWS Secrets Manager

```javascript
// config/secrets.js
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'us-west-2'
});

async function getSecrets() {
  try {
    const secretName = process.env.SECRET_NAME || 'taskmanager/production';
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    let secretString;
    
    if ('SecretString' in data) {
      secretString = data.SecretString;
    } else {
      const buff = Buffer.from(data.SecretBinary, 'base64');
      secretString = buff.toString('ascii');
    }
    
    return JSON.parse(secretString);
  } catch (err) {
    console.error('Error retrieving secrets:', err);
    throw err;
  }
}

module.exports = { getSecrets };
```


### 🔹 Implementing AWS WAF for API Protection

```yaml
Resources:
  TaskManagerWAF:
    Type: AWS::WAFv2::WebACL
    Properties:
      Name: TaskManagerWebACL
      Scope: REGIONAL
      DefaultAction:
        Allow: {}
      VisibilityConfig:
        SampledRequestsEnabled: true
        CloudWatchMetricsEnabled: true
        MetricName: TaskManagerWebACL
      Rules:
        - Name: AWSManagedRulesCommonRuleSet
          Priority: 0
          OverrideAction:
            None: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWSManagedRulesCommonRuleSet
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesCommonRuleSet
        
        - Name: AWSManagedRulesKnownBadInputsRuleSet
          Priority: 1
          OverrideAction:
            None: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWSManagedRulesKnownBadInputsRuleSet
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesKnownBadInputsRuleSet
        
        - Name: AWSManagedRulesSQLiRuleSet
          Priority: 2
          OverrideAction:
            None: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWSManagedRulesSQLiRuleSet
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesSQLiRuleSet
              
        - Name: RateBasedRule
          Priority: 3
          Action:
            Block: {}
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: RateBasedRule
          Statement:
            RateBasedStatement:
              Limit: 1000
              AggregateKeyType: IP
```


## 🔷 Performance Optimization


### 🔹 Database Performance Tuning

Setting up connection pooling and optimizing PostgreSQL:

```javascript
// db/connection.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '10000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000', 10),
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Add instrumentation for monitoring
pool.on('connect', () => {
  console.debug('New database connection established');
});

pool.on('acquire', () => {
  console.debug('Database connection acquired from pool');
});

pool.on('remove', () => {
  console.debug('Database connection removed from pool');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Override release method to track release time
    client.release = () => {
      client.lastReleaseTime = Date.now();
      return release.apply(client);
    };
    
    // Override query method to track query time
    client.query = (...args) => {
      client.lastQueryTime = Date.now();
      return query.apply(client, args);
    };
    
    return client;
  },
  end: () => pool.end(),
};
```


### 🔹 PostgreSQL Configuration for Production

```ini
max_connections = 200
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
work_mem = 5MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_parallel_maintenance_workers = 4
synchronous_commit = off
autovacuum = on
log_min_duration_statement = 100ms
```


### 🔹 Setting up Redis Caching

```javascript
// cache/redis.js
const Redis = require('ioredis');

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: 3,
  connectTimeout: 5000,
  enableReadyCheck: true,
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined
};

// Create Redis client
const redisClient = new Redis(redisOptions);

redisClient.on('connect', () => {
  console.info('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

// Cache wrapper with TTL in seconds
async function cacheSet(key, value, ttl = 3600) {
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    return true;
  } catch (error) {
    console.error('Redis cache set error:', error);
    return false;
  }
}

// Get value from cache
async function cacheGet(key) {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
}

// Delete value from cache
async function cacheDelete(key) {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis cache delete error:', error);
    return false;
  }
}

// Clear cache by pattern
async function cacheClear(pattern = '*') {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis cache clear error:', error);
    return false;
  }
}

module.exports = {
  redisClient,
  cacheSet,
  cacheGet,
  cacheDelete,
  cacheClear
};
```


### 🔹 API Response Caching Middleware

```javascript
// middleware/cache.js
const { cacheGet, cacheSet } = require('../cache/redis');

// Cache middleware
function cacheMiddleware(ttl = 3600) {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Skip caching for authenticated requests with specific user data
    if (req.user && !req.query.allowCache) {
      return next();
    }
    
    // Create a cache key based on the URL and query params
    const cacheKey = `api:${req.originalUrl}`;
    
    try {
      // Try to get from cache
      const cachedResponse = await cacheGet(cacheKey);
      
      if (cachedResponse) {
        // Return cached response
        return res.status(200).json({
          ...cachedResponse,
          _cached: true
        });
      }
      
      // Store the original res.json method
      const originalJson = res.json;
      
      // Override res.json method to cache the response
      res.json = function(data) {
        // Cache the response
        cacheSet(cacheKey, data, ttl).catch(err => {
          console.error('Cache middleware error:', err);
        });
        
        // Call the original method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
}

module.exports = cacheMiddleware;
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
