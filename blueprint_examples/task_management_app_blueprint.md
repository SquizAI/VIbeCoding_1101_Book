# Task Management Application: Full-Stack Blueprint

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_5-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 5" />
  <h1>Task Management Application Blueprint</h1>
  
  <p><i>"A comprehensive full-stack architecture for a modern task management system"</i></p>
</div>

<hr/>

## 1. System Overview

This blueprint outlines the architecture for a full-stack task management application that allows users to create, organize, and track tasks across projects and teams. The system follows a contract-first approach to ensure seamless integration between frontend and backend components.

### 1.1 Core Features

- User authentication and profile management
- Project creation and team collaboration
- Task creation, assignment, and tracking
- Task categorization and filtering
- Due date management and notifications
- Activity tracking and reporting
- Real-time updates for collaborative features

### 1.2 Technology Stack

**Frontend:**
- React with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Styled Components for styling
- React Query for data fetching
- Socket.io client for real-time features

**Backend:**
- Node.js with Express
- TypeScript for type safety
- MongoDB for data storage
- Mongoose for ODM
- JWT for authentication
- Socket.io for real-time communication

## 2. System Architecture

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT APPLICATION                          │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │             │   │             │   │                     │    │
│  │  React      │   │  Redux      │   │  React Query        │    │
│  │  Components │◄──►  Store      │◄──►  Data Fetching      │    │
│  │             │   │             │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│          ▲                                      ▲               │
│          │                                      │               │
│          │                                      │               │
│          ▼                                      ▼               │
│  ┌─────────────┐                      ┌─────────────────────┐   │
│  │             │                      │                     │   │
│  │  Router     │                      │  Socket.io Client   │   │
│  │             │                      │                     │   │
│  └─────────────┘                      └─────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │                 │
                           ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                            API LAYER                             │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │             │   │             │   │                     │    │
│  │  REST API   │   │  GraphQL    │   │  WebSocket Server   │    │
│  │  Endpoints  │   │  API        │   │                     │    │
│  │             │   │             │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                             │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │             │   │             │   │                     │    │
│  │  User       │   │  Project    │   │  Task               │    │
│  │  Service    │   │  Service    │   │  Service            │    │
│  │             │   │             │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │             │   │             │   │                     │    │
│  │  Team       │   │  Notification│  │  Activity           │    │
│  │  Service    │   │  Service    │   │  Service            │    │
│  │             │   │             │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐    │
│  │             │   │             │   │                     │    │
│  │  MongoDB    │   │  Redis      │   │  File Storage       │    │
│  │  Database   │   │  Cache      │   │                     │    │
│  │             │   │             │   │                     │    │
│  └─────────────┘   └─────────────┘   └─────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Interaction Flow

1. User interacts with React components in the frontend
2. Actions are dispatched to Redux store
3. API calls are made through React Query
4. Backend API processes requests and interacts with services
5. Services perform business logic and data operations
6. Database layer handles data persistence
7. Real-time updates are pushed through WebSockets
8. Frontend updates UI based on received data

## 3. Shared Data Models

### 3.1 Core TypeScript Interfaces

These interfaces are shared between frontend and backend to ensure type consistency:

```typescript
// Shared interfaces (frontend and backend)

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assigneeId?: string; // User ID
  creatorId: string; // User ID
  dueDate?: string;
  tags: string[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string; // User ID
  uploadedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  authorId: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  entityType: 'task' | 'project' | 'comment';
  entityId: string;
  action: 'created' | 'updated' | 'deleted' | 'assigned' | 'completed';
  userId: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId: string; // User ID
  title: string;
  message: string;
  type: 'task_assigned' | 'task_due' | 'comment_added' | 'project_invitation';
  read: boolean;
  entityType: 'task' | 'project' | 'comment';
  entityId: string;
  createdAt: string;
}
```

### 3.2 API Response Interfaces

