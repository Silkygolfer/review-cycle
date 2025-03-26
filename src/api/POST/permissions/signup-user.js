'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export async function signupUser(prevState, formData) {
    const supabase = await createClient();
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:3000/auth/confirm'
            }
        })
        if (error) {
            return {success: null, error: error.message}
        }

        return {success: true, data}
    } catch (error) {
        return {success: false, error: error.message}
    };
};