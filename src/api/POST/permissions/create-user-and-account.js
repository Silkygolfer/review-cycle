'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createUserAndAccount(data) {
    const supabase = await createClient();

    try {
        const { data: userData, error: userError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: 'http://localhost:3000/auth/confirm'
            }
        })

        console.log('userError: ', userError)
        if (userError) {
            return { success: false, error: userError.message }
        }

        const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .insert({
            account_name: data.account_name,
            address: data?.address,
            city: data?.city,
            state: data?.state,
            country: data?.country
        })
        .select()
        .single()

        if (accountError) {
            return { success: false, error: accountError.message }
        }

        const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
            user_id: userData.user.id,
            role_id: 'cae74b8b-27b6-46e1-b20a-11159931a9b0',
            account_id: accountData.id
        })

        if (roleError) {
            return { success: false, error: roleError.message }
        }

        const { error: selectedAccountError } = await supabase
        .from('users')
        .update({
            "selected_account_id": accountData.id
        })
        .eq('id', userData.user.id)

        if (selectedAccountError) {
            return { success: false, error: selectedAccountError.message }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    };
}