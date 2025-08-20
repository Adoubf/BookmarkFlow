"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "zh" | "en";

// 允许占位符参数是 string | number（比如 {count}、{year}）
type TranslationParams = Record<string, string | number>;

// 所有文案都是 key -> string
type Messages = Record<string, string>;

// 语言 -> 文案映射
type TranslationMap = Record<Language, Messages>;

const translations: TranslationMap = {
  zh: {
    // Navigation
    "nav.bookmarkFlow": "BookmarkFlow",
    "nav.home": "首页",
    "nav.bookmarks": "书签",
    "nav.distribution": "分布图",
    "nav.clearData": "清除数据",
    "nav.bookmarkCount": "个书签",

    // Home page
    "home.title": "导入书签",
    "home.subtitle": "将你的浏览器书签转换为美丽的、可搜索的导航体验。",
    "home.browserSupport": "支持 Chrome、Firefox、Safari 和 Edge。",

    // Features
    "features.smartSearch": "智能搜索",
    "features.smartSearchDesc": "通过跨标题和 URL 的智能搜索立即找到任何书签",
    "features.autoOrganization": "自动组织",
    "features.autoOrganizationDesc": "保留你的文件夹结构并自动添加智能标签",
    "features.lightningFast": "闪电加载",
    "features.lightningFastDesc": "导航数千个书签，瞬间加载和流畅动画",

    // Bookmark Importer
    'importer.title': '导入书签',
    'importer.processing': '处理书签...',
    'importer.dragDrop': '拖放你的书签文件到这里，或者点击浏览',
    'importer.duplicateFilter': '重复项将被自动过滤',
    'importer.chooseFile': '选择文件',
    'importer.processing2': '处理中...',
    'importer.importMore': '导入更多',
    'importer.supportedFormats': '支持的格式：HTML (.html) 和 JSON (.json)',
    'importer.privacy': '你的书签在本地处理，永远不会发送到任何服务器',

    // Search
    "search.placeholder": "搜索书签...",
    "search.allFolders": "所有的分类",
    "search.filteredResults": "过滤后的结果",
    "search.allBookmarks": "所有的书签",

    // Messages
    "message.parseError": "解析书签文件失败，请确保文件是有效的书签导出文件。",
    "message.noBookmarks": "未找到书签。",
    "message.noNewBookmarks": "未找到新书签，所有书签均已存在。",
    "message.importSuccess": "导入了 {count} 个新书签，跳过 {duplicates} 个重复项。",
    "message.importFailed": "导入书签失败",
    "message.confirmClear":
      "确定要清除所有书签数据吗？此操作不可撤销。",

    // Buttons
    "button.confirm": "确认",
    "button.cancel": "取消",
    "button.ok": "确定",

    // View modes
    "view.list": "列表",
    "view.grid": "网格",
    "view.compact": "紧凑",

    // Chart
    "chart.bookmarkDistribution": "书签分布图",
    "chart.bookmarkCount": "书签数量",
    "chart.saveImage": "保存图片",
    "chart.noData": "暂无数据",
    "chart.noDataDesc": "导入一些书签后，这里将显示美丽的分布图表",
    "chart.totalBookmarks": "总书签数",
    "chart.totalFolders": "总文件夹数",
    "chart.avgPerFolder": "平均每文件夹",

    // Footer
    "footer.description":
      "现代化的书签管理工具，让您的网址导航更加高效便捷。支持主流浏览器导入，本地处理保护隐私。",
    "footer.features": "功能特性",
    "footer.multiBrowser": "多浏览器支持",
    "footer.smartSearch": "智能搜索过滤",
    "footer.autoDedupe": "自动去重导入",
    "footer.privacy": "本地隐私保护",
    "footer.supportedBrowsers": "支持的浏览器",
    "footer.copyright": "© {year} BookmarkFlow. 保留所有权利。",
    "footer.builtWith": "使用 Next.js & Tailwind CSS 构建",
    "footer.madeWith": "用",
    "footer.byAuthor": "制作 by Cascade AI",
  },
  en: {
    // Navigation
    "nav.bookmarkFlow": "BookmarkFlow",
    "nav.home": "Home",
    "nav.bookmarks": "Bookmarks",
    "nav.distribution": "Distribution",
    "nav.clearData": "Clear Data",
    "nav.bookmarkCount": " bookmarks",

    // Home page
    "home.title": "Import Your Bookmarks",
    "home.subtitle":
      "Transform your browser bookmarks into a beautiful, searchable navigation experience.",
    "home.browserSupport": "Support for Chrome, Firefox, Safari, and Edge.",

    // Features
    "features.smartSearch": "Smart Search",
    "features.smartSearchDesc":
      "Instantly find any bookmark with intelligent search across titles and URLs",
    "features.autoOrganization": "Auto Organization",
    "features.autoOrganizationDesc":
      "Preserve your folder structure and add smart tags automatically",
    "features.lightningFast": "Lightning Fast",
    "features.lightningFastDesc":
      "Navigate thousands of bookmarks with instant loading and smooth animations",

    // Bookmark Importer
    'importer.title': 'Import Your Bookmarks',
    'importer.processing': 'Processing Bookmarks...',
    'importer.dragDrop': 'Drag and drop your bookmark file here, or click to browse',
    'importer.duplicateFilter': 'Duplicates will be automatically filtered out',
    'importer.chooseFile': 'Choose File',
    'importer.processing2': 'Processing...',
    'importer.importMore': 'Import More',
    'importer.supportedFormats': 'Supported formats: HTML (.html) and JSON (.json)',
    'importer.privacy': 'Your bookmarks are processed locally and never sent to any server',

    // Search
    "search.placeholder": "Search bookmarks...",
    "search.allFolders": "All Folders",
    "search.filteredResults": "Filtered results",
    "search.allBookmarks": "All bookmarks",

    // Messages
    "message.parseError":
      "Failed to parse bookmark file. Please ensure it's a valid bookmark export.",
    "message.noBookmarks": "No bookmarks found in the file.",
    "message.noNewBookmarks":
      "No new bookmarks found. All bookmarks already exist.",
    "message.importSuccess":
      "Imported {count} new bookmarks. Skipped {duplicates} duplicates.",
    "message.importFailed": "Failed to import bookmarks",
    "message.confirmClear":
      "Are you sure you want to clear all bookmark data? This action cannot be undone.",

    // Buttons
    "button.confirm": "Confirm",
    "button.cancel": "Cancel",
    "button.ok": "OK",

    // View modes
    "view.list": "List",
    "view.grid": "Grid",
    "view.compact": "Compact",

    // Chart
    "chart.bookmarkDistribution": "Bookmark Distribution",
    "chart.bookmarkCount": "Bookmark Count",
    "chart.saveImage": "Save Image",
    "chart.noData": "No Data Available",
    "chart.noDataDesc":
      "Import some bookmarks to see beautiful distribution charts here",
    "chart.totalBookmarks": "Total Bookmarks",
    "chart.totalFolders": "Total Folders",
    "chart.avgPerFolder": "Avg per Folder",

    // Footer
    "footer.description":
      "Modern bookmark management tool for efficient and convenient web navigation. Supports mainstream browser imports with local processing for privacy protection.",
    "footer.features": "Features",
    "footer.multiBrowser": "Multi-browser Support",
    "footer.smartSearch": "Smart Search & Filter",
    "footer.autoDedupe": "Auto Deduplication",
    "footer.privacy": "Local Privacy Protection",
    "footer.supportedBrowsers": "Supported Browsers",
    "footer.copyright": "© {year} BookmarkFlow. All rights reserved.",
    "footer.builtWith": "Built with Next.js & Tailwind CSS",
    "footer.madeWith": "Made with",
    "footer.byAuthor": "by Cascade AI",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");
  const [isClient, setIsClient] = useState(false);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load language preference from localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      const saved = localStorage.getItem("bookmarkflow-language");
      if (saved === "zh" || saved === "en") {
        setLanguage(saved);
      }
    } catch (error) {
      // 仅在开发期提示即可，避免噪音
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Failed to load language preference:", error);
      }
    }
  }, [isClient]);

  // Save language preference to localStorage
  useEffect(() => {
    if (!isClient) return;

    try {
      localStorage.setItem("bookmarkflow-language", language);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Failed to save language preference:", error);
      }
    }
  }, [language, isClient]);

  const t = (key: string, params?: TranslationParams): string => {
    const dict = translations[language];
    const raw = dict[key];
    if (!raw) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`Translation missing for key: ${key}`);
      }
      return key;
    }

    if (!params) return raw;

    // 简单占位符替换：{count} / {year} / ...
    return raw.replace(/{(\w+)}/g, (match, k: string) => {
      const v = params[k];
      return v !== undefined ? String(v) : match;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
