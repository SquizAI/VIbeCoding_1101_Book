# Exercise: Full Stack Authentication System

<div align="center">
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/VIBE_CODING_101-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Vibe Coding 101" />
  </a>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/CHAPTER_5-9b59b6?style=for-the-badge&logo=bookstack&logoColor=white" alt="Chapter 5" />
  <h1>Full Stack Authentication System</h1>
  
  <p><i>"Building a secure, integrated authentication system across frontend and backend"</i></p>
</div>

<hr/>

## Overview

In this exercise, you will build a complete authentication system that spans both the frontend and backend of a web application. You'll implement user registration, login, profile management, and secure route protection while maintaining proper separation of concerns and following contract-first development principles.

## Learning Objectives

- Design a secure authentication system with JWT tokens
- Implement backend authentication routes and middleware
- Create a frontend authentication flow with state management
- Protect routes on both frontend and backend
- Apply proper error handling and validation
- Follow contract-first development principles

## Prerequisites

- Understanding of React and a backend framework (Express.js, FastAPI, etc.)
- Basic knowledge of JWT authentication
- Familiarity with RESTful API design
- Completed the basic frontend and backend integration exercises

## Exercise Steps

### 1. Authentication Blueprint Design

**Task:** Before writing any code, create a comprehensive blueprint for your authentication system.

**Requirements:**
- Define the authentication data model (User schema)
- Design the API contract for auth-related endpoints
- Document the authentication flow (registration, login, token refresh)
- Specify security measures and token handling
- Create interface definitions for request/response objects

**Deliverable:** A complete authentication blueprint document (markdown or diagram).

### 2. Backend Authentication Implementation

**Task:** Implement the backend authentication system based on your blueprint.

**Requirements:**
- Create a User model with secure password storage
- Implement registration, login, and token refresh endpoints
- Add JWT token generation and validation
- Create middleware for route protection
- Implement proper error handling and validation
- Set up secure HTTP-only cookies for tokens

**Example Implementation (Node.js/Express):**

```javascript
// Example User model (using Mongoose)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
```

**Deliverable:** Complete backend authentication implementation including:
- User model
- Authentication controller with all required endpoints
- JWT utilities
- Authentication middleware
- Validation middleware

### 3. Frontend Authentication Interface

**Task:** Implement the frontend authentication components and state management.

**Requirements:**
- Create registration and login forms with validation
- Implement authentication context/provider for state management
- Add token handling and storage
- Create protected route components
- Implement token refresh logic
- Add user profile management

**Example Implementation (React with Context API):**

```jsx
// Example Authentication Context
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/me');
          setCurrentUser(response.data.data);
        }
      } catch (err) {
        // Token might be invalid, remove it
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      // Store token and set auth header
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
      throw err;
    }
  };

  // Registration function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Deliverable:** Complete frontend authentication implementation including:
- Authentication context provider
- Login and registration components
- Protected route wrapper component
- User profile component
- API integration layer

### 4. Integration Testing

**Task:** Test the complete authentication flow from frontend to backend.

**Requirements:**
- Test user registration
- Test login and token generation
- Test protected route access
- Test token refresh mechanism
- Test error handling and validation
- Test token expiration

**Deliverable:** Automated tests for both frontend and backend authentication.

### 5. Security Enhancements

**Task:** Improve the security of your authentication system.

**Requirements:**
- Implement rate limiting for auth endpoints
- Add CSRF protection
- Implement account lockout after failed attempts
- Add email verification for registration
- Implement password reset functionality
- Add request logging for authentication attempts

**Example Implementation (Rate Limiting):**

```javascript
// Rate limiting middleware
const rateLimit = require('express-rate-limit');

// Apply rate limiting to login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again after 15 minutes',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});

// Apply to routes
router.post('/api/auth/login', loginLimiter, authController.login);
```

**Deliverable:** Enhanced authentication system with additional security features.

## Bonus Challenges

### 1. Social Authentication

Add OAuth integration with social providers (Google, GitHub, etc.):
- Implement OAuth routes on the backend
- Create social login buttons on the frontend
- Handle linking social accounts with existing accounts
- Add profile data synchronization

### 2. Role-Based Authorization

Implement a comprehensive role-based authorization system:
- Create role and permission models
- Implement permission checking middleware
- Add role-based UI component rendering
- Create an admin panel for role management

### 3. Multi-Factor Authentication

Add two-factor authentication support:
- Implement TOTP (Time-based One-Time Password) generation
- Create setup and verification screens
- Add backup codes functionality
- Implement remember device functionality

## Evaluation Criteria

Your implementation will be evaluated on:

1. **Blueprint Quality:** Comprehensive design with clear interfaces and flows
2. **Security:** Proper implementation of authentication best practices
3. **Usability:** User-friendly authentication flow
4. **Code Organization:** Clean separation of concerns
5. **Error Handling:** Comprehensive error management
6. **Testing:** Thorough testing of authentication flows

## Submission

Provide the following:

1. Authentication blueprint document
2. Backend authentication implementation
3. Frontend authentication implementation
4. Integration tests
5. Security enhancements
6. A document explaining your implementation decisions

## Resources

- [OWASP Authentication Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT.io](https://jwt.io/) - Information about JSON Web Tokens
- [React Authentication Patterns](https://reactrouter.com/web/example/auth-workflow)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

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
