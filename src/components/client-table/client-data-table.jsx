'use client'

import { useState } from "react";

import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
 } from "../ui/dropdown-menu";

 import { Button } from "../ui/button";
 import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

import { 
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel
 } from "@tanstack/react-table";

 import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
 } from "../ui/table";

import CreateClientDialogForm from "./create-client-form";


 export function ClientDataTable({ columns, data, refreshData, accountId }) {
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnFilters, setColumnFilters] = useState([])
    const [openClientCreateForm, setOpenClientCreateForm] = useState(false);
    const router = useRouter();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        meta: {
            refreshData
        },
        state: {
            columnVisibility,
            columnFilters
        }
    })

    return(
    <>
        <CreateClientDialogForm openClientCreateForm={openClientCreateForm} setOpenClientCreateForm={setOpenClientCreateForm} refreshData={refreshData} accountId={accountId} />
        <div className="flex w-full flex-col">
            <div className="flex w-full items-center py-4">
                <Input
                    placeholder="Filter by name..."
                    value={(table.getColumn("client_name")?.getFilterValue()) ?? ""}
                    onChange={(event) =>
                    table.getColumn("client_name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2">
                    Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter(
                        (column) => column.getCanHide()
                    )
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {column.columnDef.header || column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => {setOpenClientCreateForm(true)}} className='ml-auto mr-4'>
                    Create Client
                </Button>
            </div>
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow className='hover:bg-transparent' key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
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
        </div>
    </>
    )
  };

