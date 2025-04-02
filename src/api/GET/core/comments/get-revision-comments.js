'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getRevisionComments(review_cycle_id) {
    const supabase = await createClient();

    try {
        const { data: commentData, error: commentError } = await supabase
        .from('revision_comments')
        .select('*')
        .eq('review_cycle_id', review_cycle_id)

        if (commentError) {
            return { success: false, error: commentError.message }
        }

        return { success: true, commentData }
    } catch (error) {
        return { sucess: false, error: error.message }
    }
};