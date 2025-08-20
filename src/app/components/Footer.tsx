"use client";

import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/50 glass">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BookmarkFlow
              </h3>
            </div>
            <p className="text-sm text-foreground/60 max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">{t('footer.features')}</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('footer.multiBrowser')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('footer.smartSearch')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('footer.autoDedupe')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('footer.privacy')}</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">{t('footer.supportedBrowsers')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <div className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded bg-blue-400"></div>
                </div>
                <span>Chrome</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <div className="w-4 h-4 rounded bg-orange-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded bg-orange-400"></div>
                </div>
                <span>Firefox</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <div className="w-4 h-4 rounded bg-blue-600/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded bg-blue-500"></div>
                </div>
                <span>Safari</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/60">
                <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded bg-green-400"></div>
                </div>
                <span>Edge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-foreground/50">
            {t('footer.copyright', { year: currentYear })}
          </div>
          <div className="flex items-center space-x-6 text-sm text-foreground/50">
            <span>{t('footer.builtWith')}</span>
            <div className="flex items-center space-x-1">
              <span>{t('footer.madeWith')}</span>
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>{t('footer.byAuthor')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
