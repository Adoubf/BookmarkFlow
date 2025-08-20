"use client";

import { useState, useRef } from "react";
import { Bookmark } from "../page";
import { useLanguage } from "../contexts/LanguageContext";
import { AlertModal } from "./Modal";

interface BookmarkImporterProps {
  onBookmarksImported: (bookmarks: Bookmark[]) => void;
  existingBookmarks: Bookmark[];
  compact?: boolean;
}

export default function BookmarkImporter({
  onBookmarksImported,
  existingBookmarks,
  compact = false,
}: BookmarkImporterProps) {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "default" | "success" | "error";
  }>({ isOpen: false, title: "", message: "", variant: "default" });

  const generateId = () =>
    Math.random().toString(36).slice(2, 11 /* 9 chars */);

  // -------------------------
  // 类型与类型守卫
  // -------------------------
  type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
  type JsonObject = { [k: string]: JsonValue };
  type JsonArray = JsonValue[];

  // Chrome/Edge 书签节点的最小安全子集（我们用到的字段）
  type BookmarkUrlNode = {
    type?: string; // 'url'
    url?: string;
    name?: string;
    title?: string;
    date_added?: string;
  };

  type BookmarkFolderNode = {
    name?: string;
    children?: unknown[];
  };

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const isUrlNode = (n: unknown): n is BookmarkUrlNode =>
    isRecord(n) &&
    (n.type === "url" || typeof n.type === "undefined") && // 有的导出不带 type
    typeof (n as BookmarkUrlNode).url === "string";

  const hasChildren = (n: unknown): n is BookmarkFolderNode =>
    isRecord(n) && Array.isArray((n as BookmarkFolderNode).children);

  // -------------------------
  // 解析文件
  // -------------------------
  const parseBookmarkFile = async (file: File): Promise<Bookmark[]> => {
    const text = await file.text();
    const out: Bookmark[] = [];

    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        // JSON 格式（Chrome/Edge/通用）
        const data: unknown = JSON.parse(text);

        const extract = (node: unknown, folder = ""): void => {
          // 命中 URL 节点
          if (isUrlNode(node)) {
            const title =
              (node.name ?? node.title)?.toString().trim() || "Untitled";
            const url = node.url!;

            // Chrome 的 date_added 常见为字符串数字
            const tsStr = node.date_added;
            const date =
              typeof tsStr === "string" && /^\d+$/.test(tsStr)
                ? // 你的原逻辑：/1000（保留）
                  new Date(parseInt(tsStr, 10) / 1000)
                : new Date();

            out.push({
              id: generateId(),
              title,
              url,
              folder: folder || "Imported",
              dateAdded: date,
            });
          }

          // 递归 children
          if (hasChildren(node)) {
            const n = node as BookmarkFolderNode & { name?: string };
            const currentFolder =
              typeof n.name === "string" && n.name.trim() !== ""
                ? n.name
                : folder;
            n.children!.forEach((child) => extract(child, currentFolder));
          }
        };

        // 既兼容 Chrome 的 roots，又兼容通用数组/对象
        if (isRecord(data) && "roots" in data && isRecord((data as any).roots)) {
          const roots = (data as { roots: Record<string, unknown> }).roots;
          Object.values(roots).forEach((root) => extract(root));
        } else if (Array.isArray(data)) {
          (data as unknown[]).forEach((item) => extract(item));
        } else {
          extract(data);
        }
      } else {
        // HTML 格式（Firefox/Safari 等）
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const links = doc.querySelectorAll("a[href]");

        links.forEach((link) => {
          const url = link.getAttribute("href");
          const title = link.textContent?.trim() || "Untitled";

          if (url && url.startsWith("http")) {
            // 尝试从 DOM 结构回溯目录名
            let folder = "Imported";
            let parent: HTMLElement | null = link.parentElement;
            while (parent) {
              const folderName =
                parent.querySelector("h3")?.textContent?.trim();
              if (folderName && folderName !== title) {
                folder = folderName;
                break;
              }
              parent = parent.parentElement;
            }

            out.push({
              id: generateId(),
              title,
              url,
              folder,
              dateAdded: new Date(),
            });
          }
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error parsing bookmark file:", error);
      throw new Error(t("message.parseError"));
    }

    return out;
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const parsed = await parseBookmarkFile(file);
      if (parsed.length === 0) {
        throw new Error(t("message.noBookmarks"));
      }

      // 去重（按 URL）
      const existingUrls = new Set(existingBookmarks.map((b) => b.url));
      const newBookmarks = parsed.filter((b) => !existingUrls.has(b.url));

      if (newBookmarks.length === 0) {
        setAlertModal({
          isOpen: true,
          title: t("nav.bookmarks"),
          message: t("message.noNewBookmarks"),
          variant: "default",
        });
      } else {
        const duplicateCount = parsed.length - newBookmarks.length;
        if (duplicateCount > 0) {
          const message = t("message.importSuccess", {
            count: newBookmarks.length,
            duplicates: duplicateCount,
          });
          setAlertModal({
            isOpen: true,
            title: t("nav.bookmarks"),
            message,
            variant: "success",
          });
        }
        onBookmarksImported(newBookmarks);
      }
    } catch (error) {
      setAlertModal({
        isOpen: true,
        title: t("nav.bookmarks"),
        message:
          error instanceof Error ? error.message : t("message.importFailed"),
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  if (compact) {
    return (
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-200 neon-primary whitespace-nowrap"
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
        <span className="text-sm font-medium whitespace-nowrap">
          {isProcessing ? "处理中..." : "导入更多"}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.json"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </button>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
          ${
            isDragOver
              ? "border-primary bg-primary/10 neon-primary"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          }
          ${isProcessing ? "opacity-50 pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold mb-2">
            {isProcessing ? t("importer.processing") : t("importer.title")}
          </h3>

          <p className="text-foreground/60 mb-6">
            {t("importer.dragDrop")}
            <br />
            <span className="text-xs text-foreground/40">
              {t("importer.duplicateFilter")}
            </span>
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 neon-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>{isProcessing ? t("importer.processing2") : t("importer.chooseFile")}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.json"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xs text-foreground/60">Chrome</span>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xs text-foreground/60">Firefox</span>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xs text-foreground/60">Safari</span>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xs text-foreground/60">Edge</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-foreground/50">
        <p>{t("importer.supportedFormats")}</p>
        <p className="mt-1">{t("importer.privacy")}</p>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal((prev) => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        okText={t("button.ok")}
        variant={alertModal.variant}
      />
    </div>
  );
}
