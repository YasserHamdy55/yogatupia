import React, { useEffect, useState } from "react";
import { Pencil, X, Save } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useContent } from "../../context/ContentContext";
import { useAdminEdit } from "./AdminInline";

const TXT = {
  en: {
    editLabel: "Edit",
    save: "Save",
    cancel: "Cancel",
    en: "English",
    ar: "Arabic",
  },
  ar: {
    editLabel: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    en: "إنجليزي",
    ar: "عربي",
  },
};

// ---------- Bilingual edit modal ----------
const InlineEditModal = ({
  path,
  multiline,
  isList,
  label,
  initialEn,
  initialAr,
  onSave,
  onClose,
}) => {
  const { language } = useLanguage();
  const t = TXT[language] ?? TXT.en;
  const dir = language === "ar" ? "rtl" : "ltr";

  const toText = (v) => (Array.isArray(v) ? v.join("\n") : (v ?? ""));
  const fromText = (raw) =>
    isList
      ? raw
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : raw;

  const [enVal, setEnVal] = useState(toText(initialEn));
  const [arVal, setArVal] = useState(toText(initialAr));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const inputClass =
    "w-full rounded-2xl border border-sand-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white";
  const Field = multiline || isList ? "textarea" : "input";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ en: fromText(enVal), ar: fromText(arVal) });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir={dir}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-auto">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-serif font-semibold text-sage-900">
              {label || t.editLabel}
            </h2>
            <p className="text-xs text-sage-600 mt-0.5 font-mono">{path}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sand-100 text-sage-700"
            aria-label={t.cancel}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold tracking-wide uppercase text-sage-700 mb-2">
                {t.en}
              </label>
              <Field
                dir="ltr"
                rows={multiline || isList ? 5 : undefined}
                className={inputClass}
                value={enVal}
                onChange={(e) => setEnVal(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold tracking-wide uppercase text-sage-700 mb-2">
                {t.ar}
              </label>
              <Field
                dir="rtl"
                rows={multiline || isList ? 5 : undefined}
                className={inputClass}
                value={arVal}
                onChange={(e) => setArVal(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-sand-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-medium text-sage-800 bg-sand-100 hover:bg-sand-200"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full font-semibold text-white bg-sage-600 hover:bg-sage-700 shadow-md inline-flex items-center gap-2"
            >
              <Save size={16} />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Public component ----------
// Renders editable site-content text. In admin edit mode shows a pencil overlay
// that opens a bilingual editor writing back into ContentContext via
// updateContentValue.
//
// Props:
//   path        - dot path inside site content (e.g. "home.hero.title")
//   as          - HTML tag/component for the wrapper (default "span")
//   multiline   - render <textarea> in editor (default false)
//   list        - treat stored value as array of strings (default false)
//   label       - friendly label shown in the editor header
//   fallback    - default text if value missing
//   children    - optional render function (value) => ReactNode for custom layout
//   className   - applied to outer wrapper
//   ...rest     - forwarded to the wrapper element
const InlineEditable = ({
  path,
  as: Tag = "span",
  multiline = false,
  list = false,
  label,
  fallback = "",
  children,
  className = "",
  ...rest
}) => {
  const { language } = useLanguage();
  const { content, getContentValue, updateLocalizedContent } = useContent();
  const { isAdmin, editMode } = useAdminEdit();
  const [open, setOpen] = useState(false);

  const value = list
    ? (getContentValue(language, path, fallback) ?? [])
    : getContentValue(language, path, fallback);

  const renderContent =
    typeof children === "function" ? children(value) : value;

  const editable = isAdmin && editMode;

  const initialEn = path
    .split(".")
    .reduce((acc, key) => acc?.[key], content?.en);
  const initialAr = path
    .split(".")
    .reduce((acc, key) => acc?.[key], content?.ar);

  const handleSave = ({ en, ar }) => {
    updateLocalizedContent(path, { en, ar });
    setOpen(false);
  };

  const wrapperClass =
    `${editable ? "relative inline-block group/inline-edit ring-1 ring-amber-300/70 hover:ring-amber-500 rounded transition-shadow" : ""} ${className}`.trim();

  return (
    <>
      <Tag className={wrapperClass} {...rest}>
        {renderContent}
        {editable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
            className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 opacity-80 hover:opacity-100"
            aria-label="Edit"
            title="Edit"
          >
            <Pencil size={12} />
          </button>
        )}
      </Tag>

      {open && (
        <InlineEditModal
          path={path}
          multiline={multiline}
          isList={list}
          label={label}
          initialEn={initialEn ?? (list ? [] : "")}
          initialAr={initialAr ?? (list ? [] : "")}
          onSave={handleSave}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default InlineEditable;
