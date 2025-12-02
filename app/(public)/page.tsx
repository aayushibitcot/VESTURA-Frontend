import Home from "@/components/home"
import { CONTENTFUL_URL } from "@/utils/constant";

export default async function HomePage() {
  const res = await fetch(CONTENTFUL_URL + `&content_type=categoryTable&include=2`);
  const data = await res.json();
  const categories = data;
  return <Home categories={categories} />
}
