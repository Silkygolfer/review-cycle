import getSelectedAccount from "@/api/GET/permissions/get-selected-account";
import getClientsByAccount from "@/api/GET/core/clients/get-clients-by-account";
import AdminClientsTable from "@/components/admin-dashboard/clients-table/clients-table";
import { adminClientColumns } from "@/components/admin-dashboard/clients-table/clients-table-config";
import { AccountForm } from "@/components/admin-dashboard/account-details/account-form";
import updateAccount from "@/api/UPDATE/update-account";
import checkSuperAdmin from "@/api/GET/permissions/get-super-admin";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CreateClientDialogForm from "@/components/admin-dashboard/create-client-form";


export default async function AdminPage() {
    // get selectedAccount data
    const { selectedAccount } = await getSelectedAccount();

    // formatting account data for AdminClientTable
    const accountObj = selectedAccount.accounts;

    // get clients for this account -> format and pass to AdminClientTable
    const { clientData } = await getClientsByAccount(selectedAccount.accounts.id);

    // check is_super_admin
    const { success } = await checkSuperAdmin();

    // check if admin
    const confirmAdminRole = selectedAccount.user_roles.find(userRole => userRole.account_id === selectedAccount.accounts.id)?.roles.name === 'admin' || false;

    // render for super_admin or admin
    if (success || confirmAdminRole) {
        return (
            <div className="flex mt-5 w-full">
                <div className="px-4 w-full">
                    <Tabs defaultValue='account' className={'min-w-[600px] w-full'}>
                        <TabsList className={'grid w-full grid-cols-2'}>
                            <TabsTrigger value='account'>Account Details</TabsTrigger>
                            <TabsTrigger value='clients'>Clients</TabsTrigger>
                        </TabsList>
                        <TabsContent value='account'>
                            <AccountForm account={accountObj} updateAccount={updateAccount} />
                        </TabsContent>
                        <TabsContent value='clients'>
                            <div className="flex flex-col">
                                <CreateClientDialogForm accountId={selectedAccount.accounts.id} />
                                <AdminClientsTable data={clientData} columns={adminClientColumns} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <h1>We're sorry, you don't have permission to access this Account's Admin Panel</h1>
            </div>
        )
    }
}