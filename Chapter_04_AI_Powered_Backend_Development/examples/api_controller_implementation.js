/**
 * API Controller Implementation Example
 * 
 * This file demonstrates best practices for implementing
 * RESTful API controllers in Node.js with Express.
 * It includes proper error handling, validation, and response formatting.
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { ProductService } = require('../services/product.service');
const { ApiError } = require('../utils/errors');
const { asyncHandler } = require('../utils/async-handler');
const { paginate } = require('../utils/pagination');
const { authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Product Controller Class
 * 
 * Handles all product-related API endpoints
 */
class ProductController {
  constructor(productService) {
    this.productService = productService;
    this.router = router;
    this.setupRoutes();
  }

  /**
   * Set up all routes for the product resource
   */
  setupRoutes() {
    // GET /api/products - Get all products with filtering and pagination
    this.router.get(
      '/', 
      this.getProductsValidation(),
      asyncHandler(this.getAllProducts.bind(this))
    );

    // GET /api/products/:id - Get a single product by ID
    this.router.get(
      '/:id', 
      this.getProductByIdValidation(),
      asyncHandler(this.getProductById.bind(this))
    );

    // POST /api/products - Create a new product
    this.router.post(
      '/', 
      authorize(['admin', 'product-manager']),
      this.createProductValidation(),
      asyncHandler(this.createProduct.bind(this))
    );

    // PUT /api/products/:id - Update a product
    this.router.put(
      '/:id', 
      authorize(['admin', 'product-manager']),
      this.updateProductValidation(),
      asyncHandler(this.updateProduct.bind(this))
    );

    // DELETE /api/products/:id - Delete a product
    this.router.delete(
      '/:id', 
      authorize(['admin']),
      this.deleteProductValidation(),
      asyncHandler(this.deleteProduct.bind(this))
    );

    // GET /api/products/search - Search products
    this.router.get(
      '/search', 
      this.searchProductsValidation(),
      asyncHandler(this.searchProducts.bind(this))
    );
  }

  /**
   * Get all products with filtering and pagination
   */
  async getAllProducts(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    // Extract query parameters with defaults
    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      category,
      minPrice,
      maxPrice,
      status = 'active'
    } = req.query;

    // Build filters object
    const filters = { status };
    
    if (category) {
      filters.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      
      if (minPrice !== undefined) {
        filters.price.$gte = parseFloat(minPrice);
      }
      
      if (maxPrice !== undefined) {
        filters.price.$lte = parseFloat(maxPrice);
      }
    }

    // Get paginated products
    const { data, pagination } = await this.productService.getAllProducts({
      filters,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    });

