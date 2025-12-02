"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signUp } from "@/store/auth/action"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PUBLIC_PATH, STRONG_PASSWORD_REGEX, VALIDATION_ERROR_MESSAGE } from "@/utils/constant"
import SimpleReactValidator from "simple-react-validator"

const defaultForm = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
}

type FormType = typeof defaultForm

export default function RegisterForm() {
  const [form, setForm] = useState<FormType>(defaultForm)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [, forceUpdate] = useState(0)
  const validator = useRef(
    new SimpleReactValidator({
      autoForceUpdate: { forceUpdate },
      messages: {
        required: ":attribute" + VALIDATION_ERROR_MESSAGE.REQUIRED,
        email: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_EMAIL,
        phone: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_PHONE,
        // url: ":attribute" + VALIDATION_ERROR_MESSAGE.INVALID_URL,
      },
      validators: {
        strong_password: {
          message: VALIDATION_ERROR_MESSAGE.PASSWORD_MIN_LENGTH,
          rule: (val: string) => {
            return new RegExp(STRONG_PASSWORD_REGEX).test(val);
          },
        },
      },
    })
  )

  //  universal handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    validator.current.showMessageFor(name)
  }
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validator.current.allValid()) {
      setIsLoading(true)
      const payload = { ...form, phone: form.phone || undefined }
      const res = await signUp(payload)
      if (res?.success) {
        toast({
          title: res?.message || VALIDATION_ERROR_MESSAGE.REGISTRATION_SUCCESS,
          variant: "success",
        })
        setTimeout(() => router.push(PUBLIC_PATH.LOGIN), 1200)
      } else {
        toast({
          title: res?.message || VALIDATION_ERROR_MESSAGE.REGISTRATION_FAILED,
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
      <div className="grid grid-cols-2 gap-4">
        {/* first name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            className="h-11"
          />
          {validator.current.message("firstName", form.firstName, "required", { className: "text-sm text-destructive mt-1", attribute: "firstname" })}
        </div>
        {/* last name */}  
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            className="h-11"
          />
          {validator.current.message("lastName", form.lastName, "required", { className: "text-sm text-destructive mt-1", attribute: "lastname" })}
        </div>
      </div>
      {/* username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="johndoe"
          value={form.username}
          onChange={handleChange}
          className="h-11"
        />
        {validator.current.message("username", form.username, "required", { className: "text-sm text-destructive mt-1", attribute: "username" })}
      </div>
      {/* email */}
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
        {validator.current.message("email", form.email, "required|email", { className: "text-sm text-destructive mt-1", attribute: "email" })}
      </div>
      {/* phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+91-9876543210"
          value={form.phone}
          onChange={handleChange}
          className="h-11"
        />
        {validator.current.message("phone", form.phone, "required|phone", { className: "text-sm text-destructive mt-1", attribute: "phone" })}
      </div>
      {/* password */}     
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          className="h-11"
        />
        {validator.current.message("password", form.password, "required|strong_password", { className: "text-sm text-destructive mt-1", attribute: "password" })}
      </div>
      {/* submit button */}
      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
      {/* divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground"></span>
        </div>
      </div>
      {/* sign in link */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={PUBLIC_PATH.LOGIN} className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </div>
    </form>
  )
}


