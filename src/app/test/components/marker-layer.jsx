'use client'

import { memo, useEffect, useState } from 'react';
import Marker from './marker';

/**
 * MarkerLayer component that displays markers over an image
 * 
 * @param {Object} props
 * @param {Array} props.markers - Array of marker objects
 * @param {number} props.scale - Current scale factor of the image
 * @param {Object} props.containerRef - Reference to the scrollable container
 * @param {function} [props.onMarkerClick] - Handler for marker click events
 * @param {string} [props.activeMarkerId] - ID of the currently active marker
 */
const MarkerLayer = ({ 
  markers = [], 
  scale = 1,
  containerRef,
  onMarkerClick,
  activeMarkerId 
}) => {
  const [scrollPosition, setScrollPosition] = useState({ scrollLeft: 0, scrollTop: 0 });

  // Monitor scroll position changes
  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    
    // Set initial scroll position
    setScrollPosition({
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop
    });

    // Handle scroll events
    const handleScroll = () => {
      setScrollPosition({
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop
      });
    };

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  if (!markers || markers.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {markers.map((marker, index) => (
        <Marker
          key={marker.id}
          id={marker.id}
          position={marker.position.original}
          scale={scale}
          scrollPosition={scrollPosition}
          number={index + 1}
          isActive={marker.id === activeMarkerId}
          onClick={() => onMarkerClick && onMarkerClick(marker.id)}
        />
      ))}
    </div>
  );
};

export default memo(MarkerLayer);