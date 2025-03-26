import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getClients() {
    const supabase = await createClient();

    try {
        const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')

        if (clientError) {
            return { success: false, error}
        }

        return { success: true, clientData }
    } catch (error) {
        return { success: false, error: error.message}
    }
};