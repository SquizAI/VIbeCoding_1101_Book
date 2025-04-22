# Exercise 1: Building a RESTful API

## Objective
Create a complete RESTful API from scratch using AI assistance, implementing proper error handling, validation, and documentation.

## Background
APIs (Application Programming Interfaces) are the backbone of modern software architecture, allowing different systems to communicate with each other. By building a RESTful API, you'll learn essential backend concepts while creating something that's immediately useful for real applications.

## Requirements

Design and implement a RESTful API for a personal library management system with the following features:

1. **Resource Management**:
   - Books: Create, read, update, and delete books in your library
   - Authors: Manage author information
   - Categories: Organize books by categories

2. **Data Validation**:
   - Implement proper input validation for all API endpoints
   - Handle validation errors gracefully with appropriate status codes

3. **Documentation**:
   - Include clear API documentation (can be generated automatically)
   - Document all endpoints, request parameters, and responses

4. **Error Handling**:
   - Implement comprehensive error handling
   - Use appropriate HTTP status codes
   - Provide helpful error messages

## Technical Specifications

Choose one of the following technology stacks:

### Option 1: Node.js Stack
- Runtime: Node.js
- Framework: Express.js
- Data storage: JSON file (beginner) or MongoDB (advanced)
- Validation: express-validator or Joi

### Option 2: Python Stack
- Runtime: Python 3.x
- Framework: FastAPI or Flask
- Data storage: JSON file (beginner) or SQLite (advanced)
- Validation: Pydantic (FastAPI) or marshmallow (Flask)

## API Endpoints to Implement

### Books
- `GET /api/books` - List all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Authors
- `GET /api/authors` - List all authors
- `GET /api/authors/:id` - Get a specific author
- `POST /api/authors` - Create a new author
- `PUT /api/authors/:id` - Update an author
- `DELETE /api/authors/:id` - Delete an author

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Implementation Steps Using Vibe Coding

1. **Planning Phase**:
   - Define your data models (book, author, category)
   - Plan relationships between models
   - Design your API endpoints and expected responses

2. **AI Collaboration**:
   - Create a prompt describing the API specifications
   - Ask the AI to generate the initial project structure
   - Request implementation of core endpoints
   - Iteratively improve with follow-up prompts

3. **Testing and Refinement**:
   - Test each endpoint manually or with automated tests
   - Refine the API based on test results
   - Add additional features or error handling

## Sample AI Prompts to Get Started

### Initial Project Setup
```
Create a [Node.js/Python] RESTful API for a library management system using [Express/FastAPI]. 

I need:
1. A project structure with proper organization
2. Data models for books, authors, and categories
3. Basic CRUD endpoints for each model
4. Simple data storage using [JSON files/your recommended approach]
5. Basic error handling

Books should have: title, author ID, category ID, publication year, ISBN, and description.
Authors should have: name, biography, and birth year.
Categories should have: name and description.

Please include clear comments explaining the code.
```

### Adding Input Validation
```
Enhance my library API with comprehensive input validation. 

For each endpoint, validate:
- Required fields are present
- String fields have appropriate length limits
- Numeric fields are within valid ranges
- IDs exist in the database before establishing relationships

Please implement validation for the book creation and update endpoints first.
```

## Extension Challenges

Once you've completed the basic implementation, try these extensions:

1. **Advanced Querying**: Add filtering, sorting, and pagination to the list endpoints
2. **Authentication**: Implement user authentication with JWT
3. **Rate Limiting**: Add rate limiting to prevent API abuse
4. **Testing**: Create automated tests for all endpoints
5. **Deployment**: Deploy your API to a cloud provider

## Submission

Your submission should include:

1. All source code files
2. A README.md with:
   - Setup instructions
   - API documentation
   - Examples of how to use each endpoint
3. A reflection on:
   - How you used AI assistance
   - Challenges you encountered
   - What you learned
   - How you would improve the API further
