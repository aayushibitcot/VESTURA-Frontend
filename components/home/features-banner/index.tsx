import { Package, Shield, Truck, DollarSign } from "lucide-react"
import FeatureItem from "./feature-item"

const features = [
  {
    icon: Package,
    title: "FREE RETURNS",
    description: "You can ask a refund anytime",
  },
  {
    icon: Shield,
    title: "SECURE DELIVERY",
    description: "Your devices arrive safe and protected",
  },
  {
    icon: Truck,
    title: "FREE SHIPPING",
    description: "Don't pay extra fees for your delivery",
  },
  {
    icon: DollarSign,
    title: "BEST DISCOUNTS",
    description: "We give you the best price guarantee",
  },
]

export default function FeaturesBanner() {
  return (
    <section className="border-y border-border bg-muted/40 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
