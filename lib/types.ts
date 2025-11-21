export interface Product {
  sku: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  images?: string[] // Array of product images
  category: string
  inStock: boolean
  stockQuantity?: number // Stock quantity
  sizes: string[] // Added sizes array for clothing/shoe size options
  colors: string[] | { name: string; hex: string }[] // Colors can be string array from API or object array for UI
  specifications?: Record<string, any> // Product specifications
  rating?: number // Product rating
  reviewCount?: number // Number of reviews
  createdAt?: string // Creation timestamp
  updatedAt?: string // Last update timestamp
}

export interface ProductsResponse {
  products: Product[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Category {
  id: string
  name: string
  image: string
  slug: string
  description?: string
  productCount?: number
}

export interface SignupFormType {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
}

export interface SignUpRespose {
  message: string
  success: boolean
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignInResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string
}

export interface SingleErrorResponse {
  message: string; 
  code: string;    
  path: string[];  
  extensions: {
    code: string;  
    stacktrace: string[]; 
  };
  success?: boolean
}

export interface ErrorResponse {
  errors: SingleErrorResponse[];
}