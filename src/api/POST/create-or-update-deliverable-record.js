'use server'
import { createClient } from "@/utils/supabase/server-supabase-instance";

export default async function createOrUpdateDeliverableRecord(prevState, formData) {
    const supabase = await createClient();
    const deliverable_name = formData.get('deliverable_name')
    const deliverable_description = formData.get('deliverable_description')
    const deliverable_type = formData.get('deliverable_type')
    const deliverable_start_date = formData.get('deliverable_start_date')
    const deliverable_end_date = formData.get('deliverable_end_date')
    const deliverable_status = formData.get('deliverable_status')
    const deliverable_content = formData.get('deliverable_content')
    const campaign_id = formData.get('campaign_id')
    const deliverable_id = formData.get('deliverable_id') || undefined

    try {
        const recordData = {
            'deliverable_name': deliverable_name,
            'deliverable_description': deliverable_description,
            'deliverable_type': deliverable_type,
            'deliverable_start_date': deliverable_start_date,
            'deliverable_end_date': deliverable_end_date,
            'deliverable_status': deliverable_status,
            'deliverable_content': deliverable_content,
            'campaign_id': campaign_id,
        }
        
        // Only include deliverable_id if it exists (editing mode)
        if (deliverable_id) {
            recordData.id = deliverable_id
        }
        
        const { data, error } = await supabase
            .from('deliverables')
            .upsert(recordData, { 
                onConflict: 'id', // Specify which column defines a conflict
                returning: 'minimal' // This is optional, but more efficient
            })

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data }
        
    } catch (error) {
        return { success: false, error: error.message }
    }
}