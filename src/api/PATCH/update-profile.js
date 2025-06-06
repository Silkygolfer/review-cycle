'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function updateProfile(prevState, formData) {
    const first_name = formData.get('first_name');
    const last_name = formData.get('last_name');
    const id = formData.get('id');
    
    try {
        const supabase = await createClient();

        const { data: userData, error: userError } = await supabase.from('users').update({
            first_name: first_name,
            last_name: last_name
        }).eq('id', id)
        .select()

        if (userError) {
            return { success: false, error: userError.message };
        }
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}