'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function updateDeliverable(data) {
    const supabase = await createClient()

    try {
        const { error: deliverableError } = await supabase
        .from('deliverables')
        .upsert(data, {
            onConflict: 'id'
        })

        if (deliverableError) {
            return { success: false, error: deliverableError.message }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};