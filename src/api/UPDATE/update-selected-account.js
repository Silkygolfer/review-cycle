'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function updateUserSelectedAccount(accountId) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
        return { success: false, error: "Not authenticated" };
    }
    
    const { error } = await supabase
        .from('users')
        .update({ selected_account_id: accountId })
        .eq('id', user.id);
    
    if (error) {
        return { success: false, error };
    }
    
    return { success: true };
}