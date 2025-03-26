import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getUserAccounts() {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError } = await supabase
        .auth
        .getUser();

        if (userError) {
            return { success: false, userError }
        }

        const { data: userAccounts, error: userAccountsError } = await supabase
        .from('user_roles')
        .select('accounts(*)')
        .eq('user_id', userData.user.id)

        if (userAccountsError) {
            return { success: false, userAccountsError}
        }

        return { success: true, userAccounts}
    } catch (error) {
        return { success: false, error: error.message}
    }
};