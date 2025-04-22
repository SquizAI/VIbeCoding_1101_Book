# Database API Blueprint: E-commerce Product Catalog

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-2ecc71?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_4-2ecc71?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 4" />
  <h1>Database API Blueprint: E-commerce Product Catalog</h1>
  
  <p><i>"A comprehensive data layer blueprint for scalable product management"</i></p>
</div>

<hr/>

## 1. System Overview

This blueprint outlines the architecture for a product catalog database API service for an e-commerce platform. The system will manage product data, categories, inventory, and pricing information through a RESTful API interface.

### 1.1 Purpose and Scope

The Product Catalog API will:
- Serve as the single source of truth for product information
- Provide standardized interfaces for product data access and manipulation
- Support complex queries for product discovery and filtering
- Maintain inventory and pricing data with transaction integrity
- Enable both internal service-to-service communication and external client access

### 1.2 Key Stakeholders

- **Product Management Team**: Primary consumers for product information management
- **Inventory Management Team**: Requires accurate inventory data
- **Pricing Team**: Manages product pricing and promotions
- **Frontend Applications**: Consumer-facing web and mobile clients
- **Partner Systems**: External B2B integrations requiring product data

## 2. Architecture Overview

### 2.1 System Context Diagram

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │
│  Admin Portal    │◄────►│                  │      │  Mobile App      │
│                  │      │                  │      │                  │
└──────────────────┘      │                  │      └──────────────────┘
                          │                  │
┌──────────────────┐      │  Product         │      ┌──────────────────┐
│                  │      │  Catalog         │      │                  │
│  Web Store       │◄────►│  API             │◄────►│  Inventory       │
│                  │      │                  │      │  Service         │
└──────────────────┘      │                  │      │                  │
                          │                  │      └──────────────────┘
┌──────────────────┐      │                  │
│                  │      │                  │      ┌──────────────────┐
│  Partner         │◄────►│                  │      │                  │
│  Systems         │      └──────────────────┘      │  Pricing         │
│                  │              ▲                 │  Service         │
└──────────────────┘              │                 │                  │
                                  │                 └──────────────────┘
                                  ▼
                          ┌──────────────────┐
                          │                  │
                          │  Product         │
                          │  Database        │
                          │                  │
                          └──────────────────┘
```

### 2.2 Technology Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL (primary) with Redis for caching
- **ORM**: Prisma for type-safe database access
- **API Documentation**: OpenAPI/Swagger
- **Authentication**: JWT with OAuth 2.0
- **Logging & Monitoring**: Datadog with custom instrumentation
- **Containerization**: Docker with Kubernetes orchestration

### 2.3 Key Design Patterns

- **Repository Pattern**: Abstract database operations from business logic
- **Service Layer**: Encapsulate business rules and transaction management
- **API Gateway**: Single entry point with request validation and routing
- **CQRS (lightweight)**: Separate read and write operation paths for optimized performance
- **Event Sourcing**: For critical inventory and pricing updates

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ Category    │       │ Product     │       │ Inventory   │
│             │       │             │       │             │
│ id          │       │ id          │       │ id          │
│ name        │◄──┐   │ name        │   ┌──►│ productId   │
│ description │   │   │ description │   │   │ quantity    │
│ imageUrl    │   │   │ basePrice   │   │   │ reserved    │
│ parentId    │   └───│ categoryId  │   │   │ warehouseId │
└─────────────┘       │ createdAt   │   │   └─────────────┘
                      │ updatedAt   │   │
┌─────────────┐       └─────────────┘   │   ┌─────────────┐
│ Attribute   │             ▲           │   │ Price       │
│             │             │           │   │             │
│ id          │             │           │   │ id          │
│ name        │       ┌─────────────┐   │   │ productId   │
│ description │       │ ProductAttr │   └──►│ amount      │
└─────────────┘       │             │       │ currency    │
      ▲               │ productId   │       │ regionId    │
      │               │ attributeId │       │ startDate   │
      └───────────────│ value       │       │ endDate     │
                      └─────────────┘       └─────────────┘
```

### 3.2 Database Schema (TypeScript with Prisma)

