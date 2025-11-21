"use client";

import Link from "next/link"
import { useCategories } from "@/hooks/use-categories"

export default function Footer() {
  const { categories } = useCategories()

  return (
    <footer className="bg-foreground text-background py-12 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-serif text-xl mb-4">BITCOT</h3>
            <p className="text-sm text-background/70 leading-relaxed">
              Premium fashion and apparel for your modern lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wide mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-background/70 hover:text-background transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-background/70 hover:text-background transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-background/70 hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wide mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/shop?category=${category.slug}`}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-background/50">Loading categories...</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wide mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Email: info@bitcot.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Business St, City, State 12345</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/70">© {new Date().getFullYear()} BITCOT. All rights reserved.</p>
          <div className="flex gap-6 text-sm"></div>
        </div>
      </div>
    </footer>
  )
}
