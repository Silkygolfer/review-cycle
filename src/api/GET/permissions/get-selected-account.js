'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getSelectedAccount() {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError } = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, userError}
        }

        const { data: selectedAccount, error: selectedAccountError } = await supabase
        .from('users')
        .select('accounts(*), user_roles(account_id, roles(name))')
        .eq('id', userData.user.id)
        .single()

        if (selectedAccountError) {
            return { success: false, selectedAccountError }
        }

        return { success: true, selectedAccount }
    } catch (error) {
        return { success: false, error: error.message }
    }
}