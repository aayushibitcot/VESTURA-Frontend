"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { PRIVATE_PATH } from "@/utils/constant"
import { useTransition } from "react"
import { Category } from "@/types/categories"

type HeaderDesktopViewProps = {
  setMobileMenuOpen?: (open: boolean) => void
  categories?: Category[]
}

export default function HeaderDesktopView({ setMobileMenuOpen, categories }: HeaderDesktopViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleCategoryClick = (categorySlug: string) => {
    // If already on shop page, update URL silently without triggering route requests
    if (pathname === PRIVATE_PATH.SHOP) {
      const params = new URLSearchParams()
      params.set("category", categorySlug)
      const newUrl = `${PRIVATE_PATH.SHOP}?${params.toString()}`
      // Update URL without triggering Next.js navigation
      if (window.history.replaceState) {
        window.history.replaceState(
          { ...window.history.state },
          '',
          newUrl
        )
      }
      // Trigger popstate to notify ProductGrid
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else {
      // If not on shop page, navigate normally (this will trigger one route request, which is acceptable)
      router.push(`${PRIVATE_PATH.SHOP}?category=${categorySlug}`)
    }
  }

  return (
    <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
      <Link
        href={PRIVATE_PATH.HOME}
        className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors relative group"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-50 transition-all group-hover:w-full"></span>
      </Link>
      <Link
        href={PRIVATE_PATH.SHOP}
        className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors relative group"
      >
        Shop
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-50 transition-all group-hover:w-full"></span>
      </Link>
      <div className="relative group">
        <button className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors flex items-center gap-1.5 relative">
          Categories
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-50 transition-all group-hover:w-full"></span>
        </button>
        <div className="cursor-pointer absolute left-1/2 -translate-x-1/2 mt-4 w-56 bg-neutral-800 border border-neutral-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-sm overflow-hidden">
          {categories && categories.length > 0 && categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="cursor-pointer block w-full text-left px-5 py-3 text-sm text-neutral-200 hover:bg-neutral-700 hover:text-neutral-50 transition-colors capitalize border-b border-neutral-700 last:border-0"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={PRIVATE_PATH.CONTACT}
        className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors relative group"
      >
        Contact
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neutral-50 transition-all group-hover:w-full"></span>
      </Link>
      <Link
        href={PRIVATE_PATH.MY_ORDERS}
        className="cursor-pointer text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
        onClick={() => setMobileMenuOpen?.(false)}
      >
        My Orders
      </Link>
    </nav>
  )
}

