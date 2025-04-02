'use client'

import { memo } from 'react';

/**
 * Marker component that displays a single marker
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the marker
 * @param {Object} props.position - Position of the marker {x, y} in original image coordinates
 * @param {number} props.scale - Current scale factor of the image
 * @param {Object} props.scrollPosition - Current scroll position {scrollLeft, scrollTop}
 * @param {number} [props.number] - Optional number to display in the marker
 * @param {boolean} [props.isActive] - Whether the marker is currently active/selected
 * @param {function} [props.onClick] - Handler for marker click events
 */
const Marker = ({ 
  id, 
  position, 
  scale,
  scrollPosition = { scrollLeft: 0, scrollTop: 0 },
  number, 
  isActive = false, 
  onClick 
}) => {
  // Default marker size in pixels (diameter)
  const markerSize = 24;
  const halfSize = markerSize / 2;
  
  // Calculate position based on image scale and container scroll
  // We subtract the scroll position to adjust the marker position when scrolling
  const scaledX = position.x * scale;
  const scaledY = position.y * scale;
  
  const left = scaledX - halfSize - scrollPosition.scrollLeft;
  const top = scaledY - halfSize - scrollPosition.scrollTop;
  
  // Calculate if the marker is currently visible in the viewport
  // This helps with performance by not rendering off-screen markers
  const isVisible = true; // We can implement visibility check if needed
  
  if (!isVisible) return null;
  
  return (
    <div
      className={`fixed rounded-full flex items-center justify-center pointer-events-auto 
                 ${isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
      style={{
        width: `${markerSize}px`,
        height: `${markerSize}px`,
        left: `${left}px`,
        top: `${top}px`,
        backgroundColor: isActive ? '#3b82f6' : '#ef4444', // blue if active, red by default
        border: '2px solid white',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
        cursor: 'pointer',
        zIndex: isActive ? 20 : 10
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering image click
        onClick && onClick(id);
      }}
      title={`Marker ${number || ''}`}
    >
      {number}
    </div>
  );
};

export default memo(Marker);