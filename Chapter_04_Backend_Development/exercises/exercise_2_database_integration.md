# Exercise 2: Database Integration

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-2ecc71?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_4-2ecc71?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 4" />
  <h1>Database Integration Exercise</h1>
  
  <p><i>"Building a robust data layer for your backend application"</i></p>
</div>

<hr/>

## Overview

In this exercise, you will integrate a database into a backend application following a blueprint-first approach. You'll design the database schema, implement database models, and create a robust data access layer to handle CRUD operations.

## Learning Objectives

- Design a database schema with appropriate relationships and constraints
- Implement data models with an ORM (Object-Relational Mapper)
- Create a data access layer that abstracts database operations
- Implement proper error handling and transaction management
- Write database migration scripts for version control

## Prerequisites

- Understanding of database concepts (tables, relationships, indexes)
- Familiarity with SQL basics
- Basic knowledge of a backend framework (Express.js, Django, etc.)
- Completed Exercise 1: REST API Design

## Exercise Steps

### 1. Database Schema Design

**Task:** Design a database schema for a book management system with the following entities:

- Authors (with details like name, bio, birth date)
- Books (with details like title, publication date, ISBN)
- Categories (such as fiction, non-fiction, science, history)
- Reviews (ratings and comments from users)

**Requirements:**
- Create an entity relationship diagram (ERD)
- Define primary and foreign keys
- Specify data types for each field
- Include constraints (NOT NULL, UNIQUE, etc.)
- Design appropriate indexes for performance

**Deliverable:** A complete database schema diagram and SQL schema definition script.

### 2. ORM Model Implementation

**Task:** Implement the database models using an ORM of your choice (Sequelize, Prisma, SQLAlchemy, etc.)

**Requirements:**
- Create model definitions for all entities
- Define relationships between models (one-to-many, many-to-many)
- Implement data validation at the model level
- Include appropriate timestamps (created_at, updated_at)

Example (using Prisma with TypeScript):

```typescript
// Example model definition for the Book entity
model Book {
  id          Int       @id @default(autoincrement())
  title       String
  isbn        String    @unique
  description String?   @db.Text
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relationships
  authorId    Int
  author      Author    @relation(fields: [authorId], references: [id])
  categories  CategoryOnBook[]
  reviews     Review[]
}
```

**Deliverable:** Complete model definitions for all entities.

### 3. Database Migrations

**Task:** Create database migration scripts to set up your schema and handle future changes.

**Requirements:**
- Initial migration to create all tables
- Seed data migration to populate initial test data
- Strategy for handling schema changes (adding columns, changing types)

**Deliverable:** Migration scripts and seed data files.

### 4. Data Access Layer

**Task:** Create a data access layer that abstracts database operations from the rest of the application.

**Requirements:**
- Implement repository pattern or service pattern
- Create functions for CRUD operations on each entity
- Implement complex queries (filtering, sorting, pagination)
- Handle relationships in queries (eager loading, lazy loading)

Example (using TypeScript with Prisma):

```typescript
// BookRepository.ts
export class BookRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  }
  
  async findAll(
    skip: number = 0,
    take: number = 10,
    orderBy: { [key: string]: 'asc' | 'desc' } = { title: 'asc' }
  ): Promise<Book[]> {
    return this.prisma.book.findMany({
      skip,
      take,
      orderBy,
      include: {
        author: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  }
  
  // Other CRUD operations...
}
```

**Deliverable:** Complete data access layer implementation.

### 5. Transaction Management

**Task:** Implement transaction management for operations that modify multiple entities.

**Requirements:**
- Create a function that adds a new book, associates it with an author and categories, all in a single transaction
- Implement proper error handling and rollback
- Test transaction success and failure scenarios

Example (using TypeScript with Prisma):

```typescript
async createBookWithRelations(
  bookData: CreateBookDto,
  authorId: number,
  categoryIds: number[]
): Promise<Book> {
  return this.prisma.$transaction(async (tx) => {
    // Create the book
    const book = await tx.book.create({
      data: {
        title: bookData.title,
        isbn: bookData.isbn,
        description: bookData.description,
        publishedAt: bookData.publishedAt,
        authorId
      }
    });
    
    // Associate with categories
    for (const categoryId of categoryIds) {
      await tx.categoryOnBook.create({
        data: {
          bookId: book.id,
          categoryId
        }
      });
    }
    
    return book;
  });
}
```

**Deliverable:** Transaction management implementation with error handling.

### 6. Integration with API Layer

**Task:** Integrate your data access layer with the API routes from Exercise 1.

**Requirements:**
- Update API endpoints to use the data access layer
- Implement proper error handling
- Add query parameters for filtering and pagination
- Ensure responses include related entities where appropriate

**Deliverable:** Updated API controller code that uses the data access layer.

### 7. Testing

**Task:** Write tests for your database integration.

**Requirements:**
- Unit tests for data access methods
- Integration tests for API endpoints with database operations
- Test transaction success and failure cases
- Use a test database or in-memory database for testing

**Deliverable:** Complete test suite for database operations.

## Bonus Challenges

### 1. Performance Optimization

Implement database query optimization:
- Add appropriate indexes
- Use query analysis to identify slow queries
- Implement caching for frequently accessed data
- Optimize eager loading of relationships

### 2. Audit Trail

Implement an audit trail system:
- Track all changes to database records
- Store who made changes and when
- Implement soft delete instead of hard delete
- Create API endpoints to access history data

### 3. Advanced Querying

Implement advanced querying capabilities:
- Full-text search
- Composite filtering (AND/OR conditions)
- Complex sorting (multiple fields)
- Relationship-based filtering

## Evaluation Criteria

Your implementation will be evaluated on:

1. **Database Design Quality:** Proper normalization, relationships, and constraints
2. **Code Organization:** Clean separation of concerns, abstraction layers
3. **Error Handling:** Comprehensive error handling and graceful failures
4. **Performance:** Efficient queries and appropriate indexing
5. **Testing:** Comprehensive test coverage
6. **Documentation:** Clear code comments and API documentation

## Submission

Provide the following:

1. Complete database schema design (ERD and SQL script)
2. ORM model definitions
3. Migration scripts
4. Data access layer implementation
5. API integration code
6. Test suite
7. A brief document explaining your design decisions

## Resources

- [Database Normalization Guide](https://www.guru99.com/database-normalization.html)
- [Prisma Documentation](https://www.prisma.io/docs/) (for Node.js/TypeScript)
- [Sequelize Documentation](https://sequelize.org/master/) (for Node.js)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/) (for Python)
- [Transaction Management Best Practices](https://www.postgresql.org/docs/current/tutorial-transactions.html)

<hr/>

<div align="center">
  <h3>🧭 Continue Your Learning Journey</h3>
</div>

<div align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/📋_Chapter_Overview-teal?style=for-the-badge" alt="Chapter Overview" /></a>
  <a href="../exercises"><img src="https://img.shields.io/badge/🏋️_More_Exercises-coral?style=for-the-badge" alt="More Exercises" /></a>
</div>

<div align="center">
  <a href="../../README.md"><img src="https://img.shields.io/badge/🏠_Course_Home-pink?style=flat-square" alt="Course Home" /></a>
</div>

<div align="center">
  <p><em>© 2025 Vibe Coding. Transform the way you build software with AI-human collaboration!</em></p>
</div>