```typescript
// Prisma schema definition
model Category {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(100)
  description String?   @db.Text
  imageUrl    String?   @db.VarChar(255)
  parentId    Int?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([parentId])
}

model Product {
  id          String    @id @default(uuid())
  name        String    @db.VarChar(200)
  description String    @db.Text
  basePrice   Decimal   @db.Decimal(10, 2)
  isActive    Boolean   @default(true)
  categoryId  Int
  category    Category  @relation(fields: [categoryId], references: [id])
  attributes  ProductAttribute[]
  inventory   Inventory[]
  prices      Price[]
  images      ProductImage[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([categoryId])
  @@index([name])
  @@index([isActive])
}

model Attribute {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(100)
  description String?   @db.Text
  products    ProductAttribute[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([name])
}

model ProductAttribute {
  id          String    @id @default(uuid())
  productId   String
  attributeId Int
  value       String
  product     Product   @relation(fields: [productId], references: [id])
  attribute   Attribute @relation(fields: [attributeId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([productId, attributeId])
  @@index([attributeId])
}

model Inventory {
  id          String    @id @default(uuid())
  productId   String
  quantity    Int       @default(0)
  reserved    Int       @default(0)
  warehouseId String
  product     Product   @relation(fields: [productId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([productId, warehouseId])
  @@index([warehouseId])
}

model Price {
  id          String    @id @default(uuid())
  productId   String
  amount      Decimal   @db.Decimal(10, 2)
  currency    String    @db.Char(3)
  regionId    String
  startDate   DateTime  @default(now())
  endDate     DateTime?
  product     Product   @relation(fields: [productId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([productId])
  @@index([regionId])
  @@index([startDate, endDate])
}

model ProductImage {
  id          String    @id @default(uuid())
  productId   String
  url         String
  altText     String?
  isPrimary   Boolean   @default(false)
  sortOrder   Int       @default(0)
  product     Product   @relation(fields: [productId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([productId])
}
```

### 3.3 Database Indexes and Optimizations

- **Primary Indexes**: All primary keys are indexed by default
- **Foreign Key Indexes**: All foreign keys have indexes for join operations
- **Search Indexes**: Product name and category indexes for search operations
- **Filtering Indexes**: Common filter parameters (isActive, price ranges)
- **Composite Indexes**: For unique constraints and common query patterns

### 3.4 Database Migration Strategy

- **Schema Versioning**: Semantic versioning for database schema
- **Migration Scripts**: Automated, versioned migration scripts using Prisma Migrate
- **Rollback Strategy**: All migrations include rollback procedures
- **Data Migration**: Separate scripts for schema changes vs. data transformations
- **Testing**: Automated testing of migrations in staging environment

## 4. API Contract

### 4.1 REST API Endpoints

#### Products

```
GET    /api/v1/products          - List products (with filtering, pagination)
GET    /api/v1/products/:id      - Get product by ID
POST   /api/v1/products          - Create new product
PUT    /api/v1/products/:id      - Update product
DELETE /api/v1/products/:id      - Delete product (soft delete)
GET    /api/v1/products/search   - Search products by query params
```

#### Categories

```
GET    /api/v1/categories            - List all categories
GET    /api/v1/categories/:id        - Get category by ID
POST   /api/v1/categories            - Create new category
PUT    /api/v1/categories/:id        - Update category
DELETE /api/v1/categories/:id        - Delete category
GET    /api/v1/categories/:id/products - List products in category
```

#### Inventory

```
GET    /api/v1/inventory/:productId  - Get inventory for product
PUT    /api/v1/inventory/:productId  - Update inventory
POST   /api/v1/inventory/batch       - Batch update inventory
```

#### Pricing

```
GET    /api/v1/prices/:productId     - Get all prices for product
POST   /api/v1/prices                - Create new price
PUT    /api/v1/prices/:id            - Update price
DELETE /api/v1/prices/:id            - Delete price
```

### 4.2 Request/Response Formats

#### Product Response Example

```json
{
  "id": "prod_12345abcde",
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "basePrice": 129.99,
  "category": {
    "id": 42,
    "name": "Audio Accessories"
  },
  "attributes": [
    {
      "name": "Color",
      "value": "Black"
    },
    {
      "name": "Connectivity",
      "value": "Bluetooth 5.0"
    }
  ],
  "inventory": {
    "available": 157,
    "warehouses": [
      {
        "id": "wh_east",
        "quantity": 89
      },
      {
        "id": "wh_west",
        "quantity": 68
      }
    ]
  },
  "pricing": {
    "current": {
      "amount": 129.99,
      "currency": "USD",
      "region": "US"
    },
    "promotional": [
      {
        "amount": 99.99,
        "currency": "USD",
        "region": "US",
        "startDate": "2025-05-15T00:00:00Z",
        "endDate": "2025-05-30T23:59:59Z"
      }
    ]
  },
  "images": [
    {
      "url": "https://example.com/images/headphones-1.jpg",
      "altText": "Front view of headphones",
      "isPrimary": true
    }
  ],
  "isActive": true,
  "createdAt": "2025-01-15T08:30:00Z",
  "updatedAt": "2025-04-10T14:22:36Z"
}
```

