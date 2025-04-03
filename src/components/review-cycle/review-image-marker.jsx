'use client'

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import createRevisionComments from "@/api/POST/core/create-revision-comments";
import { Edit, Redo2, Trash, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

export default function ReviewImageMarker({ review_id, url, initialMarkers = [] }) {
    // intialize router
    const router = useRouter();

    // State for image dimensions
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
        aspectRatio: 0
    });

    // State for comment button loading
    const [isLoading, setIsLoading] = useState(false)

    // State for image scale
    const [scale, setScale] = useState(1.0);

    // State for Shift button press trigger
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    // State for dragging/panning
    const [isDragging, setIsDragging] = useState(false);

    // State for markers and comments
    const [markers, setMarkers] = useState(initialMarkers);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [activeComment, setActiveComment] = useState("");

    // State for comment index
    const [commentIndex, setCommentIndex] = useState(initialMarkers.length);

    // Set boolean return function for index comparison
    function needsSaved() {
        if (commentIndex === markers.length) {
            return false
        } else {
            return true
        }
    };

    // State for conditional highlight component
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [showHighlight, setShowHighlight] = useState(false);

    // Refs
    const dragRef = useRef({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
        hasMoved: false,
        lastClickLocation: null
    });
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Function to get image dimensions on load
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
    };

    // Function to handle clicking on the image and setting location
    const handleImageClick = (e) => {
        if (dragRef.current.hasMoved) {
            dragRef.current.hasMoved = false;
            return;
        }

        const rect = e.target.getBoundingClientRect();

        // Get coordinates of click on displayed image
        const displayX = e.clientX - rect.left;
        const displayY = e.clientY - rect.top;

        // Adjust coordinates for scale to get original image coordinates
        const originalX = Math.round(displayX / scale);
        const originalY = Math.round(displayY / scale);

        // Store click location
        dragRef.current.lastClickLocation = { x: originalX, y: originalY };
        
        // Show comment input after clicking
        setShowCommentInput(true);
    };

    // Function to add a marker with comment
    const handleAddComment = () => {
        if (activeComment.trim() !== "") {
            const newMarker = {
                id: uuidv4(),
                position: dragRef.current.lastClickLocation,
                comment: activeComment,
                url: url,
                review_cycle_id: review_id,
                created_at: new Date().toISOString()
            };
            
            setMarkers([...markers, newMarker]);
            setActiveComment("");
            setShowCommentInput(false);
        }
    };

    // Function to handle clicking on marker and opening comment highlight w selection
    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
        setShowHighlight(true);
    }


    // Function to call async commit comments to database
    const handleSubmitComments = async (markers) => {
        try {
            setIsLoading(true);
            const result = await createRevisionComments(markers);
            if (result.success) {
                console.log('Successfully submitted comments')
                setCommentIndex(markers.length);
            }
            if (result.error) {
                console.log('Failed to submit comments')
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Function to delete comments
    const handleDeleteComment = (id) => {
        if (selectedMarker.id === id && showHighlight) {
            setShowHighlight(false);
            setSelectedMarker(null);
        }
        const stateMarker = markers.filter(item => item.id !== id)
        setMarkers(stateMarker);
        router.refresh();
    }; 

    // Function to trigger when mouse button is clicked and held for drag/pan
    const handleMouseDown = (e) => {
        if (e.shiftKey) {
            const container = containerRef.current;
            if (!container) return;

            setIsDragging(true);

            dragRef.current = {
                ...dragRef.current,
                startX: e.clientX,
                startY: e.clientY,
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop,
                hasMoved: false
            };

            document.body.style.cursor = 'grabbing';
        }
    };

    // Function to handle the mouse moving for drag/pan
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const container = containerRef.current;
        if (!container) return;

        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragRef.current.hasMoved = true;
        }

        container.scrollLeft = dragRef.current.scrollLeft - dx;
        container.scrollTop = dragRef.current.scrollTop - dy;
    };

    // Handler for ending drag/pan
    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
    };

    // Calculate the scaled width and height for the parent container
    const scaledWidth = Math.round(imageDimensions.width * scale);
    const scaledHeight = Math.round(imageDimensions.height * scale);

    // useEffect to set event listeners on container and window
    useEffect(() => {
        const container = containerRef.current;
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

    // Local function for setting default scale
    function setLocalScale() {
        if (imageDimensions.width > 0 && containerRef.current) {
            const containerWidth = containerRef.current.clientWidth || 800;
            const initialScale = containerWidth / imageDimensions.width;
            setScale(initialScale);
        }
    }

    // useEffect to get image dimensions and set state
    useEffect(() => {
        getImageDimensions(url, (dimensions) => {
            setImageDimensions(dimensions);

            // Calculate initial scale to fit image width to container width
            if (dimensions.width > 0 && containerRef.current) {
                // Get actual container width from DOM, or fallback to 800
                const containerWidth = containerRef.current.clientWidth || 800;
                const initialScale = containerWidth / dimensions.width;
                setScale(initialScale);
            }
        });
    }, [url]);

    // useEffect to handle Shift key press
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
        <div className="flex flex-row space-x-4 w-full">
            <div className="flex flex-col space-y-2">
                <div className="flex relative">
                    <div
                        ref={containerRef} 
                        className="w-full relative overflow-auto" 
                        style={{
                            height: '600px',
                            width: '600px',
                            border: '1px solid #ccc',
                            cursor: isDragging ? 'grabbing' : (isShiftPressed ? 'grab' : 'pointer')
                        }}
                    >
                        <div 
                            style={{ 
                                width: scaledWidth, 
                                height: scaledHeight, 
                                position: 'relative' 
                            }}
                        >
                            <img
                                ref={imageRef}
                                src={url}
                                alt="Image"
                                onClick={handleImageClick}
                                style={{ 
                                    width: imageDimensions.width,
                                    height: imageDimensions.height,
                                    maxWidth: 'none', 
                                    maxHeight: 'none', 
                                    transform: `scale(${scale})`, 
                                    transformOrigin: '0 0',
                                    userSelect: 'none',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                                draggable="false"
                            />
                            
                            {/* Render markers directly on the image's parent div */}
                            {markers.map((marker, index) => (
                                <div
                                    key={marker.id}
                                    className="absolute rounded-full bg-red-500 border-2 border-white flex items-center justify-center"
                                    onClick={() => handleMarkerClick(marker)}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        left: `${marker.position.x * scale - 12}px`,
                                        top: `${marker.position.y * scale - 12}px`,
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}
                                    title={marker.comment}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Zoom control */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[60%] hover:bg-gray-200 hover:rounded-2xl opacity-10 hover:opacity-100 hover:z-50">
                        <div className="flex flex-col items-center justify-center pb-2">
                            <div className="flex items-center justify-center w-full">
                                <p className="text-black flex p-2 justify-center">Slide to zoom in and out</p>
                                <Button variant={'ghost'} className={'hover:bg-muted/10 hover:cursor-pointer'} onClick={() => setLocalScale()}>
                                    <Redo2 className="w-4 h-4 text-black hover:cursor-pointer" />
                                </Button>
                            </div>
                            <Slider
                                defaultValue={[1.0]}
                                value={[scale]}
                                min={0.1}
                                max={4}
                                step={0.01}
                                onValueChange={(newValue) => setScale(newValue[0])}
                                className={'w-full p-2'}
                            />
                        </div>
                    </div>
                </div>
                {/* Controls for completing review_cycle */}
                <div
                className="flex flex-row bg-muted/50 rounded-md w-full">
                    <h1 className="flex items-center ml-2 p-2">Approve or Submit Revision</h1>
                    <div
                    className="flex ml-auto p-2 flex-wrap">
                        <Button
                        variant={'outline'}
                        className={'hover:border-green-600 m-2 w-fit'}>Approve</Button>
                        <Button
                        variant={'outline'}
                        className={'hover:border-red-600 m-2 w-fit'}>Submit Revision</Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col max-w-[400px] h-full max-h-full">
                {/* Instructions */}
                <div className="flex flex-col italic font-semibold text-md w-full max-h-[148px] p-4 mb-2 space-y-2 rounded-md border-gray-300 bg-muted/50">
                    <p>Click on the image to leave a comment</p>
                    <p>Hold Shift + Click to move around on the image</p>
                </div>

                {/* Comment input form */}
                {showCommentInput && (
                    <div className="flex flex-col w-full border rounded-md">
                        <h3 className="flex items-center text-md font-medium p-2 m-2">Add Comment</h3>
                        <textarea 
                            className="flex p-2 border rounded-md mx-2 mb-2"
                            rows="3"
                            placeholder="Enter your comment here..."
                            value={activeComment}
                            onChange={(e) => setActiveComment(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant={'outline'}
                                className={'m-2 hover:border-red-500'} 
                                onClick={() => setShowCommentInput(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant={'outline'}
                                className={'m-2 hover:border-green-600'}
                                onClick={handleAddComment}
                            >
                                Add Comment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Conditionally render the comment highlight component */}
                {showHighlight && (
                    <div className="flex flex-col w-full border rounded-md relative border-blue-500 mt-4">
                        <div className="flex flex-row">
                            <div className="flex items-center text-sm italic p-2">
                                Marker Position: X:{selectedMarker.position.x}, Y:{selectedMarker.position.y}
                            </div>
                            <div className="flex p-2 ml-auto">
                                <Button variant={'ghost'} className={'w-8 h-8'} onClick={() => {
                                    setActiveComment('');
                                    setShowHighlight(false);
                                }}>
                                    <X />
                                </Button>
                                <Button variant={'ghost'} className={'w-8 h-8'}>
                                    <Edit className="flex w-3 h-3" />
                                </Button>
                                <Button 
                                variant={'ghost'} 
                                className={'w-8 h-8 hover:border hover:border-red-500'}
                                onClick={() => handleDeleteComment(selectedMarker.id)}>
                                    <Trash className="flex w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                        <Separator orientation="horizontal" className={'flex w-full'}/>
                        <div className="flex p-2 items-center text-lg">
                            <p className="text-md">
                                {selectedMarker.comment}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Comments list */}
                {markers.length > 0 && (
                    <div className="mt-2 w-full">
                        <h3 className="text-lg font-medium mb-2">Comments</h3>
                        <div className="flex max-h-[300px] border rounded-md divide-y">
                        <ScrollArea className={'overflow-hidden pt-2'}>
                            {markers.map((marker, index) => (
                                <div 
                                key={marker.id} 
                                className="p-3 flex items-center border-b space-x-2 hover:cursor-pointer"
                                onClick={() => {
                                    setSelectedMarker(marker);
                                    setShowHighlight(true);
                                }}>
                                    <div className="mr-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                        {index + 1}
                                    </div>
                                        <p className="line-clamp-3">{marker.comment}</p>
                                </div>
                            ))}
                        </ScrollArea>
                        </div>
                        <div className="flex w-full mt-3">
                            {needsSaved() && (
                            <>
                            <Button
                            variant={'outline'}
                            className={'hover:cursor-pointer hover:border-green-600'}
                            disabled={isLoading}
                            onClick={() => handleSubmitComments(markers)}
                            >
                                {isLoading ? 'Saving comments...' : 'Save Comments'}
                            </Button>
                            <p className="flex text-red-500 items-center text-sm italic text-wrap px-2">You have unsaved changes</p>
                            </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}