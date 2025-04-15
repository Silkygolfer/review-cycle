'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createCampaignWithDeliverables(data) {

    const supabase = await createClient();
    try {
        // extract campaign data
        const campaign = {
            campaign_name: data.campaign_name,
            campaign_description: data.campaign_description,
            client_id: data.client_id
        }


        const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert(campaign)
        .select()
        .single()

        if (campaignError) {
            return { success: false, error: campaignError.message}
        }

        // extract campaign ID
        const campaignId = campaignData.id

        // add campaignId to deliverables objects in array
        const deliverables = data.deliverables.map(obj => {
            return {
                ...obj,
                campaign_id: campaignId
            }
        });

        const { error: deliverableError } = await supabase
        .from('deliverables')
        .insert(deliverables)

        if (deliverableError) {
            return { success: false, error: deliverableError.message }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};