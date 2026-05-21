import React, { useState } from "react";
import { ImageIcon, Pencil } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { useAdminEdit } from "./AdminInline";
import { ImagePickerModal } from "./ImagePicker";

const TEXT = {
  en: {
    change: "Change image",
    chooseImage: "Choose image",
    library: "Library",
    upload: "Upload",
    url: "From URL",
    searchPlaceholder: "Search images...",
    noImages: "No images yet. Upload your first one below.",
    dropOrClick: "Drop images here, or click to choose",
    fromDevice: "Choose from device",
    pasteUrl: "Paste an image URL",
    add: "Add",
    save: "Save",
    cancel: "Cancel",
    remove: "Remove",
    selected: "Selected",
    uploading: "Uploading...",
    loading: "Loading...",
    confirmDelete: "Delete this image from the library?",
    pick: "Choose",
  },
  ar: {
    change: "تغيير الصورة",
    chooseImage: "اختيار صورة",
    library: "المكتبة",
    upload: "رفع",
    url: "من رابط",
    searchPlaceholder: "بحث في الصور...",
    noImages: "لا توجد صور بعد. ارفع أول صورة بالأسفل.",
    dropOrClick: "اسحب الصور هنا، أو اضغط للاختيار",
    fromDevice: "اختر من الجهاز",
    pasteUrl: "ألصق رابط صورة",
    add: "إضافة",
    save: "حفظ",
    cancel: "إلغاء",
    remove: "إزالة",
    selected: "محدد",
    uploading: "جارٍ الرفع...",
    loading: "جارٍ التحميل...",
    confirmDelete: "حذف هذه الصورة من المكتبة؟",
    pick: "اختيار",
  },
};

const InlineImageEditable = ({
  path,
  alt = "",
  fallback = "",
  className = "",
  as: Tag = "div",
  children,
  ...rest
}) => {
  const { language } = useLanguage();
  const { getContentValue, updateLocalizedContent } = useContent();
  const { isAdmin, editMode } = useAdminEdit();
  const [open, setOpen] = useState(false);
  const t = TEXT[language] ?? TEXT.en;
  const dir = language === "ar" ? "rtl" : "ltr";

  const url = getContentValue(language, path, fallback) || fallback;
  const editable = isAdmin && editMode;

  const handleSave = (next) => {
    const value =
      typeof next === "string"
        ? next
        : Array.isArray(next)
          ? (next[0] ?? "")
          : "";
    updateLocalizedContent(path, { en: value, ar: value });
    setOpen(false);
  };

  const content =
    typeof children === "function" ? (
      children(url)
    ) : url ? (
      <img src={url} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-sand-100 text-sage-400">
        <ImageIcon size={32} />
      </div>
    );

  const wrapperClass =
    `${editable ? "relative ring-1 ring-amber-300/70 hover:ring-amber-500 transition-shadow" : "relative"} ${className}`.trim();

  return (
    <>
      <Tag className={wrapperClass} {...rest}>
        {content}
        {editable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
            className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 text-xs font-medium"
            title={t.change}
          >
            <Pencil size={12} />
            {t.change}
          </button>
        )}
      </Tag>

      <ImagePickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        initial={url}
        multiple={false}
        t={t}
        dir={dir}
      />
    </>
  );
};

export default InlineImageEditable;
