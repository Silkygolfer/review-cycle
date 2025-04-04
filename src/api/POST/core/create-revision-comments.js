'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createRevisionComment(marker) {
    const supabase = await createClient();
    
    try {
        const { data: commentData, error: commentError } = await supabase
        .from('revision_comments')
        .insert(marker)

        if (commentError) {
            return { success: false, error: commentError.message }
        }

        return { success: true, commentData }
    } catch (error) {
        return { success: false, error: error.message }
    }
}