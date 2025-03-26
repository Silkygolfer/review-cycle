import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
  } from "@/components/ui/sidebar"

import AppSidebarHeader from "./header/app-sidebar-header"
import { sidebarItemsConfig } from "./config/sidebar-menu-config"
import AppSidebarFooter from "./footer/app-sidebar-footer"
import getUserData from "@/api/GET/permissions/get-user-data"
import getSelectedAccount from "@/api/GET/permissions/get-selected-account"
import getAccounts from "@/api/GET/core/accounts/get-accounts"
  
export async function AppSidebar() {

    // get all accounts -> pass to AppSidebarHeader for Dropdown Selection
    const accounts = await getAccounts();

    // get userData -> pass to AppSidebarFooter for UI
    const { userData } = await getUserData();

    // get selectedAccount -> tranform then pass to AppSideHeader for Account Selection
    const { selectedAccount } = await getSelectedAccount();

    // create selectedAccount object to pass to AppSidebarHeader for selectedAccount state
    const selectedAccountObj = {
        'id': selectedAccount.accounts.id,
        'account_name': selectedAccount.accounts.account_name
    }

    // init userRole variable
    let userRole = '';

    // is_super_admin is falsy, pass roles
    if (!userData.is_super_admin) {
        // map the role to the selectedAccount by account_id
        const selectedAccountRoleObject = selectedAccount.user_roles.find(
        role => role.account_id === userData.selected_account_id
        );
        // get role name as string from mapped roles -> accounts. Pass to AppSidebarFooter for UI
        userRole = selectedAccountRoleObject.roles.name;
    }
    
    
    return (
        <Sidebar>
        <AppSidebarHeader selectedAccountObj={selectedAccountObj} accounts={accounts.accounts} />
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {sidebarItemsConfig.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup />
        </SidebarContent>
        <AppSidebarFooter userData={userData} role={userRole} />
        </Sidebar>
    )
}
