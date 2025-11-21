import { AuthHeader } from "@/components/ui/auth-header"
import ChangePasswordForm from "./change-password-form" 

export default function ChangePassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-sm shadow-lg p-8 md:p-10">
          <AuthHeader title="Change password" description="Enter your current and new password" />

          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
