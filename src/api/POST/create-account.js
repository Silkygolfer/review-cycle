'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createAccountRecord(prevState, formData) {
    const account_name = formData.get('account_name')
    const address = formData.get('address')
    const city = formData.get('city')
    const state = formData.get('state')
    const country = formData.get('country')



    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: userError || "Not authenticated" };
    }

    const { data: accountData, error: accountsError } = await supabase
    .from('accounts')
    .insert({
        account_name: account_name,
        address: address,
        city: city,
        state: state,
        country: country
    })
    .select('id')
    .single()

    if (accountsError) {
        return { success: false, error: accountsError}
    }

    const { data, error } = await supabase.from('user_roles').insert({
        user_id: user.id,
        account_id: accountData.id
    })
    .select()
    .single()

    if (error) {
        return { success: false, error}
    }

    return {success: true}
}