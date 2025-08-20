"use client";

import { useState } from "react";

interface FaviconImageProps {
  url: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FaviconImage({ url, className = "", size = 'md' }: FaviconImageProps) {
  const [imageError, setImageError] = useState(false);
  
  const getFaviconUrl = (websiteUrl: string): string | null => {
    try {
      const domain = new URL(websiteUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  };

  const faviconUrl = getFaviconUrl(url);

  if (!faviconUrl || imageError) {
    return (
      <svg 
        className={`${getSizeClasses()} text-foreground/40 ${className}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
        />
      </svg>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      className={`${getSizeClasses()} ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}