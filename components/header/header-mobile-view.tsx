"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { PRIVATE_PATH, PUBLIC_PATH } from "@/utils/constant"
import { useTransition } from "react"

type HeaderMobileViewProps = {
  cartCount: number
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  user: any
  handleLogout: () => void
}

export default function HeaderMobileView({
  cartCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  handleLogout,
}: HeaderMobileViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleCategoryClick = (categorySlug: string) => {
    setMobileMenuOpen(false)
    // Use Next.js router to update URL, which will properly trigger searchParams updates
    if (pathname === PRIVATE_PATH.SHOP) {
      const params = new URLSearchParams()
      params.set("category", categorySlug)
      const newUrl = `${PRIVATE_PATH.SHOP}?${params.toString()}`
      // Use router.replace to update URL without adding to history, but still trigger Next.js updates
      startTransition(() => {
        router.replace(newUrl, { scroll: false })
      })
    } else {
      // If not on shop page, navigate normally
      startTransition(() => {
        router.push(`${PRIVATE_PATH.SHOP}?category=${categorySlug}`)
      })
    }
  }

  if (!mobileMenuOpen) return null

  return (
    <nav className="lg:hidden py-6 border-t border-neutral-800">
      <div className="flex flex-col gap-4">
        <Link
          href={PRIVATE_PATH.HOME}
          className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href={PRIVATE_PATH.SHOP}
          className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          Shop
        </Link>
        <div className="text-sm font-semibold uppercase tracking-wider text-neutral-400 pt-2">Categories</div>
        {/* {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className="text-sm pl-4 text-left text-neutral-200 hover:text-neutral-50 transition-colors capitalize py-1"
          >
            {category.name}
          </button>
        ))} */}
        <Link
          href={PRIVATE_PATH.CONTACT}
          className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact
        </Link>
        <Link
          href={PRIVATE_PATH.MY_ORDERS}
          className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          My Orders
        </Link>
        <Link
          href={PRIVATE_PATH.CART}
          className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1 flex items-center gap-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="bg-neutral-50 text-neutral-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        {user ? (
          <>
            <Link
              href={PRIVATE_PATH.PROFILE}
              className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout()
                setMobileMenuOpen(false)
              }}
              className="text-sm font-medium uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors py-1 text-left w-full"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href={PUBLIC_PATH.LOGIN}
            className="text-sm font-medium uppercase tracking-wider text-neutral-200 hover:text-neutral-50 transition-colors py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

