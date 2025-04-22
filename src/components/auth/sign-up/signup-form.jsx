'use client'
import { useState } from "react"
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
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion" // Note: You'll need to install framer-motion

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
  // State to track form step (1: Email/Password, 2: Account Details)
  const [step, setStep] = useState(1)
  
  // init Router for navigation
  const router = useRouter();

  // get form APIs
  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, getValues } = useForm({
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

  // Function to handle first step validation and transition
  const handleContinue = async () => {
    // Validate first step fields
    const isValid = await trigger(['email', 'password'])
    if (isValid) {
      setStep(2)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Create your account" : "Account Details"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Enter your email and password to get started" 
              : "Complete your profile information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register('email')} 
                      type="email" 
                      placeholder="m@example.com" 
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      {...register('password')}
                      type="password"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="button" 
                    onClick={handleContinue}
                  >
                    Create Account
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col w-full space-y-4">
                    <div>
                      <Label htmlFor="account_name">Account Name</Label>
                      <Input
                        {...register('account_name')}
                        className="mt-1"
                      />
                      {errors.account_name && (
                        <p className="text-sm text-red-500">{errors.account_name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        {...register('address')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        {...register('city')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        {...register('state')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        {...register('country')}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="w-1/3"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3"
                    >
                      {isSubmitting ? 'Creating account...' : 'Get Started'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}