'use client'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { ChevronDown } from "lucide-react"
import updateUserSelectedAccount from "@/api/UPDATE/update-selected-account"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

export default function HeaderAccountDropdownMenu({ accounts, userData }) {
    const router = useRouter();
    const [ selectedAccount, setSelectedAccount ] = useState(userData.userData.accounts?.account_name || 'Select Account')


    const handeAccountSelection = async (account_id, account_name) => {
        setSelectedAccount(account_name);
        const { success, error } = await updateUserSelectedAccount(account_id);

        if (error) {
            setSelectedAccount('Select Account')
            toast.error('Issue updating selected account - ', error)
        }

        if (success) {
            toast.success('Selected Account updated!')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild> 
                <SidebarMenuButton>
                    {selectedAccount}
                    <ChevronDown className="ml-auto"/>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ width: 'var(--radix-popper-anchor-width)' }}>
                {accounts && accounts.length > 0 && (
                <>
                {accounts.map((account) => (
                    <DropdownMenuItem key={account.id} onClick={() => handeAccountSelection(account.id, account.account_name)}>
                        <span>{account.account_name}</span>
                    </DropdownMenuItem>
                ))}
                </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}