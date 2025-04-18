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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import createUserAndAccount from "@/api/POST/permissions/create-user-and-account"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const signupSchema = z.object({
  email: z.string({required_error: 'Email is required'}).email({message: "Invalid email address"}),
  password: z.string({required_error: 'Password is required'}).min(6, "Passwords must be at least 6 characters in length"),
  account_name: z.string({required_error: 'Account Name is required'}),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string()
})

export default function SignupForm({
  className,
  ...props
}) {

  // init Router for navigation
  const router = useRouter();

  // get form APIs
  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      account_name: '',
      address: '',
      city: '',
      state: '',
      country: ''
    }
  })

  // handle form submit
  const onSubmit = async (data) => {
    try {
      const result = await createUserAndAccount(data);

      if (result.success) {
        toast.success('Account created successfully, please check your email to confirm!')
        router.push('/auth/email')
      }

      if (result.error) {
        toast.error('Failed to create account - ' + result.error)
      }
    } catch (error) {
      toast.error('Error - ' + error)
    }
  }

  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup for your account</CardTitle>
          <CardDescription>
            Enter your email below to signup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                {...register('email')} 
                type="email" 
                placeholder="m@example.com" />
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

                <div className="grid gap-3">
                  <Input
                  {...register('password')}
                  type={'password'}
                  />
                </div>

                <Separator className={'w-[90%]'} />

                <div className="flex flex-col w-full space-y-2">

                  <Label>Account Name</Label>
                  <Input
                  {...register('account_name')}
                  className={'border p-2 w-full'}
                  />

                  <Label>Address</Label>
                  <Input
                  {...register('address')}
                  className={'border p-2 w-full'}
                  />

                  <Label>City</Label>
                  <Input
                  {...register('city')}
                  className={'border p-2 w-full'}
                  />

                  <Label>State</Label>
                  <Input
                  {...register('state')}
                  className={'border p-2 w-full'}
                  />

                  <Label>Country</Label>
                  <Input
                  {...register('country')}
                  className={'border p-2 w-full'}
                  />

                </div>

              </div>
              <div className="flex flex-col gap-3">
                <Button
                disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
