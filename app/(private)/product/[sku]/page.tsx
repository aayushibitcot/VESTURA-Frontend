import ProductComponent from "@/components/product";
import { Product } from "@/lib/types";

interface ProductPageProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
  
  return <ProductComponent product={product} relatedProducts={relatedProducts} />
}
