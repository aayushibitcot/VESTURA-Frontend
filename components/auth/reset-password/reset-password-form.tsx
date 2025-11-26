"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { PUBLIC_PATH } from "@/utils/constant"
import { resetPassword } from "@/store/auth/action"

const defaultForm = {
  username: "",
  code: "",
  newPassword: "",
  confirmPassword: "",
}

type FormType = typeof defaultForm

export default function ResetPasswordForm() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormType>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validate = () => {
    const newErrors: Partial<FormType> = {}
    if (!form.username.trim()) {
      newErrors.username = "Username is required"
    }
    if (!form.code.trim()) {
      newErrors.code = "Code is required"
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = "New password is required"
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (form.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      const res = await resetPassword({
        code: form.code,
        username: form.username,
        newPassword: form.newPassword,
      })
      if (res?.success) {
        toast({
          title: "Password reset",
          description: res.message || "Your password has been reset successfully.",
        })
      } else {
        toast({
          title: "Reset failed",
          description: res?.message || "Unable to reset password. Please check the code and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Reset failed",
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
          name="username"
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

      <div className="space-y-2">
        <Label htmlFor="code">Verification code</Label>
        <Input
          id="code"
          name="code"
          type="text"
          placeholder="Enter the code sent to your email"
          value={form.code}
          onChange={(e) => {
            setForm({ ...form, code: e.target.value })
            setErrors({ ...errors, code: "" })
          }}
          required
          className="h-11"
        />
        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          value={form.newPassword}
          onChange={(e) => {
            setForm({ ...form, newPassword: e.target.value })
            setErrors({ ...errors, newPassword: "" })
          }}
          required
          minLength={8}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
        {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter new password"
          value={form.confirmPassword}
          onChange={(e) => {
            setForm({ ...form, confirmPassword: e.target.value })
            setErrors({ ...errors, confirmPassword: "" })
          }}
          required
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link href={PUBLIC_PATH.LOGIN} className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </div>
    </form>
  )
}


