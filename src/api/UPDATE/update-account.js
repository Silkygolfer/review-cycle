'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function updateAccount(account_id, data) {
    const supabase = await createClient();

    try {
        const { error: accountError } = await supabase
        .from('accounts')
        .update(data)
        .eq('id', account_id)

        if (accountError) {
            return { success: false, accountError }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};