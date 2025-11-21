import type { Category } from "./types"

/**
 * Utility function to get a category by slug
 * This is still useful for client-side category lookups
 */
export function getCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
