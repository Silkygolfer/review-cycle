'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function resendInvitationEmail(user_email) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
        .auth
        .admin
        .inviteUserByEmail(user_email, {
            redirectTo: 'http//localhost:3000/auth/invite'
        })

        if (error) {
            return { success: false, error: error.message}
        }

        return { success: true, data}
    } catch (error) {
        return { success: false, error: error.message}
    }
}