"use client";

import { useState, useEffect } from "react";
import BookmarkImporter from "./components/BookmarkImporter";
import TopNavigation from "./components/TopNavigation";
import CategorySidebar from "./components/CategorySidebar";
import Footer from "./components/Footer";
import DistributionChart from "./components/DistributionChart";
import ScrollToTop from "./components/ScrollToTop";
import { ConfirmModal } from "./components/Modal";
import { useLanguage } from "./contexts/LanguageContext";

// Dynamic imports for better performance
import dynamic from 'next/dynamic';

const BookmarkGrid = dynamic(() => import('./components/BookmarkGrid'), {
  loading: () => <div className="animate-pulse bg-surface/50 rounded-lg h-48" />
});

const SearchBar = dynamic(() => import('./components/SearchBar'), {
  loading: () => <div className="animate-pulse bg-surface/50 rounded-lg h-12" />
});

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
  tags?: string[];
  dateAdded?: Date;
}

const STORAGE_KEY = 'bookmarkflow-data';

export default function Home() {
  const { t } = useLanguage();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'bookmarks' | 'distribution'>('home');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('grid');

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.bookmarks && Array.isArray(parsedData.bookmarks)) {
          setBookmarks(parsedData.bookmarks);
          if (parsedData.bookmarks.length > 0) {
            setCurrentPage('bookmarks');
          }
        }
        if (parsedData.viewMode) {
          setViewMode(parsedData.viewMode);
        }
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage:', error);
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    try {
      const dataToSave = {
        bookmarks,
        viewMode,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage:', error);
    }
  }, [bookmarks, viewMode]);


  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || bookmark.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const folders = Array.from(new Set(bookmarks.map(b => b.folder).filter(Boolean))) as string[];
  const bookmarkCounts = folders.reduce((acc, folder) => {
    acc[folder] = bookmarks.filter(b => b.folder === folder).length;
    return acc;
  }, {} as Record<string, number>);

  // Auto-switch to bookmarks page when bookmarks are imported
  const handleBookmarksImported = (importedBookmarks: Bookmark[]) => {
    setBookmarks(prev => [...prev, ...importedBookmarks]);
    if (importedBookmarks.length > 0) {
      setCurrentPage('bookmarks');
    }
  };

  // Clear all bookmark data
  const [showClearModal, setShowClearModal] = useState(false);
  
  const handleClearData = () => {
    setShowClearModal(true);
  };
  
  const confirmClearData = () => {
    setBookmarks([]);
    setSearchQuery("");
    setSelectedFolder(null);
    setCurrentPage('home');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNavigation 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          bookmarkCount={bookmarks.length}
          onClearData={handleClearData}
        />

        {/* Category Sidebar - Only show on bookmarks page */}
        {currentPage === 'bookmarks' && bookmarks.length > 0 && (
          <CategorySidebar
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
            bookmarkCounts={bookmarkCounts}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          currentPage === 'bookmarks' && bookmarks.length > 0 ? 'ml-64' : ''
        } pt-20 px-6 pb-6`}>
          <div className="max-w-7xl mx-auto">
          {currentPage === 'home' || bookmarks.length === 0 ? (
            /* Welcome Screen */
            <div className="text-center py-20">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary pulse-glow mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {t('home.title')}
                </h2>
                <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
                  {t('home.subtitle')}<br/>
                  {t('home.browserSupport')}
                </p>
              </div>
              
              <BookmarkImporter onBookmarksImported={handleBookmarksImported} existingBookmarks={bookmarks} />
              
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="glass rounded-xl p-6 neon-primary">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.smartSearch')}</h3>
                  <p className="text-foreground/60 text-sm">{t('features.smartSearchDesc')}</p>
                </div>
                
                <div className="glass rounded-xl p-6 neon-secondary">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.autoOrganization')}</h3>
                  <p className="text-foreground/60 text-sm">{t('features.autoOrganizationDesc')}</p>
                </div>
                
                <div className="glass rounded-xl p-6" style={{boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'}}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-accent/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('features.lightningFast')}</h3>
                  <p className="text-foreground/60 text-sm">{t('features.lightningFastDesc')}</p>
                </div>
              </div>
            </div>
          ) : currentPage === 'distribution' ? (
            /* Distribution Chart */
            <div className="space-y-6">
              <DistributionChart bookmarks={bookmarks} />
            </div>
          ) : (
            /* Bookmark Management Interface */
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <SearchBar 
                  searchQuery={searchQuery} 
                  onSearchChange={setSearchQuery}
                  folders={folders}
                  selectedFolder={selectedFolder}
                  onFolderChange={setSelectedFolder}
                />
                <BookmarkImporter onBookmarksImported={handleBookmarksImported} existingBookmarks={bookmarks} compact />
              </div>
              
              <BookmarkGrid bookmarks={filteredBookmarks} viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          )}
          </div>
        </main>

        {/* Footer - Sticky to bottom */}
        <div className="mt-auto">
          <Footer />
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
      
      {/* Clear Data Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearData}
        title={t('nav.clearData')}
        message={t('message.confirmClear')}
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        variant="danger"
      />
    </div>
  );
}

