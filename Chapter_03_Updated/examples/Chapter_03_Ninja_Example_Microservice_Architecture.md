# Chapter 03: Ninja Example - Microservice Architecture

## Microservice Architecture for Task Management System

This document outlines the architectural design of a sophisticated microservice-based task management system. This represents a ninja-level approach to implementing the task management functionality shown in the beginner and advanced examples.

### System Overview

The system is composed of several independently deployable services that communicate via asynchronous messaging and RESTful APIs:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  API Gateway    │────▶│  User Service   │     │  Notification   │
│                 │     │                 │     │  Service        │
└────────┬────────┘     └────────┬────────┘     └────────▲────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       │
┌─────────────────┐     ┌─────────────────┐             │
│                 │     │                 │             │
│  Task Service   │────▶│  Event Bus      │─────────────┘
│                 │     │                 │
└────────┬────────┘     └─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│                 │
│  Analytics      │
│  Service        │
│                 │
└─────────────────┘
```

### Service Descriptions

#### 1. API Gateway
- **Responsibility**: Entry point for all client requests, handles authentication, request routing, and rate limiting
- **Technologies**: Envoy, JWT authentication, Redis for rate limiting
- **Deployment**: Kubernetes with autoscaling based on request volume

```yaml
# Excerpt from API Gateway configuration
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: task-management-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "tasks.example.com"
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - "tasks.example.com"
    tls:
      mode: SIMPLE
      serverCertificate: /etc/certs/server.pem
      privateKey: /etc/certs/privatekey.pem
