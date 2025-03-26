'use client'

import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import deleteClientRecord from "@/api/DELETE/delete-client"
import { toast } from "sonner"
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
 } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"

export const clientColumns = [
    {
        accessorKey: 'client_name',
        header: 'Client Name'
    },
    {
        accessorKey: 'domain',
        header: 'Domain'
    },
    {
        accessorKey: 'address',
        header: 'Address'
    },
    {
        accessorKey: 'city',
        header: 'City'
    },
    {
        accessorKey: 'state',
        header: 'State'
    },
    {
        accessorKey: 'country',
        header: 'Country'
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => {
            const client = row.original

            const handleDelete = async () => {
                
                try {
                    const result = await deleteClientRecord(client.id)
                    if (result.success) {
                        toast.success(`${client.client_name} successfully deleted`)
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
                        <Separator />
                        <DropdownMenuItem onClick={handleDelete}>
                            Delete Client
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]