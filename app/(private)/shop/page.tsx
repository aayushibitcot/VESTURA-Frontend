import Shop from "@/components/shop"
import * as API from "@/store/serverApiAction/serverApis";
import { ProductsResponse } from "@/types/products";
import { Category } from "@/types/categories";
import { API_PATH } from "@/utils/constant";

type Props = { searchParams: Promise<{ category?: string }> }

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  
  // Fetch categories
  const res = await API.get<Category[]>(API_PATH.CATEGORIES);
  const categories = res.success && res.data ? (res.data as Category[]) : [];
  
  // Fetch products based on category
  let products: ProductsResponse;
  if (category) {
    // Fetch products by category
    const categoryResponse = await API.get<ProductsResponse>(
      `${API_PATH.PRODUCTS_BY_CATEGORY}/${encodeURIComponent(category)}`
    );
    products = categoryResponse.success && categoryResponse.data 
      ? (categoryResponse.data as ProductsResponse)
      : { products: [], pagination: undefined };
  } else {
    // Fetch all products
    const response = await API.get<ProductsResponse>(API_PATH.PRODUCTS);
    products = response.success && response.data 
      ? (response.data as ProductsResponse)
      : { products: [], pagination: undefined };
  }
  
  const productsList = products.products || [];
  const totalCount = products.pagination?.total || 0;
  
  return <Shop products={productsList} 
    categories={categories} 
    totalCount={totalCount} 
  />
}