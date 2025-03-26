'use server'

import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function deleteClientRecord(clientId) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

        if (error) {
            return { success: false, error}
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message}
    }
};