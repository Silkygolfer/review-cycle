import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getAccounts() {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError } = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, error: userError.message}
        }

        const { data: accounts, error: accountsError } = await supabase
        .from('users')
        .select('is_super_admin, user_roles(accounts(id, account_name), roles(name))')
        .eq('id', userData.user.id)
        .single()

        if (accountsError) {
            return { success: false, error: accountsError.error}
        }

        return { success: true, accounts}
    } catch (error) {
        return { success: false, error: error.message}
    }
};