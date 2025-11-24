export interface Product {
    sku: string
    name: string
    description: string
    price: number
    currency: string
    image: string
    images?: string[] 
    category: string
    inStock: boolean
    stockQuantity?: number 
    sizes?: string[] 
    colors?: string[] | { name: string; hex: string }[] 
    specifications?: Record<string, any> 
    rating?: number 
    reviewCount?: number 
    createdAt?: string 
    updatedAt?: string 
    relatedProducts?: Product[] 
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