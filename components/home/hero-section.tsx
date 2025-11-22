"use client"

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Category } from "@/types/categories"
import { PRIVATE_PATH } from "@/utils/constant"

const gradients = [
  "from-blue-600/20 via-purple-600/20 to-transparent",
  "from-purple-600/20 via-pink-600/20 to-transparent",
  "from-green-600/20 via-emerald-600/20 to-transparent",
  "from-orange-600/20 via-red-600/20 to-transparent",
  "from-indigo-600/20 via-blue-600/20 to-transparent",
  "from-pink-600/20 via-rose-600/20 to-transparent",
]

export default function HeroSection({ categories }: { categories: Category[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  // Create slides from categories (take first 4 categories)
  const slides = useMemo(() => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) return []
    
    return categories.slice(0, 4).map((category, index) => ({
      id: category.id,
      title: category.name.toUpperCase(),
      subtitle: category.name,
      description: category.description || `Discover our exclusive ${category.name} collection. Premium quality and style for every occasion.`,
      image: category.image || "/placeholder.jpg",
      alt: `${category.name} collection`,
      cta: `Shop ${category.name}`,
      ctaLink: `${PRIVATE_PATH.SHOP}?category=${category.slug}`,
      gradient: gradients[index % gradients.length],
    }))
  }, [categories])

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) {
      setProgress(0)
      return
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 2
      })
    }, 100)

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setProgress(0)
    }, 5000)

    return () => { 
      clearInterval(progressInterval)
      clearInterval(slideInterval)
    }
  }, [isAutoPlaying, currentSlide, slides.length])

  const goToSlide = (index: number) => {
    if (slides.length > 0) {
      setCurrentSlide(index)
      setProgress(0)
    }
  }

  const nextSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setProgress(0)
    }
  }

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setProgress(0)
    }
  }

  // Show loading or empty state
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <section className="relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:pr-8">
              <div className="h-64 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="relative aspect-[4/3] lg:aspect-[16/11]">
              <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative overflow-hidden bg-background"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide]?.gradient || gradients[0]} transition-all duration-1000 pointer-events-none`}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 lg:pr-8 order-2 lg:order-1">
            <div
              key={`content-${currentSlide}`}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {slides[currentSlide]?.subtitle || ""}
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                  {slides[currentSlide]?.title || ""}
                </h1>
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {slides[currentSlide]?.description || ""}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                <Button asChild size="lg" className="px-8">
                  <Link href={slides[currentSlide]?.ctaLink || ""}>{slides[currentSlide]?.cta || "Shop Now"}</Link>
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"   
                    size="icon"
                    onClick={prevSlide}
                    className="h-11 w-11 rounded-full hover:scale-110 transition-transform bg-transparent"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    className="h-11 w-11 rounded-full hover:scale-110 transition-transform bg-transparent"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] lg:aspect-[16/11] order-1 lg:order-2">
            <div key={`img-${currentSlide}`} className="absolute inset-0 animate-in fade-in zoom-in-95 duration-1000">
              <img
                src={slides[currentSlide]?.image || "/placeholder.svg?height=800&width=800"}
                alt={slides[currentSlide]?.alt || "Product collection"}
                className="w-full h-full object-contain rounded-2xl shadow-2xl bg-muted/30"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className="group relative flex flex-col items-center gap-2 transition-all"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`text-xs font-semibold transition-all ${
                  currentSlide === index ? "text-foreground scale-110" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {String(slide.id).padStart(2, "0")}
              </span>
              <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-primary transition-all duration-100 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ width: currentSlide === index ? `${progress}%` : "0%" }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
