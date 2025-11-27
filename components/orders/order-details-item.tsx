interface OrderDetailsItemProps {
  item: {
    id?: string;
    product?: {
      name: string;
      image?: string;
      sku?: string;
      price?: number;
    };
    quantity?: number;
    price?: number;
    selectedSize?: string;
    selectedColor?: string;
  };
}

export default function OrderDetailsItem({ item }: OrderDetailsItemProps) {
  // Handle API structure where product details are nested
  const productName = item.product?.name || "Product";
  const productImage = item.product?.image || "/placeholder.svg";
  const size = item.selectedSize || "N/A";
  const color = item.selectedColor || "N/A";
  const quantity = item.quantity || 1;
  const price = item.price || item.product?.price || 0;

  return (
    <div className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium mb-1">{productName}</h3>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p>Size: {size}</p>
          <p>Color: {color}</p>
          <p>Quantity: {quantity}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-medium">${price.toFixed(2)}</p>
      </div>
    </div>
  )
}

