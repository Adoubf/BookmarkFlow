"use client";

import { useState } from "react";
import { Bookmark } from "../page";
import FaviconImage from "./FaviconImage";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  viewMode: 'list' | 'grid' | 'compact';
  onDeleteBookmark?: (id: string) => void;
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

function BookmarkCard({ bookmark, onDelete, viewMode = 'list' }: BookmarkCardProps & { viewMode?: 'list' | 'grid' | 'compact' }) {
  const [isHovered, setIsHovered] = useState(false);

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getLastFolderName = (folderPath: string): string => {
    if (!folderPath) return '';
    
    // Clean and get last segment
    const segments = folderPath.split('/').filter(Boolean);
    const uniqueSegments: string[] = [];
    
    for (const segment of segments) {
      // Skip duplicates and root folders
      if (uniqueSegments.length === 0 || uniqueSegments[uniqueSegments.length - 1] !== segment) {
        if (!['书签栏', 'Bookmarks Bar', 'Bookmarks', '收藏夹'].includes(segment)) {
          uniqueSegments.push(segment);
        }
      }
    }
    
    return uniqueSegments.length > 0 ? uniqueSegments[uniqueSegments.length - 1] : '';
  };

  const handleClick = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  if (viewMode === 'grid') {
    return (
      <div
        className="group relative glass rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer neon-primary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-200 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Favicon */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-surface/50 flex items-center justify-center flex-shrink-0">
            <FaviconImage url={bookmark.url} size="lg" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {bookmark.title}
            </h3>
            <p className="text-sm text-foreground/60 truncate">
              {getDomainFromUrl(bookmark.url)}
            </p>
          </div>
        </div>

        {/* Folder Tag */}
        {bookmark.folder && (
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent/20 text-accent border border-accent/30">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {getLastFolderName(bookmark.folder)}
            </span>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
    );
  }

  if (viewMode === 'compact') {
    return (
      <div
        className="group relative flex items-center p-2 rounded-lg glass hover:bg-primary/5 transition-all duration-200 cursor-pointer border border-border/30 hover:border-primary/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Favicon */}
        <div className="w-6 h-6 rounded bg-surface/50 flex items-center justify-center flex-shrink-0 mr-2">
          <FaviconImage url={bookmark.url} size="md" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {bookmark.title}
          </h3>
        </div>

        {/* Folder Tag */}
        {bookmark.folder && (
          <div className="flex-shrink-0 mr-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent border border-accent/30">
              {getLastFolderName(bookmark.folder)}
            </span>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(bookmark.id);
          }}
          className={`w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  // Default list view
  return (
    <div
      className="group relative flex items-center p-3 rounded-lg glass hover:bg-primary/5 transition-all duration-200 cursor-pointer border border-border/30 hover:border-primary/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Favicon */}
      <div className="w-8 h-8 rounded-lg bg-surface/50 flex items-center justify-center flex-shrink-0 mr-3">
        <FaviconImage url={bookmark.url} size="lg" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 mr-3">
        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200 mb-1">
          {bookmark.title}
        </h3>
        <p className="text-sm text-foreground/60 truncate">
          {getDomainFromUrl(bookmark.url)}
        </p>
      </div>

      {/* Folder Tag */}
      {bookmark.folder && (
        <div className="flex-shrink-0 mr-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent/20 text-accent border border-accent/30">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {getLastFolderName(bookmark.folder)}
          </span>
        </div>
      )}

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(bookmark.id);
        }}
        className={`w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 z-10 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function BookmarkGrid({ bookmarks, viewMode, onDeleteBookmark }: BookmarkGridProps) {
  const [localBookmarks, setLocalBookmarks] = useState(bookmarks);

  const handleDelete = (id: string) => {
    setLocalBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    // Notify parent component about the deletion
    if (onDeleteBookmark) {
      onDeleteBookmark(id);
    }
  };

  // Update local bookmarks when props change
  if (bookmarks !== localBookmarks && bookmarks.length !== localBookmarks.length) {
    setLocalBookmarks(bookmarks);
  }

  if (localBookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground/60 mb-2">No bookmarks found</h3>
        <p className="text-foreground/40">Try adjusting your search or import more bookmarks</p>
      </div>
    );
  }

  return (
    <div className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
        : viewMode === 'compact'
        ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1'
        : 'space-y-2 max-w-4xl mx-auto'
    }`}>
      {localBookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={handleDelete}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
