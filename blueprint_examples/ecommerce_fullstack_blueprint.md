# Full-Stack Blueprint: E-Commerce Platform

## 1. System Overview

A modern e-commerce platform that integrates a responsive frontend shopping experience with a robust backend API. The system allows users to browse products, manage their shopping cart, complete purchases, and track order status.

## 2. Core Objectives

- Create a seamless shopping experience across devices
- Implement secure user authentication and account management
- Develop a product catalog with search and filtering capabilities
- Build a shopping cart with checkout process
- Provide order management and tracking
- Establish secure payment processing
- Enable basic admin functionality for product and order management

## 3. System Architecture

```mermaid
graph TD
    A[Client Application] --> B[Client-Side State Management]
    B --> C[API Client/Service Layer]
    C --> D[API Gateway]
    D --> E[Authentication Service]
    D --> F[Product Service]
    D --> G[Cart Service]
    D --> H[Order Service]
    D --> I[Payment Service]
    D --> J[User Service]
    E --> K[(User Database)]
    F --> L[(Product Database)]
    G --> M[(Cart Database)]
    H --> N[(Order Database)]
    H --> I
    I --> O[Payment Processor]
    J --> K
    
    subgraph "Frontend"
    A
    B
    C
    end
    
    subgraph "Backend"
    D
    E
    F
    G
    H
    I
    J
    end
    
    subgraph "Data Storage"
    K
    L
    M
    N
    end
    
    subgraph "External Services"
    O
    end
```

## 4. Data Models

### Shared Type Definitions

```typescript
// shared/types.ts - Used by both frontend and backend

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categories: string[];
  images: string[];
  inventory: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product; // Expanded in responses
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentDetails: {
    method: 'credit_card' | 'paypal';
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
  };
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  inventory INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  PRIMARY KEY (product_id, category)
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0
);
```

#### Carts and Orders Tables
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_snapshot JSONB NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);
```

## 5. API Contract

### OpenAPI Specification (Excerpt)

```yaml
openapi: 3.0.0
info:
  title: E-Commerce API
  version: 1.0.0
paths:
  /auth/register:
    post:
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
                firstName:
                  type: string
                lastName:
                  type: string
      responses:
        '201':
          description: User registered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
                  token:
                    type: string
  
  /products:
    get:
      summary: Get product list
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: search
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  total:
                    type: integer
                  page:
                    type: integer
                  pages:
                    type: integer
  
  /cart:
    get:
      summary: Get user's cart
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User's cart
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'
    
    post:
      summary: Add item to cart
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                productId:
                  type: string
                quantity:
                  type: integer
                  minimum: 1
      responses:
        '200':
          description: Updated cart
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Cart'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        role:
          type: string
          enum: [customer, admin]
        createdAt:
          type: string
          format: date-time
    
    Product:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        description:
          type: string
        price:
          type: number
        discountPrice:
          type: number
        categories:
          type: array
          items:
            type: string
        images:
          type: array
          items:
            type: string
        inventory:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

## 6. Frontend Architecture

### Component Structure

```
E-CommerceApp
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── NavigationMenu
│   │   ├── CartIcon
│   │   └── UserMenu
│   └── Footer
├── Pages
│   ├── HomePage
│   │   ├── HeroBanner
│   │   ├── FeaturedProducts
│   │   └── CategoryHighlights
│   ├── ProductListPage
│   │   ├── FilterSidebar
│   │   ├── ProductGrid
│   │   └── Pagination
│   ├── ProductDetailPage
│   │   ├── ProductGallery
│   │   ├── ProductInfo
│   │   ├── AddToCartForm
│   │   └── RelatedProducts
│   ├── CartPage
│   │   ├── CartItemList
│   │   └── CartSummary
│   ├── CheckoutPage
│   │   ├── AddressForm
│   │   ├── PaymentForm
│   │   └── OrderSummary
│   ├── OrderConfirmationPage
│   ├── UserAccountPage
│   │   ├── ProfileSettings
│   │   ├── AddressBook
│   │   └── OrderHistory
│   └── AuthPages
│       ├── LoginPage
│       └── RegistrationPage
└── Shared
    ├── ProductCard
    ├── Button
    ├── FormElements
    ├── Modal
    ├── Notification
    └── LoadingSpinner
```

### State Management

```typescript
// Redux Store Structure
interface RootState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };
  products: {
    items: Product[];
    featuredProducts: Product[];
    currentProduct: Product | null;
    loading: boolean;
    error: string | null;
    filters: {
      category: string | null;
      searchQuery: string | null;
      priceRange: [number, number] | null;
    };
    pagination: {
      page: number;
      totalPages: number;
      totalItems: number;
    };
  };
  cart: {
    items: CartItem[];
    loading: boolean;
    error: string | null;
  };
  orders: {
    items: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
  };
  ui: {
    notifications: Notification[];
    modals: {
      [key: string]: boolean;
    };
    theme: 'light' | 'dark';
  };
}
```

### Frontend Routes

```typescript
const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    path: '/products',
    component: ProductListPage
  },
  {
    path: '/products/:id',
    component: ProductDetailPage
  },
  {
    path: '/cart',
    component: CartPage
  },
  {
    path: '/checkout',
    component: CheckoutPage,
    protected: true
  },
  {
    path: '/order-confirmation/:id',
    component: OrderConfirmationPage,
    protected: true
  },
  {
    path: '/account',
    component: UserAccountPage,
    protected: true,
    routes: [
      {
        path: '/account/profile',
        component: ProfileSettings
      },
      {
        path: '/account/addresses',
        component: AddressBook
      },
      {
        path: '/account/orders',
        component: OrderHistory
      }
    ]
  },
  {
    path: '/login',
    component: LoginPage,
    guestOnly: true
  },
  {
    path: '/register',
    component: RegistrationPage,
    guestOnly: true
  }
];
```

