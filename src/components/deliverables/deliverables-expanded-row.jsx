'use client'
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import DeliverableDetailCard from "./deliverable-detail-card";
import DeliverableForm from "./create-deliverable-form";
import { useUserPermissions } from "@/context/user-permissions-context";

export default function DeliverablesDetailView({ data, campaignId }) {
    const [openDeliverableCreateForm, setOpenDeliverableCreateForm] = useState(false);
    const [selectedDeliverable, setSelectedDeliverable] = useState(null);
    const router = useRouter();
    const { isAdmin } = useUserPermissions();
    
    const refreshData = () => {
        router.refresh();
    }; 

    const handleOpenForm = (deliverable = null) => {
        setSelectedDeliverable(deliverable);
        setOpenDeliverableCreateForm(true);
    };

    const handleCloseForm = () => {
        setOpenDeliverableCreateForm(false);
        setSelectedDeliverable(null);
    };

    const organizedDeliverables = (deliverables) => {
        return deliverables.reduce((result, deliverable) => {
            const { deliverable_type } = deliverable;
            if (!result[deliverable_type]) {
                result[deliverable_type] = [];
            }

            result[deliverable_type].push(deliverable);

            return result;
        }, {})
    }


    // UI for Admin/Super-Admin

    if (isAdmin) {
        return (
            <>
            {openDeliverableCreateForm && (
                <DeliverableForm 
                    initialData={selectedDeliverable} 
                    isOpen={openDeliverableCreateForm} 
                    setIsOpen={handleCloseForm}
                    campaignId={campaignId}
                    refreshData={refreshData} 
                />
            )}
            <div className="flex-col w-full h-full p-4">
                <div className="flex deliverable-header w-full">
                    <Button className='flex mb-4 border-1 hover:border-green-700' variant={'outline'} onClick={() => handleOpenForm()}>Add Deliverable</Button>
                </div>
                <Separator />
                <div className="deliverable-content h-full flex flex-row space-y-2">
                    <div className="email flex flex-col w-1/3 h-full items-center">
                        <div className="flex pt-2">
                            <h1>Email</h1>
                        </div>
                        <Separator className={'mt-2 mb-4'} />
                        <div className="email-deliverables-container flex flex-col w-full space-y-2">
                            {organizedDeliverables(data)['email']?.map(deliverable => (
                                <DeliverableDetailCard 
                                    deliverable={deliverable} 
                                    key={deliverable.id} 
                                    onEdit={handleOpenForm} 
                                />
                            ))}
                        </div>  
                    </div>
                    <Separator className={'h-full'} orientation="vertical" />
                    <div className="social flex flex-col w-1/3 h-full items-center">
                        <div className="flex pt-2">
                            <h1>Social</h1>
                        </div>
                        <Separator className={'mt-2 mb-4'} />
                        <div className="social-deliverables-container flex flex-col w-full space-y-2">
                            {organizedDeliverables(data)['social']?.map(deliverable => (
                                <DeliverableDetailCard 
                                    deliverable={deliverable} 
                                    key={deliverable.id} 
                                    onEdit={handleOpenForm}
                                />
                            ))}
                        </div>
                    </div>
                    <Separator className={'h-full'} orientation="vertical" />
                    <div className="website flex flex-col w-1/3 items-center">
                        <div className="flex pt-2">
                            <h1>Website</h1>
                        </div>
                        <Separator className={'mt-2 mb-4'} />
                        <div className="website-deliverables-container flex flex-col w-full space-y-2">
                            {organizedDeliverables(data)['website']?.map(deliverable => (
                                <DeliverableDetailCard 
                                    deliverable={deliverable} 
                                    key={deliverable.id} 
                                    onEdit={handleOpenForm}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
        )
    }

    return (
            <div className="flex-col w-full h-full p-4">
                <Separator />
                <div className="deliverable-content h-full flex flex-row space-y-2">
                    <div className="email flex flex-col w-1/3 h-full items-center">
                        <div className="flex pt-2">
                            <h1>Email</h1>
                        </div>
                        <Separator className={'mt-2 mb-4'} />
                        <div className="email-deliverables-container flex flex-col w-full space-y-2">
                            {organizedDeliverables(data)['email']?.map(deliverable => (
                                <DeliverableDetailCard 
                                    deliverable={deliverable} 
                                    key={deliverable.id} 
                                    onEdit={handleOpenForm} 
                                />
                            ))}
                        </div>  
                    </div>
                    <Separator className={'h-full'} orientation="vertical" />
                    <div className="social flex flex-col w-1/3 h-full items-center">
                        <div className="flex pt-2">
                            <h1>Social</h1>
                        </div>
                        <Separator className={'mt-2 mb-4'} />
                        <div className="social-deliverables-container flex flex-col w-full space-y-2">
                            {organizedDeliverables(data)['social']?.map(deliverable => (
                                <DeliverableDetailCard 
                                    deliverable={deliverable} 
                                    key={deliverable.id} 
                                    onEdit={handleOpenForm}
                                />
                            ))}
                        </div>
                    </div>
                    <Separator className={'h-full'} orientation="vertical" />
                    <div className="website flex flex-col w-1/3 items-center">
                        <div className="flex pt-2">
                            <h1>Website</h1>
                        </div>
                        <Separator className={'mt-2 mb-4'} />
                        <div className="website-deliverables-container flex flex-col w-full space-y-2">
                            {organizedDeliverables(data)['website']?.map(deliverable => (
                                <DeliverableDetailCard 
                                    deliverable={deliverable} 
                                    key={deliverable.id} 
                                    onEdit={handleOpenForm}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
    )
};