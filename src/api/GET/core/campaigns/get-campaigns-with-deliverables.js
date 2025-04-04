'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getCampaignsWithDeliverables(account_id) {
    const supabase = await createClient();

    try {
        const { data: campaignData, error: campaignError } = await supabase
        .from('clients')
        .select('*, campaigns(*, deliverables(*, review_cycles(*, users(first_name, last_name)))))')
        .eq('account_id', account_id)
        .order('submitted_at', {ascending: false, referencedTable: 'campaigns.deliverables.review_cycles'})

        if (campaignError) {
            return { success: false, error: campaignError.message}
        }

        return { success: true, campaignData }
    } catch (error) {
        return { success: false, error: error.message }
    }
};