import { AuthHeader } from "@/components/ui/auth-header"
import ForgotPasswordForm from "./forgot-password-form"

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-sm shadow-lg p-8 md:p-10">
          <AuthHeader title="Forgot password" description="Enter your email to receive a reset code" />

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
