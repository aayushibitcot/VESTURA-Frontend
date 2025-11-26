"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { forgotPassword } from "@/store/auth/action"
import Link from "next/link"

const defaultForm = {
  username: "",
}

type FormType = typeof defaultForm

export default function ForgotPasswordForm() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormType>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validate = () => {
    if (!form.username.trim()) {
      return "Username is required"
    }
    if (!/\S+@\S+\.\S+/.test(form.username)) {
      return "Enter a valid email"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      toast({
        title: "Validation error",
        description: error,
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const res = await forgotPassword(form.username)
      if (res?.success) {
        toast({
          title: "Email sent",
          description: res.message || "We have sent a password reset code to your email.",
        })
      } else {
        toast({
          title: "Request failed",
          description: res?.message || "Unable to send reset code. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Email address</Label>
        <Input
          id="username"
          type="email"
          placeholder="you@example.com"
          value={form.username}
          onChange={(e) => {
            setForm({ ...form, username: e.target.value })
            setErrors({ ...errors, username: "" })
          }}
          required
          className="h-11"
        />
        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Code"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </form>
  )
}


