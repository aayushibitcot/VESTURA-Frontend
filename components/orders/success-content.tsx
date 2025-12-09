
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PRIVATE_PATH } from "@/utils/constant"

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />

          <h1 className="font-serif text-4xl md:text-5xl mb-4">Order Successful!</h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon. You will receive an
            email confirmation with your order details.
          </p>

          <div className="border border-border p-6 mb-8 space-y-4 text-left">
            <h2 className="font-medium text-lg">What's Next?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ You'll receive an email confirmation shortly</li>
              <li>✓ Your order will be processed within 1-2 business days</li>
              <li>✓ Free shipping on all orders</li>
              <li>✓ Track your shipment via the link in your confirmation email</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={PRIVATE_PATH.SHOP}>
              <Button className="bg-foreground text-background hover:bg-foreground/90 cursor-pointer">Continue Shopping</Button>
            </Link>
            <Link href={PRIVATE_PATH.HOME}>
              <Button variant="outline" className="cursor-pointer">Return to Home</Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Questions? Contact us at{" "}
            <a href="mailto:support@bitcot.com" className="text-foreground hover:underline">
              support@bitcot.com
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}

