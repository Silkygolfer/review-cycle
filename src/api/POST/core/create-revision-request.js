'use server'
// WILL SOON BE DEPRECATED IN FAVOR OF CREATE REVIEW CYCLE

import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createRevisionRequest(prevState, formData) {
    const supabase = await createClient();
    const deliverable_id = formData.get('deliverable_id');
    const review_status = formData.get('review_status');
    const revision_comment = formData.get('revision_comment');

    try {
        // get user
        const { data: userData, error: userError } = await supabase
        .auth
        .getUser()

        if (userError) {
            return { success: false, error: userError.message }
        }

        const { data: revisionData, error: revisionError } = await supabase
        .from('review_cycles')
        .insert({
            'deliverable_id': deliverable_id,
            'review_status': review_status,
            'revision_comment': revision_comment,
            'submitted_by': userData.user.id
        })
        .select('review_status')
        .single()


        if (revisionError) {
            return { success: false, error: revisionError.message}
        }

        if (revisionData.review_status === 'approved') {
            const { error: approvedError } = await supabase
            .from('deliverables')
            .update({
                'deliverable_status': 'approved'
            })
            .eq('id', deliverable_id)

            if (approvedError) {
                return { success: false, error: approvedError.message}
            };
        } else {
            const { error: requestError } = await supabase
            .from('deliverables')
            .update({
                'deliverable_status': 'revision requested'
            })
            .eq('id', deliverable_id)

            if (requestError) {
                return { success: false, error: requestError.message}
            };
        };
        
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message}
    }
};