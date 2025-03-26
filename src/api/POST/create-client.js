'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export async function createClientRecord(prevState, formData) {
    const supabase = await createClient();
    const client_name = formData.get('client_name');
    const domain = formData.get('domain');
    const address = formData.get('address');
    const city = formData.get('city');
    const state = formData.get('state');
    const country = formData.get('country');
    const account_id = formData.get('account_id');

    try {
        const { data, error: clientError } = await supabase
        .from('clients')
        .insert({
            'client_name': client_name,
            'domain': domain,
            'address': address,
            'city': city,
            'state': state,
            'country': country,
            'account_id': account_id
        })
        .select('*')
        .single();

        if (clientError) {
            return { success: false, error: clientError.message}
        }

        // Need to create a client_permissions record?

        return {success: true, data};
    } catch (error) {
        return {success: false, error: error.message }
    }
}