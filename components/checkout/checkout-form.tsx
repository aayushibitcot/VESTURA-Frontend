"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import OrderSummary from "@/components/ui/order-summary"
import { PRIVATE_PATH } from "@/utils/constant"

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  couponCode: "",
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
}

type FormType = typeof defaultForm

export default function CheckoutForm() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormType>>({})
  const { cartItems, totalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // const validate = () => {
  //   const newErrors: Partial<FormType> = {}
  //   if (!form.firstName.trim()) {
  //     newErrors.firstName = "First name is required"
  //   }
  //   if (!form.lastName.trim()) {
  //     newErrors.lastName = "Last name is required"
  //   }
  //   if (!form.email.trim()) {
  //     newErrors.email = "Email is required"
  //   }
  //   if (!form.phone.trim()) {
  //     newErrors.phone = "Phone number is required"
  //   }
  //   if (!form.streetAddress.trim()) {
  //     newErrors.streetAddress = "Street address is required"
  //   }
  //   if (!form.city.trim()) {
  //     newErrors.city = "City is required"
  //   }
  //   if (!form.state.trim()) {
  //     newErrors.state = "State is required"
  //   }
  //   if (!form.zipCode.trim()) {
  //     newErrors.zipCode = "Zip code is required"
  //   }
  //   if (!form.country.trim()) {
  //     newErrors.country = "Country is required"
  //   }
  //   if (!form.couponCode.trim()) {
  //     newErrors.couponCode = "Coupon code is required"
  //   }
  //   if (!form.cardholderName.trim()) {
  //     newErrors.cardholderName = "Card holder name is required"
  //   }
  //   if (!form.cardNumber.trim()) {
  //     newErrors.cardNumber = "Card number is required"
  //   }
  //   if (!form.expiryDate.trim()) {
  //     newErrors.expiryDate = "Expiry date is required"
  //   }
  //   if (!form.cvv.trim()) {
  //     newErrors.cvv = "CVV is required"
  //   }
  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // const error = validate()
    // if (error) {
    //   toast({
    //     title: "Validation error",
    //     description: error,
    //     variant: "destructive",
    //   })
    //   return
    // }
    setIsProcessing(true)

    try {
      const orderNumber = `ARD-${Math.floor(Math.random() * 1000)}`
      const shippingCost = 5.99
      const finalTotal = totalPrice + shippingCost

      const orderDetails = {
        orderNumber,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: finalTotal,
      }

      sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails))

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Order placed successfully!",
        description: "Redirecting to confirmation page...",
      })

      clearCart()

      setTimeout(() => {
        window.location.href = PRIVATE_PATH.ORDER_SUCCESS
      }, 100)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "There was an error processing your checkout. Please try again.",
      })
      setIsProcessing(false)
    }
  }

  const shippingCost = 5.99
  const finalTotal = totalPrice + shippingCost

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Left Column - Forms */}
        <div className="space-y-8">
          {/* Billing Information */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide mb-4">BILLING INFORMATION</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-xs uppercase tracking-wide text-muted-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={(e) => {
                      setForm({ ...form, firstName: e.target.value })
                      setErrors({ ...errors, firstName: "" })  // clear first name error
                    }}   
                    className="mt-1"
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={(e) => {
                      setForm({ ...form, lastName: e.target.value })
                      setErrors({ ...errors, lastName: "" })  // clear last name error
                    }}
                    className="mt-1"
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value })
                      setErrors({ ...errors, email: "" })  // clear email error
                    }}
                    className="mt-1"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value })
                      setErrors({ ...errors, phone: "" })  // clear phone error
                    }}
                    className="mt-1"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide mb-4">SHIPPING ADDRESS</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="streetAddress" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Street Address
                </Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={form.streetAddress}
                  onChange={(e) => {
                    setForm({ ...form, streetAddress: e.target.value })
                    setErrors({ ...errors, streetAddress: "" })  // clear street address error
                  }}
                  className="mt-1"
                />
                {errors.streetAddress && <p className="text-sm text-red-500">{errors.streetAddress}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-xs uppercase tracking-wide text-muted-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={(e) => {
                      setForm({ ...form, city: e.target.value })
                      setErrors({ ...errors, city: "" })  // clear city error
                    }}
                    className="mt-1"
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state" className="text-xs uppercase tracking-wide text-muted-foreground">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={(e) => {
                      setForm({ ...form, state: e.target.value })
                      setErrors({ ...errors, state: "" })  // clear state error
                    }}
                    className="mt-1"
                  />
                  {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={(e) => {
                      setForm({ ...form, zipCode: e.target.value })
                      setErrors({ ...errors, zipCode: "" })  // clear zip code error
                    }}
                    className="mt-1"
                  />
                  {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={(e) => {
                      setForm({ ...form, country: e.target.value })
                      setErrors({ ...errors, country: "" })  // clear country error
                    }}
                    className="mt-1"
                  />
                  {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide mb-4">COUPON CODE</h2>
            <div>
              <Label htmlFor="couponCode" className="text-xs uppercase tracking-wide text-muted-foreground">
                Enter Coupon Code
              </Label>
              <Input
                id="couponCode"
                name="couponCode"
                value={form.couponCode}
                onChange={(e) => {
                  setForm({ ...form, couponCode: e.target.value })
                  setErrors({ ...errors, couponCode: "" })  // clear coupon code error
                }}
                placeholder="Enter code"
                className="mt-1"
              />
              {errors.couponCode && <p className="text-sm text-red-500">{errors.couponCode}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide mb-4">Payment Method*</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardholderName" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Card Holder Name*
                </Label>
                <Input
                  id="cardholderName"
                  name="cardholderName"
                  value={form.cardholderName}
                  onChange={(e) => {
                    setForm({ ...form, cardholderName: e.target.value })
                    setErrors({ ...errors, cardholderName: "" })  // clear card holder name error
                  }}
                  className="mt-1"
                />
                {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
              </div>

              <div>
                <Label htmlFor="cardNumber" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Card Number*
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={(e) => {
                      setForm({ ...form, cardNumber: e.target.value })
                      setErrors({ ...errors, cardNumber: "" })  // clear card number error
                    }}
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Expiry Date*
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={form.expiryDate}
                    onChange={(e) => {
                      setForm({ ...form, expiryDate: e.target.value })
                      setErrors({ ...errors, expiryDate: "" })  // clear expiry date error
                    }}
                    className="mt-1"
                  />
                  {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-xs uppercase tracking-wide text-muted-foreground">
                    CVV*
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={form.cvv}
                    onChange={(e) => {
                      setForm({ ...form, cvv: e.target.value })
                      setErrors({ ...errors, cvv: "" })  // clear CVV error
                    }}
                    maxLength={4}
                    className="mt-1"
                  />
                  {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <OrderSummary
            variant="checkout"
            showItems={true}
            shippingCost={shippingCost}
            isProcessing={isProcessing}
            submitButtonText="PLACE ORDER"
          />
        </div>
      </div>
    </form>
  )
}
