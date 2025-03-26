'use client'

import { ChevronDown, ChevronRight } from "lucide-react"

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
    }
]