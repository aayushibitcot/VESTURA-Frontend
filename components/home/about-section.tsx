export default function AboutSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-balance">
                STYLE REDEFINED.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl max-w-xl">
                Premium fashion and contemporary styles designed to elevate your wardrobe and express your unique
                personality.
              </p>
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">Quality Fashion</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    100% authentic clothing from premium brands with satisfaction guaranteed.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Express shipping available. Get your fashion delivered within 3-5 business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">Style Advice</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dedicated fashion consultants ready to assist with sizing and styling recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/modern-fashion-clothing-collection-display-premium.jpg"
                alt="Modern fashion collection display"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-8 -right-8 w-2/3 h-2/3 bg-accent/10 rounded-lg -z-10 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
