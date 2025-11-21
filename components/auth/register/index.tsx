import { AuthHeader } from "@/components/ui/auth-header"
import RegisterForm from "./register-form"

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-sm shadow-lg p-8 md:p-10">
          <AuthHeader title="Create an account" description="Enter your details to get started" />

          <RegisterForm />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8"></p>
      </div>
    </div>
  )
}
