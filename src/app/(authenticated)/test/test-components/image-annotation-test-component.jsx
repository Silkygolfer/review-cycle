'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

const BasicImageDialog = ({ imageUrl, buttonText = "View Image" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

  // Load image dimensions
  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Calculate dialog size based on image dimensions
  const getDialogStyles = () => {
    // Default minimum size if image dimensions aren't available yet
    if (imageDimensions.width === 0) return { maxWidth: '90vw', width: '1200px' };
    
    // Calculate total width including the white panel (25% extra)
    // Use Math.max to ensure we don't go below minimum width of 1200px
    const totalWidth = Math.max(
      1200, // Minimum width in pixels
      Math.min(imageDimensions.width * 1.25, window.innerWidth * 0.9)
    );
    
    return {
      maxWidth: '90vw',
      width: `${totalWidth}px`
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Image className="mr-2" size={16} />
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent style={getDialogStyles()} className="p-0">
        <div className="flex flex-row w-full">
          <div className="w-3/4">
            <img 
              ref={imgRef}
              src={imageUrl} 
              alt="Image preview" 
              className="w-full h-auto"
            />
          </div>
          <div className="w-1/4 bg-muted/50 p-4">
            {/* Content for white panel */}
            {imageDimensions.width > 0 && (
              <div className="text-sm text-gray-500">
                <p>Image dimensions:</p>
                <p>{imageDimensions.width} × {imageDimensions.height}</p>
                <p>Aspect ratio: {(imageDimensions.width / imageDimensions.height).toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BasicImageDialog;