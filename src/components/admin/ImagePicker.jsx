import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Plus,
  Loader2,
  Search,
  GripVertical,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useMediaLibrary } from "../../context/MediaLibraryContext";

const TEXT = {
  en: {
    chooseImage: "Choose Image",
    chooseImages: "Choose Images",
    library: "Library",
    upload: "Upload",
    url: "URL",
    searchPlaceholder: "Search images...",
    noImages: "No images yet. Upload your first one.",
    dropOrClick: "Drag & drop images here, or click to browse",
    fromDevice: "Choose from device",
    pasteUrl: "Paste image URL",
    add: "Add",
    save: "Save",
    cancel: "Cancel",
    remove: "Remove",
    selected: "Selected",
    uploading: "Uploading...",
    loading: "Loading...",
    confirmDelete: "Delete this image from the library? This cannot be undone.",
    noImage: "No image selected",
    change: "Change",
    addImage: "Add image",
    pick: "Pick from library",
  },
  ar: {
    chooseImage: "اختر صورة",
    chooseImages: "اختر صورًا",
    library: "المكتبة",
    upload: "رفع",
    url: "رابط",
    searchPlaceholder: "بحث في الصور...",
    noImages: "لا توجد صور بعد. ارفع أول صورة.",
    dropOrClick: "اسحب الصور هنا، أو اضغط للاختيار",
    fromDevice: "اختر من الجهاز",
    pasteUrl: "ألصق رابط الصورة",
    add: "إضافة",
    save: "حفظ",
    cancel: "إلغاء",
    remove: "إزالة",
    selected: "مختار",
    uploading: "جارٍ الرفع...",
    loading: "جارٍ التحميل...",
    confirmDelete: "حذف هذه الصورة من المكتبة؟ لا يمكن التراجع.",
    noImage: "لا توجد صورة مختارة",
    change: "تغيير",
    addImage: "إضافة صورة",
    pick: "اختر من المكتبة",
  },
};

