'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function deleteDeliverableRecord(id) {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('deliverables')
            .delete()
            .eq('id', id)

            if (error) {
                return {success: false, error: error.message}
            }

            return {success: true}
    } catch (error) {
        return {success: false, error: error.message}
    }
};