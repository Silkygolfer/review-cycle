'use client'
import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import updateProfile from "@/api/PATCH/update-profile"
import { Label } from "../ui/label"
import { toast } from "sonner"

export default function ProfileDetailsForm({ initialProfileState }) {
    const userData = initialProfileState;
    
    const [formValues, setFormValues] = useState({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email
    })
    
    const [state, formAction, isPending] = useActionState(updateProfile, {success: false})
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        if (state.success) {
            toast('Profile updated successfully!')
        }
        if (state.error) {
            toast.error(state.error)
        }
    }, [state])
    
    return (
        <Card className='flex flex-col w-full'>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <Label>Name: <span>{formValues.first_name} {formValues.last_name}</span></Label>
                <Label>Email: {formValues.email}</Label>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <Input type="hidden" name="id" value={userData.id} />

                    <div className="space-y-4">
                        <div>
                            <Label className='pb-2' htmlFor="first_name">First Name</Label>
                            <Input 
                                id="first_name"
                                name="first_name"
                                value={formValues.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label className='pb-2' htmlFor="last_name">Last Name</Label>
                            <Input 
                                id="last_name"
                                name="last_name"
                                value={formValues.last_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label className='pb-2' htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                name='email'
                                value={formValues.email}
                                onChange={handleChange}
                            />
                        </div>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}