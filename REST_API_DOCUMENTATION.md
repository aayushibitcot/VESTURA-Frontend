# BITCOT E-Commerce Platform - REST API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Base URL & Authentication](#base-url--authentication)
3. [API Endpoints](#api-endpoints)
   - [Authentication APIs](#1-authentication-apis)
   - [Home APIs](#2-home-apis)
   - [Product APIs](#3-product-apis)
   - [Cart APIs](#4-cart-apis)
   - [Order APIs](#5-order-apis)
   - [Checkout & Payment APIs](#6-checkout--payment-apis)
   - [Contact APIs](#7-contact-apis)
   - [Newsletter APIs](#8-newsletter-apis)
4. [Error Responses](#error-responses)
5. [Data Models](#data-models)

---

## Overview

This document describes all REST API endpoints required for the BITCOT e-commerce platform. All APIs follow RESTful conventions and return JSON responses.

**Base URL:** `https://api.bitcot.com/v1` (or configured via environment variable)

**API Version:** v1

---

## Base URL & Authentication

### Base URL
```
https://api.bitcot.com/v1
```

### Authentication

Most endpoints require authentication using Bearer tokens. Include the access token in the Authorization header:

```
Authorization: Bearer {access_token}
```

**Token Source:** The access token is obtained from the login endpoint and should be stored in cookies or local storage.

**Public Endpoints** (No authentication required):
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /products`
- `GET /products/:sku`
- `GET /products/category/:category`
- `GET /categories`

---

## API Endpoints

### 1. Authentication APIs

#### 1.1 User Login
Authenticate a user and receive access tokens.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+1234567890",
      "avatar_path": "https://example.com/avatars/user.jpg",
      "role": "customer",
      "active_status": true,
      "platform": "web",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "last_login_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "AUTHENTICATION_FAILED"
}
```

---

#### 1.2 User Registration
Register a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Email already exists",
  "error": "EMAIL_EXISTS"
}
```

---

#### 1.3 Forgot Password
Request a password reset code.

**Endpoint:** `POST /auth/forgot-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset code has been sent to your email"
}
```

---

#### 1.4 Reset Password
Reset password using verification code.

**Endpoint:** `POST /auth/reset-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "code": "123456",
  "newPassword": "newSecurePassword123",
  "username": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Invalid or expired reset code",
  "error": "INVALID_RESET_CODE"
}
```

---

#### 1.5 Change Password
Change user's password (authenticated).

**Endpoint:** `POST /auth/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "error": "INVALID_PASSWORD"
}
```

---

#### 1.6 Get Current User Profile
Get authenticated user's profile information.

**Endpoint:** `GET /auth/profile`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "avatar_path": "https://example.com/avatars/user.jpg",
    "role": "customer",
    "active_status": true,
    "platform": "web",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "last_login_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 1.7 Update User Profile
Update authenticated user's profile information.

**Endpoint:** `PUT /auth/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "file_path": "https://example.com/avatars/new-avatar.jpg"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "avatar_path": "https://example.com/avatars/new-avatar.jpg"
  }
}
```

---

#### 1.8 Get Presigned URL for File Upload
Get presigned URL(s) for uploading files (e.g., profile pictures).

**Endpoint:** `POST /auth/upload/presigned-url`

**Authentication:** Required

**Request Body:**
```json
{
  "extensions": [".jpg", ".png"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Presigned URLs generated",
  "data": [
    {
      "file_path": "uploads/user_123/avatar_123456.jpg",
      "signedUrl": "https://s3.amazonaws.com/bucket/path?signature=..."
    },
    {
      "file_path": "uploads/user_123/avatar_123457.png",
      "signedUrl": "https://s3.amazonaws.com/bucket/path?signature=..."
    }
  ]
}
```

---

### 2. Home APIs

#### 2.1 Get Home Page Content
Return the aggregated content blocks required to render the home page.

**Endpoint:** `GET /home`

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "hero": [
      {
        "id": 1,
        "title": "WINTER COLLECTION",
        "subtitle": "Premium Winter Apparel",
        "description": "Discover our exclusive winter collection...",
        "image": "https://cdn.bitcot.com/hero/winter-collection.jpg",
        "alt": "Winter fashion collection",
        "cta": "Shop Winter Clothes",
        "ctaLink": "/shop?category=winter-clothes",
        "gradient": "from-blue-600/20 via-purple-600/20 to-transparent"
      }
      // Additional slides...
    ],
    "featuredCategories": [
      {
        "id": "cat_123",
        "name": "Outerwear",
        "slug": "outerwear",
        "image": "https://cdn.bitcot.com/categories/outerwear.jpg",
        "description": "Premium winter coats and jackets"
      }
    ],
    "collections": [
      {
        "title": "New Arrivals",
        "products": [
          {
            "sku": "PROD-001",
            "name": "Premium Winter Coat",
            "price": 249.99,
            "currency": "USD",
            "image": "https://cdn.bitcot.com/products/winter-coat.jpg",
            "badge": "New"
          }
        ]
      }
    ],
    "marketingHighlights": [
      {
        "id": "highlight-fast-shipping",
        "title": "Fast Delivery",
        "description": "Same-day dispatch on all orders before 2 PM"
      }
    ],
    "newsletter": {
      "title": "Stay in the Loop",
      "description": "Exclusive offers and early access to our latest drops."
    }
  }
}
```

---

#### 2.2 Get Hero Slides
Return only the hero slider configuration for the home page.

**Endpoint:** `GET /home/hero-slides`

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "WINTER COLLECTION",
      "subtitle": "Premium Winter Apparel",
      "description": "Discover our exclusive winter collection...",
      "image": "https://cdn.bitcot.com/hero/winter-collection.jpg",
      "alt": "Winter fashion collection",
      "cta": "Shop Winter Clothes",
      "ctaLink": "/shop?category=winter-clothes",
      "gradient": "from-blue-600/20 via-purple-600/20 to-transparent"
    }
    // Additional slides...
  ]
}
```

---

#### 2.3 Get Homepage Featured Products
Return curated product lists for the home page (e.g., featured, trending, seasonal).

**Endpoint:** `GET /home/featured-products`

**Authentication:** Not required

**Query Parameters:**  
- `section` (optional) - Filter by section key (e.g., `featured`, `new-arrivals`, `best-sellers`)
- `limit` (optional, default: 8)

**Example Request:**  
```
GET /home/featured-products?section=featured&limit=8
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "section": "featured",
    "title": "Featured Picks",
    "products": [
      {
        "sku": "PROD-001",
        "name": "Premium Winter Coat",
        "description": "Warm and stylish winter coat",
        "price": 249.99,
        "currency": "USD",
        "image": "https://cdn.bitcot.com/products/winter-coat.jpg",
        "category": "outerwear",
        "badge": "New",
        "rating": 4.8,
        "reviewCount": 54
      }
    ]
  }
}
```

---

#### 2.4 Get Homepage Content Blocks
Fetch reusable CMS-driven blocks used across the home page (feature banners, storytelling sections, etc.).

**Endpoint:** `GET /home/blocks`

**Authentication:** Not required

**Query Parameters:**  
- `type` (optional) - Filter by block type (e.g., `feature-banner`, `story`, `testimonial`)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "feature-fast-shipping",
      "type": "feature-banner",
      "title": "Fast Delivery",
      "description": "Same-day dispatch on all orders before 2 PM",
      "icon": "truck",
      "ctaText": "Learn More",
      "ctaLink": "/shipping"
    },
    {
      "id": "testimonial-1",
      "type": "testimonial",
      "quote": "BITCOT has the best winter collection!",
      "author": "Aayushi S.",
      "role": "Fashion Blogger"
    }
  ]
}
```

---

### 3. Product APIs

#### 3.1 Get All Products
Retrieve a paginated list of all products with optional filtering.

**Endpoint:** `GET /products`

**Authentication:** Not required

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `category` (optional) - Filter by category
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter
- `inStock` (optional, boolean) - Filter by stock availability
- `search` (optional) - Search term for product name/description
- `sortBy` (optional) - Sort field (price, name, createdAt)
- `sortOrder` (optional) - Sort order (asc, desc)

**Example Request:**
```
GET /products?page=1&limit=20&category=shoes&minPrice=50&maxPrice=200&sortBy=price&sortOrder=asc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "sku": "PROD-001",
        "name": "Premium Running Shoes",
        "description": "High-quality running shoes with advanced cushioning",
        "price": 129.99,
        "currency": "USD",
        "image": "https://example.com/images/shoes.jpg",
        "images": [
          "https://example.com/images/shoes-1.jpg",
          "https://example.com/images/shoes-2.jpg"
        ],
        "category": "shoes",
        "inStock": true,
        "stockQuantity": 50,
        "sizes": ["7", "8", "9", "10", "11"],
        "colors": [
          {
            "name": "Black",
            "hex": "#000000"
          },
          {
            "name": "White",
            "hex": "#FFFFFF"
          }
        ],
        "specifications": {
          "material": "Leather",
          "weight": "300g",
          "warranty": "1 year"
        },
        "rating": 4.5,
        "reviewCount": 120,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

#### 3.2 Get Product by SKU
Get detailed information about a specific product.

**Endpoint:** `GET /products/:sku`

**Authentication:** Not required

**URL Parameters:**
- `sku` (required) - Product SKU identifier

**Example Request:**
```
GET /products/PROD-001
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sku": "PROD-001",
    "name": "Premium Running Shoes",
    "description": "High-quality running shoes with advanced cushioning technology...",
    "price": 129.99,
    "currency": "USD",
    "image": "https://example.com/images/shoes.jpg",
    "images": [
      "https://example.com/images/shoes-1.jpg",
      "https://example.com/images/shoes-2.jpg",
      "https://example.com/images/shoes-3.jpg"
    ],
    "category": "shoes",
    "inStock": true,
    "stockQuantity": 50,
    "sizes": ["7", "8", "9", "10", "11"],
    "colors": [
      {
        "name": "Black",
        "hex": "#000000"
      },
      {
        "name": "White",
        "hex": "#FFFFFF"
      }
    ],
    "specifications": {
      "material": "Leather",
      "weight": "300g",
      "warranty": "1 year",
      "brand": "BITCOT"
    },
    "reviews": [
      {
        "id": "review_123",
        "userId": "user_456",
        "userName": "John Doe",
        "userAvatar": "https://example.com/avatars/john.jpg",
        "rating": 5,
        "comment": "Excellent shoes! Very comfortable.",
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ],
    "rating": 4.5,
    "reviewCount": 120,
    "relatedProducts": [
      {
        "sku": "PROD-002",
        "name": "Casual Sneakers",
        "price": 89.99,
        "image": "https://example.com/images/sneakers.jpg"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Product not found",
  "error": "PRODUCT_NOT_FOUND"
}
```

---

#### 3.3 Get Products by Category
Get products filtered by category.

**Endpoint:** `GET /products/category/:category`

**Authentication:** Not required

**URL Parameters:**
- `category` (required) - Category slug or name

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `sortBy` (optional)
- `sortOrder` (optional)

**Example Request:**
```
GET /products/category/shoes?page=1&limit=20
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "sku": "PROD-001",
        "name": "Premium Running Shoes",
        "price": 129.99,
        "image": "https://example.com/images/shoes.jpg",
        "category": "shoes",
        "inStock": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    },
    "category": {
      "id": "cat_123",
      "name": "Shoes",
      "slug": "shoes",
      "description": "Footwear collection"
    }
  }
}
```

---

#### 3.4 Get All Categories
Get list of all product categories.

**Endpoint:** `GET /categories`

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_123",
      "name": "Shoes",
      "slug": "shoes",
      "image": "https://example.com/categories/shoes.jpg",
      "description": "Footwear collection for all occasions",
      "productCount": 45
    },
    {
      "id": "cat_124",
      "name": "Clothing",
      "slug": "clothing",
      "image": "https://example.com/categories/clothing.jpg",
      "description": "Fashionable clothing items",
      "productCount": 120
    }
  ]
}
```

