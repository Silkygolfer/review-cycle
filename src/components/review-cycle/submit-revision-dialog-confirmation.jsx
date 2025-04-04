'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation";
import updateReviewCycleStatus from "@/api/UPDATE/core/update-review-cycle-status";
import { toast } from "sonner";
import { useState } from "react";
import updateDeliverableStatus from "@/api/UPDATE/core/update-deliverable-status";

export default function SubmitRevisionDialog({ review_id, ...props }) {
    // init router
    const router = useRouter();

    // set state for loading
    const [isLoading, setIsLoading] = useState(false);

    // handle updating review cycle and navigation post-success
    const handleAction = async () => {
        try {
            setIsLoading(true);
            const { reviewData, error } = await updateReviewCycleStatus({id: review_id, status: 'revision requested', submitted_at: 'now()'});
            if (error) {
                toast.error('Error submitting revision: ' + error)
            }
            const result = await updateDeliverableStatus({ deliverable_id: reviewData.deliverable_id, status: 'revision requested'})
            if (result.success) {
                toast.success('Revision submitted successfully')
                router.push('/campaigns')
            }

            if (result.error) {
                toast.error('Failed to submit revision: ' + result.error)
            }
        } catch (error) {
            console.error('Error in handleAction fn: ', error)
        } finally {
            setIsLoading(false);
        }
    };

    return(
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
            variant={'outline'}
            className={'hover:border-red-600 m-2 w-fit'}>
                Submit Revision
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. Please check all comments are accurate, and no other edits need to be made.</AlertDialogDescription>
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