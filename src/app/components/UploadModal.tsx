"use client";

import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export default function UploadModal({ isOpen, onClose, onFileSelect }: UploadModalProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      onClose();
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl p-8 max-w-md w-full mx-4 glass neon-primary">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{t('upload.title')}</h2>
          <p className="text-sm text-foreground/70">{t('upload.description')}</p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="p-4 bg-surface/30 rounded-lg border border-border/30">
            <div className="flex items-center space-x-3 text-sm text-foreground/60">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('upload.supportedFormats')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleChooseFile}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 neon-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>{t('button.chooseFile')}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 bg-surface/50 hover:bg-surface/70 text-foreground/70 hover:text-foreground font-medium rounded-lg transition-all duration-200 border border-border/30"
            >
              {t('button.cancel')}
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
