'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance"
import { redirect } from "next/navigation"

export async function signoutUser() {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error("Error signing out:", error.message);
        return { success: false, error: error.message };
    }
    
    // Optionally redirect after sign out
    redirect("/login");
};