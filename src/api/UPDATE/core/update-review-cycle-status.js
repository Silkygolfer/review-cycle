'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function updateReviewCycleStatus({ id, status = '', submitted_at}) {
    const supabase = await createClient();

    try {
        // create base update object
        const updateData = {
            'review_status': status
        };

        // only add submitted_at if defined
        if (submitted_at !== undefined) {
            updateData.submitted_at = submitted_at;
        }

        const { data: reviewData, error: updateError } = await supabase
        .from('review_cycles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
        
        if (updateError) {
            return { success: false, error: updateError.message }
        }

        return { success: true, reviewData }

    } catch (error) {
        return { success: false, error: error.message }
    }
}