'use client'

import { useRef, useState } from 'react';
import { Input } from "../ui/input";
import { FileIcon, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFileToSupabase } from '@/data-stream/upload/upload-to-supabase';

export default function FileUploader({ 
  value, 
  onChange, 
  disabled,
  allowedFileTypes = [],
  acceptAttribute = "",
  maxSizeInMB = 10 
}) {

  // set State for loading
  const [isLoading, setIsLoading] = useState(false);

  // set State for fileName
  const [fileName, setFileName] = useState(value ? getFileNameFromUrl(value) : '');

  // set file input ref
  const fileInputRef = useRef(null);

  // function to get the file name to display
  function getFileNameFromUrl(url) {
    if (!url) return '';
    try {
      return decodeURIComponent(url.split('/').pop());
    } catch (e) {
      return 'Uploaded file';
    }
  }

  // function to handle changing the file
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type if restrictions are set
    if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
      toast.error(`Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`File size exceeds the ${maxSizeInMB}MB limit`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadFileToSupabase(formData);
      
      if (result.success) {
        // Simply call the onChange with the new URL
        onChange(result.data.publicUrl);
      } else {
        toast.error(result.error || 'Upload failed');
        setFileName('');
      }
    } catch (error) {
      toast.error('Error uploading file');
      setFileName('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFileName('');
    onChange('');
  };

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="border rounded-md p-2 w-full grid grid-cols-[1fr,auto] gap-2 items-center">
          <div className="flex items-center gap-2 min-w-0">
            <FileIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">{fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleReplaceClick}
              className="text-xs px-2 py-1 rounded border"
              disabled={disabled}
            >
              Replace
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              aria-label="Remove file"
              disabled={disabled}
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            onChange={handleFileChange}
            disabled={isLoading || disabled}
            className="w-full"
            accept={acceptAttribute}
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      )}
      
      {/* Hidden file input for replacement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading || disabled}
        accept={acceptAttribute}
      />
    </div>
  );
}