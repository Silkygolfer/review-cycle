'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function loginUser(prevState, formData) {
    const supabase = await createClient();
    const email = formData.get('email')
    const password = formData.get('password')

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data}
    } catch (error) {
        return { success: false, error: error.message}
    }
};