import Shop from "@/components/shop"
import * as API from "@/store/serverApiAction/serverApis";
import { ProductsResponse } from "@/types/products";
import { Category } from "@/types/categories";
import { API_PATH } from "@/utils/constant";

type Props = { searchParams: { category?: string } }

export default async function ShopPage({ searchParams }: Props) {
  
  const response : any = await API.get<ProductsResponse>(API_PATH.PRODUCTS);

  const res = await API.get<Category[]>(API_PATH.CATEGORIES);
  
  return <Shop products={response?.data?.products || []} 
    categories={res?.data || []} 
    totalCount={response?.data?.pagination?.total || 0} 
  />
}