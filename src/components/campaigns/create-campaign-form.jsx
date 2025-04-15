'use client'
import { useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { X, ChevronsUpDown, Check } from "lucide-react";
import createCampaignWithDeliverables from "@/api/POST/core/create-campaign-with-deliverables";
import { toast } from "sonner";
import FileUploader from "../deliverables/file-uploader";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "../ui/command";
import { cn } from "@/lib/utils";
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

const campaignSchema = z.object({
    campaign_name: z.string().min(1, "Campaign name is required"),
    campaign_description: z.string(),
    client_id: z.string().min(1, "Please select a client"),
    deliverables: z.array(deliverableSchema),
  });



export default function CreateCampaignForm({ clientOptions, refreshData }) {

    // set State for Campaign Dialog
    const [isOpen, setIsOpen] = useState(false);

    // functions to control dialog state
    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    // set State for Client Search
    const [comboboxOpen, setComboboxOpen] = useState(false);

    // set selected client state
    const [selectedClient, setSelectedClient] = useState(null);

    // set State for Deliverable Add Form
    const [deliverableFormOpen, setDeliverableFormOpen] = useState(false);

    // Get form APIs
    const { register, control, trigger, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(campaignSchema),
        defaultValues: {
        campaign_name: "",
        campaign_description: "",
        client_id: selectedClient?.value,
        deliverables: [],
        newDeliverable: { 
            deliverable_name: "", 
            deliverable_description: "",
            deliverable_type: "",
            deliverable_due_date: "",
            deliverable_status: "",
            deliverable_content: "",
        }
        }
    });
    
    // Set up field array for the nested array of deliverables
    const { fields, append } = useFieldArray({
        control,
        name: "deliverables"
    });
    
    // Handler to add a new deliverable
    const addDeliverable = async () => {

        const newDeliverable = watch("newDeliverable");

        const validationResult = deliverableSchema.safeParse(newDeliverable);
 
        if (!validationResult.success) {
            toast.error('Please complete all required fields')

            validationResult.error.issues.forEach(issue => {
                const path = issue.path.join('.');
                // Set error manually for display
                setValue(`newDeliverable.${path}`, newDeliverable[path], {
                  shouldValidate: true,
                  shouldDirty: true
                });
              });
            return;
        }

        append(newDeliverable);
        
        setValue("newDeliverable", { 
            deliverable_name: "", 
            deliverable_description: "", 
            deliverable_type: "",
            deliverable_due_date: "",
            deliverable_status: "",
            deliverable_content: "",
        });

        listRef.current?.scrollIntoView({ behavior: 'smooth' });

        setDeliverableFormOpen(false);
    };

    // create Ref for Card
    const listRef = useRef();

    // function to submit the form
    const onSubmit = async (data) => {

        // Remove the newDeliverable field before final submission
        const { newDeliverable, ...submissionData } = data;

        // Add the client_id to submission object
        submissionData.client_id = selectedClient?.value || '';

        // try the async submit
        try {
            const result = await createCampaignWithDeliverables(submissionData)

            if (result.success) {
                toast.success("Campaign created successfully!")
                reset();
                closeDialog();
                refreshData();
            }

            if (result.error) {
                toast.error('Failed to create campaign: ' + result.error)
            }
        } catch (error) {
            toast.error('Error: ', error);
        }
    };

    return (
        <>
        <Button
        onClick={() => openDialog()}
        variant={'outline'}>
            Create Campaign
        </Button>
        {isOpen && (
             <Dialog open={isOpen} onOpenChange={setIsOpen}>
             <DialogContent className={'sm:max-w-[425px]'}>
                 <DialogHeader>
                     <DialogTitle>Create Campaign</DialogTitle>
                     <DialogDescription>Use this form to create a campaign with as many Deliverables as needed!</DialogDescription>
                 </DialogHeader>
                 <ScrollArea className={'max-h-[400px]'}>
                 <div className="p-4">
                 <form onSubmit={handleSubmit(onSubmit)}>
 
                     {/* Client Options Popover */}
                     <div className="space-y-2 mb-4">
                         <Label>Clients</Label>
                         <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                             <PopoverTrigger asChild>
                                 <Button
                                 type='button'
                                 variant="outline"
                                 role="combobox"
                                 aria-expanded={comboboxOpen}
                                 className="w-[200px] justify-between"
                                 >
                                 {selectedClient
                                 ? selectedClient.label
                                 : "Select client..."}
                                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                 </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-[200px] p-0">
                                 <Command>
                                 <CommandInput placeholder="Search client..." />
                                 <CommandList>
                                     <CommandEmpty>No client found.</CommandEmpty>
                                     <CommandGroup>
                                     {clientOptions.map((client) => (
                                         <CommandItem
                                         key={client.value}
                                         value={client.label}
                                         onSelect={() => {
                                             const isSelected = selectedClient?.value === client.value;
                                             const newClient = isSelected ? null : client;
                                             setSelectedClient(newClient);
                                             setValue('client_id', newClient?.value || '')
                                             setComboboxOpen(false);
                                         }}
                                         >
                                         <Check
                                             className={cn(
                                             "mr-2 h-4 w-4",
                                             selectedClient?.value === client.value ? "opacity-100" : "opacity-0"
                                             )}
                                         />
                                         {client.label}
                                         </CommandItem>
                                     ))}
                                     </CommandGroup>
                                 </CommandList>
                                 </Command>
                             </PopoverContent>
                         </Popover>
                         {errors?.client_id && (
                             <p className="text-red-500 text-sm">{errors.client_id.message}</p>
                         )}
                         </div>
 
                     <div className="grid mb-2 space-y-2">
 
                     <Label className="block mb-2">Campaign Name</Label>
                     <Input
                         {...register("campaign_name")} 
                         className="border p-2 w-full"
                     />
                     {errors?.campaign_name && (
                         <p className="text-red-500 text-sm">{errors.campaign_name.message}</p>
                     )}
 
                     <Label className="block mb-2">Campaign Description</Label>
                     <Input
                     {...register("campaign_description")}
                     className="border p-2 w-full"
                     />
                     {errors?.campaign_description && (
                         <p className="text-red-500 text-sm">{errors.campaign_description.message}</p>
                     )}
 
                     </div>
                     
                     {/* Deliverable List */}
                     <div ref={listRef} className="mb-4 space-y-2">
                         <div className="flex w-full items-center">
                             <h3 className="font-bold">Deliverables</h3>
                             {deliverableFormOpen ? (
                                 <Button
                                 type='button'
                                 onClick={() => setDeliverableFormOpen(false)}
                                 className={'flex ml-auto hover:bg-red-900'}
                                 variant={'ghost'}>
                                     <X />
                                 </Button>
                             ) : (
                                 <Button 
                                 type='button'
                                 variant={'outline'} 
                                 className={'flex ml-auto hover:bg-blue-900'}
                                 onClick={() => setDeliverableFormOpen(true)}
                                 >Add Deliverable</Button>
                             )}
                         </div>
                     
                     <ul className="mb-4">
                         {fields.map((field, index) => (
                         <li key={field.id} className="mb-2 p-2 border rounded">
                             {watch(`deliverables.${index}.deliverable_name`)}
                         </li>
                         ))}
                     </ul>
                     
                     {/* Add New Deliverable Section */}
                     {deliverableFormOpen && (
                         <Card className="p-3 mb-4">
                         <CardContent className={'space-y-2'}>
                     
                         <Label>Deliverable Name</Label>
                         <Input
                             placeholder="Name"
                             {...register("newDeliverable.deliverable_name")}
                             className="border p-2 flex-1"
                         />
                         {errors.newDeliverable?.deliverable_name && (
                             <p className="text-red-500 text-sm">{errors.newDeliverable.deliverable_name.message}</p>
                         )}
 
                         <Label>Deliverable Description</Label>
                         <Input
                             placeholder="Description"
                             {...register("newDeliverable.deliverable_description")}
                             className="border p-2 flex-1"
                         />
                         {errors.newDeliverable?.deliverable_description && (
                             <p className="text-red-500 text-sm">{errors.newDeliverable.deliverable_description.message}</p>
                         )}
 
                         <Label>Deliverable Type</Label>
                         <Controller
                             name="newDeliverable.deliverable_type"
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
                         {errors.newDeliverable?.deliverable_type && (
                             <p className="text-red-500 text-sm">{errors.newDeliverable.deliverable_type.message}</p>
                         )}
                         
                         <Label>Deliverable Status</Label>
                         <Controller
                             name="newDeliverable.deliverable_status"
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
                         {errors.newDeliverable?.deliverable_status && (
                             <p className="text-red-500 text-sm">{errors.newDeliverable.deliverable_status.message}</p>
                         )}
 
                         <Label>Due Date</Label>
                         <Controller
                             name="newDeliverable.deliverable_due_date"
                             control={control}
                             render={({ field }) => (
                                 <Popover>
                                     <PopoverTrigger asChild>
                                         <Button variant={'outline'}>
                                             {field?.value ? field.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : "Select Date"}
                                         </Button>
                                     </PopoverTrigger>
                                     <PopoverContent>
                                         <Calendar
                                         mode='single'
                                         selected={field.value}
                                         onSelect={field.onChange}
                                         className={'rounded-md border shadow'}
                                         />
                                     </PopoverContent>
                                 </Popover>
                             )}
                         />
                         {errors.newDeliverable?.deliverable_due_date && (
                             <p className="text-red-500 text-sm">{errors.newDeliverable.deliverable_due_date.message}</p>
                         )}
 
                         <Label>File</Label>
                         <Controller
                         name="newDeliverable.deliverable_content"
                         control={control}
                         defaultValue={''}
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
                         {errors.newDeliverable?.deliverable_content && (
                             <p className="text-red-500 text-sm">{errors.newDeliverable.deliverable_content.message}</p>
                         )}
                     
                         <Button
                             variant={'outline'}
                             type="button"
                             onClick={addDeliverable}
                             className="p-2 w-full hover:bg-blue-900"
                         >
                             Add Deliverable
                         </Button>
                         </CardContent>
                     </Card>
                     )}
                     </div>
                     
                     <Button 
                     type="submit" 
                     className="p-2"
                     disabled={isSubmitting}
                     >
                     {isSubmitting ? 'Creating Campaign...' : 'Submit Campaign'}
                     </Button>
                 </form>
                 </div>
                 </ScrollArea>
             </DialogContent>
         </Dialog>
        )}
        </>
    );
    }