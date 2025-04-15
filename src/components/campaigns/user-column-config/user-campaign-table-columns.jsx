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

import { useRouter } from "next/navigation";

import { Button } from "../../ui/button";
import { toast } from "sonner";

import deleteCampaignRecord from "@/api/DELETE/delete-campaign";

export const userCampaignColumns = [
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