"use client";

interface CategorySidebarProps {
  folders: string[];
  selectedFolder: string | null;
  onFolderChange: (folder: string | null) => void;
  bookmarkCounts: Record<string, number>;
}

export default function CategorySidebar({ folders, selectedFolder, onFolderChange, bookmarkCounts }: CategorySidebarProps) {
  const totalBookmarks = Object.values(bookmarkCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="fixed left-0 top-20 bottom-0 w-64 glass border-r border-border/50 z-30 flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-foreground text-center">分类导航</h3>
        
        <div className="flex-1 overflow-y-auto">
          {/* All Bookmarks */}
          <button
            onClick={() => onFolderChange(null)}
            className={`w-full flex items-center p-2 rounded-lg mb-2 transition-all duration-200 group ${
              selectedFolder === null
                ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
            }`}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-medium text-sm truncate">全部书签</span>
            </div>
            <span className="ml-2 px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full border border-accent/30 flex-shrink-0 min-w-[24px] text-center">
              {totalBookmarks}
            </span>
          </button>

          {/* Folder Categories */}
          {folders.length > 0 && (
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => onFolderChange(folder)}
                  className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 group ${
                    selectedFolder === folder
                      ? 'bg-primary/20 text-primary border border-primary/30 neon-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-surface/50'
                  }`}
                  title={folder}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="font-medium text-sm truncate">{folder}</span>
                  </div>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30 flex-shrink-0 min-w-[24px] text-center">
                    {bookmarkCounts[folder] || 0}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {folders.length === 0 && (
            <div className="text-center py-8 px-2">
              <svg className="w-10 h-10 mx-auto mb-3 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-sm text-foreground/50">暂无分类</p>
              <p className="text-xs text-foreground/40 mt-1">导入书签后会自动显示分类</p>
            </div>
          )}
        </div>
        
        {/* Category count info */}
        {folders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30 flex-shrink-0">
            <p className="text-xs text-foreground/50 text-center">
              共 {folders.length} 个分类
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
