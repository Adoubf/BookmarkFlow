"use client";

import { useState } from "react";
import { useLanguage, Language } from '../contexts/LanguageContext';

interface TopNavigationProps {
  currentPage: 'home' | 'bookmarks' | 'distribution';
  onPageChange: (page: 'home' | 'bookmarks' | 'distribution') => void;
  bookmarkCount: number;
  onClearData?: () => void;
}

export default function TopNavigation({ currentPage, onPageChange, bookmarkCount, onClearData }: TopNavigationProps) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('nav.bookmarkFlow')}
              </h1>
              <p className="text-xs text-foreground/60">Modern Bookmark Navigation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onPageChange('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                currentPage === 'home'
                  ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                  : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{t('nav.home')}</span>
            </button>
            <button
              onClick={() => onPageChange('bookmarks')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                currentPage === 'bookmarks'
                  ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{t('nav.bookmarks')}</span>
              {bookmarkCount > 0 && (
                <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30">
                  {bookmarkCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onPageChange('distribution')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                currentPage === 'distribution'
                  ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                  : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{t('nav.distribution')}</span>
            </button>
          </div>

          {/* Language Switcher & Status */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-surface/30 rounded-lg border border-border/30 p-1">
              <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  language === 'zh'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
                }`}
              >
                EN
              </button>
            </div>
            
            <div className="text-sm text-foreground/60">
              {bookmarkCount}{t('nav.bookmarkCount')}
            </div>
            {bookmarkCount > 0 && onClearData && (
              <button
                onClick={onClearData}
                className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200"
                title={t('nav.clearData')}
              >
                <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('nav.clearData')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