    // Return response
    res.status(200).json({
      success: true,
      data,
      pagination
    });
  }

  /**
   * Get a single product by ID
   */
  async getProductById(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { id } = req.params;

    // Get product by ID
    const product = await this.productService.getProductById(id);

    // Check if product exists
    if (!product) {
      throw new ApiError(404, 'Product not found', { productId: id });
    }

    // Return response
    res.status(200).json({
      success: true,
      data: product
    });
  }

  /**
   * Create a new product
   */
  async createProduct(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    // Extract product data from request body
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      status: req.body.status || 'active',
      inventory: req.body.inventory || 0,
      attributes: req.body.attributes || {},
      createdBy: req.user.id // From auth middleware
    };

    // Create product
    const product = await this.productService.createProduct(productData);

    // Return response
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  }

  /**
   * Update a product
   */
  async updateProduct(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { id } = req.params;

    // Check if product exists
    const existingProduct = await this.productService.getProductById(id);
    if (!existingProduct) {
      throw new ApiError(404, 'Product not found', { productId: id });
    }

    // Extract product data from request body
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      status: req.body.status,
      inventory: req.body.inventory,
      attributes: req.body.attributes,
      updatedBy: req.user.id // From auth middleware
    };

    // Only include defined fields (allow partial updates)
    Object.keys(productData).forEach(key => {
      if (productData[key] === undefined) {
        delete productData[key];
      }
    });

    // Update product
    const updatedProduct = await this.productService.updateProduct(id, productData);

    // Return response
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  }

  /**
   * Delete a product
   */
  async deleteProduct(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { id } = req.params;

    // Check if product exists
    const existingProduct = await this.productService.getProductById(id);
    if (!existingProduct) {
      throw new ApiError(404, 'Product not found', { productId: id });
    }

    // Delete product (may be soft delete depending on implementation)
    await this.productService.deleteProduct(id, req.user.id);

    // Return response
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  }

  /**
   * Search products
   */
  async searchProducts(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation error', errors.array());
    }

    const { 
      query, 
      page = 1, 
      limit = 20 
    } = req.query;

    // Search products
    const { data, pagination } = await this.productService.searchProducts(
      query,
      parseInt(page, 10),
      parseInt(limit, 10)
    );

    // Return response
    res.status(200).json({
      success: true,
      data,
      pagination
    });
  }

  /**
   * Validation for getting all products
   */
  getProductsValidation() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      
      query('sortBy')
        .optional()
        .isIn(['name', 'price', 'createdAt', 'updatedAt'])
        .withMessage('Sort by must be one of: name, price, createdAt, updatedAt'),
      
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
      
      query('category')
        .optional()
        .isString()
        .withMessage('Category must be a string'),
      
      query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a non-negative number'),
      
      query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a non-negative number')
        .custom((value, { req }) => {
          if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
            throw new Error('Maximum price must be greater than minimum price');
          }
          return true;
        }),
      
      query('status')
        .optional()
        .isIn(['active', 'inactive', 'draft'])
        .withMessage('Status must be one of: active, inactive, draft')
    ];
  }

  /**
   * Validation for getting a product by ID
   */
  getProductByIdValidation() {
    return [
      param('id')
        .isMongoId()
        .withMessage('Invalid product ID format')
    ];
  }

  /**
   * Validation for creating a product
   */
  createProductValidation() {
    return [
      body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      
      body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
      
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
      
      body('category')
        .isMongoId()
        .withMessage('Category must be a valid ID'),
      
      body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
      
      body('status')
        .optional()
        .isIn(['active', 'inactive', 'draft'])
        .withMessage('Status must be one of: active, inactive, draft'),
      
      body('inventory')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Inventory must be a non-negative integer'),
      
      body('attributes')
        .optional()
        .isObject()
        .withMessage('Attributes must be an object')
    ];
  }

  /**
   * Validation for updating a product
   */
  updateProductValidation() {
    return [
      param('id')
        .isMongoId()
        .withMessage('Invalid product ID format'),
      
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      
      body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),
      
      body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
      
      body('category')
        .optional()
        .isMongoId()
        .withMessage('Category must be a valid ID'),
      
      body('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
      
      body('status')
        .optional()
        .isIn(['active', 'inactive', 'draft'])
        .withMessage('Status must be one of: active, inactive, draft'),
      
      body('inventory')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Inventory must be a non-negative integer'),
      
      body('attributes')
        .optional()
        .isObject()
        .withMessage('Attributes must be an object')
    ];
  }

  /**
   * Validation for deleting a product
   */
  deleteProductValidation() {
    return [
      param('id')
        .isMongoId()
        .withMessage('Invalid product ID format')
    ];
  }

  /**
   * Validation for searching products
   */
  searchProductsValidation() {
    return [
      query('query')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Search query must be at least 2 characters'),
      
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
    ];
  }
}

/**
 * Utility for handling async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * API Error class for consistent error responses
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.name || 'ERROR',
      timestamp: err.timestamp || new Date().toISOString(),
      requestId: req.requestId // Assuming request ID middleware is used
    }
  };

  // Add error details if available (for validation errors, etc.)
  if (err.details) {
    errorResponse.error.details = err.details;
  }

  // Log error for server-side issues
  if (statusCode >= 500) {
    console.error('Server error:', err);
  }

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Pagination utility function
 */
