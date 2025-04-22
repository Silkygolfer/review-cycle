import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, CheckCircle } from 'lucide-react';

export default function EmailConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full p-3">
            <Mail className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
          <p className="">
            We've sent a confirmation link to your email address.
          </p>
        </div>
        
        <Alert className="border-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <AlertTitle className="">Almost there!</AlertTitle>
          <AlertDescription className="">
            Please click the confirmation link we sent to complete your registration. 
            If you don't see it, check your spam folder.
          </AlertDescription>
        </Alert>
        
        {/*<div className="mt-6 text-center text-sm">
          <p className="">
            Didn't receive an email?{' '}
            <button className="font-medium hover:cursor-pointer">
              Click here to resend
            </button>
          </p>
        </div>*/}
      </div>
    </div>
  );
}