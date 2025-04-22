/**
 * JWT Authentication Implementation Example
 * 
 * This example demonstrates how to implement JWT-based authentication in a Node.js
 * Express application with secure practices. It includes token generation, validation,
 * refresh token rotation, and protected routes.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// In a real application, these would be stored in a secure environment
// and loaded via environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

// In-memory storage for demo purposes - use a database in production
const users = [];
const refreshTokens = [];

// Implement rate limiting to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per IP within the window
  message: 'Too many login attempts, please try again after 15 minutes'
});

/**
 * User Registration
 * 
 * 1. Validate input (email, password strength)
 * 2. Hash password with bcrypt
 * 3. Store user with hashed password
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Input validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password with bcrypt (10 rounds is a good default as of 2025)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Store user (would be a database operation in production)
    users.push(user);
    
    // Respond with success but don't send sensitive information
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

/**
 * User Login
 * 
 * 1. Find user by email
 * 2. Verify password with bcrypt
 * 3. Generate access token (short-lived)
 * 4. Generate refresh token (longer-lived)
 */
app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      // Use consistent error messages to prevent user enumeration
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate access token (short-lived, typically 15-60 minutes)
    const accessToken = generateAccessToken(user);
    
    // Generate refresh token (longer-lived, typically days or weeks)
    const refreshToken = jwt.sign(
      { userId: user.id }, 
      REFRESH_TOKEN_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Store refresh token (in a database in production)
    refreshTokens.push(refreshToken);
    
    // Send tokens to client
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * Token Refresh
 * 
 * 1. Verify refresh token is valid and in our store
 * 2. Generate new access token
 * 3. (Optional) Implement refresh token rotation for added security
 */
app.post('/api/auth/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }
  
  // Check if refresh token is in our store
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
  
  // Verify refresh token
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Remove invalid refresh token from store
      const tokenIndex = refreshTokens.indexOf(refreshToken);
      refreshTokens.splice(tokenIndex, 1);
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    // Find user
    const user = users.find(user => user.id === decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user);
    
    // Implement refresh token rotation (optional but recommended)
    // Remove old refresh token
    const tokenIndex = refreshTokens.indexOf(refreshToken);
    refreshTokens.splice(tokenIndex, 1);
    
    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: user.id }, 
      REFRESH_TOKEN_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Store new refresh token
    refreshTokens.push(newRefreshToken);
    
    // Send new tokens to client
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  });
});

/**
 * Logout
 * 
 * 1. Remove refresh token from store
 * 2. Client should remove tokens from their storage
 */
app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  
  // Remove refresh token from store
  const tokenIndex = refreshTokens.indexOf(refreshToken);
  if (tokenIndex !== -1) {
    refreshTokens.splice(tokenIndex, 1);
  }
  
  res.json({ message: 'Logout successful' });
});

/**
 * Authentication Middleware
 * 
 * 1. Extract JWT from Authorization header
 * 2. Verify JWT signature and expiration
 * 3. Add user data to request object
 */
const authenticateToken = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      // Token validation failed
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    // Add user information to request
    req.user = decoded;
    next();
  });
};

/**
 * Role-Based Authorization Middleware
 * 
 * Only allows users with specific roles to access the route
 */
const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: insufficient role' });
    }
    
    next();
  };
};

/**
 * Generate Access Token
 * 
 * Creates a short-lived JWT with user information
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1h' } // Short-lived token
  );
}

/**
 * Example Protected Routes
 */

// Public route - no authentication required
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

// Protected route - authentication required
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'This is a protected endpoint',
    user: req.user
  });
});

// Admin-only route - authentication and admin role required
app.get('/api/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'Admin dashboard data' });
});

// User profile route - authentication required and must be the user's own profile
app.get('/api/users/:id/profile', authenticateToken, (req, res) => {
  // Check if user is accessing their own profile or is an admin
  if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: not your profile' });
  }
  
  // Find user
  const user = users.find(user => user.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Return user profile without sensitive information
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Security Best Practices Implemented:
 * 
 * 1. Password hashing with bcrypt
 * 2. Short-lived access tokens
 * 3. Refresh token rotation
 * 4. Rate limiting for authentication endpoints
 * 5. Role-based access control
 * 6. Consistent error messages to prevent user enumeration
 * 7. Token blacklisting on logout
 * 8. No sensitive data in tokens
 * 9. Separation of access and refresh token secrets
 * 
 * Additional Production Considerations:
 * 
 * 1. Store tokens and user data in a database
 * 2. Use HTTPS in production
 * 3. Implement CSRF protection
 * 4. Add email verification for registration
 * 5. Consider using OAuth 2.0 for third-party authentication
 * 6. Implement IP-based suspicious activity detection
 * 7. Use a secrets management solution for JWT secrets
 */
