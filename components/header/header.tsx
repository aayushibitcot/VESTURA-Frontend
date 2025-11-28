"use client"

import Link from "next/link"
import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { appLogout } from "@/store/auth/action"
import { useRouter } from "next/navigation"
import { PRIVATE_PATH, PUBLIC_PATH } from "@/utils/constant"
import HeaderMobileView from "./header-mobile-view"
import HeaderDropdown from "./header-dropdown"
import HeaderDesktopView from "./header-desktop-view"
import { Category } from "@/types/categories"
import { useCart } from "@/lib/cart-provider"

interface HeaderProps {
  categories: Category[]
}

export default function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  // Use use-shopping-cart library for real-time cart count updates
  const { cartCount } = useCart()
  const totalCartCount = cartCount || 0

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user?.firstName || ""
    const lastName = user?.lastName ||""
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (firstName) return firstName[0].toUpperCase()
    if (user?.email) return user.email[0].toUpperCase()
    return "U"
  }

  const handleLogout = async () => {
    await appLogout(dispatch)
    router.push(PUBLIC_PATH.LOGIN)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900 text-neutral-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            <Link href={PRIVATE_PATH.HOME} className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-neutral-50 text-neutral-900 flex items-center justify-center font-serif text-xl font-bold">
                  B
                </div>
                <h1 className="font-serif text-2xl font-normal tracking-[0.2em] text-neutral-50">BITCOT</h1>
              </div>
            </Link>

            <HeaderDesktopView setMobileMenuOpen={setMobileMenuOpen} categories={categories} />

            <HeaderDropdown
              cartCount={totalCartCount}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              user={user}
              getUserInitials={getUserInitials}
              handleLogout={handleLogout}
            />
          </div>

          <HeaderMobileView
            cartCount={totalCartCount}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            user={user}
            handleLogout={handleLogout}
          />
        </div>
      </header>

      {/* <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} /> */}
    </>
  )
}
