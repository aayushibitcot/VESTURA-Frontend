import Shop from "@/components/shop"
import * as API from "@/store/serverApiAction/serverApis";
import { ProductsResponse } from "@/types/products";
import { Category } from "@/types/categories";

export default async function ShopPage() {
  // Fetch products on the server side
  const response = await API.get<ProductsResponse>('/api/products');
  const categoriesResponse = await API.get<Category[]>('/api/categories');
  return <Shop products={response.data?.products || []} pagination={response.data?.pagination || undefined} categories={categoriesResponse.data || []} />
}
