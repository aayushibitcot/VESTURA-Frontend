import Shop from "@/components/shop"
import * as API from "@/store/serverApiAction/serverApis";
import { ProductsResponse } from "@/types/products";
import { Category } from "@/types/categories";
import { API_PATH } from "@/utils/constant";

type Props = { searchParams: Promise<{ category?: string }> }

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  
  const response = await API.get<ProductsResponse>(API_PATH.PRODUCTS);
  const res = await API.get<Category[]>(API_PATH.CATEGORIES);
  const productsData = response.success && response.data 
    ? (response.data as ProductsResponse)
    : { products: [], pagination: undefined };
  
  const products = productsData.products || [];
  const totalCount = productsData.pagination?.total || 0;
  const categories = res.success && res.data ? (res.data as Category[]) : [];
  
  return <Shop products={products} 
    categories={categories} 
    totalCount={totalCount} 
  />
}