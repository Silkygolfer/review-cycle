'use client'
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "../ui/card";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import React from "react";

export default function ReviewHistory({ reviews }) {
    // intit router
    const router = useRouter();

    // date format helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
    };

    // handle Review selection push
    const handleReviewPush = (id) => {
        router.push(`/campaigns/${id}`)
    }

    return (
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Revision History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                <div className="p-4 space-y-2">
                    {reviews && reviews.length > 0 ? (
                        reviews.map(review => (
                            <React.Fragment key={review.id}>
                            {review.review_status === 'approved' ? (
                            <Card
                            onClick={() => handleReviewPush(review.id)}
                            className="shadow-sm border-1 border-green-600 hover:cursor-pointer">
                                <CardTitle className="text-sm p-4">
                                    {formatDate(review.submitted_at)} - {review.users?.first_name} {review.users?.last_name}
                                </CardTitle>
                                <CardContent className="pt-2">
                                    Approved
                                </CardContent>
                            </Card>
                            ) : (
                                <Card 
                                key={review.id} 
                                className="shadow-sm border-1 border-red-600 hover:cursor-pointer"
                                onClick={() => handleReviewPush(review.id)}>
                                <CardTitle className="text-sm p-4">
                                    {formatDate(review.submitted_at)} - {review.users?.first_name} {review.users?.last_name}
                                </CardTitle>
                                <CardContent className="pt-2">
                                    Revision Requested
                                </CardContent>
                            </Card>
                            )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No review history available
                        </div>
                    )}
                </div>
            </ScrollArea>
            </DialogContent>
    )
}