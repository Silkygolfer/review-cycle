'use client'
import { useActionState, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import createWaitlistRecord from "@/api/POST/waitlist/create-waitlist-record";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

export default function WaitlistForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [state, formAction, isPending] = useActionState(createWaitlistRecord, { success: false })

    useEffect(() => {
        if (state.success) {
            setIsSubmitted(true)
        }
        if (state.error) {
            toast.error('Error submitting your waitlist registration: ' + state.error)
        }
    })

    if (isSubmitted) {
        return (
            <div className="flex justify-center items-center p-4">
                <Label>Thank you for registering, please check your inbox for additional information!</Label>
            </div>
        )
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
                    <form action={formAction} className="space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>First Name</Label>
                                <Input id='first_name' name='first_name' type={'text'} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Last Name</Label>
                                <Input id='last_name' name='last_name' type={'text'} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <Input id='email' name='email' type={'email'} />
                        </div>
                        <div className="flex justify-center pt-2">
                            <Button 
                            disabled={isPending}
                            type={'submit'}>
                                {isPending ? 'Registering...' : 'Complete Registration'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}