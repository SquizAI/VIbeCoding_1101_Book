#!/usr/bin/env python3
"""
Title: Chapter 03 - Advanced Example: RESTful API Service
Description: A FastAPI-based RESTful API service with database integration
Chapter: 03 - Building Real Projects with AI Assistance
Skill Level: Advanced
"""

# This file demonstrates a modern API architecture using FastAPI and SQLAlchemy
# Below are diagrams and explanations of the system instead of actual code

## API Architecture Overview

```mermaid
flowchart TB
    Client([Client Application])
    Gateway[API Gateway/CORS]
    API[FastAPI Application]
    Validation[Pydantic Validation]
    DB[(SQLite Database)]
    ORM[SQLAlchemy ORM]
    
    Client <--> Gateway
    Gateway <--> API
    API <--> Validation
    API <--> ORM
    ORM <--> DB
    
    classDef client fill:#f9f,stroke:#333,stroke-width:2px
    classDef api fill:#bbf,stroke:#33f,stroke-width:2px
    classDef data fill:#bfb,stroke:#393,stroke-width:2px
    
    class Client client
    class Gateway,API,Validation api
    class DB,ORM data
```

## Database Configuration Approach

The application uses SQLAlchemy as an ORM (Object-Relational Mapper) with the following configuration approach:

1. **Connection Management**:
   - Environment variable-based database URL configuration
   - Fallback to SQLite for local development
   - Connection pooling with session management

## Data Models Visualization

```mermaid
classDiagram
    class TaskModel {
        +Integer id
        +String title
        +String description
        +Boolean completed
        +Integer priority
        +DateTime created_at
        +DateTime updated_at
    }
    
    class TaskBase {
        +str title
        +Optional[str] description
        +int priority
    }
    
    class TaskCreate {
        // Inherits all fields from TaskBase
    }
    
    class TaskUpdate {
        +Optional[str] title
        +Optional[str] description
        +Optional[bool] completed
        +Optional[int] priority
    }
    
    class Task {
        +int id
        +bool completed
        +datetime created_at
        +datetime updated_at
    }
    
    TaskBase <|-- TaskCreate
    TaskBase <|-- Task
```

## Data Modeling Strategy

1. **SQLAlchemy Models** - Database schema representation:
   - `TaskModel`: Database table definition with columns and constraints
   - Primary keys, indexes, and default values defined at the database level
   - Automatic timestamp management for created/updated times

2. **Pydantic Models** - API schema representation:
   - `TaskBase`: Common shared fields for tasks
   - `TaskCreate`: Input validation for creating tasks
   - `TaskUpdate`: Partial update support with optional fields
   - `Task`: Response model with all fields including database-generated ones
   - ORM mode enabled for automatic conversion between SQLAlchemy and Pydantic

## Dependency Injection Pattern

```mermaid
flowchart LR
    Route[API Route]-->Dependency[Database Dependency]
    Dependency-->Session[DB Session]
    Session-->Cleanup{Auto Cleanup}
    Cleanup-->Close[Close Session]
    
    classDef highlight fill:#f96,stroke:#333,stroke-width:2px
    class Dependency highlight
```

## FastAPI Application Configuration

1. **Dependency Injection**:
   - Automatic database session management
   - Context-managed session with guaranteed cleanup
   - Yielding pattern for dependency lifecycle control

2. **API Documentation**:
   - Auto-generated OpenAPI specifications
   - Interactive Swagger UI for testing
   - Clear metadata for API discovery

3. **Security Configuration**:
   - CORS middleware configuration
   - Cross-Origin Resource Sharing controls
   - Production-ready settings with configurable origins

## API Routing Strategy

```mermaid
flowchart TD
    subgraph Endpoints
        Root[GET /]-->Info[API Information]
        GetAll[GET /tasks]-->|Query parameters|FilteredList[Filtered Task List]
        GetOne[GET /tasks/{id}]-->SingleTask[Single Task Details]
        Create[POST /tasks]-->NewTask[Create Task]
        Update[PUT /tasks/{id}]-->UpdatedTask[Update Task]
        Delete[DELETE /tasks/{id}]-->RemoveTask[Remove Task]
        Metrics[GET /metrics]-->Stats[Task Statistics]
    end
    
    classDef root fill:#f9f,stroke:#333,stroke-width:2px
    class Root root
```

1. **Root Endpoint**:
   - Provides API information and metadata
   - Self-documenting with links to documentation
   - Entry point for API exploration

## Task Listing with Filtering

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant DB as Database
    
    Client->>API: GET /tasks?completed=true&limit=10
    API->>API: Validate query parameters
    API->>DB: Query tasks with filters
    DB->>API: Return filtered tasks
    API->>API: Transform to Pydantic models
    API->>Client: Return JSON response
