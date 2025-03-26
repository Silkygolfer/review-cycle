'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createCampaignRecord(prevState, formData) {
    const supabase = await createClient();

    const campaign_name = formData.get('campaign_name');
    const campaign_description = formData.get('campaign_description');
    const client_id = formData.get('client_id')

    try {
        const { data, error } = await supabase.from('campaigns').insert({
            'campaign_name': campaign_name,
            'campaign_description': campaign_description,
            'client_id': client_id
        })
        .select()
        .single()
    
        if (error) {
            return { success: false, error}
        }
        return { success: true, data: data}
    } catch (error) {
        return { success: false, error: error.message}
    }
}