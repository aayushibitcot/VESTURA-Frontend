import type { Product } from "@/types/products"
import ProductCard from "@/components/ui/product-card"
import { SectionHeading } from "../ui/section-heading"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="border-t border-border py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Related Products" align="left" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
