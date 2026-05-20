import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import ImagePicker from "./ImagePicker";

const CLASS_TYPES = ["Yoga", "Pilates", "Reformer"];

// Convert an ISO/server datetime string into the value format expected by
// <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
const toDatetimeLocal = (value) => {
  if (!value) return "";
  // already in local format
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
  ) {
    return value.slice(0, 16);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const TEXT = {
  en: {
    editTitle: "Edit Class",
    addTitle: "Add New Class",
    nameEn: "Class Name (English)",
    nameAr: "Class Name (Arabic)",
    descEn: "Description (English)",
    descAr: "Description (Arabic)",
    levelEn: "Level (English)",
    levelAr: "Level (Arabic)",
    instructor: "Instructor Name",
    dateTime: "Date & Time",
    capacity: "Capacity (Total Spots)",
    available: "Available Spots",
    price: "Price",
    duration: "Duration (minutes)",
    type: "Class Type",
    coverImage: "Cover Image",
    gallery: "Gallery Images",
    save: "Save Changes",
    cancel: "Cancel",
  },
  ar: {
    editTitle: "تعديل الحصة",
    addTitle: "إضافة حصة جديدة",
    nameEn: "اسم الحصة (إنجليزي)",
    nameAr: "اسم الحصة (عربي)",
    descEn: "الوصف (إنجليزي)",
    descAr: "الوصف (عربي)",
    levelEn: "المستوى (إنجليزي)",
    levelAr: "المستوى (عربي)",
    instructor: "اسم المدرب",
    dateTime: "التاريخ والوقت",
    capacity: "السعة الاستيعابية",
    available: "المقاعد المتاحة",
    price: "السعر",
    duration: "المدة (دقائق)",
    type: "نوع الحصة",
    coverImage: "صورة الغلاف",
    gallery: "معرض الصور",
    save: "حفظ التعديلات",
    cancel: "إلغاء",
  },
};

const ClassEditModal = ({ classItem, mode = "edit", onSave, onClose }) => {
  const { language } = useLanguage();
  const t = TEXT[language] ?? TEXT.en;
  const dir = language === "ar" ? "rtl" : "ltr";

  const [form, setForm] = useState(() => ({
    ...classItem,
    name: { ...(classItem?.name ?? { en: "", ar: "" }) },
    description: { ...(classItem?.description ?? { en: "", ar: "" }) },
    level: { ...(classItem?.level ?? { en: "", ar: "" }) },
    image: classItem?.image ?? "",
    images: Array.isArray(classItem?.images) ? classItem.images : [],
    dateTime: toDatetimeLocal(classItem?.dateTime),
  }));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (key, lang, value) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], [lang]: value } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalSpots = Math.max(0, Number(form.totalSpots) || 0);
    const availableSpots = Math.min(
      totalSpots,
      Math.max(0, Number(form.availableSpots) || 0),
    );
    const payload = {
      ...form,
      type: form.type,
      duration: Math.max(1, Number(form.duration) || 60),
      totalSpots,
      availableSpots,
      price: Math.max(0, Number(form.price) || 0),
      image: form.image ?? "",
      images: Array.isArray(form.images) ? form.images : [],
    };
    onSave?.(payload);
  };

  const inputClass =
    "w-full rounded-2xl border border-sand-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white";
  const labelClass = "block text-sm font-medium text-sage-800 mb-1.5";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      dir={dir}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-auto">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h2 className="text-2xl font-serif font-semibold text-sage-900">
            {mode === "add" ? t.addTitle : t.editTitle}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.nameEn}</label>
              <input
                dir="ltr"
                className={inputClass}
                value={form.name.en}
                onChange={(e) => setNested("name", "en", e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>{t.nameAr}</label>
              <input
                dir="rtl"
                className={inputClass}
                value={form.name.ar}
                onChange={(e) => setNested("name", "ar", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.descEn}</label>
              <textarea
                dir="ltr"
                rows={3}
                className={inputClass}
                value={form.description.en}
                onChange={(e) => setNested("description", "en", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>{t.descAr}</label>
              <textarea
                dir="rtl"
                rows={3}
                className={inputClass}
                value={form.description.ar}
                onChange={(e) => setNested("description", "ar", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t.instructor}</label>
              <input
                className={inputClass}
                value={form.instructor}
                onChange={(e) => setField("instructor", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>{t.dateTime}</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.dateTime}
                onChange={(e) => setField("dateTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>{t.type}</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setField("type", e.target.value)}
              >
                {CLASS_TYPES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.duration}</label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>{t.capacity}</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.totalSpots}
                onChange={(e) => setField("totalSpots", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>{t.available}</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.availableSpots}
                onChange={(e) => setField("availableSpots", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t.price}</label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>{t.levelEn}</label>
              <input
                dir="ltr"
                className={inputClass}
                value={form.level.en}
                onChange={(e) => setNested("level", "en", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>{t.levelAr}</label>
              <input
                dir="rtl"
                className={inputClass}
                value={form.level.ar}
                onChange={(e) => setNested("level", "ar", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t.coverImage}</label>
            <ImagePicker
              value={form.image ?? ""}
              onChange={(next) => setField("image", next)}
            />
          </div>

          <div>
            <label className={labelClass}>{t.gallery}</label>
            <ImagePicker
              multiple
              value={Array.isArray(form.images) ? form.images : []}
              onChange={(next) =>
                setField("images", Array.isArray(next) ? next : [])
              }
            />
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

export default ClassEditModal;
