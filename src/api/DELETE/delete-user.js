'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function deleteUser(id) {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError } = await supabase
        .auth
        .admin
        .deleteUser(id)

        if (userError) {
            return { success: false, error: userError.message}
        }

        return { success: true, userData }
    } catch (error) {
        return { success: false, error: error.message}
    }
};