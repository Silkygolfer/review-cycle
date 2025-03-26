'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import loginUser from "@/api/POST/permissions/login-user"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import getUserRoles from "@/api/GET/permissions/get-user-roles"


function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Loading..." : "Login"}
    </Button>
  )
}

export function LoginForm({
  className,
  ...props
}) {

  const router = useRouter();

  const [state, formAction] = useActionState(loginUser, { success: false })

  useEffect(() => {
    if (state.success) {
      getUserRoles();
      // Use router.push instead of window.location for client-side navigation
      router.push('/dashboard')
    }
  }, [state, router])

  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Show error message if login failed */}
      {state.error && <p className="text-red-500">{state.error}</p>}
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name='email' type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name='password' type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <SubmitButton />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