#### Product Request Example (Creation)

```json
{
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "basePrice": 129.99,
  "categoryId": 42,
  "attributes": [
    {
      "attributeId": 12,
      "value": "Black"
    },
    {
      "attributeId": 15,
      "value": "Bluetooth 5.0"
    }
  ],
  "inventory": [
    {
      "warehouseId": "wh_east",
      "quantity": 89
    },
    {
      "warehouseId": "wh_west",
      "quantity": 68
    }
  ],
  "prices": [
    {
      "amount": 129.99,
      "currency": "USD",
      "regionId": "US"
    }
  ],
  "images": [
    {
      "url": "https://example.com/images/headphones-1.jpg",
      "altText": "Front view of headphones",
      "isPrimary": true
    }
  ]
}
```

### 4.3 Query Parameters

Products endpoint supports the following query parameters:

```
?category=42           - Filter by category ID
?minPrice=50&maxPrice=150 - Filter by price range
?attributes.Color=Black    - Filter by attribute
?search=wireless       - Text search on name/description
?isActive=true         - Filter by active status
?sort=price:asc        - Sort by field (asc or desc)
?page=1&limit=20       - Pagination
?include=prices,inventory - Include related data
```

### 4.4 Authentication and Authorization

- **Authentication**: JWT tokens obtained through OAuth 2.0 flow
- **Rate Limiting**: API rate limits based on client ID
- **Permissions**:
  - `products:read` - Read product data
  - `products:write` - Create/update products
  - `products:delete` - Delete products
  - `inventory:read` - Read inventory data
  - `inventory:write` - Update inventory
  - `prices:read` - Read pricing data
  - `prices:write` - Create/update pricing

## 5. Implementation Plan

### 5.1 Service Layer Structure

```
/src
  /api
    /controllers       # API endpoint handlers
    /middlewares       # Auth, validation, error handling
    /routes            # Route definitions
    /validators        # Request validation schemas
  /services            # Business logic
    /product
    /category
    /inventory
    /pricing
  /repositories        # Data access layer
    /product
    /category
    /inventory
    /pricing
  /models              # Domain models (extends Prisma types)
  /utils               # Utility functions
  /config              # Configuration
  /types               # TypeScript type definitions
  /tests               # Test files
```

### 5.2 Key Components

#### Repository Layer Example (ProductRepository.ts)

```typescript
// Example repository implementation
export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string, include: ProductInclude = {}): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: include.category,
        attributes: include.attributes ? {
          include: {
            attribute: true
          }
        } : false,
        inventory: include.inventory,
        prices: include.prices ? {
          where: {
            OR: [
              { endDate: null },
              { endDate: { gt: new Date() } }
            ]
          }
        } : false,
        images: include.images
      }
    });
  }

  async findAll(params: ProductQueryParams): Promise<PaginatedResult<Product>> {
    // Implementation of complex querying with filters, sorting, pagination
    // ...
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.$transaction(async (tx) => {
      // Create product with related entities in transaction
      // ...
    });
  }

  // Other repository methods...
}
```

#### Service Layer Example (ProductService.ts)

```typescript
// Example service implementation
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private eventBus: EventBus
  ) {}

  async getProductById(id: string, include: ProductInclude = {}): Promise<Product | null> {
    return this.productRepository.findById(id, include);
  }

  async createProduct(data: CreateProductDto, userId: string): Promise<Product> {
    // Validate business rules
    this.validateProductData(data);
    
    // Create product through repository
    const product = await this.productRepository.create(data);
    
    // Publish event for other services
    this.eventBus.publish('product.created', {
      productId: product.id,
      userId,
      timestamp: new Date()
    });
    
    return product;
  }

  async updateProductPrice(
    productId: string, 
    priceData: UpdatePriceDto,
    userId: string
  ): Promise<Product> {
    // Implementation with transaction and event publishing
    // ...
  }

  // Other service methods...
}
```

### 5.3 Caching Strategy

- **Cache Layers**:
  - In-memory cache (Node.js)
  - Distributed cache (Redis)
  - CDN for product images
- **Cache Invalidation**:
  - TTL (Time-to-Live) for cached products
  - Event-based invalidation on updates
  - Selective invalidation based on entity relationships
- **Cache Keys**: 
  - Pattern: `product:{id}:[fields]`
  - Example: `product:123:base` (base data)
  - Example: `product:123:full` (with all relations)

