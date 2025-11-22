import Categories from "./categories-section"
import { Category } from "@/types/categories"

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <>
      <Categories categories={categories} /> 
    </>
  )
}
