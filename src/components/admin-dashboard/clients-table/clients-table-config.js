'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, EllipsisVerticalIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import deleteClientRecord from "@/api/DELETE/delete-client";
import { useRouter } from "next/navigation";

export const adminClientColumns = [
    {
        accessorKey: 'client_name',
        header: 'Client Name',
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
          ),
    },
    {
        accessorKey: 'id',
        header: 'Client Id'
    },
    {
        accessorKey: 'client_assignments',
        header: 'Team Size',
        cell: ({ getValue }) => {
            const assignments = getValue();
            return assignments ? assignments.length : 0;
        }
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const client = row.original;
        const router = useRouter()
        const handleDelete = async (id) => {
          const result = await deleteClientRecord(id);
          if (result.success) {
            toast.success('Client deleted successfully')
            router.refresh()
          } else {
            toast.error('Failed to delete client')
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost'>
                <EllipsisVerticalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>
                Edit Client
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => handleDelete(client.id)}>
                Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
]