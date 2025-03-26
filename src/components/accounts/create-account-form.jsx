'use client'
import { useEffect } from "react"
import { useActionState } from "react"

import { 
    Dialog,
    DialogTitle,
    DialogContent,
} from "../ui/dialog"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { toast } from "sonner"

import createAccountRecord from "@/api/POST/create-account"



export default function CreateAccountDialogForm({ openAccountCreateForm, setOpenAccountCreateForm, refreshPage }) {
    const [state, formAction, isPending] = useActionState(createAccountRecord, { success: false })

    useEffect(() => {
        if (state.success) {
            toast('Account created successfully!');
            setOpenAccountCreateForm(false);
            refreshPage();
        }
        if (state.error) {
            toast.error(state.error)
        }
    }, [state])

    const handleSubmit = async (formData) => {
        formAction(formData);
    }

    return (
        <Dialog open={openAccountCreateForm} onOpenChange={setOpenAccountCreateForm}>
            <DialogContent>
            <DialogTitle className={'flex justify-center'}>
                <span>Create New Account</span>
            </DialogTitle>
                <form action={handleSubmit}>
                    <div className="flex flex-col space-y-4">
                        <div className="space-y-2">
                            <Label>Account Name</Label>
                            <Input id='account_name' name='account_name' className="w-3/4" type="text" />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input id='address' name='address' className="w-3/4" type="text" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <Label className="ml-2">City</Label>
                                <Input id='city' name='city' type="text" />
                            </div>
                            <div className="space-y-2">
                                <Label className="ml-2">State</Label>
                                <Input id='state' name='state' type="text" />
                            </div>
                            <div className="space-y-2">
                                <Label className="ml-2">Country</Label>
                                <Input id='country' name='country' type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="flex py-2 mt-2">
                        <Button type={'submit'} disabled={isPending}>{isPending ? "Creating..." : "Create Account"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}