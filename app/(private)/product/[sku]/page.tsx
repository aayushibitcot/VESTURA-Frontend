import ProductComponent from "@/components/product"
import * as API from "@/store/serverApiAction/serverApis"
import { Product } from "@/types/products"
import { API_PATH } from "@/utils/constant"

interface ProductPageProps {
  params: Promise<{ sku: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { sku } = await params

  const response = await API.get<Product>(`${API_PATH.PRODUCTS}/${sku}`)

  const product = response?.data as Product

  const normalizedProduct = {
    ...product,
    sizes: product.sizes || [],
    colors: product.colors || [],
  }

  return <ProductComponent product={normalizedProduct as Product} />
}