const normalizeValue = (value, multiple) => {
  if (multiple) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const ImagePickerModal = ({
  open,
  onClose,
  onSave,
  initial,
  multiple,
  t,
  dir,
}) => {
  const { assets, loading, ensureLoaded, refresh, upload, remove } =
    useMediaLibrary();
  const [tab, setTab] = useState("library");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() => normalizeValue(initial, true));
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    if (open) {
      setSelected(normalizeValue(initial, true));
      ensureLoaded();
    }
  }, [open, initial, ensureLoaded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filteredAssets = useMemo(() => {
    if (!search.trim()) return assets;
    const q = search.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (a.name ?? "").toLowerCase().includes(q) ||
        (a.path ?? "").toLowerCase().includes(q),
    );
  }, [assets, search]);

  if (!open) return null;

  const toggleSelect = (url) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
      );
    } else {
      setSelected([url]);
    }
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList ?? []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!files.length) return;
    setUploading(true);
    try {
      const { results, errors } = await upload(files);
      if (errors.length) {
        const msg = errors
          .map(
            (e) => `${e.file?.name ?? "file"}: ${e.error?.message ?? "failed"}`,
          )
          .join("\n");
        // eslint-disable-next-line no-alert
        alert(msg);
      }
      if (results.length) {
        const urls = results.map((a) => a.url);
        if (multiple) {
          setSelected((prev) => [...prev, ...urls]);
        } else {
          setSelected([urls[0]]);
        }
        setTab("library");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = () => {
    const v = urlInput.trim();
    if (!v) return;
    if (multiple) {
      setSelected((prev) => (prev.includes(v) ? prev : [...prev, v]));
    } else {
      setSelected([v]);
    }
    setUrlInput("");
    setTab("library");
  };

  const handleDeleteAsset = async (asset, e) => {
    e?.stopPropagation?.();
    // eslint-disable-next-line no-alert
    if (!window.confirm(t.confirmDelete)) return;
    try {
      await remove(asset);
      setSelected((prev) => prev.filter((u) => u !== asset.url));
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err?.message ?? "Delete failed");
    }
  };

  const handleSave = () => {
    if (multiple) {
      onSave?.(selected);
    } else {
      onSave?.(selected[0] ?? "");
    }
    onClose?.();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer?.files);
  };

  const isSelected = (url) => selected.includes(url);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 px-2 sm:px-4 py-4"
      role="dialog"
      aria-modal="true"
      dir={dir}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sand-200 px-5 py-3">
          <h2 className="text-xl font-serif font-semibold text-sage-900">
            {multiple ? t.chooseImages : t.chooseImage}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-100 text-sage-700"
            aria-label={t.cancel}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sand-200 px-2 gap-1">
          {[
            { id: "library", icon: ImageIcon, label: t.library },
            { id: "upload", icon: Upload, label: t.upload },
            { id: "url", icon: LinkIcon, label: t.url },
          ].map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setTab(it.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === it.id
                  ? "border-sage-600 text-sage-700"
                  : "border-transparent text-sage-600 hover:text-sage-800"
              }`}
            >
              <it.icon size={16} />
              {it.label}
            </button>
          ))}
          <div className="ml-auto rtl:ml-0 rtl:mr-auto flex items-center text-xs text-sage-600 px-3">
            {multiple &&
              selected.length > 0 &&
              `${selected.length} ${t.selected}`}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "library" && (
            <div>
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-sage-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-full border border-sand-300 pl-9 rtl:pl-4 rtl:pr-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16 text-sage-600">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {t.loading}
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-16 text-sage-600">
                  <ImageIcon size={36} className="mx-auto mb-3 opacity-40" />
                  {t.noImages}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setTab("upload")}
                      className="btn-primary text-sm"
                    >
                      <Upload
                        size={16}
                        className="inline mr-2 rtl:mr-0 rtl:ml-2"
                      />
                      {t.upload}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredAssets.map((asset) => {
                    const sel = isSelected(asset.url);
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => toggleSelect(asset.url)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-sand-50 transition-all ${
                          sel
                            ? "border-sage-600 ring-2 ring-sage-400"
                            : "border-transparent hover:border-sage-300"
                        }`}
                      >
                        <img
                          src={asset.url}
                          alt={asset.name ?? ""}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                        {sel && (
                          <div className="absolute top-1.5 left-1.5 rtl:left-auto rtl:right-1.5 w-6 h-6 rounded-full bg-sage-600 text-white text-xs font-bold flex items-center justify-center">
                            ✓
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAsset(asset, e)}
                          className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-7 h-7 rounded-full bg-white/85 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={t.remove}
                        >
                          <Trash2 size={14} />
                        </button>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "upload" && (
            <div>
              <div
                ref={dropRef}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
                className="border-2 border-dashed border-sand-300 rounded-2xl py-12 px-6 text-center hover:border-sage-400 transition-colors"
              >
                <Upload size={36} className="mx-auto mb-3 text-sage-500" />
                <p className="text-sage-700 mb-4">{t.dropOrClick}</p>
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
                  className="btn-primary text-sm disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <Loader2
                        size={16}
                        className="inline mr-2 rtl:mr-0 rtl:ml-2 animate-spin"
                      />
                      {t.uploading}
                    </>
                  ) : (
                    <>
                      <Upload
                        size={16}
                        className="inline mr-2 rtl:mr-0 rtl:ml-2"
                      />
                      {t.fromDevice}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {tab === "url" && (
            <div className="max-w-xl mx-auto py-6">
              <label className="block text-sm font-medium text-sage-800 mb-2">
                {t.pasteUrl}
              </label>
              <div className="flex gap-2">
                <input
                  dir="ltr"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-full border border-sand-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="btn-primary text-sm whitespace-nowrap"
                >
                  <Plus size={16} className="inline mr-1 rtl:mr-0 rtl:ml-1" />
                  {t.add}
                </button>
              </div>
              {urlInput.trim() && (
                <div className="mt-6">
                  <img
                    src={urlInput.trim()}
                    alt=""
                    className="max-h-64 mx-auto rounded-xl shadow"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-sand-200 px-5 py-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sage-700 hover:bg-sand-100 font-medium"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary text-sm"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImagePicker = ({
  value,
  onChange,
  multiple = false,
  className = "",
  emptyLabel,
}) => {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const t = TEXT[language] ?? TEXT.en;
  const [open, setOpen] = useState(false);

  const values = useMemo(() => {
    if (multiple) return normalizeValue(value, true);
    const v = normalizeValue(value, false);
    return v ? [v] : [];
  }, [value, multiple]);

  const removeAt = (idx) => {
    if (multiple) {
      const next = values.filter((_, i) => i !== idx);
      onChange?.(next);
    } else {
      onChange?.("");
    }
  };

  const moveItem = (from, to) => {
    if (!multiple) return;
    if (to < 0 || to >= values.length) return;
    const next = [...values];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange?.(next);
  };

  return (
    <div className={className} dir={dir}>
      <div className="flex flex-wrap gap-3">
        {values.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative group w-24 h-24 rounded-xl overflow-hidden border border-sand-300 bg-sand-50"
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-contain"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 rtl:right-auto rtl:left-1 w-6 h-6 rounded-full bg-white/85 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={t.remove}
            >
              <X size={12} />
            </button>
            {multiple && values.length > 1 && (
              <div className="absolute bottom-1 left-1 rtl:left-auto rtl:right-1 flex gap-0.5">
                <button
                  type="button"
                  onClick={() => moveItem(idx, idx - 1)}
                  className="w-5 h-5 rounded-sm bg-white/80 text-sage-700 hover:bg-white text-xs"
                  disabled={idx === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, idx + 1)}
                  className="w-5 h-5 rounded-sm bg-white/80 text-sage-700 hover:bg-white text-xs"
                  disabled={idx === values.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-sand-400 text-sage-600 hover:border-sage-500 hover:text-sage-800 flex flex-col items-center justify-center text-xs gap-1"
        >
          {values.length === 0 ? (
            <>
              <ImageIcon size={20} />
              <span>{emptyLabel ?? t.pick}</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>{multiple ? t.addImage : t.change}</span>
            </>
          )}
        </button>
      </div>

      <ImagePickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(next) => onChange?.(next)}
        initial={value}
        multiple={multiple}
        t={t}
        dir={dir}
      />
    </div>
  );
};

export default ImagePicker;
export { ImagePickerModal };
