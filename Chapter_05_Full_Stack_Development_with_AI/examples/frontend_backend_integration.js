/**
 * Frontend-Backend Integration Example
 * 
 * This file demonstrates best practices for integrating
 * a React frontend with a Node.js API backend using
 * a contract-first approach.
 */

// ------------------------------------------------------
// PART 1: SHARED API CONTRACT (TypeScript interfaces)
// ------------------------------------------------------

/**
 * This section would typically be in a shared package
 * or shared file accessible to both frontend and backend
 */

/**
 * Product model interface (shared between frontend and backend)
 */
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inventory: number;
  status: 'active' | 'inactive' | 'deleted';
  attributes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response interface for paginated lists (shared)
 */
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

/**
 * API response interface for a single item (shared)
 */
interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API error response interface (shared)
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    timestamp: string;
    requestId?: string;
    details?: any;
  };
}

/**
 * Product API routes (shared constants)
 */
const API_ROUTES = {
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    SEARCH: '/api/products/search',
  }
};

// ------------------------------------------------------
// PART 2: BACKEND IMPLEMENTATION (Node.js/Express)
// ------------------------------------------------------

// Assuming product.controller.js and product.service.js
// are implemented as shown in previous examples

/**
 * Example backend implementation of the product API endpoints
 * (This would be in your Express.js routes and controllers)
 */
const express = require('express');
const router = express.Router();

// Import controller (implementation from previous examples)
const { ProductController } = require('./controllers/product.controller');
const { ProductService } = require('./services/product.service');
const { ProductRepository } = require('./repositories/product.repository');

// Initialize
const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Register routes (simplified version)
router.get('/api/products', productController.getAllProducts.bind(productController));
router.get('/api/products/:id', productController.getProductById.bind(productController));
router.post('/api/products', productController.createProduct.bind(productController));
router.put('/api/products/:id', productController.updateProduct.bind(productController));
router.delete('/api/products/:id', productController.deleteProduct.bind(productController));
router.get('/api/products/search', productController.searchProducts.bind(productController));

// ------------------------------------------------------
// PART 3: FRONTEND IMPLEMENTATION (React/TypeScript)
// ------------------------------------------------------

/**
 * Example React hooks for API integration
 * Using React Query for data fetching and caching
 */

// api.ts - API client setup
import axios from 'axios';
import { QueryClient } from 'react-query';

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Transform error response to match ErrorResponse interface
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: response?.data?.error?.message || 'An unexpected error occurred',
        code: response?.data?.error?.code || 'UNKNOWN_ERROR',
        timestamp: response?.data?.error?.timestamp || new Date().toISOString(),
        details: response?.data?.error?.details || null,
      }
    };
    
    return Promise.reject(errorResponse);
  }
);

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default apiClient;

// ------------------------------------------------------
// productApi.ts - Product-specific API functions

import apiClient from './api';
import { 
  API_ROUTES, 
  Product, 
  PaginatedResponse,
  SingleResponse, 
  ErrorResponse 
} from '../shared/types';

// Get all products with filtering and pagination
export const getProducts = async (
  params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  } = {}
): Promise<PaginatedResponse<Product>> => {
  const response = await apiClient.get<PaginatedResponse<Product>>(
    API_ROUTES.PRODUCTS.LIST,
    { params }
  );
  return response.data;
};

// Get a product by ID
export const getProductById = async (
  id: string
): Promise<SingleResponse<Product>> => {
  const response = await apiClient.get<SingleResponse<Product>>(
    API_ROUTES.PRODUCTS.DETAIL(id)
  );
  return response.data;
};

// Create a new product
export const createProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SingleResponse<Product>> => {
  const response = await apiClient.post<SingleResponse<Product>>(
    API_ROUTES.PRODUCTS.CREATE,
    product
  );
  return response.data;
};

// Update a product
export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<SingleResponse<Product>> => {
  const response = await apiClient.put<SingleResponse<Product>>(
    API_ROUTES.PRODUCTS.UPDATE(id),
    product
  );
  return response.data;
};

// Delete a product
export const deleteProduct = async (
  id: string
): Promise<SingleResponse<void>> => {
  const response = await apiClient.delete<SingleResponse<void>>(
    API_ROUTES.PRODUCTS.DELETE(id)
  );
  return response.data;
};

// Search products
export const searchProducts = async (
  query: string,
  page = 1,
  limit = 20
): Promise<PaginatedResponse<Product>> => {
  const response = await apiClient.get<PaginatedResponse<Product>>(
    API_ROUTES.PRODUCTS.SEARCH,
    { params: { query, page, limit } }
  );
  return response.data;
};

// ------------------------------------------------------
// hooks/useProducts.ts - React Query hooks

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts
} from '../api/productApi';
import { Product } from '../shared/types';

// Query keys
const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: (id: string) => ['product', id],
  PRODUCT_SEARCH: (query: string) => ['products', 'search', query],
};

