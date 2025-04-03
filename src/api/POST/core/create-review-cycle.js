'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance"

export default async function createReviewCycle(id) {
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
            'deliverable_id': id,
            'submitted_by': userData.user.id
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