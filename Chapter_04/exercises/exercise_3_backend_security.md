# Exercise 3: Backend Security Implementation

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-2ecc71?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_4-2ecc71?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 4" />
  <h1>Backend Security Implementation</h1>
  
  <p><i>"Building robust security into your backend application"</i></p>
</div>

<hr/>

## Overview

This exercise focuses on implementing comprehensive security measures for a backend API. You'll work through authentication, authorization, data validation, and protection against common security vulnerabilities.

## Learning Objectives

- Implement secure user authentication with JWT
- Set up role-based access control (RBAC)
- Apply input validation and sanitization
- Protect against common security vulnerabilities (OWASP Top 10)
- Implement secure API practices and security headers
- Configure proper error handling with security in mind

## Prerequisites

- Familiarity with REST API development
- Basic understanding of authentication concepts
- Knowledge of common web security threats
- Completed Exercise 1: REST API Design

## Exercise Steps

### 1. Secure Authentication System

**Task:** Implement a JWT-based authentication system with refresh token rotation.

**Requirements:**
- User registration with email verification
- Secure password hashing with bcrypt
- JWT access tokens with appropriate expiration
- Refresh token mechanism with secure storage
- Token blacklisting for logout functionality
- Rate limiting for authentication endpoints

**Example Implementation (Node.js/Express):**

```javascript
// Authentication controller example
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token
    await saveRefreshToken(user.id, refreshToken);
    
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### 2. Role-Based Authorization

**Task:** Implement role-based access control for API endpoints.

**Requirements:**
- Define roles (e.g., admin, editor, user)
- Create middleware for role-based access checks
- Apply granular permissions for different operations
- Secure route protection based on user roles
- Role hierarchy with permission inheritance

**Example Implementation:**

```javascript
// Authorization middleware
const authorize = (requiredRoles = []) => {
  return (req, res, next) => {
    // Check JWT first
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Check role if specified
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Set user in request
      req.user = user;
      next();
    })(req, res, next);
  };
};

// Usage in routes
router.get('/users', authorize(['admin']), userController.getAllUsers);
router.get('/profile', authorize(), userController.getProfile);
```

### 3. Input Validation and Sanitization

**Task:** Implement comprehensive input validation for all API endpoints.

**Requirements:**
- Schema validation for request bodies
- Query parameter validation
- Data sanitization to prevent injection attacks
- Custom validators for domain-specific rules
- Consistent error messages for validation failures

**Example Implementation:**

```javascript
// Validation middleware using express-validator
const validateUserCreation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/)
    .withMessage('Password must include lowercase, uppercase, number and special character'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  validateResults
];

// Validation results middleware
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Usage in routes
router.post('/users', validateUserCreation, userController.createUser);
```

### 4. Security Headers and HTTPS

**Task:** Configure security headers and ensure HTTPS-only access.

**Requirements:**
- Set up Helmet.js to manage security headers
- Configure CSP (Content Security Policy)
- Implement HSTS (HTTP Strict Transport Security)
- Set secure and HttpOnly flags for cookies
- Prevent clickjacking with X-Frame-Options
- Redirect HTTP to HTTPS

**Example Implementation:**

```javascript
// Security headers setup
const helmet = require('helmet');

// Apply helmet with customized CSP
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: ["'self'", 'data:', 'https://secure.example.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    connectSrc: ["'self'", 'https://api.example.com']
  }
}));

// HSTS setup
app.use(helmet.hsts({
  maxAge: 15552000, // 180 days in seconds
  includeSubDomains: true,
  preload: true
}));

// HTTP to HTTPS redirect
app.use((req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
});
```

### 5. Protection Against Common Vulnerabilities

**Task:** Implement protections against OWASP Top 10 vulnerabilities.

**Requirements:**
- SQL/NoSQL Injection prevention
- Cross-Site Scripting (XSS) protection
- Cross-Site Request Forgery (CSRF) prevention
- Broken Authentication countermeasures
- Secure file upload handling
- Protection against excessive data exposure

**Example Implementation (SQL Injection Prevention):**

```javascript
// Parameterized queries with prepared statements
const getUserById = async (userId) => {
  const query = 'SELECT id, name, email, role FROM users WHERE id = ?';
  try {
    // Using parameterized query instead of string concatenation
    const [rows] = await db.query(query, [userId]);
    return rows[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch user');
  }
};
```

### 6. API Rate Limiting and Brute Force Protection

**Task:** Implement rate limiting and brute force protection for API endpoints.

**Requirements:**
- Global rate limiting per IP address
- More strict rate limits for authentication endpoints
- Exponential backoff for failed login attempts
- Account lockout after multiple failed attempts
- Monitoring and alerting for suspicious activity

**Example Implementation:**

```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// More strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 login attempts per hour
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

### 7. Secure Error Handling and Logging

**Task:** Implement secure error handling and logging practices.

**Requirements:**
- Custom error handling middleware
- Sanitized error messages for production
- Detailed internal logging for debugging
- No sensitive data in error responses
- Structured logging with appropriate levels
- Correlation IDs for request tracking

**Example Implementation:**

```javascript
// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Generate unique error ID for tracking
  const errorId = uuidv4();
  
  // Log detailed error for debugging (internal only)
  logger.error({
    errorId,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'unauthenticated'
  });
  
  // Send sanitized response to client
  const statusCode = err.statusCode || 500;
  
  // In production, hide error details
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message;
  
  res.status(statusCode).json({
    error: {
      message,
      errorId // For support reference
    }
  });
};

// Apply error handler as the last middleware
app.use(errorHandler);
```

## Bonus Challenges

### 1. Two-Factor Authentication

Implement a second factor authentication system:
- TOTP (Time-based One-Time Password) integration
- QR code generation for app setup
- Recovery codes for backup access
- Remember trusted devices functionality

### 2. API Key Management System

Create a secure API key management system for external integrations:
- Key generation with appropriate entropy
- Key scoping with granular permissions
- Usage tracking and quotas
- Key rotation and revocation capabilities

### 3. Security Audit and Penetration Testing

Perform a security audit and penetration testing:
- Run automated security scanning tools
- Manually test for vulnerabilities
- Document findings and remediation plans
- Implement fixes for identified issues

## Evaluation Criteria

Your implementation will be evaluated on:

1. **Security Effectiveness:** Protection against common threats
2. **Code Quality:** Clean, maintainable security implementations
3. **Usability:** Security measures that don't hinder legitimate users
4. **Depth of Protection:** Defense-in-depth approach
5. **Documentation:** Clear documentation of security measures
6. **Testing:** Comprehensive security testing

## Submission

Provide the following:

1. Complete authentication and authorization implementation
2. Input validation and security middleware code
3. Security headers configuration
4. Protection measures against OWASP vulnerabilities
5. Rate limiting and brute force protection implementation
6. Secure error handling and logging code
7. A document explaining your security architecture and decisions

## Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [JWT Implementation Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)

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
