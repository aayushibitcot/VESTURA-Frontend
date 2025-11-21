"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { changePassword } from "@/store/actions/authAction"

const defaultForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

type FormType = typeof defaultForm

export default function ChangePasswordForm() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormType>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validate = () => {
    if (form.newPassword !== form.confirmPassword) {
      return "New password and confirm password do not match."
    }
    if (form.newPassword.length < 8) {
      return "Password must be at least 8 characters long."
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
      const res = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      })
      if (res?.success) {
        toast({
          title: "Password updated",
          description: res.message || "Your password has been changed successfully.",
        })
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast({
          title: "Change failed",
          description: res?.message || "Unable to change password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Change failed",
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
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="Enter current password"
          value={form.currentPassword}
          onChange={(e) => {
            setForm({ ...form, currentPassword: e.target.value })
            setErrors({ ...errors, currentPassword: "" })
          }}
          required
          className="h-11"
        />
        {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
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
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Updating..." : "Change Password"}
      </Button>
    </form>
  )
}


