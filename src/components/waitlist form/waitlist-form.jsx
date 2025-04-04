'use client'
import { useActionState, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import createWaitlistRecord from "@/api/POST/waitlist/create-waitlist-record";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { z } from "zod";

// Define Zod schema for form validation
const waitlistSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address")
});

export default function WaitlistForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [state, formAction, isPending] = useActionState(createWaitlistRecord, { success: false });

    useEffect(() => {
        if (state.success) {
            setIsSubmitted(true);
        }
        if (state.error) {
            toast.error('Error submitting your waitlist registration: ' + state.error);
        }
    }, [state]);

    // Client-side validation handler
    const handleSubmit = (formData) => {
        try {
            // Convert FormData to object for validation
            const data = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                email: formData.get('email')
            };
            
            // Validate the data
            waitlistSchema.parse(data);
            
            // If validation passes, clear errors and submit the form
            setValidationErrors({});
            return formAction(formData);
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Transform Zod errors into a more usable format
                const errors = {};
                error.errors.forEach((err) => {
                    errors[err.path[0]] = err.message;
                });
                setValidationErrors(errors);
                toast.error('Please fix the form errors');
                return;
            }
            toast.error('Validation error occurred');
            return;
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex justify-center items-center p-4">
                <Label>Thank you for registering, please check your inbox for additional information!</Label>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full">
            <Card className="w-full max-w-md p-4 m-2">
                <CardHeader className="text-center">
                    <CardTitle>
                        CmndCenter Waitlist
                    </CardTitle>
                    <CardDescription>
                        Sign up to our waitlist for more information about the launch date and planned feature releases!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>First Name</Label>
                                <Input 
                                    id='first_name' 
                                    name='first_name' 
                                    type='text' 
                                />
                                {validationErrors.first_name && (
                                    <p className="text-sm text-red-500">{validationErrors.first_name}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Last Name</Label>
                                <Input 
                                    id='last_name' 
                                    name='last_name' 
                                    type='text' 
                                />
                                {validationErrors.last_name && (
                                    <p className="text-sm text-red-500">{validationErrors.last_name}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <Input 
                                id='email' 
                                name='email' 
                                type='email' 
                            />
                            {validationErrors.email && (
                                <p className="text-sm text-red-500">{validationErrors.email}</p>
                            )}
                        </div>
                        <div className="flex justify-center pt-2">
                            <Button 
                                disabled={isPending}
                                type='submit'>
                                {isPending ? 'Registering...' : 'Complete Registration'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}