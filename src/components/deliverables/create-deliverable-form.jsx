import { useForm } from "react-hook-form";
import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import DatePicker from "./date-picker";
import FileUploader from "./file-uploader";
import createOrUpdateDeliverableRecord from "@/api/POST/create-or-update-deliverable-record";

export default function DeliverableForm({
    initialData,
    isOpen,
    setIsOpen,
    campaignId,
    refreshData
}) {
    const [fileUrl, setFileUrl] = useState('');
    const [fileUploaded, setFileUploaded] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [state, formAction, isPending] = useActionState(createOrUpdateDeliverableRecord, { success: false })

    const form = useForm({
        defaultValues: {
            deliverable_name: '',
            deliverable_description: '',
            deliverable_type: '',
            deliverable_status: '',
            deliverable_content: '',
            deliverable_start_date: '',
            deliverable_end_date: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            // If we have initialData (editing), set the file URL and dates
            if (initialData) {
                setFileUrl(initialData.deliverable_content || '');
                setFileUploaded(!!initialData.deliverable_content);
                setStartDate(initialData.deliverable_start_date || '');
                setEndDate(initialData.deliverable_end_date || '');
            } else {
                // Reset for new deliverable
                setFileUrl('');
                setFileUploaded(false);
                setStartDate('');
                setEndDate('');
            }

            // Reset form fields
            form.reset({
                deliverable_name: initialData?.deliverable_name || '',
                deliverable_description: initialData?.deliverable_description || '',
                deliverable_type: initialData?.deliverable_type || '',
                deliverable_status: initialData?.deliverable_status || '',
                deliverable_content: initialData?.deliverable_content || '',
                // Don't set date fields here as we're using the DatePicker component
            });
        }
    }, [form, initialData, isOpen]);

    const handleUploadComplete = (url, fileDetails) => {
        setFileUrl(url);
        setFileUploaded(!!url);
        form.setValue('deliverable_content', url);
    };

    useEffect(() => {
        if (state && !isPending) {
            if (state.success) {
                toast.success(initialData ? "Deliverable updated successfully" : "Deliverable created successfully")
                refreshData();
                setIsOpen(false);
            } else if (state.error) {
                toast.error(`Failed to save deliverable: , ${state.error}`)
            }
        }
    }, [state, isPending, initialData, setIsOpen]);

    const deliverableTypes = [
        { value: 'email', label: 'Email' },
        { value: 'social', label: 'Social' },
        { value: 'website', label: 'Website' }
    ];

    const deliverableStatuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'in progress', label: 'In Progress' },
        { value: 'approved', label: 'Approved' },
        { value: 'revision requested', label: 'Revision Requested' },
        { value: 'needs approval', label: 'Needs Approval' }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogTitle className={'flex justify-center'}>
                    <span>{initialData ? 'Edit Deliverable' : 'Create Deliverable'}</span>
                </DialogTitle>
                <Form {...form}>
                    <form action={formAction} className="flex flex-col space-y-4">
                    {initialData && (
                        <input
                            type="hidden"
                            name="deliverable_id"
                            value={initialData.id || ''}
                        />
                    )}
                        <FormField
                            control={form.control}
                            name="deliverable_name"
                            rules={{ required: 'Deliverable name is required' }}
                            render={({ field }) => (
                                <FormItem className={'space-y-2'}>
                                    <FormLabel>Deliverable Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className={'w-full'} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="deliverable_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deliverable Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} className={'w-full max-h-[200px]'} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="deliverable_type"
                            rules={{ required: 'Type is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        name='deliverable_type' 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deliverableTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="deliverable_status"
                            rules={{ required: 'Status is required' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        name='deliverable_status' 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deliverableStatuses.map(status => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex space-x-2">
                            <div className="space-y-2 w-1/2">
                                <FormLabel>Start Date</FormLabel>
                                <DatePicker date={startDate} setDate={setStartDate} nameRef={'deliverable_start_date'}/>
                            </div>
                            <div className="space-y-2 w-1/2">
                                <FormLabel>End Date</FormLabel>
                                <DatePicker date={endDate} setDate={setEndDate} nameRef={'deliverable_end_date'}/>
                            </div>
                        </div>
                        
                        {/* File Uploader */}
                        <div className="space-y-2">
                            <FormLabel>Deliverable Content</FormLabel>
                            
                            {/* Show existing file details if editing */}
                            {initialData && fileUrl && (
                                <div className="p-2 rounded-md border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Current File:</span>
                                            <span className="text-sm truncate max-w-[250px]">
                                                {fileUrl.split('/').pop() || fileUrl}
                                            </span>
                                        </div>
                                        <a 
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                        >
                                            Preview
                                        </a>
                                    </div>
                                </div>
                            )}
                            
                            <FileUploader
                                label={initialData && fileUrl ? "Replace File" : "Upload File"}
                                onUploadComplete={handleUploadComplete}
                                initialFileUrl={fileUrl}
                            />
                            <input
                                type="hidden"
                                name="deliverable_content"
                                id="deliverable_content"
                                value={fileUrl}
                            />
                            <input
                                type="hidden"
                                name="campaign_id"
                                id="campaign_id"
                                value={campaignId || ''}
                            />
                            {fileUrl && !initialData && (
                                <p className="text-sm text-green-600">File uploaded successfully</p>
                            )}
                        </div>

                        <Button
                            type='submit'
                            variant={'outline'}
                            className={'w-full'}
                            disabled={!fileUploaded || isPending}
                        >
                            {isPending ? 
                              (initialData ? 'Updating Deliverable...' : 'Creating Deliverable...') : 
                              (initialData ? 'Update Deliverable' : 'Create Deliverable')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}