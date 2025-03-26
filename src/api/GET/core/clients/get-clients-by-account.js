import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getClientsByAccount(account_id) {
    const supabase = await createClient();

    try {
        const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*, client_assignments(users(*))')
        .eq('account_id', account_id)

        if (clientError) {
            return { success: false, error: clientError.message}
        }

        return { success: true, clientData }
    } catch (error) {
        return { success: false, error: error.message}
    }
};