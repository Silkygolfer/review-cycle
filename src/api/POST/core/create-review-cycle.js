'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance"

export default async function createReviewCycle(deliverable) {
    const supabase = await createClient();

    try {
        // get user
        const { data: userData, error: userError } = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, error: userError.message }
        }


        const { data: reviewCycle, error: reviewCycleError } = await supabase
        .from('review_cycles')
        .insert({
            'deliverable_id': deliverable.id,
            'submitted_by': userData.user.id,
            'asset_url': deliverable.deliverable_content
        })
        .select('id')
        .single()

        if (reviewCycleError) {
            return { success: false, error: reviewCycleError.message }
        }

        return { success: true, reviewCycle }
    } catch (error) {
        return { success: false, error: error.message }
    }
};