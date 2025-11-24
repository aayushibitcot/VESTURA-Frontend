import Home from "@/components/home"
import * as API from "@/store/serverApiAction/serverApis";
import { Category } from "@/types/categories";
import { API_PATH } from "@/utils/constant";

export default async function HomePage() {
  const response = await API.get<Category[]>(API_PATH.CATEGORIES);
  const categories = response.data || [];
  return <Home categories={categories} />
}
