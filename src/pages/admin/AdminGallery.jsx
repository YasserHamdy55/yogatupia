import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Loader2,
  Search,
  RefreshCw,
  Image as ImageIcon,
  Copy,
  Check,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useMediaLibrary } from "../../context/MediaLibraryContext";

const TEXT = {
  en: {
    title: "Media Library",
    subtitle:
      "All images uploaded across the site. Drop new files or click to browse.",
    search: "Search images...",
    upload: "Upload",
    refresh: "Refresh",
    noImages: "No images yet. Upload your first one above.",
    confirmDelete: "Delete this image from the library? This cannot be undone.",
    uploading: "Uploading...",
    loading: "Loading...",
    copy: "Copy URL",
    copied: "Copied!",
    delete: "Delete",
    images: "images",
    dropHere: "Drop images here, or click to browse",
  },
  ar: {
    title: "مكتبة الوسائط",
    subtitle: "كل الصور المرفوعة في الموقع. اسحب ملفات جديدة أو اضغط للاختيار.",
    search: "بحث في الصور...",
    upload: "رفع",
    refresh: "تحديث",
    noImages: "لا توجد صور بعد. ارفع أول صورة بالأعلى.",
    confirmDelete: "حذف هذه الصورة من المكتبة؟ لا يمكن التراجع.",
    uploading: "جارٍ الرفع...",
    loading: "جارٍ التحميل...",
    copy: "نسخ الرابط",
    copied: "تم النسخ!",
    delete: "حذف",
    images: "صورة",
    dropHere: "اسحب الصور هنا، أو اضغط للاختيار",
  },
};

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AdminGallery = () => {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const t = TEXT[language] ?? TEXT.en;
  const { assets, loading, error, refresh, upload, remove, ensureLoaded } =
    useMediaLibrary();
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  const filtered = useMemo(() => {
    if (!search.trim()) return assets;
    const q = search.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (a.name ?? "").toLowerCase().includes(q) ||
        (a.path ?? "").toLowerCase().includes(q),
    );
  }, [assets, search]);

  const handleFiles = async (files) => {
    const arr = Array.from(files ?? []).filter((f) =>
      f.type?.startsWith("image/"),
    );
    if (!arr.length) return;
    setUploading(true);
    try {
      const { errors } = await upload(arr);
      if (errors.length) {
        // eslint-disable-next-line no-alert
        alert(
          errors
            .map(
              (e) =>
                `${e.file?.name ?? "file"}: ${e.error?.message ?? "failed"}`,
            )
            .join("\n"),
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (asset) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await remove(asset);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err?.message ?? "Delete failed");
    }
  };

  const handleCopy = async (asset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div dir={dir} className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-sage-900 mb-1">
          {t.title}
        </h1>
        <p className="text-sage-700">{t.subtitle}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-sage-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-full border border-sand-300 pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
        </div>
        <button
          type="button"
          onClick={() => refresh({ search })}
          className="px-4 py-2 rounded-full bg-white border border-sand-300 text-sage-700 hover:bg-sand-50 text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw size={14} />
          {t.refresh}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary text-sm disabled:opacity-60 flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t.uploading}
            </>
          ) : (
            <>
              <Upload size={16} />
              {t.upload}
            </>
          )}
        </button>
      </div>

      {/* Drop zone (also acts as empty-state) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFiles(e.dataTransfer?.files);
        }}
        className="border-2 border-dashed border-sand-300 rounded-2xl p-6 text-center text-sage-600 hover:border-sage-400 transition-colors mb-6 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={28} className="mx-auto mb-2 opacity-60" />
        <p className="text-sm">{t.dropHere}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error.message ?? String(error)}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sage-600">
          <Loader2 className="animate-spin mr-2" size={20} />
          {t.loading}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sage-600">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-40" />
          {t.noImages}
        </div>
      ) : (
        <>
          <p className="text-xs text-sage-600 mb-3">
            {filtered.length} {t.images}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((asset) => (
              <div
                key={asset.id}
                className="group relative bg-white rounded-xl border border-sand-200 overflow-hidden shadow-sm"
              >
                <div className="aspect-square bg-sand-50">
                  <img
                    src={asset.url}
                    alt={asset.name ?? ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5 text-xs text-sage-700">
                  <div className="truncate font-medium" title={asset.name}>
                    {asset.name ?? "—"}
                  </div>
                  <div className="text-sage-500 flex justify-between mt-0.5">
                    <span>{formatSize(asset.size_bytes)}</span>
                    {asset.width && asset.height && (
                      <span>
                        {asset.width}×{asset.height}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleCopy(asset)}
                    className="w-8 h-8 rounded-full bg-white/95 text-sage-700 hover:bg-sage-600 hover:text-white flex items-center justify-center shadow"
                    title={copiedId === asset.id ? t.copied : t.copy}
                  >
                    {copiedId === asset.id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset)}
                    className="w-8 h-8 rounded-full bg-white/95 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center shadow"
                    title={t.delete}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminGallery;
