'use client'
import { useEffect } from "react"
import { useActionState } from "react"
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import createClientUserRecord from "@/api/POST/permissions/create-client-user-record"




export default function CreateUserDialogForm({ refreshPage, isOpen, setIsOpen, client_id, account_id }) {
    const [state, formAction, isPending] = useActionState(createClientUserRecord, { success: false })

    useEffect(() => {
        if (state.success) {
            toast('User invited!');
            refreshPage();
            setIsOpen(false);
        }
        if (state.error) {
            toast.error(state.error)
        }
    }, [state])

    // Needs to create user_roles record
    // Needs to create client_assignments record
    const handleSubmit = (formData) => {
        formData.append('client_id', client_id);
        formData.append('account_id', account_id);
        formAction(formData)
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
            <DialogTitle className={'flex justify-center'}>
                <span>Create New User</span>
            </DialogTitle>
                <form action={handleSubmit}>
                    <div className="flex flex-col space-y-4">
                        {/*<div className="flex flex-row space-x-2">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input id='user_first_name' name='user_first_name' className="" type="text" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input id='user_last_name' name='user_last_name' className="" type="text" />
                            </div>
                        </div>*/}
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input id='user_email' name='user_email' className="w-3/4" type="text" />
                        </div>
                    </div>
                    <div className="flex py-2 mt-2">
                        <Button type={'submit'} disabled={isPending}>{isPending ? "Inviting..." : "Invite User"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}