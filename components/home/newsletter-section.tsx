"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { SectionHeading } from "@/components/ui/section-heading"
import { useToast } from "@/hooks/use-toast"

const defaultForm = {
  email: "",
}

type FormType = typeof defaultForm

export default function NewsletterSection() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormType>>({})
  const { toast } = useToast()

  const validate = () => {
    const newErrors: Partial<FormType> = {}
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    const error = validate()
    if (error) {
      toast({
        title: "Validation error",
        description: error,
        variant: "destructive",
      })
      return
    }
    console.log("Newsletter subscription:", form.email)
    setForm({ email: "" })
    toast({
      title: "Newsletter subscription successful",
      description: "You have been subscribed to our newsletter.",
    })
  }

  return (
    <section className="py-20 md:py-28 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
        <SectionHeading
          title="Subscribe to our newsletter"
          description="Get the latest updates on new products, special offers, and industry insights delivered straight to your inbox."
        />

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              setErrors({ ...errors, email: "" })
            }}
            className="flex-1 bg-background text-foreground border-background"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          <Button
            type="submit"
            className="bg-foreground text-background hover:bg-foreground/90 uppercase tracking-wide px-8"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}
