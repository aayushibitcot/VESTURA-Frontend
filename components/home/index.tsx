import Header from "@/components/header/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/home/hero-section"
import FeaturesBanner from "@/components/home/features-banner"
import CategoriesSection from "@/components/home/categories-section"
import NewsletterSection from "@/components/home/newsletter-section"
import AboutSection from "@/components/home/about-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesBanner />
        <CategoriesSection />
        <NewsletterSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
