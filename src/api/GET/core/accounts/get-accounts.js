'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getAccounts() {
    const supabase = await createClient();

    try {
        const { data: accounts, error: accountsError } = await supabase
        .from('accounts')
        .select('*')

        if (accountsError) {
            return { success: false, accountsError}
        }

        return { success: true, accounts}
    } catch (error) {
        return { success: false, error: error.message}
    }
};