"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PRIVATE_PATH, VALIDATION_ERROR_MESSAGE } from "@/utils/constant"
import SimpleReactValidator from "simple-react-validator"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store/hooks"
import { signIn } from "@/store/actions/authAction"

const defaultForm = {
  email: "",
  password: "",
}

type FormType = typeof defaultForm

export default function LoginForm() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [, forceUpdate] = useState(0)
  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate },
      messages: {
        required: ":attribute" + VALIDATION_ERROR_MESSAGE.REQUIRED,
        email: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_EMAIL,
      },
    })
  )

  // universal handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    validator.current.showMessageFor(name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validator.current.allValid()) {
      setIsLoading(true)

      const res = await signIn(form, dispatch)
      
      if (res?.success) {
        toast({
          description: res?.message || VALIDATION_ERROR_MESSAGE.LOGIN_SUCCESS_DESCRIPTION,
        })
        setTimeout(() => {
          router.push(PRIVATE_PATH.HOME)
        }, 500)
      } else {
        toast({
          description: res?.message || VALIDATION_ERROR_MESSAGE.UNEXPECTED_ERROR,
          variant: "destructive",
        })
      }
      setIsLoading(false)
    } else {
      validator.current.showMessages()
      forceUpdate((prev) => prev + 1)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="h-11"
        />
        {validator.current.message("email", form.email, "required|email", { className: "text-sm text-destructive mt-1" })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {/* <a href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground">
            Forgot password?
          </a> */}
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          className="h-11"
        />
        {validator.current.message("password", form.password, "required", { className: "text-sm text-destructive mt-1" })}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </form>
  )
}
