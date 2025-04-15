'use client'

import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "../../ui/dropdown-menu";

import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "../../ui/button";
import { toast } from "sonner";

import deleteCampaignRecord from "@/api/DELETE/delete-campaign";

export const adminCampaignColumns = [
    {
        accessorKey: 'campaign_name',
        header: 'Campaign Name',
        cell: ({ row, getValue }) => (
            <div className="flex items-center">
                {row.getCanExpand() && (
                    <button
                    onClick={row.getToggleExpandedHandler()}
                    className="mr-2 transition-transform"
                    >
                        {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                    </button>
                )}
                {getValue()}
            </div>
        )
    },
    {
        accessorKey: 'campaign_description',
        header: 'Campaign Description',
        cell: ({ row }) => {
            const campaign_description = row.original.campaign_description;

            return (
                <div className='text-wrap md:w-128 line-clamp-3'>
                    {campaign_description}
                </div>
            )
        }
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => {
            const campaign = row.original;
            const handleDelete = async () => {
                try {
                    const result = await deleteCampaignRecord(campaign.id)
                    if (result.success) {
                        toast.success(`${campaign.campaign_name} successfully deleted`)
                        if (table?.options?.meta?.refreshData) {
                            await table.options.meta.refreshData()
                        }
                    } else {
                        toast.error(`Failed to delete: ${result.error}`)
                    }
                } catch (error) {
                    toast.error(`An unexpected error occurred: ${error.message}`)
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'} className={'h-8 w-8 p-0'}>
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                            Delete Campaign
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },
//  {
//        accessorKey: 'campaign_status',
//        header: 'Campaign Status'
//   },
    {
        accessorKey: 'client_name',
        header: 'Client Name',
        enableHiding: true,
        hidden: true
    },
    {
        accessorKey: 'client_id',
        header: 'Client ID',
        enableHiding: true,
        hidden: true
    }
]