---

### 4. Cart APIs

#### 4.1 Get User Cart
Get the authenticated user's shopping cart.

**Endpoint:** `GET /cart`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "cart_123",
    "userId": "user_123",
    "items": [
      {
        "id": "cart_item_456",
        "product": {
          "sku": "PROD-001",
          "name": "Premium Running Shoes",
          "price": 129.99,
          "currency": "USD",
          "image": "https://example.com/images/shoes.jpg"
        },
        "quantity": 2,
        "selectedSize": "9",
        "selectedColor": "Black",
        "subtotal": 259.98
      }
    ],
    "subtotal": 259.98,
    "shipping": 0,
    "tax": 0,
    "total": 259.98,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 4.2 Add Item to Cart
Add a product to the user's shopping cart.

**Endpoint:** `POST /cart/items`

**Authentication:** Required

**Request Body:**
```json
{
  "productSku": "PROD-001",
  "quantity": 2,
  "selectedSize": "9",
  "selectedColor": "Black"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": "cart_123",
    "items": [
      {
        "id": "cart_item_456",
        "product": {
          "sku": "PROD-001",
          "name": "Premium Running Shoes",
          "price": 129.99,
          "image": "https://example.com/images/shoes.jpg"
        },
        "quantity": 2,
        "selectedSize": "9",
        "selectedColor": "Black",
        "subtotal": 259.98
      }
    ],
    "total": 259.98
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Product is out of stock",
  "error": "OUT_OF_STOCK"
}
```

