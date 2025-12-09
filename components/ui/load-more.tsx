"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoadMoreProps {
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  className?: string
  buttonClassName?: string
  loadingText?: string
  loadMoreText?: string
}

export default function LoadMore({
  isLoading,
  hasMore,
  onLoadMore,
  className,
  buttonClassName,
  loadingText = "Loading...",
  loadMoreText = "Load More"
}: LoadMoreProps) {
  if (!hasMore) {
    return null
  }

  return (
    <div className={cn("flex justify-center mt-8", className)}>
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        className={cn(
          "px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 cursor-pointer",
          buttonClassName
        )}
      >
        {isLoading ? loadingText : loadMoreText}
      </Button>
    </div>
  )
}

