'use client'
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import FileUploader from "./file-uploader";
import updateDeliverable from "@/api/PATCH/core/update-deliverable";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const deliverableSchema = z.object({
    deliverable_name: z.string()
    .min(1, 'Name is required'),
    deliverable_description: z.string(),
    deliverable_type: z.string()
    .min(1, "Type is required"),
    deliverable_status: z.string()
    .min(1, 'Status is required'),
    deliverable_due_date: z.date({
        required_error: "Date is required",
        invalid_type_error: "Invalid date"
    }),
    deliverable_content: z.string()
    .min(1, "File is required"),
    campaign_id: z.string(),
    id: z.string()
})


export default function EditDeliverableForm({ data, refreshData, isOpen, setIsOpen }) {

    // get form APIs
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(deliverableSchema),
        defaultValues: {
            id: data?.id,
            deliverable_name: data?.deliverable_name || '',
            deliverable_description: data?.deliverable_description || '',
            deliverable_type: data?.deliverable_type || '',
            deliverable_due_date: data?.deliverable_due_date ? new Date(data.deliverable_due_date) : new Date(),
            deliverable_status: data?.deliverable_status || '',
            deliverable_content: data?.deliverable_content || '',
            campaign_id: data.campaign_id
        }
    })

    // handle submitting the form
    const onSubmit = async (data) => {
        try {
            const result = await updateDeliverable(data)
            if (result.success) {
                toast.success('Deliverable updated successfully!')
                reset();
                refreshData();
                setIsOpen(false);
            }

            if (result.error) {
                toast.error('Failed to update deliverable - ' + result.error)
            }
        } catch (error) {
            toast.error('Error: ' + error.message)
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={'sm:max-w-[425px]'}>
                <DialogHeader>
                    <DialogTitle>Update Deliverable</DialogTitle>
                    <DialogDescription>Use this form to update your Deliverable</DialogDescription>
                </DialogHeader>
                <div className="flex p-2 w-full items-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
                        <Label>Name</Label>
                        <Input
                        {...register('deliverable_name')}
                        className={'border p-2 w-full'}
                        />
                        {errors.deliverable_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliverable_name.message}</p>
                        )}

                        <Label>Description</Label>
                        <Input
                        {...register('deliverable_description')}
                        className={'border p-2 w-full'}
                        />

                        <Label>Type</Label>
                        <Controller
                        name="deliverable_type"
                        control={control}
                        render={({ field }) => (
                            <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            >
                                <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder='Type' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='email'>Email</SelectItem>
                                    <SelectItem value='social'>Social</SelectItem>
                                    <SelectItem value='website'>Website</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                        />
                        {errors.deliverable_type && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliverable_type.message}</p>
                        )}

                        <Label>Status</Label>
                        <Controller
                        name="deliverable_status"
                        control={control}
                        render={({ field }) => (
                            <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            >
                                <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder='Status' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='pending'>Pending</SelectItem>
                                    <SelectItem value='in progress'>In Progress</SelectItem>
                                    <SelectItem value='needs approval'>Needs Approval</SelectItem>
                                    <SelectItem value='revision requested'>Revision Requested</SelectItem>
                                    <SelectItem value='approved'>Approved</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                        />
                        {errors.deliverable_status && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliverable_status.message}</p>
                        )}

                        <Label>Due Date</Label>
                        <Controller
                            name="deliverable_due_date"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={'outline'}>{field?.value ? field.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Select Date"} </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                        mode='single'
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={field.onChange}
                                        className={'rounded-md border shadow'}
                                        />
                                    </PopoverContent>
                                </Popover>
                                
                            )}
                        />
                        {errors.deliverable_due_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliverable_due_date.message}</p>
                        )}

                        <Label>File</Label>
                        <Controller
                        name="deliverable_content"
                        control={control}
                        defaultValue={data?.deliverable_content || ''}
                        render={({ field }) => (
                            <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            allowedFileTypes={'image/png, image/jpeg, image/jpg'}
                            acceptAttribute=".png, .jpeg, .jpg"
                            />
                        )}
                        />
                        {errors.deliverable_content && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliverable_content.message}</p>
                        )}
                        
                        <Separator
                        className={'w-[90%] my-4'} 
                        />

                        <Button
                        disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating Deliverable..' : 'Update Deliverable'}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}