// Hook for fetching products with filters
export const useProducts = (
  filters = {},
  options = {}
) => {
  return useQuery(
    [QUERY_KEYS.PRODUCTS, filters],
    () => getProducts(filters),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

// Hook for fetching a single product
export const useProduct = (
  id: string,
  options = {}
) => {
  return useQuery(
    QUERY_KEYS.PRODUCT(id),
    () => getProductById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

// Hook for creating a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (newProduct) => createProduct(newProduct),
    {
      onSuccess: () => {
        // Invalidate products list query to refetch
        queryClient.invalidateQueries(QUERY_KEYS.PRODUCTS);
      },
    }
  );
};

// Hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => updateProduct(id, data),
    {
      onSuccess: (_, variables) => {
        // Invalidate specific product query and products list
        queryClient.invalidateQueries(QUERY_KEYS.PRODUCT(variables.id));
        queryClient.invalidateQueries(QUERY_KEYS.PRODUCTS);
      },
    }
  );
};

// Hook for deleting a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => deleteProduct(id),
    {
      onSuccess: (_, id) => {
        // Invalidate specific product query and products list
        queryClient.invalidateQueries(QUERY_KEYS.PRODUCT(id));
        queryClient.invalidateQueries(QUERY_KEYS.PRODUCTS);
      },
    }
  );
};

// Hook for searching products
export const useSearchProducts = (
  query: string,
  page = 1,
  limit = 20,
  options = {}
) => {
  return useQuery(
    [...QUERY_KEYS.PRODUCT_SEARCH(query), page, limit],
    () => searchProducts(query, page, limit),
    {
      enabled: query.length >= 2,
      keepPreviousData: true,
      ...options,
    }
  );
};

// ------------------------------------------------------
// PART 4: FRONTEND COMPONENTS (React/TypeScript)
// ------------------------------------------------------

// ProductList.tsx - Example component using the hooks
import React, { useState } from 'react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductList = () => {
  // State for filters and pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'active',
  });
  
  // Fetch products with current filters
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useProducts(filters);
  
  // Delete product mutation
  const { 
    mutate: deleteProductMutation, 
    isLoading: isDeleting 
  } = useDeleteProduct();
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation(id);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Render error state
  if (isError) {
    return <ErrorMessage error={error} />;
  }
  
  return (
    <div className="product-list">
      <div className="product-list-header">
        <h1>Products</h1>
        <Link to="/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>
      
      <div className="product-list-filters">
        <select 
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={handleSortChange}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="name:asc">Name (A-Z)</option>
          <option value="name:desc">Name (Z-A)</option>
          <option value="price:asc">Price (Low to High)</option>
          <option value="price:desc">Price (High to Low)</option>
        </select>
      </div>
      
      <div className="product-list-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.inventory}</td>
                <td>
                  <span className={`status status-${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <Link to={`/products/${product.id}`} className="btn btn-sm">
                    View
                  </Link>
                  <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-secondary">
                    Edit
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data?.pagination && (
        <Pagination 
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductList;

// ProductDetail.tsx - Example component for a single product
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useDeleteProduct } from '../hooks/useProducts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch product details
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useProduct(id);
  
  // Delete product mutation
  const { 
    mutate: deleteProductMutation, 
    isLoading: isDeleting 
  } = useDeleteProduct();
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation(id, {
        onSuccess: () => {
          navigate('/products');
        }
      });
    }
  };
  
  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Render error state
  if (isError) {
    return <ErrorMessage error={error} />;
  }
  
  const product = data?.data;
  
  return (
    <div className="product-detail">
      <div className="product-detail-header">
        <h1>{product.name}</h1>
        <div className="product-detail-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="product-detail-content">
        <div className="product-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-info-item">
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </div>
          <div className="product-info-item">
            <strong>Category:</strong> {product.category}
          </div>
          <div className="product-info-item">
            <strong>Inventory:</strong> {product.inventory}
          </div>
          <div className="product-info-item">
            <strong>Status:</strong> 
            <span className={`status status-${product.status}`}>
              {product.status}
            </span>
          </div>
          <div className="product-info-item">
            <strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}
          </div>
          <div className="product-info-item">
            <strong>Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="product-description">
        <h2>Description</h2>
        <p>{product.description}</p>
      </div>
      
      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <div className="product-attributes">
          <h2>Attributes</h2>
          <table>
            <tbody>
              {Object.entries(product.attributes).map(([key, value]) => (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

/**
 * Best Practices Demonstrated:
 * 
 * 1. Contract-First Approach: Shared interfaces between frontend and backend
 * 2. Type Safety: TypeScript interfaces for API requests and responses
 * 3. Separation of Concerns:
 *    - API client for data fetching
 *    - Custom hooks for state management
 *    - UI components for rendering
 * 4. Error Handling: Consistent error handling and display
 * 5. Loading States: Clear loading indicators
 * 6. Data Caching: React Query for efficient data fetching and caching
 * 7. Optimistic Updates: Immediately update UI before backend confirms
 * 8. Authentication: JWT token handling in API client
 * 9. Reusable Hooks: Custom hooks for common operations
 * 10. Centralized API Routes: Single source of truth for API endpoints
 * 11. Pagination: Consistent pagination handling
 * 12. Confirmation Dialogs: User confirmation for destructive actions
 */