```

#### 2. User Service
- **Responsibility**: User management, authentication, authorization, profile management
- **Technologies**: Node.js, MongoDB, Redis for session cache
- **Domain Models**: User, Role, Permission
- **Event Publications**: UserCreated, UserUpdated, UserDeleted, UserLoginAttempt

```typescript
// User Service - User Entity (TypeScript)
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  preferences: {
    theme: 'light' | 'dark';
    taskSortOrder: 'priority' | 'dueDate' | 'createdAt';
    notificationPreferences: NotificationPreference[];
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// User service publishes events on user changes
class UserEventPublisher {
  async publishUserCreated(user: User): Promise<void> {
    await this.eventBus.publish('user.created', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });
  }
  
  // Other methods omitted for brevity
}
```

#### 3. Task Service
- **Responsibility**: Core task management functionality - CRUD operations, task assignment, status management
- **Technologies**: Go, PostgreSQL with JSONB for flexible task attributes
- **Domain Models**: Task, TaskList, Label, Comment, Attachment
- **Event Publications**: TaskCreated, TaskUpdated, TaskAssigned, TaskCompleted, TaskDeleted
- **Event Subscriptions**: UserCreated (to initialize task lists for new users)

```go
// Task Service - Task Entity (Go)
type Task struct {
    ID            uuid.UUID      `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
    Title         string         `json:"title" gorm:"not null"`
    Description   string         `json:"description"`
    Status        TaskStatus     `json:"status" gorm:"not null;default:'TODO'"`
    Priority      int            `json:"priority" gorm:"not null;default:1"`
    DueDate       *time.Time     `json:"due_date"`
    AssigneeID    *uuid.UUID     `json:"assignee_id" gorm:"type:uuid"`
    CreatorID     uuid.UUID      `json:"creator_id" gorm:"type:uuid;not null"`
    ListID        uuid.UUID      `json:"list_id" gorm:"type:uuid;not null"`
    Labels        []Label        `json:"labels" gorm:"many2many:task_labels;"`
    Attributes    postgres.JSONB `json:"attributes" gorm:"type:jsonb;default:'{}'::jsonb"`
    Comments      []Comment      `json:"comments,omitempty" gorm:"foreignKey:TaskID"`
    Attachments   []Attachment   `json:"attachments,omitempty" gorm:"foreignKey:TaskID"`
    CreatedAt     time.Time      `json:"created_at" gorm:"not null;default:now()"`
    UpdatedAt     time.Time      `json:"updated_at" gorm:"not null;default:now()"`
    CompletedAt   *time.Time     `json:"completed_at"`
}

// Task service handles events from EventBus
func (s *TaskService) HandleUserCreatedEvent(event UserCreatedEvent) error {
    // Create default task lists for new user
    return s.taskListRepo.CreateDefaultTaskListsForUser(event.UserID)
}
```

#### 4. Notification Service
- **Responsibility**: Manages all user notifications across multiple channels (email, push, in-app)
- **Technologies**: Python, RabbitMQ, Redis, SendGrid, Firebase Cloud Messaging
- **Domain Models**: Notification, NotificationChannel, DeliveryAttempt
- **Event Subscriptions**: TaskAssigned, TaskDueSoon, CommentAdded, MentionedInComment

```python
# Notification Service - Event Handler (Python)
class TaskEventHandler:
    def __init__(self, notification_service, template_engine):
        self.notification_service = notification_service
        self.template_engine = template_engine
    
    async def handle_task_assigned(self, event):
        # Get user notification preferences
        user = await self.user_repository.get_user(event['assignee_id'])
        if not user:
            return
            
        # Check if user wants notifications for task assignments
        if not user.notification_preferences.get('task_assigned', True):
            return
            
        # Get task details
        task = await self.task_repository.get_task(event['task_id'])
        
        # Create notification content using template
        content = self.template_engine.render('task_assigned', {
            'user': user,
            'task': task,
            'assigner': await self.user_repository.get_user(event['assigner_id'])
        })
        
        # Create notification
        notification = Notification(
            user_id=user.id,
            type='task_assigned',
            content=content,
            reference_id=task.id,
            reference_type='task'
        )
        
        # Send through appropriate channels
        await self.notification_service.send(notification, user.channels)
```

#### 5. Analytics Service
- **Responsibility**: Collects and processes events for reporting, dashboards, and insights
- **Technologies**: Python, Apache Kafka, Elasticsearch, Kibana
- **Features**: Real-time metrics, productivity analytics, usage patterns, trend detection
- **Event Subscriptions**: All system events for comprehensive analytics

```python
# Analytics Service - Task Completion Analyzer
class TaskCompletionAnalyzer:
    def analyze_user_performance(self, user_id, time_range='last_30_days'):
        # Query completed tasks
        completed_tasks = self.task_repository.get_completed_tasks(
            user_id=user_id,
            time_range=time_range
        )
        
        # Calculate completion metrics
        completion_rate = len(completed_tasks) / self.task_repository.count_assigned_tasks(
            user_id=user_id,
            time_range=time_range
        )
        
        avg_completion_time = sum(
            (task.completed_at - task.created_at).total_seconds()
            for task in completed_tasks
        ) / len(completed_tasks) if completed_tasks else 0
        
        # Calculate productivity trends
        daily_completions = self._group_by_day(completed_tasks)
        trend = self._calculate_trend(daily_completions)
        
        return {
            'completion_rate': completion_rate,
            'avg_completion_time_seconds': avg_completion_time,
            'daily_completions': daily_completions,
            'trend': trend
        }
```

#### 6. Event Bus
- **Responsibility**: Central message broker for inter-service communication
- **Technologies**: Apache Kafka or RabbitMQ with dead-letter queues
- **Features**: Event persistence, replay capability, exactly-once delivery semantics

### Architecture Patterns

#### Domain-Driven Design
Each service encapsulates a specific bounded context with its own domain model and business logic.

#### CQRS (Command Query Responsibility Segregation)
Tasks service uses separate models for commands (write operations) and queries (read operations) to optimize for different access patterns.

#### Event Sourcing
Task state changes are captured as a sequence of events, allowing for:
- Complete audit history
- Temporal querying (state at any point in time)
- Event replay for recovery or reprocessing

#### Circuit Breaker
All service-to-service communication implements circuit breakers to prevent cascading failures:

```java
// Circuit breaker implementation example
@CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
public User getUser(String userId) {
    return userServiceClient.getUser(userId);
}

public User getUserFallback(String userId, Exception e) {
    log.warn("Falling back for user: {} due to: {}", userId, e.getMessage());
    return User.builder()
               .id(userId)
               .name("Unknown User")
               .build();
}
```

### Deployment Architecture

The system is deployed on Kubernetes with the following components:

- Namespace isolation for each environment (dev, staging, production)
- Helm charts for consistent deployments
- Horizontal Pod Autoscaler for each service
- Istio service mesh for advanced networking features
- Prometheus and Grafana for monitoring
- EFK (Elasticsearch, Fluentd, Kibana) stack for logging

```yaml
# Example Kubernetes deployment for Task Service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: task-service
  namespace: task-management
spec:
  replicas: 3
  selector:
    matchLabels:
      app: task-service
  template:
    metadata:
      labels:
        app: task-service
    spec:
      containers:
      - name: task-service
        image: task-management/task-service:v1.2.3
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "500m"
            memory: "512Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: task-service-config
              key: db_host
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: task-service-secrets
              key: db_password
```

### Security Considerations

- **Zero Trust Architecture**: All service-to-service communication requires authentication
- **Secrets Management**: Using Kubernetes secrets or HashiCorp Vault
- **Network Policies**: Restricting inter-service communication to only necessary pathways
- **RBAC**: Fine-grained role-based access control
- **Data Encryption**: Both at rest and in transit

### Testing Strategies

- **Unit Tests**: For domain logic within each service
- **Integration Tests**: For service boundaries
- **Contract Tests**: Using consumer-driven contract testing (Pact)
- **End-to-End Tests**: For critical user journeys
- **Chaos Engineering**: Using Chaos Monkey to test system resilience

---

## Implementation Approach

This architecture would be implemented incrementally:

1. Start with a monolithic implementation to validate domain model
2. Extract User Service first for authentication/authorization 
3. Implement Task Service with initial event publishing
4. Add Notification Service to subscribe to task events
5. Implement Analytics as a read-only projection
6. Refine and enhance based on usage patterns

---

*Navigation:*  
*[⬅️ Return to Chapter](../README.md) | [📚 Main Content](../Chapter_03_Main.md) | [⚔️ Ninja Level](../Chapter_03_Ninja.md)*
