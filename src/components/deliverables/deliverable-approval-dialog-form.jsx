'use client'
import { useActionState, useState, useEffect } from "react"
import { Button } from "../ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import createRevisionRequest from "@/api/POST/core/create-revision-request";
import { toast } from "sonner";
import { CheckCheckIcon, ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeliverableApprovalDialogForm({ deliverable_id }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [reviewStatus, setReviewStatus] = useState('approved');
    const [needsRevisionComment, setNeedsRevisionComment] = useState(false);
    const [state, formAction, isPending] = useActionState(createRevisionRequest, {success: false})

    useEffect(() => {
        if (state.success && reviewStatus === 'approved') {
            toast.success('Deliverable Approved!')
            setOpen(false);
            router.refresh();
        }
        if (state.success && reviewStatus === 'revision requested') {
            toast.success('Revision Requested!')
            setOpen(false);
            router.refresh();
        }
        if (state.error) {
            toast.error('Error submitting request: ' + state.error)
        }
    }, [state, reviewStatus])

    const handleRevisionComment = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (needsRevisionComment) {
            setNeedsRevisionComment(false);
            setReviewStatus('approved')
        } else {
            setNeedsRevisionComment(true);
            setReviewStatus('revision requested')
        }
    }

    const handleAction = (formData) => { 
        formData.append('review_status', reviewStatus);
        formData.append('deliverable_id', deliverable_id)
        formAction(formData);
    }

    
    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant={'outline'} className={'w-full bg-green-700 hover:cursor-pointer hover:bg-green-800 my-2'}>
                <CheckCheckIcon />
                Complete Review</Button>
        </DialogTrigger>
        <DialogContent className={'flex space-y-4 flex-col'}>
            <DialogHeader>
                <DialogTitle>Review Deliverable</DialogTitle>
                <DialogDescription className="italic">Would you like to approve this Deliverable for distribtion?</DialogDescription>
            </DialogHeader>
            <form action={handleAction} className="space-y-4">
                <div className="flex w-full space-x-6">
                    {!needsRevisionComment && (
                        <Button type='submit' className={'flex'}>Approve Deliverable</Button>
                    )}
                    <Button type='button' className={'flex items-center'} variant={'destructive'} onClick={(e) => handleRevisionComment(e)}>
                        {needsRevisionComment ? <ChevronDown className="transition-transform duration-300 mr-2" /> : <ChevronRight className="transition-transform duration-300 mr-2" />}
                        Request Revision
                    </Button>
                </div>
                {needsRevisionComment && (
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${needsRevisionComment ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col space-y-4 pt-4">
                      <Label>Please leave a comment, detailing what needs to change.</Label>
                      <Textarea name='revision_comment' id='revision_comment'></Textarea>
                    </div>
                    <div className="pt-4">
                      <Button type='submit'>{isPending ? 'Submitting...' : 'Submit Revision Request'}</Button>
                    </div>
                </div>
                )}
            </form>
        </DialogContent>
       </Dialog>
    )

}