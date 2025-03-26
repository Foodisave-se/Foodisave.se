import React, { useState, useEffect } from "react";

export default function StarRating({ rating, count }) {
    // Create an array of 5 stars, filled based on the rating
    const renderStars = () => {
      return Array.from({ length: 5 }, (_, index) => (
        <svg 
          key={index}
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 inline-block"
          fill={index < Math.round(rating) ? "#FFA500" : "none"} 
          viewBox="0 0 24 24" 
          stroke="#FFA500"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
          />
        </svg>
      ));
    };
  
    return (
      <div className="flex items-center">
        <div className="flex mr-2">
          {renderStars()}
        </div>
        <span className="text-xs text-gray-600">({count || 0})</span>
      </div>
    );
  }