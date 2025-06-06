'use client'
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FileUploader from "./file-uploader";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import createDeliverable from "@/api/POST/core/create-deliverable";
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
    .min(1, "File is required")
})


export default function CreateDeliverableForm({ campaign_id, refreshData }) {

    // set state for dialog
    const [isOpen, setIsOpen] = useState(false)

    // function for opening dialog
    const openDialog = () => {
        setIsOpen(true)
    };

    // get form APIs
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(deliverableSchema),
        defaultValues: {
            deliverable_name: '',
            deliverable_description: '',
            deliverable_type: '',
            deliverable_due_date: '',
            deliverable_status: '',
            deliverable_content: '',
            campaign_id: campaign_id
        }
    })

    // handle submitting the form
    const onSubmit = async (data) => {
        // handle adding the campaign_id
        data.campaign_id = campaign_id

        try {
            const result = await createDeliverable(data)
            if (result.success) {
                toast.success('Deliverable created successfully!')
                reset();
                setIsOpen(false)
                refreshData();
            }

            if (result.error) {
                toast.error('Failed to create deliverable - ' + result.error)
            }
        } catch (error) {
            toast.error('Error: ' + error.message)
        }
    };

    return (
        <>
        <Button
        onClick={() => openDialog()}
        variant={'outline'}
        className={'mb-2'}
        >
            Create Deliverable
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={'sm:max-w-[425px]'}>
                <DialogHeader>
                    <DialogTitle>Create Deliverable</DialogTitle>
                    <DialogDescription>Use this form to create a Deliverable!</DialogDescription>
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
                                        <Button variant={'outline'}>{field?.value ? field.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : "Select Date"} </Button>
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
                        defaultValue={''}
                        render={({ field }) => (
                            <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
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
                            {isSubmitting ? 'Creating Deliverable..' : 'Create Deliverable'}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}