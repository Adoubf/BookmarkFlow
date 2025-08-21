"use client";

import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
  onImportData: () => void;
  bookmarkCount: number;
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onClearData, 
  onImportData, 
  bookmarkCount 
}: SettingsModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 glass rounded-2xl border border-border/50 neon-primary">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('settings.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-surface/50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div className="glass rounded-xl p-4 border border-border/30">
            <h3 className="text-sm font-medium text-foreground/70 mb-2">{t('settings.statistics')}</h3>
            <div className="flex items-center justify-between">
              <span className="text-foreground/60">{t('settings.totalBookmarks')}</span>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg border border-primary/30 font-medium">
                {bookmarkCount}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground/70">{t('settings.actions')}</h3>
            
            {/* Import Data Button */}
            <button
              onClick={() => {
                onImportData();
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 hover:border-primary/50 text-primary hover:text-primary transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{t('settings.importData')}</div>
                <div className="text-xs text-foreground/60">{t('settings.importDataDesc')}</div>
              </div>
            </button>

            {/* Clear Data Button */}
            {bookmarkCount > 0 && (
              <button
                onClick={() => {
                  onClearData();
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{t('settings.clearData')}</div>
                  <div className="text-xs text-foreground/60">{t('settings.clearDataDesc')}</div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/30 bg-surface/20 rounded-b-2xl">
          <div className="text-xs text-foreground/50 text-center">
            {t('settings.version')} {process.env.NEXT_PUBLIC_APP_VERSION}
          </div>
        </div>
      </div>
    </div>
  );
}