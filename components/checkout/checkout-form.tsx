"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useCart } from "@/lib/cart-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import OrderSummary from "@/components/ui/order-summary"
import { PRIVATE_PATH, VALIDATION_ERROR_MESSAGE } from "@/utils/constant"
import { CreateOrderParams, OrderResponse } from "@/types/order"
import SimpleReactValidator from "simple-react-validator"

interface CheckoutFormProps {
  onCreateOrder: (form: CreateOrderParams) => Promise<OrderResponse>
}

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

export default function CheckoutForm({ onCreateOrder }: CheckoutFormProps) {
  const [form, setForm] = useState<FormType>(defaultForm)
  const { cartItems, totalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [, forceUpdate] = useState(0)

  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate },
      messages: {
        required: ":attribute" + VALIDATION_ERROR_MESSAGE.REQUIRED,
        email: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_EMAIL,
        phone: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_PHONE,
      },
    })
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    validator.current.showMessageFor(name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validator.current.allValid()) {
      setIsProcessing(true)
      
      try {
        const orderItems = cartItems.map(item => ({
          productSku: item.sku,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        }))

        const orderParams: CreateOrderParams = {
          items: orderItems,
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.streetAddress,
            city: form.city,
            state: form.state,
            zip: form.zipCode,
            country: form.country,
            phone: form.phone,
          },
          billingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.streetAddress,
            city: form.city,
            state: form.state,
            zip: form.zipCode,
            country: form.country,
          },
          paymentMethod: "stripe",
          couponCode: form.couponCode || undefined,
        }

        const response = await onCreateOrder(orderParams)
        if (response.success && response.data && response.data.id) {
          toast({
            title: response.message || VALIDATION_ERROR_MESSAGE.ORDER_CREATED_SUCCESSFULLY,
            variant: "success",
          })
          clearCart()
          setTimeout(() => {
            router.push(`${PRIVATE_PATH.ORDER_SUCCESS}?orderId=${response?.data?.id}`)
          }, 1000)
        } else {
          toast({
            title: response.message || VALIDATION_ERROR_MESSAGE.FAILED_TO_CREATE_ORDER,
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : VALIDATION_ERROR_MESSAGE.FAILED_TO_CREATE_ORDER,
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    } else {
      validator.current.showMessages()
      forceUpdate((prev) => prev + 1)
      toast({
        title: VALIDATION_ERROR_MESSAGE.PLEASE_FILL_IN_ALL_REQUIRED_FIELDS_CORRECTLY,
        variant: "destructive",
      })
    }
  }

  const shippingCost = 5.99
  const finalTotal = (totalPrice ?? 0) + shippingCost

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
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("firstName", form.firstName, "required", { className: "text-sm text-destructive mt-1", attribute: "first name" })}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("lastName", form.lastName, "required", { className: "text-sm text-destructive mt-1", attribute: "last name" })}
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
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("email", form.email, "required|email", { className: "text-sm text-destructive mt-1", attribute: "email" })}
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
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("phone", form.phone, "required|phone", { className: "text-sm text-destructive mt-1", attribute: "phone" })}
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
                  onChange={handleChange}
                  className="mt-1"
                />
                {validator.current.message("streetAddress", form.streetAddress, "required", { className: "text-sm text-destructive mt-1", attribute: "street address" })}
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
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("city", form.city, "required", { className: "text-sm text-destructive mt-1", attribute: "city" })}
                </div>
                <div>
                  <Label htmlFor="state" className="text-xs uppercase tracking-wide text-muted-foreground">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("state", form.state, "required", { className: "text-sm text-destructive mt-1", attribute: "state" })}
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
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("zipCode", form.zipCode, "required", { className: "text-sm text-destructive mt-1", attribute: "zip code" })}
                </div>
                <div>
                  <Label htmlFor="country" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("country", form.country, "required", { className: "text-sm text-destructive mt-1", attribute: "country" })}
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
                onChange={handleChange}
                placeholder="Enter code"
                className="mt-1"
              />
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
                  onChange={handleChange}
                  className="mt-1"
                />
                {validator.current.message("cardholderName", form.cardholderName, "required", { className: "text-sm text-destructive mt-1", attribute: "cardholder name" })}
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
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                  />
                  {validator.current.message("cardNumber", form.cardNumber, "required", { className: "text-sm text-destructive mt-1", attribute: "card number" })}
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
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
                    onChange={handleChange}
                    className="mt-1"
                  />
                  {validator.current.message("expiryDate", form.expiryDate, "required", { className: "text-sm text-destructive mt-1", attribute: "expiry date" })}
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
                    onChange={handleChange}
                    maxLength={4}
                    className="mt-1"
                  />
                  {validator.current.message("cvv", form.cvv, "required", { className: "text-sm text-destructive mt-1", attribute: "cvv" })}
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
