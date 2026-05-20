import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import ImagePicker from "./ImagePicker";

const inputClass =
  "w-full rounded-2xl border border-sand-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white";
const labelClass = "block text-sm font-medium text-sage-800 mb-1.5";

const TEXT = {
  en: {
    save: "Save Changes",
    cancel: "Cancel",
    enLang: "English",
    arLang: "Arabic",
  },
  ar: {
    save: "حفظ التعديلات",
    cancel: "إلغاء",
    enLang: "إنجليزي",
    arLang: "عربي",
  },
};

// Convert a list value (array of strings) to a single textarea string.
const listToText = (val) => (Array.isArray(val) ? val.join("\n") : "");
const textToList = (txt) =>
  String(txt ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const renderField = (field, form, setForm, language) => {
  const { key, type, bilingual, label } = field;

  const setValue = (next) => setForm((f) => ({ ...f, [key]: next }));
  const setBilingual = (lang, v) =>
    setForm((f) => ({
      ...f,
      [key]: { ...(f[key] ?? { en: "", ar: "" }), [lang]: v },
    }));

  if (bilingual && type === "list") {
    const value = form[key] ?? { en: [], ar: [] };
    return (
      <div className="space-y-3">
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea
            dir="ltr"
            rows={4}
            className={inputClass}
            placeholder={TEXT[language].enLang}
            value={listToText(value.en)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                [key]: { ...(f[key] ?? {}), en: textToList(e.target.value) },
              }))
            }
          />
          <textarea
            dir="rtl"
            rows={4}
            className={inputClass}
            placeholder={TEXT[language].arLang}
            value={listToText(value.ar)}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                [key]: { ...(f[key] ?? {}), ar: textToList(e.target.value) },
              }))
            }
          />
        </div>
      </div>
    );
  }

  if (bilingual && (type === "text" || type === "textarea")) {
    const value = form[key] ?? { en: "", ar: "" };
    const Field = type === "textarea" ? "textarea" : "input";
    return (
      <div className="space-y-2">
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            dir="ltr"
            rows={type === "textarea" ? 3 : undefined}
            className={inputClass}
            placeholder={TEXT[language].enLang}
            value={value.en ?? ""}
            onChange={(e) => setBilingual("en", e.target.value)}
          />
          <Field
            dir="rtl"
            rows={type === "textarea" ? 3 : undefined}
            className={inputClass}
            placeholder={TEXT[language].arLang}
            value={value.ar ?? ""}
            onChange={(e) => setBilingual("ar", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // Non-bilingual fields
  if (type === "textarea") {
    return (
      <div>
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <textarea
          rows={3}
          className={inputClass}
          value={form[key] ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  }

  if (type === "number") {
    return (
      <div>
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <input
          type="number"
          className={inputClass}
          value={form[key] ?? 0}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </div>
    );
  }

  if (type === "boolean") {
    return (
      <div>
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 accent-sage-600"
            checked={!!form[key]}
            onChange={(e) => setValue(e.target.checked)}
          />
          <span className="text-sm font-medium text-sage-800">
            {label[language] ?? label.en}
          </span>
        </label>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div>
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <ImagePicker
          value={form[key] ?? ""}
          onChange={(next) => setValue(next)}
        />
      </div>
    );
  }

  if (type === "images") {
    return (
      <div>
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <ImagePicker
          multiple
          value={Array.isArray(form[key]) ? form[key] : []}
          onChange={(next) => setValue(Array.isArray(next) ? next : [])}
        />
      </div>
    );
  }

  if (type === "list") {
    return (
      <div>
        <label className={labelClass}>{label[language] ?? label.en}</label>
        <textarea
          rows={4}
          className={inputClass}
          value={listToText(form[key])}
          onChange={(e) => setValue(textToList(e.target.value))}
        />
      </div>
    );
  }

  // default: text
  return (
    <div>
      <label className={labelClass}>{label[language] ?? label.en}</label>
      <input
        className={inputClass}
        value={form[key] ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

const CollectionEditModal = ({
  item,
  schema,
  mode = "edit",
  onSave,
  onClose,
}) => {
  const { language } = useLanguage();
  const t = TEXT[language] ?? TEXT.en;
  const dir = language === "ar" ? "rtl" : "ltr";

  const [form, setForm] = useState(() => ({ ...(item ?? {}) }));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!schema) return null;

  const heading =
    mode === "add"
      ? (schema.addTitle?.[language] ?? schema.addTitle?.en)
      : (schema.title?.[language] ?? schema.title?.en);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir={dir}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-auto">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-2xl font-serif font-semibold text-sage-900">
            {heading}
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {schema.fields.map((field) => (
            <div key={field.key}>
              {renderField(field, form, setForm, language)}
            </div>
          ))}

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

export default CollectionEditModal;
