// Utility functions for bookmark processing

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
  tags?: string[];
  dateAdded?: Date;
}

/**
 * Clean and normalize folder paths to prevent duplicates and invalid characters
 */
export const cleanFolderPath = (path: string): string => {
  if (!path) return '';
  
  // 只移除乱码字符，保持其他逻辑简单
  return path
    .replace(/[└├│┌┐┘┴┬┤├]/g, '') // 移除树形字符
    .replace(/\s+/g, ' ') // 标准化空格
    .trim();
};

/**
 * Generate a unique ID for bookmarks
 */
export const generateBookmarkId = (): string => {
  return Math.random().toString(36).slice(2, 11);
};

/**
 * Parse HTML bookmark file and extract bookmarks with proper folder hierarchy
 */
export const parseHtmlBookmarks = (htmlContent: string): Bookmark[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const bookmarks: Bookmark[] = [];
  const links = doc.querySelectorAll("a[href]");

  links.forEach((link) => {
    const url = link.getAttribute("href");
    const title = link.textContent?.trim() || "Untitled";

    if (url && url.startsWith("http")) {
      // 尝试从 DOM 结构回溯目录名（原始逻辑）
      let folder = "Imported";
      let parent: HTMLElement | null = link.parentElement;
      while (parent) {
        const folderName = parent.querySelector("h3")?.textContent?.trim();
        if (folderName && folderName !== title) {
          // 只在这里清理乱码字符
          folder = cleanFolderPath(folderName);
          break;
        }
        parent = parent.parentElement;
      }

      bookmarks.push({
        id: generateBookmarkId(),
        title,
        url,
        folder,
        dateAdded: new Date(),
      });
    }
  });

  return bookmarks;
};

/**
 * Parse JSON bookmark file
 */
export const parseJsonBookmarks = (jsonContent: string): Bookmark[] => {
  try {
    const data = JSON.parse(jsonContent);
    const bookmarks: Bookmark[] = [];
    
    const extractBookmarks = (node: any, folderPath: string = ''): void => {
      if (node.type === 'url' && node.url) {
        const title = node.name || node.title || 'Untitled';
        bookmarks.push({
          id: generateBookmarkId(),
          title: title.toString().trim(),
          url: node.url,
          folder: cleanFolderPath(folderPath || 'Imported'),
          dateAdded: node.date_added ? new Date(parseInt(node.date_added) / 1000) : new Date()
        });
      } else if (node.children && Array.isArray(node.children)) {
        const currentFolder = node.name && typeof node.name === 'string' && node.name.trim() !== '' 
          ? node.name 
          : folderPath;
        
        node.children.forEach((child: any) => extractBookmarks(child, currentFolder));
      }
    };
    
    // Handle Chrome bookmark format with roots
    if (data.roots) {
      Object.values(data.roots).forEach((root: any) => extractBookmarks(root));
    } else if (Array.isArray(data)) {
      data.forEach(item => extractBookmarks(item));
    } else {
      extractBookmarks(data);
    }
    
    return bookmarks;
  } catch (error) {
    console.error('Error parsing JSON bookmarks:', error);
    return [];
  }
};

/**
 * Remove duplicate bookmarks based on URL
 */
export const removeDuplicateBookmarks = (newBookmarks: Bookmark[], existingBookmarks: Bookmark[]): Bookmark[] => {
  const existingUrls = new Set(existingBookmarks.map(b => b.url));
  return newBookmarks.filter(b => !existingUrls.has(b.url));
};

/**
 * Get the last segment of a folder path for display
 */
export const getLastFolderName = (folderPath: string): string => {
  if (!folderPath) return '';
  
  const cleanPath = cleanFolderPath(folderPath);
  const segments = cleanPath.split('/').filter(Boolean);
  
  return segments.length > 0 ? segments[segments.length - 1] : '';
};