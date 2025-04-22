import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserPermissionsProvider } from "@/context/user-permissions-context";
import getPermissionsModel from "@/api/GET/permissions/get-permissions-model";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css"

export const metadata = {
    title: "CmndCenter",
    description: "You're in control.",
  };


export default async function RootAuthenticatedLayout({ children }) {
    const { permissionsData } = await getPermissionsModel();

    if (permissionsData) {
        return (
            <html lang="en" className="dark">
                <body>
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
                                        <Toaster />
                                    </main>
                            </SidebarProvider>
                        </UserPermissionsProvider>
                </body>
            </html>
            )
    } else {
        return null;
    }
};