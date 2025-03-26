'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getUserRoles() {
    const supabase = await createClient();
    
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
            return { success: false, error: userError}
        }

        const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('roles(name), accounts(id, account_name)')
        .eq('user_id', userData.user.id)

        if (rolesError) {
            return { success: false, error: rolesError}
        }
        return { success: true, rolesData}

    } catch (error) {
        return { success: false, error: error.message}
    }
}