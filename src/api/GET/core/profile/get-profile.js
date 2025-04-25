'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getProfile() {
    const supabase = await createClient();

    try {
        const { data: user, error: userError } = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, error: userError.message}
        }

        const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq("id", user.user.id)
        .single();

        console.log('userData: ', userData)
        console.log('userDataError: ', userDataError)

        if (userDataError) {
            return { success: false, error: userDataError.message}
        }

        return { success: true, userData}
    } catch (error) {
        return { success: false, error: error.message}
    }
}