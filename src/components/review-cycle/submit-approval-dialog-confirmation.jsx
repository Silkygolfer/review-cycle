'use client'
import updateReviewCycleStatus from "@/api/UPDATE/core/update-review-cycle-status"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import updateDeliverableStatus from "@/api/UPDATE/core/update-deliverable-status"
import { useState } from "react"

export default function SubmitApprovalDialog({ review_id }) {
    // init router
    const router = useRouter();

    // set state for loading
    const [isLoading, setIsLoading] = useState(false);

    // handle updating review cycle and navigation post-success
    const handleAction = async () => {
        try {
            setIsLoading(true);
            const { reviewData, error } = await updateReviewCycleStatus({id: review_id, status: 'approved', submitted_at: 'now()'});
            if (error) {
                toast.error('Error submitting approval: ' + error)
            }
            const result = await updateDeliverableStatus({ deliverable_id: reviewData.deliverable_id, status: 'approved'})
            if (result.success) {
                toast.success('Approval submitted successfully')
                router.push('/campaigns')
            }

            if (result.error) {
                toast.error('Failed to submit approval: ' + result.error)
            }
        } catch (error) {
            console.error('Error in handleAction fn: ', error)
        } finally {
            setIsLoading(false)
        }
    };

    return(
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
            variant={'outline'}
            className={'hover:border-green-600 m-2 w-fit'}>
                Approve
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This deliverable will be marked as complete, and scheduled for distribution.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                disabled={isLoading}
                onClick={() => handleAction()}>{isLoading ? 'Submitting...' : 'Continue'}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )
}