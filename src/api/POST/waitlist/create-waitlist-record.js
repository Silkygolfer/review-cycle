'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createWaitlistRecord(state, formData) {
    console.log(formData);
    const supabase = await createClient();
    const postObject = {
        'first_name': formData.get('first_name'),
        'last_name': formData.get('last_name'),
        'email': formData.get('email')
    }

    try {
        const { error: createError } = await supabase
        .from('waitlist')
        .insert(postObject)

        if (createError) {
            return { success: false, error: createError.message }
        }
        
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
};