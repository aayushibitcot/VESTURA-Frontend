import ProductGrid from "@/components/shop/product-grid"
import { Product } from "@/types/products"
import { Category } from "@/types/categories"

interface ShopProps {
  products: Product[];
  categories: Category[];
  totalCount: number;
}

export default function Shop({ products, categories, totalCount }: ShopProps) { 
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductGrid 
        products={products} 
        categories={categories}
        totalProducts={totalCount}
      />
    </div>
  )
}

