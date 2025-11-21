"use client";

import { SectionHeading } from '@/components/ui/section-heading'
import Link from 'next/link'
import { useCategories } from '@/hooks/use-categories'
import { Skeleton } from '@/components/ui/skeleton'

export default function Categories() {
  const { categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Popular Categories"
            description="Explore our curated collection of premium fashion and apparel"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] lg:h-[400px]" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  // Take first 4 categories, with first one being featured (larger)
  const featuredCategory = categories[0]
  const otherCategories = categories.slice(1, 4)

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Popular Categories"
          description="Explore our curated collection of premium fashion and apparel"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Featured Category - Large card */}
          {featuredCategory && (
            <Link href={`/shop?category=${featuredCategory.slug}`} className="group lg:col-span-2 lg:row-span-2">
              <div className="relative h-full min-h-[400px] lg:min-h-[600px] overflow-hidden rounded-lg">
                <img
                  src={featuredCategory.image || "/placeholder.jpg"}
                  alt={featuredCategory.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-3">
                    NEW ARRIVALS
                  </div>
                  <h3 className="text-white font-serif text-3xl lg:text-4xl mb-2">{featuredCategory.name}</h3>
                  <p className="text-white/90 text-sm mb-4">
                    {featuredCategory.description || `Explore our ${featuredCategory.name} collection`}
                  </p>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-sm font-medium">Shop Collection</span>
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Other Categories */}
          {otherCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className={`group ${index === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-lg">
                <img
                  src={category.image || "/placeholder.jpg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {index === 1 && (
                    <div className="inline-block px-2 py-1 bg-accent/90 backdrop-blur-sm rounded text-accent-foreground text-xs font-medium mb-2">
                      BESTSELLER
                    </div>
                  )}
                  <h3 className="text-white font-serif text-2xl lg:text-3xl mb-2">{category.name}</h3>
                  <p className="text-white/90 text-sm mb-3">
                    {category.description || `Discover our ${category.name} collection`}
                  </p>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-sm font-medium">
                      {index === 0 ? 'Discover More' : index === 1 ? 'Explore' : 'Shop Now'}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}