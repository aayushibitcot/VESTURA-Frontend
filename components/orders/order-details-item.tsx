interface OrderItem {
  id: number | string
  name: string
  image?: string
  size: string
  color: string
  quantity: number
  price: number
}

interface OrderDetailsItemProps {
  item: OrderItem
}

export default function OrderDetailsItem({ item }: OrderDetailsItemProps) {
  return (
    <div className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium mb-1">{item.name}</h3>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p>Size: {item.size}</p>
          <p>Color: {item.color}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-medium">${item.price.toFixed(2)}</p>
      </div>
    </div>
  )
}

