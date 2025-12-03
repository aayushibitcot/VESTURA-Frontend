import ProductDetails from "@/components/product/product-details"
import RelatedProducts from "@/components/product/related-products"
import type { Product } from "@/types/products"

interface productComponentProps {
  product: Product
  relatedProducts?: Product[]
}

const productComponent = ({ product, relatedProducts = [] }: productComponentProps) => { 
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ProductDetails product={product} />
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </main>
    </div>
  )
}
export default productComponent;