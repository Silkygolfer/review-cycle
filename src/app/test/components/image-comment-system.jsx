'use client'

import { useState, useEffect, useRef } from 'react';
import ImageRender from './image-render';
import MarkerLayer from './marker-layer';
import { CommentForm, CommentList } from './comment-system-components';

/**
 * ImageCommentSystem - A complete system for viewing images and adding/viewing comments
 * 
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the image
 * @param {Array} [props.initialComments] - Preloaded comments
 * @param {Array} [props.initialMarkers] - Preloaded markers
 * @param {function} [props.onCommentAdded] - Callback when a new comment is added
 * @param {boolean} [props.readOnly] - Whether to allow adding new comments
 */
export default function ImageCommentSystem({
  imageUrl,
  initialComments = [],
  initialMarkers = [],
  onCommentAdded,
  readOnly = false
}) {
  // Image and interaction state
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef(null);
  
  // Comment and marker state
  const [markers, setMarkers] = useState(initialMarkers);
  const [comments, setComments] = useState(initialComments);
  const [activeId, setActiveId] = useState(null);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  // Sync markers and comments with initialMarkers and initialComments when they change
  useEffect(() => {
    setMarkers(initialMarkers);
  }, [initialMarkers]);
  
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Handle image click to start comment process
  const handleImageClick = (location) => {
    if (readOnly) return;
    
    setPendingLocation(location);
    setShowCommentForm(true);
  };
  
  // Handle comment submission
  const handleCommentSubmit = (text) => {
    if (!pendingLocation) return;
    
    // Create unique IDs for marker and comment
    const id = Date.now().toString();
    
    // Create new marker
    const newMarker = {
      id,
      position: pendingLocation
    };
    
    // Create new comment
    const newComment = {
      id,
      text,
      timestamp: new Date(),
      markerId: id
    };
    
    // Update state
    setMarkers([...markers, newMarker]);
    setComments([...comments, newComment]);
    
    // Reset form state
    setPendingLocation(null);
    setShowCommentForm(false);
    
    // Call external handler if provided
    if (onCommentAdded) {
      onCommentAdded(newComment, newMarker);
    }
  };
  
  // Handle marker click
  const handleMarkerClick = (markerId) => {
    setActiveId(markerId === activeId ? null : markerId);
  };
  
  // Handle comment click
  const handleCommentClick = (commentId) => {
    setActiveId(commentId === activeId ? null : commentId);
  };
  
  // Cancel comment creation
  const handleCancelComment = () => {
    setPendingLocation(null);
    setShowCommentForm(false);
  };
  
  return (
    <div className="flex flex-col">
      {/* Image and markers container */}
      <div className="relative" ref={containerRef}>
        <ImageRender
          url={imageUrl}
          initialScale={scale}
          onScaleChange={setScale}
          onClick={handleImageClick}
          containerRef={containerRef}
        />
        
        {/* Marker overlay */}
        <MarkerLayer
          markers={markers}
          scale={scale}
          containerRef={containerRef}
          onMarkerClick={handleMarkerClick}
          activeMarkerId={activeId}
        />
      </div>
      
      {/* Comment form */}
      {showCommentForm && (
        <CommentForm
          onSubmit={handleCommentSubmit}
          onCancel={handleCancelComment}
        />
      )}
      
      {/* Comment list */}
      <CommentList
        comments={comments}
        activeCommentId={activeId}
        onCommentClick={handleCommentClick}
      />
    </div>
  );
}