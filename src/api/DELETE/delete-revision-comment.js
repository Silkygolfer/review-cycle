'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function deleteRevisionComment(id) {
    const supabase = await createClient();

    try {
        const { error: deleteError } = await supabase
        .from('revision_comments')
        .delete({count: 1})
        .eq('id', id);

        if (deleteError) {
            return { success: false, error: deleteError.message }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};