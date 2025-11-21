import { AuthHeader } from "@/components/ui/auth-header"
import ResetPasswordForm from "./reset-password-form"

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
    <div className="w-full max-w-md">
      <div className="bg-background rounded-sm shadow-lg p-8 md:p-10">
        <AuthHeader
          title="Reset password"
          description="Enter the verification code and your new password"
        />

        <ResetPasswordForm />
      </div>
    </div>
  </div>
  )
}