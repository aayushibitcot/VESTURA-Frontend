"use client"

import { Product } from "@/types/products"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { VALIDATION_ERROR_MESSAGE } from "@/utils/constant"
import { Spinner } from "@/components/ui/spinner"

interface AddToCartModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddToCartModal({ product, open, onOpenChange }: AddToCartModalProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [displayImage, setDisplayImage] = useState<string>(product?.image || "/placeholder.svg")
  const [loading, setLoading] = useState(false)

  const colorOptions = useMemo<string[]>(() => {
    if (!product) return []
    const fromMap = product.colorImages ? Object.keys(product.colorImages) : []
    if (fromMap.length) return fromMap
    const colorsArray = (product.colors ?? []) as (string | { name: string; hex: string })[]
    return colorsArray.map((color) => (typeof color === "string" ? color : color.name))
  }, [product])

  const getColorValue = (colorName: string) => {
    const colorsArray = (product?.colors ?? []) as (string | { name: string; hex: string })[]
    const matched = colorsArray.find((color) =>
      typeof color === "string" ? color === colorName : color.name === colorName,
    )
    if (matched && typeof matched !== "string") {
      return matched.hex || matched.name
    }
    return colorName
  }

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName)
    const newImage =
      product?.colorImages?.[colorName] ||
      product?.image ||
      "/placeholder.svg"
    setDisplayImage(newImage)
  }

  useEffect(() => {
    const defaultImage =
      (product?.colorImages && Object.values(product.colorImages)[0]) ||
      product?.image ||
      "/placeholder.svg"
    setDisplayImage(defaultImage)
    setQuantity(1)
    setSelectedSize("")
    setSelectedColor("")
    setLoading(false)
  }, [product])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setQuantity(1)
      setSelectedSize("")
      setSelectedColor("")
      setLoading(false)
      const fallbackImage =
        (product?.colorImages && Object.values(product.colorImages)[0]) ||
        product?.image ||
        "/placeholder.svg"
      setDisplayImage(fallbackImage)
    }
    onOpenChange(newOpen)
  }

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: VALIDATION_ERROR_MESSAGE.PLEASE_SELECT_A_SIZE,
        variant: "destructive",
      })
      return
    }
    if (colorOptions.length > 0 && !selectedColor) {
      toast({
        title: VALIDATION_ERROR_MESSAGE.PLEASE_SELECT_A_COLOR,
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await addItem({
        ...product,
        quantity: quantity,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      })

      toast({
        title: VALIDATION_ERROR_MESSAGE.ITEM_ADDED_TO_CART_SUCCESSFULLY,
        // description: `${quantity} × ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ""}${selectedColor ? `, ${selectedColor}` : ""} added to your cart.`,
        variant: "success",
      })

      handleOpenChange(false)
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {product.name}
            </DialogTitle>
          </DialogHeader>
        </div>
  
        {/* Body */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          
          {/* Left: Image */}
          <div className="rounded-xl overflow-hidden border bg-muted/20">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
  
          {/* Right: Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                SKU: {product.sku}
              </p>
  
              <p className="text-3xl font-semibold text-foreground">
                ${(product.price * quantity).toFixed(2)}
              </p>
  
              <p className="text-sm text-muted-foreground leading-relaxed mb-[10px]">
                {product.description}
              </p>
  
              {/* Colors */}
              {colorOptions.length > 0 && (
                <div className="space-y-2 mb-[10px]">
                  {/* <label className="text-sm font-semibold tracking-wide">Color</label> */}
                  <label className="text-sm font-medium">
                    Color: {selectedColor && <span className="text-muted-foreground ml-2">{selectedColor}</span>}
                  </label>
                  <div className="flex gap-3 mt-[10px]">
                    {colorOptions.map((colorName) => {
                      const colorValue = getColorValue(colorName)
                      return (
                      <button
                        key={colorName}
                        onClick={() => handleColorSelect(colorName)}
                        className={`w-10 h-10 rounded-full border shadow-sm transition-all cursor-pointer 
                          ${selectedColor === colorName ? "ring-2 ring-black scale-110" : "hover:scale-105"}
                        `}
                        style={{ backgroundColor: colorValue }}
                      />
                    );
                    })}
                  </div>
                </div>
              )}
  
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide">Size</label>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-md border text-sm font-medium transition-all cursor-pointer
                          ${
                            selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-muted-foreground/30 hover:border-black"
                          }
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
  
              {/* Quantity */}
              <div className="flex items-center gap-4 mt-2">
                <label className="text-sm font-semibold tracking-wide">Quantity</label>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <DialogFooter className="flex justify-end gap-4 p-6 border-t">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="w-full md:w-auto cursor-pointer"
          >
            Cancel
          </Button>
  
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || loading}
            className="w-full md:w-auto bg-black text-white hover:bg-black/90 cursor-pointer"
          >
            {loading ? (
              <>
                <Spinner className="mr-2" /> Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );  

  // return (
  //   <Dialog open={open} onOpenChange={handleOpenChange}>
  //     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
  //       <DialogHeader>
  //         <DialogTitle>{product.name}</DialogTitle>
  //       </DialogHeader>

  //       <div className="grid md:grid-cols-2 gap-6 py-4 items-start">
  //         {/* Product Image */}
  //         <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
  //           <img
  //             src={product.image || "/placeholder.svg"}
  //             alt={product.name}
  //             className="w-full h-full object-cover"
  //           />
  //           {!product.inStock && (
  //             <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
  //               <span className="text-sm font-medium uppercase tracking-wide">Out of Stock</span>
  //             </div>
  //           )}
  //         </div>

  //         {/* Product Info */}
  //         <div className="flex flex-col min-h-full space-y-4">
  //           <div>
  //             <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
  //               SKU: {product.sku}
  //             </p>
  //             <p className="text-2xl font-medium mb-2"> ${(product.price * quantity).toFixed(2)}</p>
  //             <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>
  //           </div>

  //           <div className="flex-1 space-y-4">
  //             {/* Color Selection */}
  //             {product.colors && product.colors.length > 0 && (
  //               <div className="space-y-2">
  //                 <label className="text-sm font-medium">
  //                   Color: {selectedColor && <span className="text-muted-foreground ml-2">{selectedColor}</span>}
  //                 </label>
  //                 <div className="flex flex-wrap gap-3">
  //                   {product.colors.map((color) => {
  //                     const colorName = color as string;
  //                     return (
  //                       <button
  //                         key={colorName}
  //                         onClick={() => setSelectedColor(colorName)}
  //                         className={`relative w-12 h-12 rounded-full border-2 transition-all cursor-pointer ${
  //                           selectedColor === colorName
  //                             ? "border-foreground scale-110"
  //                             : "border-border hover:border-muted-foreground hover:scale-105"
  //                         }`}
  //                         style={{ backgroundColor: colorName.toLowerCase() }}
  //                         title={colorName}
  //                         aria-label={`Select ${colorName} color`}
  //                       >
  //                         {selectedColor === colorName && (
  //                           <div className="absolute inset-0 flex items-center justify-center">
  //                             <div className="w-2 h-2 bg-white rounded-full shadow-md" />
  //                           </div>
  //                         )}
  //                       </button>
  //                     );
  //                   })}
  //                 </div>
  //               </div>
  //             )}

  //             {/* Size Selection */}
  //             {product.sizes && product.sizes.length > 0 && (
  //               <div className="space-y-2">
  //                 <label className="text-sm font-medium">
  //                   Size: {selectedSize && <span className="text-muted-foreground ml-2">{selectedSize}</span>}
  //                 </label>
  //                 <div className="flex flex-wrap gap-2">
  //                   {product.sizes.map((size) => (
  //                     <button
  //                       key={size}
  //                       onClick={() => setSelectedSize(size)}
  //                       className={`px-3 py-2 border transition-all text-sm cursor-pointer ${
  //                         selectedSize === size
  //                           ? "border-foreground bg-foreground text-background"
  //                           : "border-border hover:border-foreground"
  //                       }`}
  //                     >
  //                       {size}
  //                     </button>
  //                   ))}
  //                 </div>
  //               </div>
  //             )}

  //             {/* Quantity Selector */}
  //             <div className="flex items-center gap-4">
  //               <label className="text-sm font-medium">Quantity:</label>
  //               <div className="flex items-center border border-border">
  //                 <button
  //                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
  //                   className="px-4 py-2 hover:bg-accent transition-colors cursor-pointer"
  //                   aria-label="Decrease quantity"
  //                 >
  //                   -
  //                 </button>
  //                 <span className="px-6 py-2 border-x border-border min-w-[60px] text-center">
  //                   {quantity}
  //                 </span>
  //                 <button
  //                   onClick={() => setQuantity(quantity + 1)}
  //                   className="px-4 py-2 hover:bg-accent transition-colors cursor-pointer"
  //                   aria-label="Increase quantity"
  //                 >
  //                   +
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <DialogFooter className="gap-2">
  //         <Button
  //           variant="outline"
  //           onClick={() => handleOpenChange(false)}
  //           className="flex-1 sm:flex-initial cursor-pointer"
  //         >
  //           Cancel
  //         </Button>
  //         <Button
  //           onClick={handleAddToCart}
  //           disabled={!product.inStock || loading}
  //           className="flex-1 sm:flex-initial bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed"
  //         >
  //           {loading ? (
  //             <>
  //               <Spinner className="mr-2" />
  //               Adding...
  //             </>
  //           ) : (
  //             "Add to Cart"
  //           )}
  //         </Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // )
}