Standardized response formats for API communication:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
```

## 4. API Contract

### 4.1 REST API Endpoints

#### Authentication

```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/refresh-token   - Refresh access token
POST   /api/auth/logout          - Logout user
GET    /api/auth/me              - Get current user profile
PUT    /api/auth/me              - Update user profile
```

#### Projects

```
GET    /api/projects             - List all projects for current user
POST   /api/projects             - Create new project
GET    /api/projects/:id         - Get project details
PUT    /api/projects/:id         - Update project
DELETE /api/projects/:id         - Delete project
GET    /api/projects/:id/members - Get project members
POST   /api/projects/:id/members - Add member to project
DELETE /api/projects/:id/members/:userId - Remove member from project
```

#### Tasks

```
GET    /api/projects/:id/tasks   - List all tasks in project
POST   /api/projects/:id/tasks   - Create new task in project
GET    /api/tasks/:id            - Get task details
PUT    /api/tasks/:id            - Update task
DELETE /api/tasks/:id            - Delete task
PUT    /api/tasks/:id/status     - Update task status
PUT    /api/tasks/:id/assignee   - Assign task to user
```

#### Comments

```
GET    /api/tasks/:id/comments   - Get comments for task
POST   /api/tasks/:id/comments   - Add comment to task
PUT    /api/comments/:id         - Update comment
DELETE /api/comments/:id         - Delete comment
```

#### Notifications

```
GET    /api/notifications        - Get user notifications
PUT    /api/notifications/:id    - Mark notification as read
PUT    /api/notifications/read-all - Mark all notifications as read
```

### 4.2 WebSocket Events

```
// Server -> Client events
'task:created'      - New task created
'task:updated'      - Task updated
'task:deleted'      - Task deleted
'comment:created'   - New comment added
'notification:new'  - New notification

// Client -> Server events
'join:project'      - Join project room for real-time updates
'leave:project'     - Leave project room
'typing:start'      - User started typing in comment
'typing:stop'       - User stopped typing in comment
```

## 5. Frontend Architecture

### 5.1 Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── PasswordReset.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── projects/
│   │   ├── ProjectList.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ProjectDetails.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskDetails.tsx
│   │   └── TaskStatusSelect.tsx
│   ├── comments/
│   │   ├── CommentList.tsx
│   │   └── CommentForm.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Dropdown.tsx
│       ├── Avatar.tsx
│       └── Loader.tsx
├── pages/
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── TaskDetailPage.tsx
│   └── ProfilePage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useTasks.ts
│   └── useNotifications.ts
├── store/
│   ├── index.ts
│   ├── auth/authSlice.ts
│   ├── projects/projectsSlice.ts
│   ├── tasks/tasksSlice.ts
│   └── notifications/notificationsSlice.ts
├── api/
│   ├── client.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── comments.ts
├── utils/
│   ├── date.ts
│   ├── validation.ts
│   └── storage.ts
└── App.tsx
```

### 5.2 State Management

Redux store structure:

```typescript
interface RootState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };
  projects: {
    items: Project[];
    currentProject: Project | null;
    loading: boolean;
    error: string | null;
  };
  tasks: {
    items: Task[];
    currentTask: Task | null;
    loading: boolean;
    error: string | null;
    filters: {
      status: string | null;
      assignee: string | null;
      priority: string | null;
    };
  };
  notifications: {
    items: Notification[];
    unreadCount: number;
    loading: boolean;
  };
}
```

### 5.3 API Integration

Example React Query hook for tasks:

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';