### 5.4 Error Handling

Standard error response format:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "The requested product could not be found",
    "details": {
      "productId": "prod_invalid123"
    },
    "requestId": "req_abc123"
  }
}
```

Error handling middleware to standardize errors:

```typescript
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  // Log error with context
  logger.error({
    message: 'Request error',
    error: err.message,
    stack: err.stack,
    requestId,
    path: req.path,
    method: req.method
  });
  
  // Map known errors to appropriate responses
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId
      }
    });
  }
  
  // Handle other error types...
  
  // Default to 500 for unhandled errors
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      requestId
    }
  });
};
```

## 6. Testing Strategy

### 6.1 Testing Levels

- **Unit Tests**: Each component tested in isolation
- **Integration Tests**: Testing interactions between components
- **API Tests**: End-to-end testing of API endpoints
- **Performance Tests**: Load and stress testing with realistic data volumes

### 6.2 Test Data Management

- **Test Fixtures**: Predefined datasets for consistent test scenarios
- **Factories**: Dynamic test data generation using Faker.js
- **Database Seeding**: Automated seeding for test environments
- **Test Isolation**: Each test runs in isolated transaction

### 6.3 Sample Test Case (Jest + Supertest)

```typescript
describe('Product API', () => {
  describe('GET /api/v1/products/:id', () => {
    it('should return 200 and product data when product exists', async () => {
      // Arrange
      const product = await createTestProduct(prisma);
      
      // Act
      const response = await request(app)
        .get(`/api/v1/products/${product.id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe(product.name);
    });
    
    it('should return 404 when product does not exist', async () => {
      // Act
      const response = await request(app)
        .get('/api/v1/products/nonexistent')
        .set('Authorization', `Bearer ${testToken}`);
      
      // Assert
      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('PRODUCT_NOT_FOUND');
    });
  });
  
  // More test cases...
});
```

## 7. Deployment and Operations

### 7.1 Deployment Pipeline

- **CI/CD**: GitHub Actions pipeline with automated testing
- **Environments**: Development, Staging, Production
- **Containerization**: Docker images with multi-stage builds
- **Deployment**: Kubernetes with Helm charts
- **Database Migrations**: Automated with manual approval for production

### 7.2 Monitoring and Observability

- **Logging**: Structured JSON logs with correlation IDs
- **Metrics**: Prometheus for system and business metrics
- **Tracing**: OpenTelemetry for distributed tracing
- **Alerts**: Defined alert thresholds for critical paths
- **Dashboards**: Grafana dashboards for service health and business KPIs

### 7.3 Performance and Scaling

- **Horizontal Scaling**: Stateless API design for horizontal scaling
- **Database Scaling**: Read replicas for query performance
- **Caching Tiers**: Multi-level caching strategy
- **Connection Pooling**: Optimized database connection management
- **Query Optimization**: Regular query analysis and optimization

## 8. Security Considerations

### 8.1 Data Protection

- **Encryption**: Data encryption at rest and in transit
- **PII Handling**: Proper handling of personally identifiable information
- **Data Retention**: Policies for data retention and deletion
- **Access Controls**: Least privilege access to product data

### 8.2 API Security

- **Input Validation**: Strict validation of all inputs
- **Rate Limiting**: Protection against abuse
- **CORS Policies**: Restrictive cross-origin policies
- **Security Headers**: Implementation of security headers
- **Audit Logging**: Logging of all sensitive operations

## 9. Future Enhancements

- **GraphQL API**: Add GraphQL support for more flexible queries
- **Real-time Updates**: WebSocket support for inventory changes
- **Advanced Search**: Integration with Elasticsearch for full-text search
- **A/B Testing**: Support for product variant testing
- **Analytics Integration**: Enhanced data collection for product analytics

## 10. Appendix

### 10.1 Database Migration Scripts

Initial schema migration script:

```typescript
// Prisma migration example
-- CreateTable
CREATE TABLE "Category" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "imageUrl" VARCHAR(255),
  "parentId" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Additional table creation SQL...

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

### 10.2 API Documentation

OpenAPI specification excerpt:

```yaml
paths:
  /api/v1/products:
    get:
      summary: List products
      description: Returns a paginated list of products with optional filters
      parameters:
        - in: query
          name: category
          schema:
            type: integer
          description: Filter by category ID
        # Other parameters...
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductListResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
    post:
      summary: Create a new product
      description: Creates a new product with related data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateProductRequest'
      responses:
        '201':
          description: Product created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
```

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
