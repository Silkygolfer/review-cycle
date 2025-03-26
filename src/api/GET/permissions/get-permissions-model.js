import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getPermissionsModel() {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError } = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, error: userError.message}
        }

        const { data: permissionsData, error: permissionsError } = await supabase
        .from('users')
        .select('is_super_admin, user_roles(*, roles(name))')
        .eq('id', userData.user.id)
        .single()

        if (permissionsError) {
            return { success: false, error: permissionsError.error}
        }

        return { success: true, permissionsData}
    } catch (error) {
        return { success: false, error: error.message}
    }
};