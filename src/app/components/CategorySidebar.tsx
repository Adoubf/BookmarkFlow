"use client";

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FolderNode {
  name: string;
  fullPath: string;
  children: FolderNode[];
  bookmarkCount: number;
  totalCount: number; // includes children
}

interface CategorySidebarProps {
  bookmarks: Bookmark[];
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  folder?: string;
  dateAdded?: Date;
}

export default function CategorySidebar({ bookmarks, selectedFolder, onFolderChange }: CategorySidebarProps) {
  const { t } = useLanguage();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  
  // Extract and clean folders from bookmarks
  const cleanFolderPath = (path: string): string => {
    if (!path) return '';
    
    // Remove duplicate segments and clean path
    const segments = path.split('/').filter(Boolean);
    const uniqueSegments: string[] = [];
    
    for (const segment of segments) {
      // Skip if it's the same as the previous segment (removes duplicates)
      if (uniqueSegments.length === 0 || uniqueSegments[uniqueSegments.length - 1] !== segment) {
        // Skip common root folders like "书签栏", "Bookmarks Bar", etc.
        if (!['书签栏', 'Bookmarks Bar', 'Bookmarks', '收藏夹'].includes(segment)) {
          uniqueSegments.push(segment);
        }
      }
    }
    
    return uniqueSegments.join('/');
  };
  
  const folders = [...new Set(
    bookmarks
      .map(b => cleanFolderPath(b.folder || ''))
      .filter(Boolean)
  )];
  
  // Calculate bookmark counts per folder (exact match only)
  const _bookmarkCounts = bookmarks.reduce((acc, bookmark) => {
    const folder = cleanFolderPath(bookmark.folder || '');
    if (folder) {
      acc[folder] = (acc[folder] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const totalBookmarks = bookmarks.length;

  // Build hierarchical folder structure
  const buildFolderTree = (folderList: string[]): FolderNode[] => {
    const tree: FolderNode[] = [];
    const nodeMap = new Map<string, FolderNode>();

    // Create all nodes first
    folderList.forEach(folder => {
      const parts = folder.split('/');
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!nodeMap.has(currentPath)) {
          const node: FolderNode = {
            name: part,
            fullPath: currentPath,
            children: [],
            bookmarkCount: 0, // Will be calculated later
            totalCount: 0
          };
          nodeMap.set(currentPath, node);
          
          if (parentPath && nodeMap.has(parentPath)) {
            nodeMap.get(parentPath)!.children.push(node);
          } else if (index === 0) {
            tree.push(node);
          }
        }
      });
    });

    // Calculate total counts (including children and sub-folders)
    const calculateTotalCount = (node: FolderNode): number => {
      // Count direct bookmarks in this folder
      const directCount = bookmarks.filter(b => {
        const cleanBookmarkFolder = cleanFolderPath(b.folder || '');
        return cleanBookmarkFolder === node.fullPath;
      }).length;
      
      // Count bookmarks in all sub-folders
      const subFolderCount = bookmarks.filter(b => {
        const cleanBookmarkFolder = cleanFolderPath(b.folder || '');
        return cleanBookmarkFolder.startsWith(node.fullPath + '/');
      }).length;
      
      node.bookmarkCount = directCount;
      node.totalCount = directCount + subFolderCount;
      return node.totalCount;
    };
    
    tree.forEach(calculateTotalCount);
    return tree;
  };

  const folderTree = buildFolderTree(folders as string[]);

  // Auto-expand root level folders on first load
  React.useEffect(() => {
    if (folderTree.length > 0 && expandedFolders.size === 0) {
      const rootFolders = folderTree.map(node => node.fullPath);
      setExpandedFolders(new Set(rootFolders));
    }
  }, [folderTree.length, expandedFolders.size, folderTree]);

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderNode = (node: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.fullPath);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedFolder === node.fullPath;
    const paddingLeft = level * 16 + 8;

    return (
      <div key={node.fullPath} className="folder-node">
        <div className="flex items-center">
          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              onClick={() => toggleFolder(node.fullPath)}
              className="p-0.5 lg:p-1 hover:bg-surface/30 rounded transition-colors duration-200 mr-0.5 lg:mr-1"
              style={{ marginLeft: `${level * 12}px` }}
            >
              <svg 
                className={`w-2.5 h-2.5 lg:w-3 lg:h-3 text-foreground/60 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : 'rotate-0'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Folder button */}
          <button
            onClick={() => onFolderChange(node.fullPath)}
            className={`flex-1 flex items-center p-1.5 lg:p-2 rounded-md lg:rounded-lg transition-all duration-200 group ${
              isSelected
                ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
            }`}
            style={{ marginLeft: hasChildren ? '0' : `${paddingLeft}px` }}
            title={node.fullPath}
          >
            <div className="flex items-center space-x-2 lg:space-x-3 flex-1 min-w-0">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="font-medium text-xs lg:text-sm truncate">{node.name}</span>
            </div>
            <div className="flex items-center space-x-0.5 lg:space-x-1">
              {hasChildren && (
                <span className="px-1 lg:px-1.5 py-0.5 text-xs bg-accent/10 text-accent/70 rounded border border-accent/20 flex-shrink-0">
                  {node.totalCount}
                </span>
              )}
              <span className="px-1.5 lg:px-2 py-0.5 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30 flex-shrink-0 min-w-[20px] lg:min-w-[24px] text-center">
                {node.bookmarkCount}
              </span>
            </div>
          </button>
        </div>
        
        {/* Children with smooth animation */}
        {hasChildren && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="ml-6 border-l border-border/30 pl-2 mt-1">
              {node.children.map(child => renderFolderNode(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 h-screen fixed left-0 top-16 bg-surface/30 backdrop-blur-md border-r border-border/50 flex flex-col z-30">
      <div className="p-4 lg:p-6 border-b border-border/30">
        <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary">
            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="text-base lg:text-lg font-semibold text-foreground">{t('sidebar.categories')}</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* All Bookmarks */}
          <button
            onClick={() => onFolderChange(null)}
            className={`w-full flex items-center p-2 lg:p-3 rounded-md lg:rounded-lg transition-all duration-200 group ${
              selectedFolder === null
                ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
            }`}
          >
            <div className="flex items-center space-x-2 lg:space-x-3 flex-1 min-w-0">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V11H5V9z" />
              </svg>
              <span className="font-medium text-xs lg:text-sm truncate">{t('sidebar.allBookmarks')}</span>
            </div>
            <span className="px-1.5 lg:px-2 py-0.5 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30 flex-shrink-0 min-w-[20px] lg:min-w-[24px] text-center">
              {totalBookmarks}
            </span>
          </button>

          {/* Hierarchical Folder Categories */}
          {folderTree.length > 0 && (
            <div className="mt-2 space-y-1">
              {folderTree.map(node => renderFolderNode(node))}
            </div>
          )}

          {/* Empty State */}
          {folders.length === 0 && (
            <div className="text-center py-8 px-2">
              <svg className="w-10 h-10 mx-auto mb-3 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-sm text-foreground/50">{t('nav.noCategories')}</p>
              <p className="text-xs text-foreground/40 mt-1">{t('nav.noCategoriesDesc')}</p>
            </div>
          )}
        </div>
        
        {/* Category count info */}
        {folders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30 flex-shrink-0">
            <p className="text-xs text-foreground/50 text-center">
              {t('nav.totalCategories', { count: folders.length })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
