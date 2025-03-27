'use client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { getCoreRowModel, useReactTable, flexRender, getExpandedRowModel } from "@tanstack/react-table"
import React, { useState } from "react"
import ClientAssignments from "./user-components/user-data-expanded-row"


export default function AdminClientsTable({ columns, data }) {
    // set state for expanded row - init with empty object
    const [expanded, setExpanded] = useState({})
    
    const table = useReactTable({
        data: data,
        columns: columns,
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel()
    })

    // Render function for content in expanded row -> passes client_assignments to the component
    const renderAssignments = ({ row }) => {
        const client = row.original;
        return <ClientAssignments client={client} />
    }

    return (
    <div className="flex flex-col w-full min-h-[400px]">
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                    <TableRow className={'hover:bg-transparent'} key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder ? null :
                                    flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <TableRow
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>

                            {/* Render the assignments component when the row is expanded */}
                            {row.getIsExpanded() && (
                                <TableRow className={'hover:bg-transparent'}>
                                    <TableCell colSpan={columns.length} className={'p-0 border-b'}>
                                        {renderAssignments({ row })}
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
    )
};

