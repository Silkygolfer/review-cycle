'use client'
import { 
    Card,
    CardTitle,
    CardContent,
 } from "../ui/card";

 import { 
    Tag,
    Info, 
    Calendar, 
    Clock, 
    FileText,
    EllipsisVertical,
    Edit
 } from "lucide-react";

 import { Separator } from "../ui/separator";
 import { Label } from "../ui/label";
 import { capatalizeFirstLetter } from "@/helpers/string-helpers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import deleteDeliverableRecord from "@/api/DELETE/delete-deliverable-record";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserPermissions } from "@/context/user-permissions-context";
import RevisionHistory from "../revisions/revision-history";
import { Dialog, DialogTrigger } from "../ui/dialog";
import createReviewCycle from "@/api/POST/core/create-review-cycle";
import ReviewCycleSelect from "../review-cycle/review-cycle-list";

export default function DeliverableDetailCard({ deliverable, onEdit }) {
    const router = useRouter();
    const { isAdmin } = useUserPermissions();

    // function to search and locate any in-progress review cycles
    function inProgressReviewCycle() {
        if(deliverable.review_cycles.find(review => review?.internal_review_cycle_status === 'in progress')) {
            return true
        } else {
            return false
        }
    };

    // variable to store results of in-progress review cycle checks
    const reviewStatus = inProgressReviewCycle();

    // function to get all the colors for the deliverable status
    const getStatusColor = (status) => {
        switch(status) {
          case 'approved':
            return 'bg-green-100 text-green-800';
          case 'pending':
            return 'bg-gray-100 text-gray-800';
          case 'in progress':
            return 'bg-yellow-100 text-yellow-800';
          case 'revision requested':
            return 'bg-red-100 text-red-800';
          case 'needs approval':
            return 'bg-blue-100 text-blue-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
    };

    // function to format the date string correctly for Calendar component
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        // If the date is already in the format 'yyyy-MM-dd', we need to ensure it's parsed correctly
        // Split the string and create a Date object with the correct parts
        const [year, month, day] = dateString.split('-').map(Number);
        
        // Month is 0-indexed in JavaScript Date
        const date = new Date(year, month - 1, day);
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // Function to handle the deletion of a deliverable -> Admins only
    const handleDelete = async (id) => {
        try {
            const response = await deleteDeliverableRecord(id);
            
            if (!response.success) {
                toast.error(`Failed to delete deliverable: ${response.error}`);
                return;
            }
            
            toast.success('Deleted Deliverable');
            router.refresh();
            
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        }
    }

    // Function to start new review process by creating review_cycle record and redirecting to review page
    const handleStartNewReview = async (deliverable_id) => {
        try {
            const result = await createReviewCycle(deliverable_id);
            console.log('result: ', result)
            if (result.success) {
                toast.success('Redirecting to review page...')
                router.push(`/campaigns/${result.reviewCycle.id}`)
            }
            if (result.error) {
                toast.error('Error starting review: ' + result.error)
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }


    if (isAdmin) {
        return (
            <div className="space-y-2 flex">
                <Card className="flex space-y-2 w-full mx-2 p-2">
                    <CardTitle className={'flex px-2 mt-2'}>
                        <div className="flex items-center">
                            {deliverable.deliverable_name}
                        </div>
                        <div className="flex ml-auto"> 
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'ghost'}>
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <Separator />
                                    <DropdownMenuItem onClick={() => onEdit(deliverable)}>
                                        Edit Deliverable
                                    </DropdownMenuItem>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                View Revision History
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <RevisionHistory revisions={deliverable.review_cycles} />
                                    </Dialog>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive" onClick={() => handleDelete(deliverable.id)}>
                                        Delete Deliverable
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardTitle>
                    <CardContent className={'flex flex-col px-2 space-y-4'}>
                        <div className="flex flex-row space-x-2">
                            <Tag className="h-4 w-4 mr-2 mt-1 flex-shrink-0"/>
                            <Label>
                                {capatalizeFirstLetter(deliverable.deliverable_type)}
                            </Label>
                            <span>•</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(deliverable.deliverable_status)} capitalize`}>
                                {deliverable.deliverable_status}
                            </span>
                        </div>
                        <div className="flex flex-row">
                            <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0"/>
                            <span>{deliverable.deliverable_description}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="text-sm">{formatDate(deliverable.deliverable_start_date)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                <div>
                                <p className="text-xs text-gray-500">End Date</p>
                                <p className="text-sm">{formatDate(deliverable.deliverable_end_date)}</p>
                                </div>
                            </div>
                        </div>
                        <Separator className={'flex w-full'}/>
                        <div className="flex">
                            <a 
                            href={deliverable.deliverable_content} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mb-2 rounded-md transition-colors"
                            >
                            <FileText className="h-4 w-4 mr-2" />
                            View Deliverable
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-2 flex">
            <Card className="flex space-y-2 w-full mx-2 p-2">
                <CardTitle className={'flex px-2 mt-2'}>
                    <div className="flex items-center">
                        {deliverable.deliverable_name}
                    </div>
                    <div className="flex ml-auto"> 
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'ghost'}>
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                View Revision History
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <RevisionHistory revisions={deliverable.review_cycles} />
                                    </Dialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                </CardTitle>
                <CardContent className={'flex flex-col px-2 space-y-4'}>
                    <div className="flex flex-row space-x-2">
                        <Tag className="h-4 w-4 mr-2 mt-1 flex-shrink-0"/>
                        <Label>
                            {capatalizeFirstLetter(deliverable.deliverable_type)}
                        </Label>
                        <span>•</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(deliverable.deliverable_status)} capitalize`}>
                            {deliverable.deliverable_status}
                        </span>
                    </div>
                    <div className="flex flex-row">
                        <Info className="h-4 w-4 mr-2 mt-1 flex-shrink-0"/>
                        <span>{deliverable.deliverable_description}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="text-sm">{formatDate(deliverable.deliverable_start_date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <div>
                            <p className="text-xs text-gray-500">End Date</p>
                            <p className="text-sm">{formatDate(deliverable.deliverable_end_date)}</p>
                            </div>
                        </div>
                    </div>
                    <Separator className={'flex w-full'}/>
                    <div className="flex">
                        <a 
                        href={deliverable.deliverable_content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 mb-2 rounded-md transition-colors"
                        >
                        <FileText className="h-4 w-4 mr-2" />
                        View Deliverable
                        </a>
                    </div>
                        {deliverable.deliverable_status === 'needs approval' && (
                            <div className="flex flex-col space-y-2">
                                <Separator className={'flex w-full -mt-2'} />
                                {inProgressReviewCycle() ? (
                                    <ReviewCycleSelect
                                    review_cycles={deliverable.review_cycles}
                                    url={deliverable.deliverable_content} />
                                ) : <Button
                                className={'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 my-2'}
                                onClick={() => handleStartNewReview(deliverable.id)}>
                                    <Edit />
                                    Start Review
                                </Button>}
                                {/*<DeliverableApprovalDialogForm deliverable_id={deliverable.id} />*/}
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    )
}