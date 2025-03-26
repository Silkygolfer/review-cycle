import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function checkSuperAdmin() {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError} = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, error: userError.message }
        }

        const { data: superAdmin, error: superAdminError } = await supabase
        .from('users')
        .select('is_super_admin')
        .eq('id', userData.user.id)
        .single()

        if (superAdminError) {
            return { success: false, error: superAdminError.message}
        }

        if (superAdmin.is_super_admin) {
            return { success: true }
        } else {
            return { success: false}
        }
    } catch (error) {
        return { success: false, error: error.message}
    }
}