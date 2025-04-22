'use client'

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { 
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getExpandedRowModel
} from "@tanstack/react-table";

import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../ui/table";
import React from "react";
import DeliverablesDetailView from "../deliverables/deliverables-expanded-row";
import { useUserPermissions } from "@/context/user-permissions-context";
import CreateCampaignForm from "./create-campaign-form";


export function CampaignDataTable({ columns, data }) {
    const [columnFilters, setColumnFilters] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [open, setOpen] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const router = useRouter();
    
    // refresh the page when a change occurs
    const refreshData = () => {
        router.refresh();
    };
    
    // Get campaigns from the selected client or all campaigns if no client is selected
    const tableData = useMemo(() => {
        if (!selectedClientId) {
            // Return all campaigns from all clients
            return data.flatMap(client => 
                client.campaigns.map(campaign => ({
                    ...campaign,
                    client_id: client.id,
                    client_name: client.client_name
                }))
            );
        } else {
            // Return campaigns only from the selected client
            const selectedClient = data.find(client => client.id === selectedClientId);
            return selectedClient ? 
                selectedClient.campaigns.map(campaign => ({
                    ...campaign,
                    client_id: selectedClient.id,
                    client_name: selectedClient.client_name
                })) : [];
        }
    }, [data, selectedClientId]);
    
    // init Campaign Table
    const table = useReactTable({
        data: tableData,
        columns,
        onExpandedChange: setExpanded,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        meta: {
            refreshData
        },
        state: {
            expanded,
            columnFilters,
            columnVisibility: {
                client_name: false,
                client_id: false
            }
        }
    });
    
    // Extract client options directly from the data prop
    const clientOptions = data
        .filter(client => client?.client_name && client?.id)
        .map(client => ({
            value: client.id,
            label: client.client_name
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    
    const hasFilters = 
        selectedClientId || 
        table.getColumn("campaign_name")?.getFilterValue();
    
    const resetFilters = () => {
        table.resetColumnFilters();
        setSelectedClientId(null);
    };

    const renderAssignments = ({ row }) => {
        const deliverables = row.original.deliverables;
        const campaign_id = row.original.id;
        return <DeliverablesDetailView data={deliverables} campaignId={campaign_id} />
    }

    // check if admin/super-admin
    const { isAdmin } = useUserPermissions()

    if (isAdmin) {
        return (
            <>
            <div className="flex w-full flex-col">
                <div className="flex w-full items-center py-4 gap-4">
                    <Input
                        placeholder="Filter by campaign name..."
                        value={table.getColumn("campaign_name")?.getFilterValue() ?? ""}
                        onChange={e => table.getColumn("campaign_name")?.setFilterValue(e.target.value)}
                        className="max-w-sm"
                    />
                    {clientOptions.length > 1 ? 
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                            {selectedClientId
                                ? clientOptions.find((client) => client.value === selectedClientId)?.label
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
                                                    const newValue = client.value === selectedClientId ? undefined : client.value;
                                                    setSelectedClientId(newValue);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedClientId === client.value ? "opacity-100" : "opacity-0"
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
                    : null}
                    {hasFilters && (
                        <Button 
                            variant="ghost" 
                            onClick={resetFilters} 
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset filters
                        </Button>
                    )}
                    <div className="flex ml-auto px-2">
                        <CreateCampaignForm
                        clientOptions={clientOptions}
                        refreshData={refreshData}
                        />
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : 
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            }
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
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
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
            </div>
            </>
        );
    }

    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full items-center py-4 gap-4">
                <Input
                    placeholder="Filter by campaign name..."
                    value={table.getColumn("campaign_name")?.getFilterValue() ?? ""}
                    onChange={e => table.getColumn("campaign_name")?.setFilterValue(e.target.value)}
                    className="max-w-sm"
                />
                {clientOptions.length > 1 ? 
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                        {selectedClientId
                            ? clientOptions.find((client) => client.value === selectedClientId)?.label
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
                                                const newValue = client.value === selectedClientId ? undefined : client.value;
                                                setSelectedClientId(newValue);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedClientId === client.value ? "opacity-100" : "opacity-0"
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
                : null}
                {hasFilters && (
                    <Button 
                        variant="ghost" 
                        onClick={resetFilters} 
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset filters
                    </Button>
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : 
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
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
        </div>
    );
}