'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createClientUserRecord(prevState, formData) {
    const supabase = await createClient();
    // const user_first_name = formData.get('user_first_name');
    // const user_last_name = formData.get('user_last_name')
    const user_email = formData.get('user_email')
    const client_id = formData.get('client_id')
    const account_id = formData.get('account_id')

    try {
        // try to create user record
        const { data: userData, error: userError } = await supabase
        .auth
        .admin
        .createUser({
            email: user_email,
            email_confirm: false,
            // user_metadata: {
            //    'first_name': user_first_name,
            //    'last_name': user_last_name,
            // },
            password: null
        })

        // if existing user, get userData & add client_permissions to new client
        if (userError) {
            if (userError.code === 'email_exists') {
                const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('email', user_email)
                .single()

            if (userError) {
                return { success: false, error: userError.message }
            }

            // check to see if user has user_role in the correct account
            const { data: userRole, error: rolesError } = await supabase
            .from('user_roles')
            .insert({
                'user_id': userData.id,
                'role_id': '833562f8-2b3f-4357-a0e3-31831f512fa6',
                'account_id': account_id
            })

            if (rolesError) {
                if (rolesError.code === '23505') {
                    return { success: false, error: rolesError.message }
                } else {
                return { success: false, error: rolesError.message}
                }
            }

            const { data: assignmentData, error: assignmentError } = await supabase
            .from('client_assignments')
            .insert({
                'user_id': userData.id,
                'client_id': client_id,
                'account_id': account_id
            })

            if (assignmentError) {
                return { success: false, error: assignmentError.message}
            }

            return { success: true }
            };
        }
             //

        if (userError) {
            return { success: false, error: userError.message }
        }

        // invite user via email
        const { data: inviteData, error: inviteError } = await supabase
        .auth
        .admin
        .inviteUserByEmail(user_email, {
            redirectTo: 'http://localhost:3000/auth/invite'
        })

        if (inviteError) {
            return { success: false, error: inviteError.message}
        }

        // create user_role record for user linking to account
        const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .insert({
            'user_id': userData.user.id,
            'account_id': account_id,
            'role_id': '833562f8-2b3f-4357-a0e3-31831f512fa6'
        })

        if (roleError) {
            return { success: false, error: roleError.message}
        }

        // create permission record for user linking to client
        const { data: assignmentData, error: assignmentError } = await supabase
        .from('client_assignments')
        .insert({
            'user_id': userData.user.id,
            'client_id': client_id,
            'account_id': account_id
        })

        if (assignmentError) {
            return { success: false, error: assignmentError.message}
        }

        // set selected_account_id
        const { error: selectionError } = await supabase
        .from('users')
        .update({
            'selected_account_id': account_id
        })
        .eq('id', userData.user.id)

        if (selectionError) {
            return { success: false, error: selectionError.message}
        }

        return { success: true }

    } catch (error) {
        return { success: false, error: error.message }
    }
}