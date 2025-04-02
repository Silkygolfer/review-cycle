'use client'

import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react"

/**
 * ImageRender component for displaying and interacting with an image
 * 
 * @param {Object} props
 * @param {string} props.url - Image URL
 * @param {number} [props.initialScale=1.0] - Initial scale factor
 * @param {function} [props.onScaleChange] - Callback when scale changes
 * @param {function} [props.onClick] - Callback when image is clicked with location info
 * @param {boolean} [props.showControls=true] - Whether to show zoom controls
 * @param {Object} [props.containerRef] - Ref to the container element for scroll syncing
 */
export default function ImageRender({ 
  url, 
  initialScale = 1.0,
  onScaleChange,
  onClick,
  showControls = true,
  containerRef
}) {
    // State for image dimensions
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
        aspectRatio: 0
    });

    // State for image scale
    const [scale, setScale] = useState(initialScale);

    // State for Shift button press trigger
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    // State for dragging/panning
    const [isDragging, setIsDragging] = useState(false);

    // Refs
    const dragRef = useRef({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
        hasMoved: false
    });
    // Use provided containerRef or create local one
    const internalContainerRef = useRef(null);
    const effectiveContainerRef = containerRef || internalContainerRef;
    const imageRef = useRef(null);

    // Function to get image dimensions on load
    const getImageDimensions = (url, callback) => {
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
    };

    // Handle image click
    const handleImageClick = (e) => {
        if (dragRef.current.hasMoved) {
            dragRef.current.hasMoved = false;
            return;
        }

        if (!onClick) return;

        const rect = e.target.getBoundingClientRect();

        // Get coordinates of click on displayed image
        const displayX = e.clientX - rect.left;
        const displayY = e.clientY - rect.top;

        // Adjust coordinates by current scale
        const adjustedX = displayX / scale;
        const adjustedY = displayY / scale;

        // Get true coordinates for original image dimensions
        const originalX = Math.round(adjustedX);
        const originalY = Math.round(adjustedY);

        // Create location object
        const location = {
            display: { x: displayX, y: displayY },
            original: { x: originalX, y: originalY }
        };

        // Call onClick handler with location
        onClick(location);
    };

    // Handle mouse down for drag/pan
    const handleMouseDown = (e) => {
        if (e.shiftKey) {
            const container = effectiveContainerRef.current;
            if (!container) return;

            setIsDragging(true);

            dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop,
                hasMoved: false
            };

            document.body.style.cursor = 'grabbing';
        }
    };

    // Handle mouse move for drag/pan
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const container = effectiveContainerRef.current;
        if (!container) return;

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragRef.current.hasMoved = true;
        }

        container.scrollLeft = dragRef.current.scrollLeft - dx;
        container.scrollTop = dragRef.current.scrollTop - dy;
    };

    // Handle mouse up to end drag/pan
    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
    };

    // Handle scale change from slider
    const handleScaleChange = (newValue) => {
        const newScale = newValue[0];
        setScale(newScale);
        
        if (onScaleChange) {
            onScaleChange(newScale);
        }
    };

    // Calculate scaled dimensions
    const scaledWidth = Math.round(imageDimensions.width * scale);
    const scaledHeight = Math.round(imageDimensions.height * scale);

    // Effect for drag/pan event listeners
    useEffect(() => {
        const container = effectiveContainerRef.current;
        if (container) {
            container.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('mouseleave', handleMouseUp);
            
            return () => {
                container.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('mouseleave', handleMouseUp);
            };
        }
    }, [isDragging]);

    // Effect to get image dimensions
    useEffect(() => {
        getImageDimensions(url, (dimensions) => {
            setImageDimensions(dimensions);
        });
    }, [url]);

    // Effect for shift key events
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
        <div className="flex flex-col space-y-2">
            <div className="flex h-full">
                <div
                    ref={effectiveContainerRef} 
                    className="w-full relative overflow-auto" 
                    style={{
                        height: '600px',
                        width: '800px',
                        border: '1px solid #ccc',
                        cursor: isDragging ? 'grabbing' : (isShiftPressed ? 'grab' : 'default')
                    }}
                >
                    <div style={{ width: scaledWidth, height: scaledHeight, position: 'relative' }}>
                        <img
                            ref={imageRef}
                            src={url}
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                            alt="Image"
                            onClick={handleImageClick}
                            style={{ 
                                maxWidth: 'none', 
                                maxHeight: 'none', 
                                transform: `scale(${scale})`, 
                                transformOrigin: '0 0',
                                userSelect: 'none',
                                position: 'relative',
                                zIndex: 1
                            }}
                            draggable="false"
                        />
                    </div>
                </div>
            </div>
            
            {showControls && (
                <div className="flex flex-col">
                    <Slider
                        defaultValue={[initialScale]}
                        min={0.1}
                        max={4}
                        step={0.1}
                        onValueChange={handleScaleChange}
                        className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Hold Shift + drag to pan the image
                    </p>
                </div>
            )}
        </div>
    );
}