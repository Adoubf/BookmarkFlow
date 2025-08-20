"use client";

import { useState } from "react";
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  folders: string[];
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
}

export default function SearchBar({ searchQuery, onSearchChange, folders, selectedFolder, onFolderChange }: SearchBarProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 glass"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-foreground/60"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Folder Filter */}
      {folders.length > 0 && (
        <div className="relative min-w-[200px]">
          <select
            value={selectedFolder || ""}
            onChange={(e) => onFolderChange(e.target.value || null)}
            className="w-full px-4 py-3 bg-surface/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 glass appearance-none cursor-pointer"
          >
            <option value="">{t('search.allFolders')}</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Search Stats */}
      <div className="flex items-center text-sm text-foreground/60 whitespace-nowrap">
        {searchQuery || selectedFolder ? (
          <span className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
            {t('search.filteredResults')}
          </span>
        ) : (
          <span className="px-3 py-2">
            {t('search.allBookmarks')}
          </span>
        )}
      </div>
    </div>
  );
}
