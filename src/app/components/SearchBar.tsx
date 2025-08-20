"use client";

import React from "react";
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  folders: string[];
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
  searchQuery: string;
}

export default function SearchBar({ folders, selectedFolder, onFolderChange, searchQuery }: SearchBarProps) {
  const { t } = useLanguage();
  // const [isDropdownOpen, setIsDropdownOpen] = React.useState(false); // Reserved for future use
  
  const buildFolderTree = (folderPaths: string[]) => {
    const tree: any[] = [];
    const nodeMap = new Map();
    
    // Clean folder paths
    const cleanPaths = folderPaths.map(path => {
      if (!path) return '';
      const segments = path.split('/').filter(Boolean);
      const uniqueSegments: string[] = [];
      
      for (const segment of segments) {
        if (uniqueSegments.length === 0 || uniqueSegments[uniqueSegments.length - 1] !== segment) {
          if (!['书签栏', 'Bookmarks Bar', 'Bookmarks', '收藏夹'].includes(segment)) {
            uniqueSegments.push(segment);
          }
        }
      }
      
      return uniqueSegments.join('/');
    }).filter(Boolean);
    
    // Build tree structure
    cleanPaths.forEach(path => {
      const segments = path.split('/');
      let currentPath = '';
      
      segments.forEach((segment, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        
        if (!nodeMap.has(currentPath)) {
          const node = {
            name: segment,
            fullPath: currentPath,
            children: [],
            level: index
          };
          
          nodeMap.set(currentPath, node);
          
          if (parentPath && nodeMap.has(parentPath)) {
            nodeMap.get(parentPath).children.push(node);
          } else {
            tree.push(node);
          }
        }
      });
    });
    
    return tree;
  };

  // const getLastFolderName = (folderPath: string): string => {
  //   if (!folderPath) return '';
  //   const segments = folderPath.split('/').filter(Boolean);
  //   return segments[segments.length - 1] || '';
  // };
  
  const folderTree = buildFolderTree(folders);
  const [showAllCategories, setShowAllCategories] = React.useState(false);

  const renderFolderTags = (nodes: any[], level = 0) => {
    const tags: React.ReactElement[] = [];
    
    nodes.forEach((node) => {
      const isSelected = selectedFolder === node.fullPath;
      const indent = level > 0 ? '　'.repeat(level) : '';
      
      tags.push(
        <button
          key={node.fullPath}
          onClick={() => onFolderChange(isSelected ? null : node.fullPath)}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isSelected
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg neon-primary'
              : 'bg-surface/50 text-foreground/70 border border-border/30 hover:bg-surface/70 hover:text-foreground hover:border-primary/30'
          }`}
          title={node.fullPath}
        >
          {level > 0 && (
            <span className="text-xs opacity-60 mr-1">
              {'└'.repeat(level)}
            </span>
          )}
          <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="truncate max-w-[120px]">{indent}{node.name}</span>
          {isSelected && (
            <svg className="w-3 h-3 ml-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      );
      
      // Add children tags
      if (node.children && node.children.length > 0) {
        tags.push(...renderFolderTags(node.children, level + 1));
      }
    });
    
    return tags;
  };

  const allTags = renderFolderTags(folderTree);
  const visibleTags = showAllCategories ? allTags : allTags.slice(0, 8);

  return (
    <div className="flex items-start justify-between">
      {/* Tag-based Category Filter */}
      {folders.length > 0 && (
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2 mb-2">
            
            {/* All Categories Button */}
            <button
              onClick={() => onFolderChange(null)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                !selectedFolder
                  ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg'
                  : 'bg-surface/30 text-foreground/60 border border-border/20 hover:bg-surface/50 hover:text-foreground'
              }`}
            >
              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('search.allFolders')}
            </button>
          </div>
          
          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {visibleTags}
            
            {/* Show More/Less Button */}
            {allTags.length > 8 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-border/20 text-foreground/50 hover:bg-border/30 hover:text-foreground/70 transition-all duration-200"
              >
                {showAllCategories ? (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {t('search.showLess')}
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    +{allTags.length - 8} {t('search.more')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Search Status */}
      <div className="flex items-center text-sm text-foreground/60 flex-shrink-0">
        {searchQuery && (
          <span className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
            {t('search.searching')}: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
}
