'use client'

import { createClient } from "@/utils/supabase/client-supabase-instance";

/**
 * Server action to upload a file to Supabase storage
 * @param {FormData} formData - FormData containing the file to upload
 * @returns {Object} - Result with success status and data or error
 */
export async function uploadFileToSupabase(formData) {
    const supabase = await createClient();

  try {
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided' };
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `deliverables/${fileName}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('Review-Approval')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      
    if (error) {
      console.error('Supabase upload error:', error);
      return { success: false, error: error.message };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Review-Approval')
      .getPublicUrl(filePath);
      
    
    return { 
      success: true, 
      data: {
        publicUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }
    };
    
  } catch (error) {
    console.error('File upload error:', error);
    return { success: false, error: error.message || 'Error uploading file' };
  }
}