'use client'

import { useState, useTransition, useRef } from 'react';
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFileToSupabase } from '@/data-stream/upload/upload-to-supabase';

export default function FileUploader({ 
  onUploadComplete, 
  label = "Upload File",
  className = "" 
}) {
  const [isPending, startTransition] = useTransition();
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [fileDetails, setFileDetails] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Reference to the file input element

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the selected file
      setUploadStatus('idle');
      handleUpload(file);
    }
  };

  const handleUpload = (file) => {
    setUploadStatus('uploading');
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFileToSupabase(formData);
      
      if (result.success) {
        setUploadStatus('success');
        setFileDetails(result.data);
        
        // Call the callback with the file URL and details
        if (onUploadComplete) {
          onUploadComplete(result.data.publicUrl, result.data);
        }
      } else {
        setUploadStatus('error');
        toast.error(result.error || 'Error uploading file');
      }
    });
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setFileDetails(null);
    
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onUploadComplete) {
      onUploadComplete('', null);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={isPending || uploadStatus === 'uploading'}
            className={`w-full ${uploadStatus === 'success' ? 'border-green-500' : uploadStatus === 'error' ? 'border-red-500' : ''}`}
          />
        </div>

        {/* Status indicators */}
        {uploadStatus === 'uploading' && (
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        )}
        {uploadStatus === 'success' && (
          <CheckCircle className="h-5 w-5 text-green-500" />
        )}
        {uploadStatus === 'error' && (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        
        {/* Reset button when file is uploaded */}
        {uploadStatus === 'success' && (
          <button 
            type="button" 
            onClick={resetUpload}
            className="text-gray-500 hover:text-red-500"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}