'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function removeUserFromClient({ user_id, client_id }) {
    const supabase = await createClient();

    try {
        const { data: deletedUser, error: deletedUserError } = await supabase
        .from('client_assignments')
        .delete({ count: 1 })
        .eq('user_id', user_id)
        .eq('client_id', client_id)

        if (deletedUserError) {
            return { success: false, error: deletedUserError.message }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};