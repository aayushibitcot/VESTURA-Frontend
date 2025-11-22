import Home from "@/components/home"
import * as API from "@/store/serverApiAction/serverApis";
import { Category } from "@/types/categories";

export default async function HomePage() {
  const response = await API.get<Category[]>('/api/categories');
  const categories = response.data || [];
  return <Home categories={categories} />
}
