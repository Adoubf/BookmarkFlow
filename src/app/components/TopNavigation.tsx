"use client";

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TopNavigationProps {
  currentPage: 'home' | 'bookmarks' | 'chart';
  onPageChange: (page: 'home' | 'bookmarks' | 'chart') => void;
  bookmarkCount: number;
  onUploadClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'list' | 'grid' | 'compact';
  onViewModeChange?: (mode: 'list' | 'grid' | 'compact') => void;
  onSettingsClick?: () => void;
}

export default function TopNavigation({ 
  currentPage, 
  onPageChange, 
  bookmarkCount, 
  onUploadClick,
  searchQuery: _searchQuery = '',
  onSearchChange: _onSearchChange,
  viewMode: _viewMode = 'grid',
  onViewModeChange: _onViewModeChange,
  onSettingsClick
}: TopNavigationProps) {
  const { t, language, setLanguage } = useLanguage();
  // Theme functionality removed for now
  const [_isSearchExpanded, _setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleBookmarksClick = () => {
    if (bookmarkCount === 0 && onUploadClick) {
      onUploadClick();
    } else {
      onPageChange('bookmarks');
    }
    setIsMobileMenuOpen(false);
  };
  
  const handlePageChange = (page: 'home' | 'bookmarks' | 'chart') => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary">
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('nav.bookmarkFlow')}
              </h1>
              <p className="text-xs text-foreground/60">Modern Bookmark Navigation</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface/50 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <button
              onClick={() => handlePageChange('home')}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base ${
                currentPage === 'home'
                  ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                  : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
              }`}
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden lg:inline">{t('nav.home')}</span>
            </button>
            <button
              onClick={handleBookmarksClick}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base ${
                currentPage === 'bookmarks'
                  ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
              }`}
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="hidden lg:inline">{t('nav.bookmarks')}</span>
              {bookmarkCount > 0 && (
                <span className="px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30">
                  {bookmarkCount}
                </span>
              )}
            </button>
            {bookmarkCount > 0 && (
              <button
                onClick={() => handlePageChange('chart')}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base ${
                  currentPage === 'chart'
                    ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                    : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
                }`}
              >
                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden lg:inline">{t('nav.distribution')}</span>
              </button>
            )}
          </div>

          {/* Language Switcher & Status */}
          <div className="hidden md:flex items-center space-x-4">
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
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="px-3 py-1.5 text-xs font-medium text-foreground/70 hover:text-foreground bg-surface/50 hover:bg-surface/70 border border-border/30 hover:border-border/50 rounded-lg transition-all duration-200"
                title={t('nav.settings')}
              >
                <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('nav.settings')}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/30">
            <div className="flex flex-col space-y-2 pt-4">
              <button
                onClick={() => handlePageChange('home')}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 text-left ${
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
                onClick={handleBookmarksClick}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between text-left ${
                  currentPage === 'bookmarks'
                    ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{t('nav.bookmarks')}</span>
                </div>
                {bookmarkCount > 0 && (
                  <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30">
                    {bookmarkCount}
                  </span>
                )}
              </button>
              
              {bookmarkCount > 0 && (
                <button
                  onClick={() => handlePageChange('chart')}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 text-left ${
                    currentPage === 'chart'
                      ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                      : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{t('nav.distribution')}</span>
                </button>
              )}
              
              {/* Mobile Language Switcher */}
              <div className="pt-2 border-t border-border/30 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/60">{t('nav.language')}</span>
                  <div className="flex items-center bg-surface/30 rounded-lg border border-border/30 p-1">
                    <button
                      onClick={() => setLanguage('zh')}
                      className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                        language === 'zh'
                          ? 'bg-primary text-white'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      中文
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                        language === 'en'
                          ? 'bg-primary text-white'
                          : 'text-foreground/60 hover:text-foreground'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
