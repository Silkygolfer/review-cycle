'use server'

import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function deleteCampaignRecord(campaignId) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)

        if (error) {
            return { success: false, error}
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message}
    }
}