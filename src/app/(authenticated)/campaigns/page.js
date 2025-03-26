import { CampaignDataTable } from "@/components/campaign-table/campaign-data-table";
import { userCampaignColumns } from "@/components/campaign-table/user-column-config/user-campaign-table-columns";
import getSelectedAccount from "@/api/GET/permissions/get-selected-account";
import getCampaignsWithDeliverables from "@/api/GET/core/campaigns/get-campaigns-with-deliverables";
import getPermissionsModel from "@/api/GET/permissions/get-permissions-model";
import { adminCampaignColumns } from "@/components/campaign-table/admin-column-config/admin-campaign-table-columns";


export default async function CampaignsPage() {
    // get the selectedAccount
    const { selectedAccount } = await getSelectedAccount();

    // get campaignData for selected account
    const { campaignData } = await getCampaignsWithDeliverables(selectedAccount.accounts.id)

    // get permissionsData model
    const { permissionsData } = await getPermissionsModel()

    // render table UI for admin/super-admin
    if (permissionsData.is_super_admin || permissionsData.user_roles.some(item => item.roles.name === 'admin')) {
        return (
            <div className="flex w-full px-4">
                <CampaignDataTable data={campaignData} columns={adminCampaignColumns}/>
            </div>
        )
    }
    
    //render UI for user
    return (
        <div className="flex w-full px-4">
            <CampaignDataTable data={campaignData} columns={userCampaignColumns}/>
        </div>
    )
};