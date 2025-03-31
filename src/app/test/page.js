'use client'
import { useEffect, useState, useRef } from "react";

export default function TestPage() {
    const [imageDimensions, setImageDimensions] = useState({ 
        width: 0, 
        height: 0,
        aspectRatio: 0 
    });
    const [clickLocation, setClickLocation] = useState({ 
        display: { x: 0, y: 0 },
        original: { x: 0, y: 0 }
    });
    const [scale, setScale] = useState(1.0);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    
    // For dragging/panning
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    function getImageDimensions(url, callback) {
        const img = new Image();
        img.onload = function() {
            const dimensions = {
                width: this.width,
                height: this.height,
                aspectRatio: this.width / this.height
            };
            callback(dimensions);
        };
        img.src = url;
    }

    const handleImageClick = (e) => {
        // Don't register clicks if we actually dragged
        if (dragRef.current.hasMoved) {
            // Reset the flag
            dragRef.current.hasMoved = false;
            return;
        }
        
        // Rest of your click handling code...
        const rect = e.target.getBoundingClientRect();
        
        // Get coordinates relative to the displayed image
        const displayX = e.clientX - rect.left;
        const displayY = e.clientY - rect.top;
        
        // With CSS transform, we need to adjust the coordinates
        const adjustedX = displayX / scale;
        const adjustedY = displayY / scale;
        
        // Original coordinates
        const originalX = Math.round(adjustedX);
        const originalY = Math.round(adjustedY);
        
        setClickLocation({
            display: { x: displayX, y: displayY },
            original: { x: originalX, y: originalY }
        });
    };

    const handleMouseDown = (e) => {
        // Only enable dragging when Shift key is pressed
        if (e.shiftKey) {
            const container = containerRef.current;
            if (!container) return;
            
            setIsDragging(true);
            
            // Record starting position and current scroll
            dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop,
                hasMoved: false
            };
            
            // Change cursor style
            document.body.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const container = containerRef.current;
        if (!container) return;
        
        // Calculate how far the mouse has moved
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        
        // Check if we've moved a significant distance
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragRef.current.hasMoved = true;
        }
        
        // Set new scroll position
        container.scrollLeft = dragRef.current.scrollLeft - dx;
        container.scrollTop = dragRef.current.scrollTop - dy;
    };

   // Handler for ending drag
   const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
};

    const handleScaleChange = (e) => {
        setScale(parseFloat(e.target.value));
    }

    // Calculate current dimensions based on scale
    const scaledWidth = Math.round(imageDimensions.width * scale);
    const scaledHeight = Math.round(imageDimensions.height * scale);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            // Add event listeners for dragging
            container.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('mouseleave', handleMouseUp);
            
            // Cleanup
            return () => {
                container.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('mouseleave', handleMouseUp);
            };
        }
    }, [isDragging]); // Re-attach listeners when dragging state changes

    useEffect(() => {
        const imageUrl = 'https://zchkrqcmywmtlcwbxpgh.supabase.co/storage/v1/object/public/Review-Approval/deliverables/web-9071484.png';
        
        getImageDimensions(imageUrl, (dimensions) => {
            setImageDimensions(dimensions);
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === 'Shift') {
            setIsShiftPressed(true);
          }
        };
        
        const handleKeyUp = (e) => {
          if (e.key === 'Shift') {
            setIsShiftPressed(false);
          }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
      }, []);
    
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex w-1/2 h-full overflow-hidden">
                <div
                    ref={containerRef} 
                    className="w-full relative overflow-auto" 
                    style={{
                        height: '600px',
                        width: '800px',
                        border: '1px solid #ccc',
                        cursor: isDragging ? 'grabbing' : (isShiftPressed ? 'grab' : 'default')
                    }}
                >
                    <img
                        ref={imageRef}
                        src={'https://zchkrqcmywmtlcwbxpgh.supabase.co/storage/v1/object/public/Review-Approval/deliverables/web-9071484.png'}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                        alt="Marketing Image"
                        onClick={handleImageClick}
                        style={{ 
                            maxWidth: 'none', 
                            maxHeight: 'none', 
                            transform: `scale(${scale})`, 
                            transformOrigin: '0 0',
                            userSelect: 'none' // Prevent selecting image while dragging
                        }}
                        draggable="false" // Prevent default dragging
                    />
                </div>
            </div>
            <div className="flex w-1/2 flex-col">
                <h1>Display: X: {clickLocation.display.x}, Y: {clickLocation.display.y}</h1>
                <h1>Original: X: {clickLocation.original.x}, Y: {clickLocation.original.y}</h1>
                <p>Image dimensions: {imageDimensions.width} x {imageDimensions.height}</p>
                <p>Image Aspect Ratio: {imageDimensions.aspectRatio?.toFixed(3)}</p>
                <p>Current Size: {scaledWidth} x {scaledHeight}</p>
                <p>Scale: {(scale * 100).toFixed(0)}%</p>

                <input
                    type="range"
                    min="0.1"
                    max="4"
                    step="0.1"
                    value={scale}
                    onChange={handleScaleChange}
                    className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                    Hold Shift + drag to pan the image
                </p>
            </div>
        </div>
    )
}