export const useTasks = (projectId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch tasks for a project
  const tasksQuery = useQuery(
    ['tasks', projectId],
    () => getTasks(projectId),
    {
      enabled: !!projectId,
    }
  );
  
  // Create task mutation
  const createTaskMutation = useMutation(
    (newTask) => createTask(projectId, newTask),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', projectId]);
      },
    }
  );
  
  // Update task mutation
  const updateTaskMutation = useMutation(
    ({ taskId, data }) => updateTask(taskId, data),
    {
      onSuccess: (updatedTask) => {
        queryClient.invalidateQueries(['tasks', projectId]);
        queryClient.invalidateQueries(['task', updatedTask.id]);
      },
    }
  );
  
  // Delete task mutation
  const deleteTaskMutation = useMutation(
    (taskId) => deleteTask(taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', projectId]);
      },
    }
  );
  
  return {
    tasks: tasksQuery.data?.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
  };
};
```

## 6. Backend Architecture

### 6.1 Server Structure

```
src/
├── config/
│   ├── database.ts
│   ├── jwt.ts
│   └── socket.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── project.controller.ts
│   ├── task.controller.ts
│   ├── comment.controller.ts
│   └── notification.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── models/
│   ├── user.model.ts
│   ├── project.model.ts
│   ├── task.model.ts
│   ├── comment.model.ts
│   ├── activity.model.ts
│   └── notification.model.ts
├── routes/
│   ├── auth.routes.ts
│   ├── project.routes.ts
│   ├── task.routes.ts
│   ├── comment.routes.ts
│   └── notification.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── project.service.ts
│   ├── task.service.ts
│   ├── comment.service.ts
│   ├── activity.service.ts
│   └── notification.service.ts
├── utils/
│   ├── jwt.utils.ts
│   ├── password.utils.ts
│   └── validation.utils.ts
├── websocket/
│   ├── socket.ts
│   ├── handlers/
│   │   ├── project.handler.ts
│   │   ├── task.handler.ts
│   │   └── notification.handler.ts
│   └── events.ts
└── app.ts
```

### 6.2 Database Schema

Example Mongoose schema for Task:

```typescript
// models/task.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Task } from '../shared/types';

export interface TaskDocument extends Task, Document {}

const AttachmentSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const TaskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['todo', 'in_progress', 'review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  projectId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assigneeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  creatorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  dueDate: { type: Date },
  tags: [{ type: String, trim: true }],
  attachments: [AttachmentSchema]
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ assigneeId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ dueDate: 1 });

export default mongoose.model<TaskDocument>('Task', TaskSchema);
```

### 6.3 Service Layer

Example Task Service:

```typescript
// services/task.service.ts
import Task, { TaskDocument } from '../models/task.model';
import ActivityService from './activity.service';
import NotificationService from './notification.service';
import { ApiError } from '../utils/errors';

class TaskService {
  private activityService: ActivityService;
  private notificationService: NotificationService;
  
  constructor() {
    this.activityService = new ActivityService();
    this.notificationService = new NotificationService();
  }
  
  async getTasks(projectId: string, filters = {}) {
    const query = { projectId, ...filters };
    return Task.find(query)
      .populate('assigneeId', 'id name email avatar')
      .populate('creatorId', 'id name email avatar')
      .sort({ createdAt: -1 });
  }
  
  async getTaskById(taskId: string) {
    const task = await Task.findById(taskId)
      .populate('assigneeId', 'id name email avatar')
      .populate('creatorId', 'id name email avatar');
      
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    return task;
  }
  
  async createTask(taskData, userId: string) {
    const task = new Task({
      ...taskData,
      creatorId: userId
    });
    
    const savedTask = await task.save();
    
    // Record activity
    await this.activityService.createActivity({
      entityType: 'task',
      entityId: savedTask.id,
      action: 'created',
      userId,
      metadata: { taskTitle: savedTask.title }
    });
    
    // Send notification if task is assigned
    if (savedTask.assigneeId && savedTask.assigneeId.toString() !== userId) {
      await this.notificationService.createNotification({
        recipientId: savedTask.assigneeId,
        title: 'New Task Assigned',
        message: `You have been assigned to task: ${savedTask.title}`,
        type: 'task_assigned',
        entityType: 'task',
        entityId: savedTask.id
      });
    }
    
    return savedTask;
  }
  
  async updateTask(taskId: string, updateData, userId: string) {
    const task = await this.getTaskById(taskId);
    
    // Check if assignee is being changed
    const assigneeChanged = 
      updateData.assigneeId && 
      task.assigneeId?.toString() !== updateData.assigneeId.toString();
    
    // Update task
    Object.assign(task, updateData);
    const updatedTask = await task.save();
    
    // Record activity
    await this.activityService.createActivity({
      entityType: 'task',
      entityId: updatedTask.id,
      action: 'updated',
      userId,
      metadata: { 
        taskTitle: updatedTask.title,
        changes: Object.keys(updateData)
      }
    });
    
    // Send notification if assignee changed
    if (assigneeChanged && updatedTask.assigneeId) {
      await this.notificationService.createNotification({
        recipientId: updatedTask.assigneeId,
        title: 'Task Assigned',
        message: `You have been assigned to task: ${updatedTask.title}`,
        type: 'task_assigned',
        entityType: 'task',
        entityId: updatedTask.id
      });
    }
    
    return updatedTask;
  }
  
