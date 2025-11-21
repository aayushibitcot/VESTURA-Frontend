"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { products } = useProducts({ autoFetch: true })
  const [searchResults, setSearchResults] = useState(products)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filtered)
    }
  }, [searchQuery, products])

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
          {searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.slice(0, 8).map((product) => (
                <Link
                  key={product.sku}
                  href={`/product/${product.sku}`}
                  onClick={onClose}
                  className="flex gap-4 p-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate group-hover:text-foreground/80">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                    <p className="text-sm font-semibold mt-2">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">Try searching with different keywords</p>
            </div>
          )}

          {searchResults.length > 8 && (
            <div className="mt-6 text-center">
              <Link
                href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                onClick={onClose}
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                View all {searchResults.length} results
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
