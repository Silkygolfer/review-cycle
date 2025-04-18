'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ReviewCycleSelect({ review_cycles }) {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                className={'w-full bg-blue-600 hover:bg-blue-700 text-white my-2 hover:cursor-pointer'}>
                    <ArrowDown />    
                    Select Review
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Reviews</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {review_cycles.map((cycle, index) => (
                        <DropdownMenuItem
                        key={cycle.id} 
                        value={cycle.id}
                        onClick={() => router.push(`/campaigns/${cycle.id}`)}>
                            <div className="flex items-center">
                                <p className="flex">Review #{index + 1} - {cycle.submitted_at.substring(0, 10)}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}