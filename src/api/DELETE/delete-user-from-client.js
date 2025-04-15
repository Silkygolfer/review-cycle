'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function removeUserFromClient({ user_id, client }) {
    const supabase = await createClient();

    try {
        const { data: deletedUser, error: deletedUserError } = await supabase
        .from('client_assignments')
        .delete({ count: 1 })
        .eq('user_id', user_id)
        .eq('client_id', client.id)

        if (deletedUserError) {
            return { success: false, error: deletedUserError.message }
        }

        // check to see if user belongs to any more clients in the account
        const { data: accountData, error: accountError } = await supabase
        .from('client_assignments')
        .select()
        .eq('account_id', client.account_id)
        .eq('user_id', user_id)

        if (accountError) {
            return { success: false, error: accountError.message }
        }

        if (accountData < 1) {
            const { error: rolesError } = await supabase
            .from('user_roles')
            .delete({count: 1})
            .eq('account_id', client.account_id)
            .eq('user_id', user_id)

            if (rolesError) {
                return { success: false, error: rolesError.message }
            }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};