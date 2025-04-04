'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getReviewData(review_id) {
    const supabase = await createClient();

    try {
        const { data: reviewData, error: commentError } = await supabase
        .from('review_cycles')
        .select('*, deliverables(deliverable_content), revision_comments(*)')
        .eq('id', review_id)
        .single()

        if (commentError) {
            return { success: false, error: commentError.message }
        }

        return { success: true, reviewData }
    } catch (error) {
        return { sucess: false, error: error.message }
    }
};