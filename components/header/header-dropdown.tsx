"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, User, Menu, X, UserCircle, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PRIVATE_PATH, PUBLIC_PATH } from "@/utils/constant"

type HeaderDropdownProps = {
  cartCount: number
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  dropdownOpen: boolean
  setDropdownOpen: (open: boolean) => void
  user: any
  getUserInitials: () => string
  handleLogout: () => void
}

export default function HeaderDropdown({
  cartCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  dropdownOpen,
  setDropdownOpen,
  user,
  getUserInitials,
  handleLogout,
}: HeaderDropdownProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-5 flex-shrink-0">
      {/* <button
        onClick={() => setSearchOpen(true)}
        className="hidden sm:block text-neutral-200 hover:text-neutral-50 transition-colors p-1"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button> */}
      {/* <Link
        href="/my-orders"
        className="hidden sm:block text-neutral-200 hover:text-neutral-50 transition-colors p-1"
        aria-label="My Orders"
        title="My Orders"
      >
        <Package className="h-5 w-5" />
      </Link> */}
      
      {!mounted ? (
        <div className="hidden sm:block w-9 h-9" />
      ) : user ? (
        <div className="hidden sm:block relative">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none relative">
                {dropdownOpen && ( 
                  <div className="absolute -inset-1"></div>
                )}
                <div className="absolute -inset-0.5 rounded-full border-2 border-neutral-50"></div>
                <Avatar className="h-9 w-9 relative z-10">
                  <AvatarImage 
                  className="object-cover"
                    src={user?.avatar} 
                    alt={user?.firstName || "User"} 
                  />
                  <AvatarFallback className="bg-neutral-50 text-neutral-900 font-semibold text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white text-neutral-900">
              <DropdownMenuItem asChild>
                <Link href={PRIVATE_PATH.PROFILE} className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link
          href={PUBLIC_PATH.LOGIN}
          className="hidden sm:block text-neutral-200 hover:text-neutral-50 transition-colors p-1"
          aria-label="Login"
        >
          <User className="h-5 w-5" />
        </Link>
      )}
      
      <Link href={PRIVATE_PATH.CART} className="relative text-neutral-200 hover:text-neutral-50 transition-colors p-1">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-neutral-50 text-neutral-900 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-1 text-neutral-200 hover:text-neutral-50"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  )
}