## 7. Backend Architecture

### Service Structure

```
backend/
├── config/
│   ├── database.js
│   ├── auth.js
│   └── app.js
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   └── user.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── validation.middleware.js
│   └── logging.middleware.js
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   └── order.model.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   └── user.routes.js
├── services/
│   ├── auth.service.js
│   ├── product.service.js
│   ├── cart.service.js
│   ├── order.service.js
│   ├── payment.service.js
│   └── user.service.js
├── utils/
│   ├── validation.js
│   ├── jwt.js
│   ├── password.js
│   └── errorHandler.js
└── server.js
```

### Authentication Flows

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth Service
    participant DB
    
    %% Registration Flow
    Client->>API: POST /auth/register (email, password)
    API->>Auth Service: registerUser(data)
    Auth Service->>DB: Check if user exists
    DB-->>Auth Service: User not found
    Auth Service->>Auth Service: Hash password
    Auth Service->>DB: Save new user
    DB-->>Auth Service: User created
    Auth Service->>Auth Service: Generate JWT
    Auth Service-->>API: Return token and user
    API-->>Client: 201 Created (token, user)
    
    %% Login Flow
    Client->>API: POST /auth/login (email, password)
    API->>Auth Service: loginUser(data)
    Auth Service->>DB: Find user by email
    DB-->>Auth Service: User found
    Auth Service->>Auth Service: Verify password
    Auth Service->>Auth Service: Generate JWT
    Auth Service-->>API: Return token and user
    API-->>Client: 200 OK (token, user)
    
    %% Protected Route Access
    Client->>API: GET /cart (with Authorization header)
    API->>Auth Service: verifyToken(token)
    Auth Service-->>API: User authenticated
    API->>DB: Get user's cart
    DB-->>API: Cart data
    API-->>Client: 200 OK (cart)
```

## 8. Integration Points

### Key Frontend-Backend Interactions

#### Product Browsing
- Frontend sends filtering/pagination parameters to backend
- Backend returns formatted product data with pagination metadata
- Frontend renders products and provides navigation UI

#### Cart Management
- Frontend maintains cart in local state and synchronizes with backend
- Add/update/remove operations trigger API calls for persistence
- Backend validates product availability before cart updates

#### Checkout Process
- Frontend collects shipping/payment information
- Backend validates order before processing payment
- Success/failure flows coordinate between systems

#### Authentication
- Frontend securely stores tokens in localStorage/cookies
- Frontend includes tokens in Authorization headers
- Backend validates tokens and enforces authorization rules

### API Client Implementation

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Example service using the API client
export const productService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  // More product-related API calls
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },
  
  // More cart-related API calls
};
```

## 9. Authentication & Security

### JWT Implementation

- Access tokens with 15-minute expiration
- HTTP-only cookies for refresh tokens
- Secure password hashing with bcrypt
- Role-based access control for admin features
- CSRF protection with tokens

### Security Considerations

- Input validation on both client and server
- HTTPS for all communications
- Protection against common vulnerabilities (XSS, CSRF, injection)
- Rate limiting for authentication endpoints
- Proper error handling to avoid information leakage

## 10. Testing Strategy

### Frontend Testing

- **Unit Tests**: Component rendering, utility functions
- **Integration Tests**: Form submissions, state updates
- **E2E Tests**: Complete user flows (registration, checkout)
- **Visual Testing**: UI appearance and responsiveness

### Backend Testing

- **Unit Tests**: Service functions, validation logic
- **Integration Tests**: API endpoints, database operations
- **Contract Tests**: API specification compliance
- **Performance Tests**: Load testing critical endpoints

### Cross-Stack Testing

- **End-to-end Tests**: Complete user journeys across stack
- **Contract Testing**: Verify frontend/backend compatibility
- **Authentication Flow Tests**: Security validation

## 11. Development Workflow

### Local Development

- Frontend: React development server (port 3000)
- Backend: Node.js API server (port 3001)
- Database: PostgreSQL container
- Shared type definitions for frontend/backend consistency

### Environment Configuration

```
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...

# Backend (.env)
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
```

## 12. Deployment Strategy

### Infrastructure

- Frontend: Static hosting (Netlify/Vercel)
- Backend: Container-based deployment (Docker/Kubernetes)
- Database: Managed PostgreSQL service
- CI/CD: GitHub Actions

### Deployment Pipeline

```mermaid
graph LR
    A[Code Push] --> B[CI Builds]
    B --> C[Run Tests]
    C --> D[Build Assets]
    D --> E[Deploy to Staging]
    E --> F[Integration Tests]
    F --> G[Deploy to Production]
    G --> H[Post-deploy Monitoring]
```

## 13. Implementation Phases

1. **Foundation**
   - Set up project structure
   - Create database schema
   - Implement authentication

2. **Core Functionality**
   - Product catalog and search
   - Shopping cart functionality
   - Basic checkout process

3. **Enhanced Features**
   - User account management
   - Order tracking
   - Payment processing
   - Admin capabilities

4. **Optimization**
   - Performance improvements
   - Enhanced security
   - Analytics integration
   - SEO optimization

## 14. MVP Definition

### MVP Features

- User registration and login
- Product browsing and search
- Shopping cart functionality
- Basic checkout process
- Order confirmation

### Post-MVP Features

- User reviews and ratings
- Recommended products
- Advanced filtering
- Social login options
- Wish lists
- Discount codes

---

This blueprint provides a comprehensive plan for implementing an e-commerce platform with a clear separation of frontend and backend concerns while establishing effective integration points. By starting with this detailed blueprint, development teams can ensure alignment across the stack and leverage AI assistance effectively throughout the implementation process.
