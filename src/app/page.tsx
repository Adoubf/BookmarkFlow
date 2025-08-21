"use client";

import { useState, useEffect } from "react";
import BookmarkImporter from "./components/BookmarkImporter";
import TopNavigation from "./components/TopNavigation";
// import CategorySidebar from "./components/CategorySidebar"; // Removed
import Footer from "./components/Footer";
import DistributionChart from "./components/DistributionChart";
import ScrollToTop from "./components/ScrollToTop";
import { ConfirmModal } from "./components/Modal";
import UploadModal from "./components/UploadModal";
import SettingsModal from "./components/SettingsModal";
import { useLanguage } from "./contexts/LanguageContext";
import { cleanFolderPath, parseHtmlBookmarks, parseJsonBookmarks, removeDuplicateBookmarks } from "./utils/bookmarkUtils";

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
  const [currentPage, setCurrentPage] = useState<'home' | 'bookmarks' | 'chart'>('home');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
    
    // Clean both the bookmark folder and selected folder for comparison
    const cleanBookmarkFolder = cleanFolderPath(bookmark.folder || '');
    const cleanSelectedFolder = selectedFolder ? cleanFolderPath(selectedFolder) : null;
    
    // Match folder: exact match or bookmark folder starts with selected folder (for sub-folders)
    const matchesFolder = !cleanSelectedFolder || 
                         cleanBookmarkFolder === cleanSelectedFolder ||
                         cleanBookmarkFolder.startsWith(cleanSelectedFolder + '/');
    
    return matchesSearch && matchesFolder;
  });

  const folders = Array.from(new Set(bookmarks.map(b => b.folder).filter(Boolean))) as string[];

  // Auto-switch to bookmarks page when bookmarks are imported
  const handleBookmarksImported = (importedBookmarks: Bookmark[]) => {
    setBookmarks(prev => [...prev, ...importedBookmarks]);
    if (importedBookmarks.length > 0) {
      setCurrentPage('bookmarks');
    }
  };

  // Handle file upload from modal
  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      let parsedBookmarks: Bookmark[] = [];
      
      if (file.name.endsWith('.html')) {
        // Parse HTML bookmark file using unified function
        parsedBookmarks = parseHtmlBookmarks(text);
      } else if (file.name.endsWith('.json')) {
        // Parse JSON bookmark file using unified function
        parsedBookmarks = parseJsonBookmarks(text);
      }
      
      if (parsedBookmarks.length > 0) {
        // Remove duplicates using unified function
        const newBookmarks = removeDuplicateBookmarks(parsedBookmarks, bookmarks);
        
        if (newBookmarks.length > 0) {
          const updatedBookmarks = [...bookmarks, ...newBookmarks];
          setBookmarks(updatedBookmarks);
          
          // Save to localStorage
          const dataToSave = {
            bookmarks: updatedBookmarks,
            viewMode: viewMode,
            timestamp: Date.now()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
          
          // Switch to bookmarks page
          setCurrentPage('bookmarks');
        }
      }
    } catch (error) {
      console.error('Failed to parse bookmark file:', error);
    }
  };

  // Clear all bookmark data
  const confirmClearData = () => {
    setBookmarks([]);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentPage('home');
    setSelectedFolder(null);
    setSearchQuery('');
  };

  // Delete a single bookmark
  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
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
          onUploadClick={() => setShowUploadModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSettingsClick={() => setShowSettingsModal(true)}
        />

        {/* Main Content */}
        <main className="flex-1 pt-16 sm:pt-20 overflow-hidden">
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
          ) : currentPage === 'bookmarks' ? (
            /* Bookmark Management Interface */
            <div className="relative">
              {/* Main Content without sidebar */}
              <div className="min-h-screen flex flex-col">
                <div className="flex-1 p-6">
                  {/* Container with max width */}
                  <div className="max-w-[1200px] mx-auto">
                    {/* Top Bar with Search, Stats, and View Controls */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                    <SearchBar
                      folders={folders}
                      selectedFolder={selectedFolder}
                      onFolderChange={setSelectedFolder}
                      searchQuery={searchQuery}
                    />
                    
                    {/* Bookmark Count and View Controls */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Bookmark Count */}
                      <div className="text-sm text-foreground/60">
                        <span className="px-3 py-2 bg-surface/50 border border-border/30 rounded-lg">
                          {filteredBookmarks.length} {t('nav.bookmarks')}
                        </span>
                      </div>
                      
                      {/* View Mode Toggle */}
                      <div className="flex items-center bg-surface/50 border border-border/30 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded transition-all duration-200 ${
                            viewMode === 'grid'
                              ? 'bg-primary text-white shadow-md'
                              : 'text-foreground/60 hover:text-foreground hover:bg-surface/70'
                          }`}
                          title={t('view.grid')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded transition-all duration-200 ${
                            viewMode === 'list'
                              ? 'bg-primary text-white shadow-md'
                              : 'text-foreground/60 hover:text-foreground hover:bg-surface/70'
                          }`}
                          title={t('view.list')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setViewMode('compact')}
                          className={`p-2 rounded transition-all duration-200 ${
                            viewMode === 'compact'
                              ? 'bg-primary text-white shadow-md'
                              : 'text-foreground/60 hover:text-foreground hover:bg-surface/70'
                          }`}
                          title={t('view.compact')}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                    <div>
                      <BookmarkGrid
                        bookmarks={filteredBookmarks}
                        viewMode={viewMode}
                        onDeleteBookmark={handleDeleteBookmark}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Footer for bookmarks page */}
                <div className="mt-auto">
                  <Footer />
                </div>
              </div>
            </div>
          ) : currentPage === 'chart' ? (
            /* Distribution Chart */
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <DistributionChart bookmarks={bookmarks} />
              </div>
              <div className="flex-shrink-0">
                <Footer />
              </div>
            </div>
          ) : (
            /* Default fallback */
            <div></div>
          )}
        </main>

        {/* Footer - Only for home page */}
        {currentPage === 'home' && (
          <div className="mt-auto">
            <Footer />
          </div>
        )}

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onFileSelect={handleFileUpload}
      />
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onClearData={() => setShowClearModal(true)}
        onImportData={() => setShowUploadModal(true)}
        bookmarkCount={bookmarks.length}
      />
      
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

