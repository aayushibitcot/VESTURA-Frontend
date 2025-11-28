import Header from "@/components/header/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/home/hero-section"
import FeaturesBanner from "@/components/home/features-banner"
import CategoriesSection from "@/components/home/categories-section"
import NewsletterSection from "@/components/home/newsletter-section"
import AboutSection from "@/components/home/about-section"
import { Category } from "@/types/categories"

export default function Home({ categories }: { categories: Category[] }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories}/>
      <main className="flex-1">
        <HeroSection categories={categories} />
        <FeaturesBanner />
        <CategoriesSection categories={categories} />
        {/* <NewsletterSection /> */}
        <AboutSection />
      </main>
      <Footer categories={categories} />
    </div>
  )
}
