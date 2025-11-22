export interface Category {
    id: string
    name: string
    image: string
    slug: string
    description?: string
    productCount?: number
}

export interface CategoriesResponse {
    categories: Category[]
    pagination?: {
        page: number
        limit: number
        total?: number
        totalPages?: number
    }
}