'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function updateDeliverableStatus({ deliverable_id, status = '' }) {
    const supabase = await createClient();

    try {
        const { error: updateError } = await supabase
        .from('deliverables')
        .update({
            'deliverable_status': status
        })
        .eq('id', deliverable_id)

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};