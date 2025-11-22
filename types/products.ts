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