  async deleteTask(taskId: string, userId: string) {
    const task = await this.getTaskById(taskId);
    await task.remove();
    
    // Record activity
    await this.activityService.createActivity({
      entityType: 'task',
      entityId: taskId,
      action: 'deleted',
      userId,
      metadata: { taskTitle: task.title }
    });
    
    return { success: true };
  }
}

export default new TaskService();
```

### 6.4 WebSocket Integration

```typescript
// websocket/socket.ts
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import projectHandler from './handlers/project.handler';
import taskHandler from './handlers/task.handler';

export default (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.id}`);
    
    // Join user's own room for personal notifications
    socket.join(`user:${socket.data.user.id}`);
    
    // Set up event handlers
    projectHandler(io, socket);
    taskHandler(io, socket);
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.id}`);
    });
  });
  
  return io;
};
```

## 7. Integration Points

### 7.1 Authentication Flow

1. User submits login credentials from frontend form
2. Frontend sends credentials to `/api/auth/login` endpoint
3. Backend validates credentials and generates JWT tokens
4. Frontend stores tokens and updates authentication state
5. Frontend includes token in subsequent API requests
6. Backend validates token in auth middleware for protected routes
7. Token refresh happens automatically when access token expires

### 7.2 Task Creation Flow

1. User fills task creation form in frontend
2. Frontend dispatches action to create task
3. API request is sent to backend
4. Backend validates request and creates task in database
5. Backend creates activity record and notifications
6. Backend emits WebSocket event for real-time updates
7. Frontend receives WebSocket event and updates UI
8. Frontend invalidates task queries to refresh data

### 7.3 Real-time Collaboration Flow

1. User joins a project page in frontend
2. Frontend emits 'join:project' event with project ID
3. Backend adds user to project room
4. When task status changes, backend emits 'task:updated' event
5. All users in project room receive the update
6. Frontend updates UI with new task status
7. Activity feed is updated in real-time

## 8. Deployment Strategy

### 8.1 Development Environment

- Local development with Docker Compose
- Separate containers for frontend, backend, and MongoDB
- Hot reloading for both frontend and backend
- Shared volume for code changes

### 8.2 Production Environment

- Frontend deployed to CDN (Netlify/Vercel)
- Backend deployed to containerized environment (Kubernetes)
- MongoDB Atlas for database
- Redis Cloud for caching and WebSocket scaling
- CI/CD pipeline with GitHub Actions

## 9. Security Considerations

- JWT tokens with proper expiration
- HTTPS for all communications
- Input validation on both frontend and backend
- CORS configuration to restrict origins
- Rate limiting for authentication endpoints
- Password hashing with bcrypt
- XSS protection with proper content sanitization
- CSRF protection for authenticated requests

## 10. Testing Strategy

### 10.1 Frontend Testing

- Unit tests for components with Jest and React Testing Library
- Integration tests for complex component interactions
- E2E tests with Cypress for critical user flows
- Mock service worker for API testing

### 10.2 Backend Testing

- Unit tests for services and utilities
- Integration tests for API endpoints
- Database tests with in-memory MongoDB
- WebSocket testing with Socket.IO client

## 11. Monitoring and Analytics

- Error tracking with Sentry
- Performance monitoring with New Relic
- User analytics with Google Analytics
- Custom event tracking for feature usage
- API usage metrics and rate limiting

---

<div align="center">
  <h3>📚 Explore Related Resources</h3>
</div>

<div align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/📋_Chapter_Overview-teal?style=for-the-badge" alt="Chapter Overview" /></a>
  <a href="../blueprint_examples"><img src="https://img.shields.io/badge/🗺️_More_Blueprints-yellow?style=for-the-badge" alt="More Blueprints" /></a>
</div>

<div align="center">
  <a href="../../README.md"><img src="https://img.shields.io/badge/🏠_Course_Home-pink?style=flat-square" alt="Course Home" /></a>
</div>

<div align="center">
  <p><em>© 2025 Vibe Coding. Transform the way you build software with AI-human collaboration!</em></p>
</div>
