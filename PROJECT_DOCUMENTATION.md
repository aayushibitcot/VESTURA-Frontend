# BITCOT E-Commerce Project - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Modules & Submodules](#modules--submodules)
3. [API Documentation](#api-documentation)
4. [Required APIs & Responses](#required-apis--responses)
5. [Data Structures](#data-structures)

---

## 🎯 Project Overview

**Project Name:** BITCOT  
**Type:** E-Commerce Platform  
**Tech Stack:** Next.js, React, TypeScript, GraphQL, Stripe  
**API Base URL:** Configured via `NEXT_PUBLIC_GRAPHQL_API_URL` environment variable

---

## 📦 Modules & Submodules

### 1. **Authentication Module** (`/app/login`, `/components/auth`)
   - **Submodules:**
     - Login Form
     - Sign Up Form
     - Forgot Password
     - Reset Password
     - Change Password
     - User Profile Update

### 2. **Home Module** (`/app/page.tsx`, `/components/home`)
   - **Submodules:**
     - Hero Section
     - Categories Section
     - Features Banner
     - About Section
     - Newsletter Section

### 3. **Shop Module** (`/app/shop`, `/components/shop`)
   - **Submodules:**
     - Product Grid
     - Product Card
     - Product Filtering
     - Product Search

### 4. **Product Module** (`/app/product/[sku]`, `/components/product`)
   - **Submodules:**
     - Product Details
     - Related Products
     - Product Image Gallery
     - Size/Color Selection
     - Add to Cart

### 5. **Cart Module** (`/app/cart`, `/components/cart`)
   - **Submodules:**
     - Cart Items Display       
     - Quantity Update
     - Item Removal
     - Cart Summary
     - Proceed to Checkout

### 6. **Checkout Module** (`/app/checkout`, `/components/checkout`)
   - **Submodules:**
     - Billing Information Form
     - Shipping Address Form
     - Payment Method Form
     - Order Summary
     - Coupon Code Application
     - Stripe Payment Integration

### 7. **Orders Module** (`/app/my-orders`, `/components/orders`)
   - **Submodules:**
     - Orders List
     - Order Details
     - Order Status Tracking
     - Order History

### 8. **Contact Module** (`/app/contact`, `/components/contact`)
   - **Submodules:**
     - Contact Form
     - Contact Information Display

### 9. **Success Module** (`/app/success`, `/app/order-success`)
   - **Submodules:**
     - Payment Success Page
     - Order Confirmation Page

---

## 🔌 API Documentation

### **API Configuration**
- **GraphQL Endpoint:** `NEXT_PUBLIC_GRAPHQL_API_URL` (from environment)
- **Stripe API:** Integrated via Next.js API route
- **Authentication:** Bearer token via cookies (`access_token`)

---

## 📡 Required APIs & Responses

### **1. Authentication APIs**

#### **1.1 Sign In (Login)**
- **Type:** GraphQL Mutation
- **Mutation Name:** `signIn`
- **File:** `utils/graphql/auth/query.ts` → `SIGN_IN_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `signInAction`

**Request:**
```graphql
mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    accessToken
    message
    refreshToken
    success
    token
    user {
      active_status
      avatar_path
      created_at
      email
      first_name
      id
      last_login_at
      last_name
      phone
      platform
      role
      updated_at
    }
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    email: string
    password: string
  }
}
```

**Response Structure:**
```typescript
{
  signIn: {
    accessToken: string
    refreshToken: string
    token: string
    message: string
    success: boolean
    user: {
      id: string
      email: string
      first_name: string
      last_name: string
      phone: string
      avatar_path: string
      role: string
      active_status: boolean
      platform: string
      created_at: string
      updated_at: string
      last_login_at: string
    }
  }
}
```

---

#### **1.2 Sign Up (Registration)**
- **Type:** GraphQL Mutation
- **Mutation Name:** `signUp`
- **File:** `utils/graphql/auth/query.ts` → `SIGN_UP_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `signUpAction`

**Request:**
```graphql
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    message
    success
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    email: string
    password: string
    firstName: string
    lastName: string
  }
}
```

**Response Structure:**
```typescript
{
  signUp: {
    success: boolean
    message: string
  }
}
```

---

#### **1.3 Forgot Password**
- **Type:** GraphQL Mutation
- **Mutation Name:** `forgetPassword`
- **File:** `utils/graphql/auth/query.ts` → `FORGOT_PASSWORD_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `forgotPasswordAction`

**Request:**
```graphql
mutation ForgetPassword($username: String!) {
  forgetPassword(username: $username) {
    message
    success
  }
}
```

**Request Variables:**
```typescript
{
  username: string
}
```

**Response Structure:**
```typescript
{
  forgetPassword: {
    success: boolean
    message: string
  }
}
```

---

#### **1.4 Reset Password**
- **Type:** GraphQL Mutation
- **Mutation Name:** `resetPassword`
- **File:** `utils/graphql/auth/query.ts` → `RESET_PASSWORD_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `resetPasswordAction`

**Request:**
```graphql
mutation ResetPassword($code: String!, $newPassword: String!, $username: String!) {
  resetPassword(code: $code, newPassword: $newPassword, username: $username) {
    success
    message
  }
}
```

**Request Variables:**
```typescript
{
  code: string
  newPassword: string
  username: string
}
```

**Response Structure:**
```typescript
{
  resetPassword: {
    success: boolean
    message: string
  }
}
```

---

#### **1.5 Change Password**
- **Type:** GraphQL Mutation
- **Mutation Name:** `ChangePassword`
- **File:** `utils/graphql/auth/query.ts` → `CHANGE_PASSWORD_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `changePasswordAction`

**Request:**
```graphql
mutation ChangePassword($input: ChangePasswordInput!) {
  ChangePassword(input: $input) {
    message
    success
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    currentPassword: string
    newPassword: string
    confirmPassword?: string
  }
}
```

**Response Structure:**
```typescript
{
  ChangePassword: {
    success: boolean
    message: string
  }
}
```

---

#### **1.6 Update User Profile**
- **Type:** GraphQL Mutation
- **Mutation Name:** `updateUser`
- **File:** `utils/graphql/auth/query.ts` → `UPDATE_USER_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `updateUserAction`

**Request:**
```graphql
mutation UpdateUser($updateUserId: String!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $updateUserId, updateUserInput: $updateUserInput) {
    message
    success
    user {
      avatar_path
      first_name
      last_name
      phone
    }
  }
}
```

**Request Variables:**
```typescript
{
  updateUserId: string
  updateUserInput: {
    first_name: string
    last_name: string
    phone: string
    file_path?: string  // Optional, for avatar
  }
}
```

**Response Structure:**
```typescript
{
  updateUser: {
    success: boolean
    message: string
    user: {
      first_name: string
      last_name: string
      phone: string
      avatar_path: string
    }
  }
}
```

---

#### **1.7 Get Presigned URL (File Upload)**
- **Type:** GraphQL Mutation
- **Mutation Name:** `getPresignedUrlForArray`
- **File:** `utils/graphql/auth/query.ts` → `GET_PRESIGNED_URL_MUTATION`
- **Action:** `utils/graphql/auth/action.ts` → `getPresignedUrlAction`

**Request:**
```graphql
mutation GetPresignedUrlForArray($input: PresignedUrlArrayInput!) {
  getPresignedUrlForArray(input: $input) {
    data {
      file_path
      signedUrl
    }
    message
    success
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    extensions: string[]  // e.g., [".jpg", ".png"]
  }
}
```

**Response Structure:**
```typescript
{
  getPresignedUrlForArray: {
    success: boolean
    message: string
    data: Array<{
      file_path: string
      signedUrl: string
    }>
  }
}
```

---

### **2. Product APIs** (Currently using static data - APIs needed)

#### **2.1 Get All Products**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Static data in `lib/products.ts`
- **Required Query:**
```graphql
query GetProducts($filters: ProductFilters, $pagination: PaginationInput) {
  products(filters: $filters, pagination: $pagination) {
    data {
      sku
      name
      description
      price
      currency
      image
      category
      inStock
      sizes
      colors {
        name
        hex
      }
    }
    total
    page
    limit
  }
}
```

**Response Structure:**
```typescript
{
  products: {
    data: Product[]
    total: number
    page: number
    limit: number
  }
}
```

---

#### **2.2 Get Product by SKU**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Static function `getProductBySlug()` in `lib/products.ts`
- **Required Query:**
```graphql
query GetProductBySku($sku: String!) {
  product(sku: $sku) {
    sku
    name
    description
    price
    currency
    image
    category
    inStock
    sizes
    colors {
      name
      hex
    }
    images
    specifications
    reviews {
      id
      rating
      comment
      user {
        name
        avatar
      }
      createdAt
    }
  }
}
```

**Response Structure:**
```typescript
{
  product: Product & {
    images: string[]
    specifications: Record<string, string>
    reviews: Review[]
  }
}
```

---

#### **2.3 Get Products by Category**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Static function `getProductsByCategory()` in `lib/products.ts`
- **Required Query:**
```graphql
query GetProductsByCategory($category: String!, $pagination: PaginationInput) {
  productsByCategory(category: $category, pagination: $pagination) {
    data {
      sku
      name
      description
      price
      currency
      image
      category
      inStock
      sizes
      colors {
        name
        hex
      }
    }
    total
  }
}
```

**Response Structure:**
```typescript
{
  productsByCategory: {
    data: Product[]
    total: number
  }
}
```

---

#### **2.4 Get Categories**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Static data in `lib/products.ts`
- **Required Query:**
```graphql
query GetCategories {
  categories {
    id
    name
    image
    slug
    description
    productCount
  }
}
```

**Response Structure:**
```typescript
{
  categories: Array<{
    id: string
    name: string
    image: string
    slug: string
    description: string
    productCount: number
  }>
}
```

---

### **3. Cart APIs** (Currently client-side only - APIs needed)

#### **3.1 Get Cart**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Client-side state in `lib/cart-context.tsx`
- **Required Query:**
```graphql
query GetCart {
  cart {
    id
    items {
      id
      product {
        sku
        name
        price
        image
      }
      quantity
      selectedSize
      selectedColor
    }
    total
    subtotal
    createdAt
    updatedAt
  }
}
```

**Response Structure:**
```typescript
{
  cart: {
    id: string
    items: CartItem[]
    total: number
    subtotal: number
    createdAt: string
    updatedAt: string
  }
}
```

---

#### **3.2 Add to Cart**
- **Type:** GraphQL Mutation (To be implemented)
- **Current Implementation:** Client-side state update
- **Required Mutation:**
```graphql
mutation AddToCart($input: AddToCartInput!) {
  addToCart(input: $input) {
    success
    message
    cart {
      id
      items {
        id
        product {
          sku
          name
          price
          image
        }
        quantity
        selectedSize
        selectedColor
      }
      total
    }
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    productSku: string
    quantity: number
    selectedSize?: string
    selectedColor?: string
  }
}
```

**Response Structure:**
```typescript
{
  addToCart: {
    success: boolean
    message: string
    cart: Cart
  }
}
```

---

#### **3.3 Update Cart Item Quantity**
- **Type:** GraphQL Mutation (To be implemented)
- **Required Mutation:**
```graphql
mutation UpdateCartItem($cartItemId: String!, $quantity: Int!) {
  updateCartItem(cartItemId: $cartItemId, quantity: $quantity) {
    success
    message
    cart {
      id
      items {
        id
        quantity
      }
      total
    }
  }
}
```

**Response Structure:**
```typescript
{
  updateCartItem: {
    success: boolean
    message: string
    cart: Cart
  }
}
```

---

#### **3.4 Remove from Cart**
- **Type:** GraphQL Mutation (To be implemented)
- **Required Mutation:**
```graphql
mutation RemoveFromCart($cartItemId: String!) {
  removeFromCart(cartItemId: $cartItemId) {
    success
    message
    cart {
      id
      items {
        id
      }
      total
    }
  }
}
```

**Response Structure:**
```typescript
{
  removeFromCart: {
    success: boolean
    message: string
    cart: Cart
  }
}
```

---

#### **3.5 Clear Cart**
- **Type:** GraphQL Mutation (To be implemented)
- **Required Mutation:**
```graphql
mutation ClearCart {
  clearCart {
    success
    message
  }
}
```

**Response Structure:**
```typescript
{
  clearCart: {
    success: boolean
    message: string
  }
}
```

---

### **4. Checkout & Payment APIs**

#### **4.1 Create Stripe Checkout Session**
- **Type:** REST API (Next.js API Route)
- **Endpoint:** `POST /api/checkout`
- **File:** `app/api/checkout/route.ts`

**Request:**
```typescript
POST /api/checkout
Content-Type: application/json

{
  items: Array<{
    name: string
    description?: string
    price: number
    quantity: number
    image?: string
  }>
}
```

**Response:**
```typescript
{
  url: string  // Stripe checkout session URL
}
```

**Error Response:**
```typescript
{
  error: string
}
```

---

#### **4.2 Create Order**
- **Type:** GraphQL Mutation (To be implemented)
- **Required Mutation:**
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    success
    message
    order {
      id
      orderNumber
      status
      total
      items {
        id
        product {
          sku
          name
          price
          image
        }
        quantity
        selectedSize
        selectedColor
      }
      shippingAddress {
        name
        address
        city
        state
        zip
        country
        phone
      }
      billingAddress {
        name
        address
        city
        state
        zip
        country
      }
      paymentStatus
      deliveryStatus
      createdAt
    }
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    items: Array<{
      productSku: string
      quantity: number
      selectedSize?: string
      selectedColor?: string
    }>
    shippingAddress: {
      name: string
      address: string
      city: string
      state: string
      zip: string
      country: string
      phone: string
    }
    billingAddress: {
      name: string
      address: string
      city: string
      state: string
      zip: string
      country: string
    }
    paymentMethod: string
    couponCode?: string
    stripeSessionId?: string
  }
}
```

**Response Structure:**
```typescript
{
  createOrder: {
    success: boolean
    message: string
    order: Order
  }
}
```

---

### **5. Orders APIs** (Currently using static data - APIs needed)

#### **5.1 Get User Orders**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Static data in `components/orders/index.tsx`
- **Required Query:**
```graphql
query GetUserOrders($pagination: PaginationInput) {
  userOrders(pagination: $pagination) {
    data {
      id
      orderNumber
      date
      total
      subtotal
      shipping
      tax
      paymentStatus
      deliveryStatus
      items {
        id
        product {
          name
          image
        }
        quantity
        price
        selectedSize
        selectedColor
      }
    }
    total
    page
    limit
  }
}
```

**Response Structure:**
```typescript
{
  userOrders: {
    data: Order[]
    total: number
    page: number
    limit: number
  }
}
```

---

#### **5.2 Get Order Details**
- **Type:** GraphQL Query (To be implemented)
- **Current Implementation:** Static data in `components/orders/order-details.tsx`
- **Required Query:**
```graphql
query GetOrderDetails($orderId: String!) {
  order(id: $orderId) {
    id
    orderNumber
    date
    total
    subtotal
    shipping
    tax
    paymentStatus
    deliveryStatus
    shippingAddress {
      name
      address
      city
      state
      zip
      country
      phone
    }
    billingAddress {
      name
      address
      city
      state
      zip
      country
    }
    items {
      id
      product {
        sku
        name
        image
        price
      }
      quantity
      selectedSize
      selectedColor
      price
    }
    paymentMethod
    trackingNumber
    estimatedDelivery
    createdAt
    updatedAt
  }
}
```

**Response Structure:**
```typescript
{
  order: Order & {
    trackingNumber?: string
    estimatedDelivery?: string
  }
}
```

---

#### **5.3 Cancel Order**
- **Type:** GraphQL Mutation (To be implemented)
- **Required Mutation:**
```graphql
mutation CancelOrder($orderId: String!) {
  cancelOrder(orderId: $orderId) {
    success
    message
    order {
      id
      status
    }
  }
}
```

**Response Structure:**
```typescript
{
  cancelOrder: {
    success: boolean
    message: string
    order: {
      id: string
      status: string
    }
  }
}
```

---

### **6. Contact APIs** (To be implemented)

#### **6.1 Submit Contact Form**
- **Type:** GraphQL Mutation (To be implemented)
- **Current Implementation:** Form only, no API call
- **Required Mutation:**
```graphql
mutation SubmitContactForm($input: ContactFormInput!) {
  submitContactForm(input: $input) {
    success
    message
  }
}
```

**Request Variables:**
```typescript
{
  input: {
    name: string
    email: string
    subject: string
    message: string
  }
}
```

**Response Structure:**
```typescript
{
  submitContactForm: {
    success: boolean
    message: string
  }
}
```

---

### **7. Newsletter APIs** (To be implemented)

#### **7.1 Subscribe to Newsletter**
- **Type:** GraphQL Mutation (To be implemented)
- **Required Mutation:**
```graphql
mutation SubscribeNewsletter($email: String!) {
  subscribeNewsletter(email: $email) {
    success
    message
  }
}
```

**Response Structure:**
```typescript
{
  subscribeNewsletter: {
    success: boolean
    message: string
  }
}
```

---

## 📊 Data Structures

### **Product Type:**
```typescript
interface Product {
  sku: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  category: string
  inStock: boolean
  sizes: string[]
  colors: { name: string; hex: string }[]
}
```

### **Category Type:**
```typescript
interface Category {
  id: string
  name: string
  image: string
  slug: string
}
```

### **Cart Item Type:**
```typescript
interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}
```

### **Order Type:**
```typescript
interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded"
  deliveryStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
}
```

### **Order Item Type:**
```typescript
interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
  selectedSize?: string
  selectedColor?: string
}
```

### **Address Type:**
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

### **User Type:**
```typescript
interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  avatar_path: string
  role: string
  active_status: boolean
  platform: string
  created_at: string
  updated_at: string
  last_login_at: string
}
```

---

## ✅ Summary of Required APIs

### **Currently Implemented:**
1. ✅ Sign In (Login)
2. ✅ Sign Up (Registration)
3. ✅ Forgot Password
4. ✅ Reset Password
5. ✅ Change Password
6. ✅ Update User Profile
7. ✅ Get Presigned URL (File Upload)
8. ✅ Stripe Checkout Session Creation

### **To Be Implemented:**
1. ❌ Get All Products
2. ❌ Get Product by SKU
3. ❌ Get Products by Category
4. ❌ Get Categories
5. ❌ Get Cart
6. ❌ Add to Cart
7. ❌ Update Cart Item
8. ❌ Remove from Cart
9. ❌ Clear Cart
10. ❌ Create Order
11. ❌ Get User Orders
12. ❌ Get Order Details
13. ❌ Cancel Order
14. ❌ Submit Contact Form
15. ❌ Subscribe to Newsletter

---

## 🔐 Authentication

All GraphQL queries/mutations (except public ones like Sign In, Sign Up) require:
- **Header:** `Authorization: Bearer {access_token}`
- **Token Source:** Cookie named `access_token`

---

## 📝 Notes

1. **Current State:** Most product, cart, and order functionality uses static/mock data
2. **Payment:** Stripe integration is implemented via Next.js API route
3. **File Upload:** Uses presigned URL pattern for S3/cloud storage
4. **Error Handling:** GraphQL errors follow standard GraphQL error format
5. **Pagination:** Should be implemented for list queries (products, orders)

---

## 🚀 Next Steps

1. Implement Product APIs (Get Products, Get Product by SKU, etc.)
2. Implement Cart APIs (server-side cart management)
3. Implement Order APIs (Create Order, Get Orders, Get Order Details)
4. Implement Contact Form API
5. Implement Newsletter Subscription API
6. Add pagination support to all list queries
7. Add search/filter functionality for products
8. Add product reviews/ratings API

---

**Document Generated:** $(date)  
**Project:** BITCOT E-Commerce Platform  
**Version:** 1.0


