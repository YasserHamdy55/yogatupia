import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const RetreatGallery = ({
  images = [],
  alt = "",
  className = "",
  fit = "cover",
}) => {
  const { language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const list = (Array.isArray(images) ? images : [])
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (index >= list.length) setIndex(0);
  }, [list.length, index]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, list.length]);

  if (list.length === 0) {
    return (
      <div
        className={`w-full h-64 md:h-full bg-sand-100 flex items-center justify-center text-sage-500 ${className}`}
      >
        {language === "ar" ? "لا توجد صورة" : "No image"}
      </div>
    );
  }

  const current = list[Math.min(index, list.length - 1)];
  const goPrev = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i - 1 + list.length) % list.length);
  };
  const goNext = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i + 1) % list.length);
  };

  return (
    <div
      className={`relative w-full h-64 md:h-full group ${
        fit === "contain" ? "bg-sand-100" : ""
      } ${className}`}
      dir={dir}
    >
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="block w-full h-full focus:outline-none"
        aria-label={language === "ar" ? "تكبير الصورة" : "Open image"}
      >
        <img
          src={current}
          alt={alt}
          className={`w-full h-64 md:h-full ${
            fit === "contain" ? "object-contain" : "object-cover"
          }`}
          loading="lazy"
        />
      </button>

      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute top-1/2 -translate-y-1/2 left-2 rtl:left-auto rtl:right-2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={language === "ar" ? "السابق" : "Previous"}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute top-1/2 -translate-y-1/2 right-2 rtl:right-auto rtl:left-2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={language === "ar" ? "التالي" : "Next"}
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 backdrop-blur-sm rounded-full px-2.5 py-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index ? "bg-white w-5" : "bg-white/60 hover:bg-white/90"
                }`}
                aria-label={`${language === "ar" ? "صورة" : "Image"} ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {index + 1} / {list.length}
          </div>
        </>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"
            aria-label={language === "ar" ? "إغلاق" : "Close"}
          >
            <X size={22} />
          </button>

          <img
            src={current}
            alt={alt}
            className="max-h-[85vh] max-w-[92vw] object-contain shadow-2xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute top-1/2 -translate-y-1/2 left-4 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"
                aria-label={language === "ar" ? "السابق" : "Previous"}
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"
                aria-label={language === "ar" ? "التالي" : "Next"}
              >
                <ChevronRight size={26} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/40 rounded-full px-3 py-1">
                {index + 1} / {list.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RetreatGallery;
