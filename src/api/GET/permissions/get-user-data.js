import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function getUserData() {
    const supabase = await createClient();

    try {
        const { data: user, error: userError } = await supabase
        .auth
        .getUser();

        if (userError) {
            return { success: false, userError }
        }

        const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.user.id)
        .single()

        if (userDataError) {
            return { success: false, userDataError}
        }

        return { success: true, userData };
    } catch (error) {
        return { success: false, error: error.message}
    }
};