const paginate = (page, limit, total) => {
  const pages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages: pages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < pages,
    hasPreviousPage: page > 1,
    nextPage: page < pages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null
  };
};

/**
 * Authorization middleware
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Assume authentication middleware has already set req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Check if user has required role
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden',
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
};

/**
 * Example Product Service
 * 
 * This would typically be in a separate service file
 */
class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Get all products with filtering and pagination
   */
  async getAllProducts({ filters, page, limit, sort }) {
    const skip = (page - 1) * limit;
    
    // Get products and total count in parallel
    const [products, total] = await Promise.all([
      this.productRepository.findAll(filters, { skip, limit, sort }),
      this.productRepository.count(filters)
    ]);
    
    return {
      data: products,
      pagination: paginate(page, limit, total)
    };
  }

  /**
   * Get a product by ID
   */
  async getProductById(id) {
    return this.productRepository.findById(id);
  }

  /**
   * Create a new product
   */
  async createProduct(productData) {
    return this.productRepository.create(productData);
  }

  /**
   * Update a product
   */
  async updateProduct(id, productData) {
    return this.productRepository.update(id, productData);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id, userId) {
    // Implement soft delete by updating status to 'deleted'
    return this.productRepository.update(id, {
      status: 'deleted',
      updatedBy: userId,
      deletedAt: new Date()
    });
  }

  /**
   * Search for products
   */
  async searchProducts(query, page, limit) {
    const skip = (page - 1) * limit;
    
    // This would typically use a search index like Elasticsearch
    // For simplicity, we're using a basic text search here
    const searchFilters = {
      $text: { $search: query }
    };
    
    // Get search results and total count in parallel
    const [products, total] = await Promise.all([
      this.productRepository.findAll(searchFilters, { 
        skip, 
        limit,
        sort: { score: { $meta: 'textScore' } }
      }),
      this.productRepository.count(searchFilters)
    ]);
    
    return {
      data: products,
      pagination: paginate(page, limit, total)
    };
  }
}

/**
 * Register routes with Express app
 */
const registerProductRoutes = (app, productService) => {
  const productController = new ProductController(productService);
  app.use('/api/products', productController.router);
  
  // Register global error handler
  app.use(errorHandler);
  
  return app;
};

module.exports = {
  ProductController,
  registerProductRoutes,
  asyncHandler,
  ApiError,
  errorHandler,
  paginate,
  authorize,
  ProductService
};

/**
 * Example Usage
 */
/*
const express = require('express');
const { registerProductRoutes } = require('./controllers/product.controller');
const { ProductRepository } = require('./repositories/product.repository');
const { ProductService } = require('./services/product.service');
const { connectToDatabase } = require('./database/connection');

const app = express();
app.use(express.json());

// Set up middleware
app.use((req, res, next) => {
  req.requestId = require('crypto').randomUUID();
  next();
});

// Connect to database
connectToDatabase().then(() => {
  // Initialize repositories and services
  const productRepository = new ProductRepository();
  const productService = new ProductService(productRepository);
  
  // Register routes
  registerProductRoutes(app, productService);
  
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
*/

/**
 * Best Practices Demonstrated:
 * 
 * 1. Controller Organization: Structured controller class with clear method responsibilities
 * 2. Input Validation: Comprehensive request validation with express-validator
 * 3. Error Handling: Consistent error responses and global error handler
 * 4. Authentication & Authorization: Role-based access control
 * 5. Request/Response Format: Consistent JSON response structure
 * 6. Pagination: Standardized pagination for list endpoints
 * 7. Separation of Concerns: Controller separate from business logic (service layer)
 * 8. Async/Await: Clean handling of asynchronous operations with error handling
 * 9. Parameter Sanitization: Input sanitization to prevent injection attacks
 * 10. Partial Updates: Support for updating only specified fields
 * 11. Soft Deletes: Preserving data with soft delete pattern
 * 12. Consistent Status Codes: Proper HTTP status codes for different scenarios
 */