---

#### 4.3 Update Cart Item Quantity
Update the quantity of an item in the cart.

**Endpoint:** `PUT /cart/items/:itemId`

**Authentication:** Required

**URL Parameters:**
- `itemId` (required) - Cart item ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "id": "cart_123",
    "items": [
      {
        "id": "cart_item_456",
        "quantity": 3,
        "subtotal": 389.97
      }
    ],
    "total": 389.97
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Cart item not found",
  "error": "CART_ITEM_NOT_FOUND"
}
```

---

#### 4.4 Remove Item from Cart
Remove an item from the cart.

**Endpoint:** `DELETE /cart/items/:itemId`

**Authentication:** Required

**URL Parameters:**
- `itemId` (required) - Cart item ID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "id": "cart_123",
    "items": [],
    "total": 0
  }
}
```

---

#### 4.5 Clear Cart
Remove all items from the cart.

**Endpoint:** `DELETE /cart`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

### 5. Order APIs

#### 5.1 Create Order
Create a new order from cart items.

**Endpoint:** `POST /orders`

**Authentication:** Required

**Request Body:**
```json
{
  "items": [
    {
      "productSku": "PROD-001",
      "quantity": 2,
      "selectedSize": "9",
      "selectedColor": "Black"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "billingAddress": {
    "name": "John Doe",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe",
  "couponCode": "SAVE10",
  "stripeSessionId": "cs_test_1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "order_789",
    "orderNumber": "ORD-2024-001",
    "userId": "user_123",
    "status": "pending",
    "items": [
      {
        "id": "order_item_101",
        "product": {
          "sku": "PROD-001",
          "name": "Premium Running Shoes",
          "price": 129.99,
          "image": "https://example.com/images/shoes.jpg"
        },
        "quantity": 2,
        "selectedSize": "9",
        "selectedColor": "Black",
        "price": 129.99,
        "subtotal": 259.98
      }
    ],
    "subtotal": 259.98,
    "shipping": 5.99,
    "tax": 21.60,
    "discount": 25.99,
    "total": 261.58,
    "shippingAddress": {
      "name": "John Doe",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA",
      "phone": "+1234567890"
    },
    "billingAddress": {
      "name": "John Doe",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "paymentMethod": "stripe",
    "paymentStatus": "pending",
    "deliveryStatus": "processing",
    "trackingNumber": null,
    "estimatedDelivery": "2024-01-25T00:00:00Z",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

#### 5.2 Get User Orders
Get list of orders for the authenticated user.

**Endpoint:** `GET /orders`

**Authentication:** Required

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional) - Filter by order status
- `sortBy` (optional) - Sort field (createdAt, total)
- `sortOrder` (optional) - Sort order (asc, desc)

**Example Request:**
```
GET /orders?page=1&limit=20&status=pending
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_789",
        "orderNumber": "ORD-2024-001",
        "date": "2024-01-15",
        "total": 261.58,
        "subtotal": 259.98,
        "shipping": 5.99,
        "tax": 21.60,
        "paymentStatus": "paid",
        "deliveryStatus": "shipped",
        "items": [
          {
            "id": "order_item_101",
            "product": {
              "name": "Premium Running Shoes",
              "image": "https://example.com/images/shoes.jpg"
            },
            "quantity": 2,
            "price": 129.99,
            "selectedSize": "9",
            "selectedColor": "Black"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

---

#### 5.3 Get Order Details
Get detailed information about a specific order.

**Endpoint:** `GET /orders/:orderId`

**Authentication:** Required

**URL Parameters:**
- `orderId` (required) - Order ID

**Example Request:**
```
GET /orders/order_789
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order_789",
    "orderNumber": "ORD-2024-001",
    "userId": "user_123",
    "date": "2024-01-15",
    "status": "shipped",
    "items": [
      {
        "id": "order_item_101",
        "product": {
          "sku": "PROD-001",
          "name": "Premium Running Shoes",
          "price": 129.99,
          "image": "https://example.com/images/shoes.jpg"
        },
        "quantity": 2,
        "selectedSize": "9",
        "selectedColor": "Black",
        "price": 129.99,
        "subtotal": 259.98
      }
    ],
    "subtotal": 259.98,
    "shipping": 5.99,
    "tax": 21.60,
    "discount": 25.99,
    "total": 261.58,
    "shippingAddress": {
      "name": "John Doe",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA",
      "phone": "+1234567890"
    },
    "billingAddress": {
      "name": "John Doe",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA"
    },
    "paymentMethod": "stripe",
    "paymentStatus": "paid",
    "deliveryStatus": "shipped",
    "trackingNumber": "TRACK123456789",
    "estimatedDelivery": "2024-01-25T00:00:00Z",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Order not found",
  "error": "ORDER_NOT_FOUND"
}
```

---

#### 5.4 Cancel Order
Cancel an existing order.

**Endpoint:** `POST /orders/:orderId/cancel`

**Authentication:** Required

**URL Parameters:**
- `orderId` (required) - Order ID

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "id": "order_789",
    "orderNumber": "ORD-2024-001",
    "status": "cancelled"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Order cannot be cancelled. It has already been shipped.",
  "error": "ORDER_CANNOT_BE_CANCELLED"
}
```

---

### 6. Checkout & Payment APIs

#### 6.1 Create Stripe Checkout Session
Create a Stripe checkout session for payment processing.

**Endpoint:** `POST /checkout/stripe`

**Authentication:** Required

**Request Body:**
```json
{
  "items": [
    {
      "name": "Premium Running Shoes",
      "description": "High-quality running shoes",
      "price": 129.99,
      "quantity": 2,
      "image": "https://example.com/images/shoes.jpg"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_1234567890"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "No items in cart",
  "error": "EMPTY_CART"
}
```

---

#### 6.2 Confirm Payment Success
Retrieve Stripe checkout session details after the customer returns to the success page.

**Endpoint:** `GET /checkout/success`

**Authentication:** Required

**Query Parameters:**  
- `sessionId` (required) - Stripe Checkout session ID returned by the frontend success page

**Example Request:**  
```
GET /checkout/success?sessionId=cs_test_1234567890
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "paymentStatus": "paid",
    "sessionId": "cs_test_1234567890",
    "amountTotal": 26158,
    "currency": "usd",
    "customerEmail": "john@example.com",
    "orderId": "order_789",
    "orderNumber": "ORD-2024-001"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Invalid or missing sessionId",
  "error": "INVALID_SESSION"
}
```

---

### 7. Contact APIs

#### 7.1 Submit Contact Form
Submit a contact form inquiry.

**Endpoint:** `POST /contact`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Product Inquiry",
  "message": "I would like to know more about your products."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Thank you for contacting us. We will get back to you soon."
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

---

### 8. Newsletter APIs

#### 8.1 Subscribe to Newsletter
Subscribe an email to the newsletter.

**Endpoint:** `POST /newsletter/subscribe`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Email already subscribed",
  "error": "ALREADY_SUBSCRIBED"
}
```

---

#### 8.2 Unsubscribe from Newsletter
Unsubscribe an email from the newsletter.

**Endpoint:** `POST /newsletter/unsubscribe`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "unsubscribe_token_123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

---

## Error Responses

All error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "errors": {
    "field": "Field-specific error message"
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Common Error Codes

- `AUTHENTICATION_FAILED` - Invalid credentials
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Request validation failed
- `EMAIL_EXISTS` - Email already registered
- `PRODUCT_NOT_FOUND` - Product does not exist
- `OUT_OF_STOCK` - Product is out of stock
- `CART_ITEM_NOT_FOUND` - Cart item does not exist
- `ORDER_NOT_FOUND` - Order does not exist
- `ORDER_CANNOT_BE_CANCELLED` - Order cannot be cancelled
- `EMPTY_CART` - Cart is empty
- `INVALID_RESET_CODE` - Invalid or expired reset code
- `ALREADY_SUBSCRIBED` - Email already subscribed

---

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  avatar_path: string
  role: "customer" | "admin"
  active_status: boolean
  platform: string
  created_at: string
  updated_at: string
  last_login_at: string
}
```

### Product
```typescript
interface Product {
  sku: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  images: string[]
  category: string
  inStock: boolean
  stockQuantity: number
  sizes: string[]
  colors: Array<{
    name: string
    hex: string
  }>
  specifications: Record<string, string>
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}
```

### Category
```typescript
interface Category {
  id: string
  name: string
  slug: string
  image: string
  description: string
  productCount: number
}
```

### Cart
```typescript
interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string
}

interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  subtotal: number
}
```

### Order
```typescript
interface Order {
  id: string
  orderNumber: string
  userId: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  deliveryStatus: "processing" | "shipped" | "delivered" | "cancelled"
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

interface OrderItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  price: number
  subtotal: number
}
```

### Address
```typescript
interface Address {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}
```

### Review
```typescript
interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
}
```

---

## Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Authentication endpoints:** 5 requests per minute per IP
- **Product endpoints:** 100 requests per minute per IP
- **Cart/Order endpoints:** 30 requests per minute per user
- **Other endpoints:** 60 requests per minute per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination using query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Pagination metadata is included in responses:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Versioning

The API uses URL versioning. Current version is `v1`:
```
https://api.bitcot.com/v1/products
```

Future versions will be available at:
```
https://api.bitcot.com/v2/products
```

---

## Webhooks

The API supports webhooks for order status updates and payment events. Webhook endpoints must be configured separately.

---

**Document Version:** 1.0  
**Last Updated:** January 2024  
**API Base URL:** `https://api.bitcot.com/v1`