```

1. **Query Parameter Processing**:
   - Pagination support (skip/limit parameters)
   - Optional filtering by completion status
   - Sensible defaults for parameters
   - Type conversion and validation

2. **Database Query Building**:
   - Dynamic filter construction
   - Efficient query optimization
   - Pagination implementation

## Single Task Retrieval

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant DB as Database
    
    Client->>API: GET /tasks/42
    API->>API: Validate task_id parameter
    API->>DB: Query task by ID
    alt Task Found
        DB->>API: Return task
        API->>Client: Return JSON response
    else Task Not Found
        DB->>API: Return null
        API->>Client: Return 404 Not Found error
    end
```

1. **Path Parameter Handling**:
   - Type validation for task_id (integer)
   - Proper URL structure for resource access
   - RESTful interface design

2. **Error Handling**:
   - HTTP status codes for different scenarios
   - Descriptive error messages
   - Consistent error response format

## Task Creation Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant Validator as Pydantic Validator
    participant DB as Database
    
    Client->>API: POST /tasks {JSON data}
    API->>Validator: Validate request body
    Validator->>API: Return validated data
    API->>DB: Create task record
    DB->>API: Return created task
    API->>Client: Return 201 Created with task data
```

1. **Request Body Validation**:
   - Schema-based validation with Pydantic
   - Automatic type conversion
   - Field constraints enforcement

2. **Database Transaction**:
   - Model instance creation
   - Transaction management (commit/rollback)
   - Database-generated fields retrieval

## Task Update Pattern

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant DB as Database
    
    Client->>API: PUT /tasks/42 {partial data}
    API->>API: Validate update data
    API->>DB: Query task by ID
    alt Task Found
        DB->>API: Return task
        API->>API: Apply partial updates
        API->>DB: Save updated task
        DB->>API: Confirm update
        API->>Client: Return updated task
    else Task Not Found
        DB->>API: Return null
        API->>Client: Return 404 Not Found error
    end
```

1. **Partial Update Support**:
   - Only update fields provided in request
   - Maintain existing values for omitted fields
   - Exclude unset values through Pydantic's exclude_unset

2. **Attribute Update Pattern**:
   - Dynamic attribute setting using setattr
   - Single-pass update of multiple fields
   - Transaction management for atomicity

## Task Deletion Pattern

```mermaid
sequenceDiagram
    participant Client
    participant API as FastAPI
    participant DB as Database
    
    Client->>API: DELETE /tasks/42
    API->>DB: Query task by ID
    alt Task Found
        DB->>API: Return task
        API->>DB: Delete task
        DB->>API: Confirm deletion
        API->>Client: Return 204 No Content
    else Task Not Found
        DB->>API: Return null
        API->>Client: Return 404 Not Found error
    end
```

1. **Resource Deletion**:
   - Proper HTTP status code (204 No Content)
   - Empty response body convention
   - Database record removal

2. **Validation Before Deletion**:
   - Existence check before attempting deletion
   - Appropriate error handling
   - Transaction completion assurance

## Task Metrics Aggregation

```mermaid
flowchart TD
    Metrics[GET /metrics]-->Total[Count All Tasks]
    Metrics-->Completed[Count Completed Tasks]
    Metrics-->Active[Calculate Active Tasks]
    Metrics-->Priority[Count High Priority Tasks]
    Metrics-->Recent[Count Recent Tasks]
    
    Total & Completed --> Active
    
    subgraph Response
        Stats[Task Statistics JSON]
    end
    
    Total --> Stats
    Completed --> Stats
    Active --> Stats
    Priority --> Stats
    Recent --> Stats
```

1. **Aggregation Queries**:
   - Efficient count operations
   - Filter-based aggregations
   - Derived calculations

2. **Time-Based Filtering**:
   - Date/time calculations
   - Recent activity tracking
   - Temporal database queries

3. **Reporting Structure**:
   - Structured response format
   - Multiple metrics in single request
   - Dashboard-ready data

## Server Configuration

```mermaid
flowchart LR
    Launch([Launch Script])-->Config[Configure Server]
    Config-->Reload[Enable Hot Reload]
    Config-->Host[Set Host IP]
    Config-->Port[Set Port]
    Reload & Host & Port-->Start[Start Uvicorn Server]
    Start-->API[FastAPI Application]
```

1. **Development Mode**:
   - Hot reload for development efficiency
   - Environment-based configuration
   - Command-line entry point

2. **Production Considerations**:
   - Configurable host and port settings
   - ASGI server integration (Uvicorn)
   - Script vs. module execution patterns

## Benefits of This Architecture

1. **Maintainability**:
   - Clear separation of concerns
   - Modular components with specific responsibilities
   - Consistent patterns across endpoints

2. **Extensibility**:
   - Easy to add new endpoints
   - Structured approach to feature expansion
   - Reusable components and patterns

3. **Performance**:
   - Async-ready framework (FastAPI)
   - Efficient database access patterns
   - Optimized response processing

"""
Navigation:
[⬅️ Return to Chapter](../README.md) | [📚 Main Content](../Chapter_03_Main.md) | [⚙️ Advanced Level](../Chapter_03_Advanced.md)
"""
