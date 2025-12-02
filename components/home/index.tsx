"use client"

import Header from "@/components/header/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/home/hero-section"
import FeaturesBanner from "@/components/home/features-banner"
import CategoriesSection from "@/components/home/categories-section"
import NewsletterSection from "@/components/home/newsletter-section"
import AboutSection from "@/components/home/about-section"
import { Category } from "@/types/categories"
import { useEffect, useState } from "react"
import { formatContentfulResponse } from "@/utils/contentful-parser"

export default function Home({ categories }: { categories: Category[] }) {

  const [formattedCategories, setFormattedCategories] = useState<Category[]>([])
  useEffect(() => {
    const formattedCategories = formatContentfulResponse(categories)
    setFormattedCategories(formattedCategories)
  }, [categories])

  
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={formattedCategories}/>
      <main className="flex-1">
        <HeroSection categories={formattedCategories} />
        <FeaturesBanner />
        <CategoriesSection categories={formattedCategories} />
        {/* <NewsletterSection /> */}
        <AboutSection />
      </main>
      <Footer categories={formattedCategories} />
    </div>
  )
}
