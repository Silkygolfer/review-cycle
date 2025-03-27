import { Card, CardContent, CardTitle } from "../ui/card";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import React from "react";

export default function RevisionHistory({ revisions }) {
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

    return (
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Revision History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                <div className="p-4 space-y-2">
                    {revisions && revisions.length > 0 ? (
                        revisions.map(revision => (
                            <React.Fragment key={revision.id}>
                            {revision.review_status === 'approved' ? (
                            <Card className="shadow-sm border-1 border-green-700">
                                <CardTitle className="text-sm p-4">
                                    {formatDate(revision.submitted_at)} - {revision.users?.first_name} {revision.users?.last_name}
                                </CardTitle>
                                <CardContent className="pt-2">
                                    Approved
                                </CardContent>
                            </Card>
                            ) : (
                                <Card key={revision.id} className="shadow-sm">
                                <CardTitle className="text-sm p-4">
                                    {formatDate(revision.submitted_at)} - {revision.users?.first_name} {revision.users?.last_name}
                                </CardTitle>
                                <CardContent className="pt-2">
                                    <Label className="italic block indent-1">
                                        "{revision.revision_comment}"
                                    </Label>
                                </CardContent>
                            </Card>
                            )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            No revision history available
                        </div>
                    )}
                </div>
            </ScrollArea>
            </DialogContent>
    )
}