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

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { signupUser } from "@/api/POST/permissions/signup-user"


function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Confirming..." : "Signup"}
    </Button>
  )
}

export function SignupForm({
  className,
  ...props
}) {

  const [state, formAction] = useActionState(signupUser, { success: false })

  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Show error message if login failed */}
      {state.error && <p className="text-red-500">{state.error}</p>}
      {/* Show success message if receive success from signup function */}
      {state.success && <p className="text-green-500">Please check your email for confirmation</p>}
      <Card>
        <CardHeader>
          <CardTitle>Signup for your account</CardTitle>
          <CardDescription>
            Enter your email below to signup
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
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
