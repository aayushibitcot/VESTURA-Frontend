import LoginForm from "@/components/auth/login/login-form"
import { AuthHeader } from "@/components/ui/auth-header"
import { PUBLIC_PATH } from "@/utils/constant"
import Link from "next/link"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-sm shadow-lg p-8 md:p-10">
          <AuthHeader title="Welcome back" description="Sign in to your account to continue" />

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href={PUBLIC_PATH.REGISTER} className="underline underline-offset-4 hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8"></p>
      </div>
    </div>
  )
}

