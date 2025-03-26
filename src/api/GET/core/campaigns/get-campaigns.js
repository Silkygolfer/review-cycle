import { createClient } from "@/utils/supabase/server-supabase-instance.js";

export default async function getCampaigns(account_id) {
    const supabase = await createClient();

    try {
        const {data: campaignData, error: clientError} = await supabase
        .from('clients')
        .select('*, campaigns(*)')
        .eq('account_id', account_id)

        if (clientError) {
            return {success: false, error: clientError.message}
        }

        return { success: true, campaignData}

    } catch (error) {
        return { success: false, error: error.message}
    }
};