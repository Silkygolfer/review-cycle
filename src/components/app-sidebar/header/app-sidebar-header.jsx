'use client'
import { 
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
 } from "../../ui/sidebar"

import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
 } from "../../ui/dropdown-menu"

import { ChevronDown } from "lucide-react"
import updateUserSelectedAccount from "@/api/UPDATE/update-selected-account"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"



export default function AppSidebarHeader({ accounts, selectedAccountObj }) {
    const router = useRouter();
    const [ selectedAccount, setSelectedAccount ] = useState(selectedAccountObj || 'Select Account')


    const handeAccountSelection = async (account_id, account) => {
        setSelectedAccount(account);
        const { success, error } = await updateUserSelectedAccount(account_id);

        if (error) {
            setSelectedAccount('Select Account')
            toast.error('Issue updating selected account - ', error)
        }

        if (success) {
            toast.success('Selected Account updated!')
            router.refresh();
        }
    }

    return (
    <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild> 
                        <SidebarMenuButton>
                            {selectedAccount.account_name}
                            <ChevronDown className="ml-auto"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ width: 'var(--radix-popper-anchor-width)' }}>
                        {accounts && accounts.length > 0 && (
                        <>
                        {accounts.map((account) => (
                            <DropdownMenuItem key={account.id} onClick={() => handeAccountSelection(account.id, account)}>
                                <span>{account.account_name}</span>
                            </DropdownMenuItem>
                        ))}
                        </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarHeader>
    )
};