'use client'
import { useState, useEffect } from "react"
import { useActionState } from "react"
import createCampaignRecord from "@/api/POST/create-campaign-record"

import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogDescription
} from "../ui/dialog"

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

import { Textarea } from "../ui/textarea"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { toast } from "sonner"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"


export default function CreateCampaignDialogForm({ openCampaignCreateForm, setOpenCampaignCreateForm, refreshData, clientOptions }) {
    const [comboboxOpen, setComboboxOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createCampaignRecord, { success: false })
    const [selectedClient, setSelectedClient] = useState(null)


    useEffect(() => {
        if (state.success) {
            toast('Campaign created successfully!');
            setOpenCampaignCreateForm(false);
            refreshData();
        }
        if (state.error) {
            toast.error(state.error)
        }
    }, [state])

    const handleSubmit = async (formData) => {
        formData.append('client_id', selectedClient?.value || '');
        formAction(formData);
    }

    return (
        <Dialog open={openCampaignCreateForm} onOpenChange={setOpenCampaignCreateForm}>
            <DialogContent>
            <DialogTitle className={'flex justify-center'}>
                <span>Create New Campaign</span>
            </DialogTitle>
            <DialogDescription>
            Enter the campaign details below to create a new campaign.
            </DialogDescription>
                <form action={handleSubmit}>
                    <div className="flex flex-col space-y-4">
                        <div className="space-y-2">
                        <Label>Client</Label>
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
                                            setSelectedClient(isSelected ? null : client);
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
                        </div>
                        <div className="space-y-2">
                            <Label>Campaign Name</Label>
                            <Input id='campaign_name' name='campaign_name' className="w-3/4" type="text" />
                        </div>
                        <div className="space-y-2">
                            <Label>Campaign Description</Label>
                            <Textarea id='campaign_description' name='campaign_description' className="w-3/4 max-h-64 overflow-y-auto" type="text" />
                        </div>
                    </div>
                    <div className="flex py-2 mt-2">
                        <Button type={'submit'} disabled={isPending || !selectedClient}>{isPending ? "Creating..." : "Create Campaign"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}