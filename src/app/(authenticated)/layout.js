import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserPermissionsProvider } from "@/context/user-permissions-context";
import getPermissionsModel from "@/api/GET/permissions/get-permissions-model";


export default async function AuthenticatedLayout( {children }) {
    const { permissionsData } = await getPermissionsModel();

    return(
        <UserPermissionsProvider permissions={permissionsData}>
            <SidebarProvider>
                <AppSidebar />
                    <main className="flex flex-col items-center w-full min-h-[95vh]">
                        <SidebarTrigger className='mr-auto' />
                        <Breadcrumbs
                        homeLabel="Dashboard"
                        separator="/"
                        customRoutes={{
                        'dashboard': 'Dashboard',
                        'campaigns': 'Campaigns',
                        'clients': 'Clients',
                        'profile': 'My Profile',
                        '[clientid]': 'Client Details',
                        '[reviewid]': 'Deliverable Review'
                        }}
                        />
                        {children}
                    </main>
            </SidebarProvider>
        </UserPermissionsProvider>
    )
};