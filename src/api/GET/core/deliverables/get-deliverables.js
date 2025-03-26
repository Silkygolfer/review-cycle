import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getDeliverables(campaignid) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
        .from('campaigns')
        .select('deliverables(*)')
        .eq('id', campaignid)
        .single()

        if (error) {
            return { success: false, error: error.message}
        }
        return { success: true, data: data}

    } catch (error) {
        return { success: false, error: error.message}
    }
};