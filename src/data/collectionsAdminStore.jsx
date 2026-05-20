import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  retreats as retreatsMock,
  pricingPlans as pricingMock,
  services as servicesMock,
  testimonials as testimonialsMock,
  faqs as faqsMock,
} from "./mockData";
import { defaultSiteContent } from "../content/defaultSiteContent";

const STORAGE_KEY = "heba-collections-admin-v1";

// ---------- Helpers ----------
const isBilingual = (val) =>
  val && typeof val === "object" && !Array.isArray(val) && "en" in val;

const ensureBilingualScalar = (en, ar) => ({
  en: en ?? "",
  ar: ar ?? en ?? "",
});

const ensureBilingualList = (en, ar) => ({
  en: Array.isArray(en) ? en : [],
  ar: Array.isArray(ar) ? ar : Array.isArray(en) ? en : [],
});

// Project a stored item (with bilingual subfields) onto the active language.
export const projectItemLocalized = (item, language) => {
  if (!item || typeof item !== "object") return item;
  const out = {};
  Object.entries(item).forEach(([key, value]) => {
    if (isBilingual(value)) {
      out[key] = value[language] ?? value.en ?? "";
    } else {
      out[key] = value;
    }
  });
  return out;
};

// ---------- Seeders ----------
const seedRetreats = () => {
  const enItems = defaultSiteContent?.en?.retreats?.items ?? [];
  const arItems = defaultSiteContent?.ar?.retreats?.items ?? [];
  return retreatsMock.map((base, i) => {
    const en = enItems[i] ?? {};
    const ar = arItems[i] ?? {};
    return {
      id: base.id,
      destination: en.destination ?? base.destination,
      dateRange: base.dateRange,
      duration: base.duration,
      image: base.image,
      images:
        Array.isArray(base.images) && base.images.length
          ? base.images
          : base.image
            ? [base.image]
            : [],
      price: base.price,
      spots: base.spots,
      availableSpots: base.availableSpots,
      title: ensureBilingualScalar(en.title ?? base.title, ar.title),
      shortDescription: ensureBilingualScalar(
        en.shortDescription ?? base.shortDescription,
        ar.shortDescription,
      ),
      fullDescription: ensureBilingualScalar(
        en.fullDescription ?? base.fullDescription,
        ar.fullDescription,
      ),
      included: ensureBilingualList(en.included ?? base.included, ar.included),
      toBring: ensureBilingualList(en.toBring ?? base.toBring, ar.toBring),
    };
  });
};

const seedPricing = () => {
  const enPlans = defaultSiteContent?.en?.pricing?.plans ?? [];
  const arPlans = defaultSiteContent?.ar?.pricing?.plans ?? [];
  return pricingMock.map((base, i) => {
    const en = enPlans[i] ?? {};
    const ar = arPlans[i] ?? {};
    return {
      id: base.id,
      price: base.price,
      popular: !!base.popular,
      name: ensureBilingualScalar(en.name ?? base.name, ar.name),
      period: ensureBilingualScalar(en.period ?? base.period, ar.period),
      features: ensureBilingualList(en.features ?? base.features, ar.features),
    };
  });
};

const seedServices = () => {
  const enS = defaultSiteContent?.en?.home?.services ?? [];
  const arS = defaultSiteContent?.ar?.home?.services ?? [];
  return servicesMock.map((base, i) => {
    const en = enS[i] ?? {};
    const ar = arS[i] ?? {};
    return {
      id: i + 1,
      icon: base.icon,
      title: ensureBilingualScalar(en.title ?? base.title, ar.title),
      description: ensureBilingualScalar(
        en.description ?? base.description,
        ar.description,
      ),
    };
  });
};

const seedTestimonials = () => {
  const enT = defaultSiteContent?.en?.home?.testimonialsList ?? [];
  const arT = defaultSiteContent?.ar?.home?.testimonialsList ?? [];
  return testimonialsMock.map((base, i) => {
    const en = enT[i] ?? {};
    const ar = arT[i] ?? {};
    return {
      id: base.id,
      name: en.name ?? base.name,
      location: en.location ?? base.location,
      rating: base.rating ?? 5,
      text: ensureBilingualScalar(en.text ?? base.text, ar.text),
    };
  });
};

const seedFaqs = () => {
  const enF = defaultSiteContent?.en?.contact?.faq?.items ?? [];
  const arF = defaultSiteContent?.ar?.contact?.faq?.items ?? [];
  // Fall back to mock faqs if content is empty.
  const baseList = enF.length ? enF : faqsMock;
  return baseList.map((base, i) => {
    const ar = arF[i] ?? {};
    return {
      id: i + 1,
      question: ensureBilingualScalar(base.question, ar.question),
      answer: ensureBilingualScalar(base.answer, ar.answer),
    };
  });
};

// ---------- Schemas (used by the edit modal) ----------
export const SCHEMAS = {
  retreats: {
    title: { en: "Edit Retreat", ar: "تعديل الرحلة" },
    addTitle: { en: "Add New Retreat", ar: "إضافة رحلة جديدة" },
    confirmDelete: {
      en: "Delete this retreat?",
      ar: "هل تريد حذف هذه الرحلة؟",
    },
    seed: seedRetreats,
    fields: [
      {
        key: "title",
        label: { en: "Title", ar: "العنوان" },
        type: "text",
        bilingual: true,
      },
      {
        key: "destination",
        label: { en: "Destination", ar: "الوجهة" },
        type: "text",
      },
      {
        key: "dateRange",
        label: { en: "Date Range", ar: "نطاق التاريخ" },
        type: "text",
      },
      {
        key: "duration",
        label: { en: "Duration", ar: "المدة" },
        type: "text",
      },
      {
        key: "image",
        label: { en: "Cover Image", ar: "صورة الغلاف" },
        type: "image",
      },
      {
        key: "images",
        label: {
          en: "Gallery Images",
          ar: "معرض الصور",
        },
        type: "images",
      },
      {
        key: "shortDescription",
        label: { en: "Short Description", ar: "وصف مختصر" },
        type: "textarea",
        bilingual: true,
      },
      {
        key: "fullDescription",
        label: { en: "Full Description", ar: "وصف تفصيلي" },
        type: "textarea",
        bilingual: true,
      },
      {
        key: "price",
        label: { en: "Price (EGP)", ar: "السعر" },
        type: "number",
      },
      {
        key: "spots",
        label: { en: "Total Spots", ar: "السعة" },
        type: "number",
      },
      {
        key: "availableSpots",
        label: { en: "Available Spots", ar: "المقاعد المتاحة" },
        type: "number",
      },
      {
        key: "included",
        label: { en: "Included (one per line)", ar: "المتضمن (سطر لكل عنصر)" },
        type: "list",
        bilingual: true,
      },
      {
        key: "toBring",
        label: {
          en: "What to Bring (one per line)",
          ar: "ما يجب إحضاره (سطر لكل عنصر)",
        },
        type: "list",
        bilingual: true,
      },
    ],
    blank: () => ({
      destination: "",
      dateRange: "",
      duration: "",
      image: "",
      images: [],
      price: 0,
      spots: 10,
      availableSpots: 10,
      title: { en: "New Retreat", ar: "رحلة جديدة" },
      shortDescription: { en: "", ar: "" },
      fullDescription: { en: "", ar: "" },
      included: { en: [], ar: [] },
      toBring: { en: [], ar: [] },
    }),
  },
  pricing: {
    title: { en: "Edit Pricing Plan", ar: "تعديل الباقة" },
    addTitle: { en: "Add New Plan", ar: "إضافة باقة جديدة" },
    confirmDelete: { en: "Delete this plan?", ar: "هل تريد حذف هذه الباقة؟" },
    seed: seedPricing,
    fields: [
      {
        key: "name",
        label: { en: "Plan Name", ar: "اسم الباقة" },
        type: "text",
        bilingual: true,
      },
      {
        key: "period",
        label: { en: "Period / Subtitle", ar: "الفترة / العنوان الفرعي" },
        type: "text",
        bilingual: true,
      },
      {
        key: "price",
        label: { en: "Price (EGP)", ar: "السعر" },
        type: "number",
      },
      {
        key: "popular",
        label: { en: "Mark as Most Popular", ar: "تمييز كالأكثر شعبية" },
        type: "boolean",
      },
      {
        key: "features",
        label: { en: "Features (one per line)", ar: "المميزات (سطر لكل عنصر)" },
        type: "list",
        bilingual: true,
      },
    ],
    blank: () => ({
      price: 0,
      popular: false,
      name: { en: "New Plan", ar: "باقة جديدة" },
      period: { en: "per class", ar: "للحصة" },
      features: { en: [], ar: [] },
    }),
  },
  services: {
    title: { en: "Edit Service", ar: "تعديل الخدمة" },
    addTitle: { en: "Add New Service", ar: "إضافة خدمة جديدة" },
    confirmDelete: {
      en: "Delete this service?",
      ar: "هل تريد حذف هذه الخدمة؟",
    },
    seed: seedServices,
    fields: [
      {
        key: "title",
        label: { en: "Title", ar: "العنوان" },
        type: "text",
        bilingual: true,
      },
      {
        key: "description",
        label: { en: "Description", ar: "الوصف" },
        type: "textarea",
        bilingual: true,
      },
      {
        key: "icon",
        label: { en: "Icon Name (lucide)", ar: "اسم الأيقونة" },
        type: "text",
      },
    ],
    blank: () => ({
      icon: "Heart",
      title: { en: "New Service", ar: "خدمة جديدة" },
      description: { en: "", ar: "" },
    }),
  },
  testimonials: {
    title: { en: "Edit Testimonial", ar: "تعديل الشهادة" },
    addTitle: { en: "Add New Testimonial", ar: "إضافة شهادة جديدة" },
    confirmDelete: {
      en: "Delete this testimonial?",
      ar: "هل تريد حذف هذه الشهادة؟",
    },
    seed: seedTestimonials,
    fields: [
      { key: "name", label: { en: "Name", ar: "الاسم" }, type: "text" },
      {
        key: "location",
        label: { en: "Location", ar: "الموقع" },
        type: "text",
      },
      {
        key: "rating",
        label: { en: "Rating (1-5)", ar: "التقييم (1-5)" },
        type: "number",
      },
      {
        key: "text",
        label: { en: "Quote", ar: "الاقتباس" },
        type: "textarea",
        bilingual: true,
      },
    ],
    blank: () => ({
      name: "",
      location: "",
      rating: 5,
      text: { en: "", ar: "" },
    }),
  },
  faqs: {
    title: { en: "Edit FAQ", ar: "تعديل السؤال" },
    addTitle: { en: "Add New FAQ", ar: "إضافة سؤال جديد" },
    confirmDelete: { en: "Delete this FAQ?", ar: "هل تريد حذف هذا السؤال؟" },
    seed: seedFaqs,
    fields: [
      {
        key: "question",
        label: { en: "Question", ar: "السؤال" },
        type: "text",
        bilingual: true,
      },
      {
        key: "answer",
        label: { en: "Answer", ar: "الإجابة" },
        type: "textarea",
        bilingual: true,
      },
    ],
    blank: () => ({
      question: { en: "", ar: "" },
      answer: { en: "", ar: "" },
    }),
  },
};

// ---------- Provider ----------
const CollectionsAdminContext = createContext(null);

const loadInitial = () => {
  const seeded = Object.fromEntries(
    Object.entries(SCHEMAS).map(([key, def]) => [key, def.seed()]),
  );
  if (typeof window === "undefined") return seeded;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seeded;
    const parsed = JSON.parse(raw);
    Object.keys(seeded).forEach((key) => {
      if (Array.isArray(parsed[key])) seeded[key] = parsed[key];
    });
    return seeded;
  } catch {
    return seeded;
  }
};

const persist = (collections) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch {
    /* ignore */
  }
};

const nextId = (items) => {
  const max = items
    .map((c) => Number(c.id))
    .filter((n) => Number.isFinite(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return max + 1;
};

export const CollectionsAdminProvider = ({ children }) => {
  const [collections, setCollections] = useState(loadInitial);

  const updateItem = useCallback((collectionKey, id, partial) => {
    setCollections((prev) => {
      const list = prev[collectionKey] ?? [];
      const next = {
        ...prev,
        [collectionKey]: list.map((it) =>
          it.id === id ? { ...it, ...partial } : it,
        ),
      };
      persist(next);
      return next;
    });
  }, []);

  const deleteItem = useCallback((collectionKey, id) => {
    setCollections((prev) => {
      const list = prev[collectionKey] ?? [];
      const next = {
        ...prev,
        [collectionKey]: list.filter((it) => it.id !== id),
      };
      persist(next);
      return next;
    });
  }, []);

  const addItem = useCallback((collectionKey) => {
    let createdItem;
    setCollections((prev) => {
      const list = prev[collectionKey] ?? [];
      const def = SCHEMAS[collectionKey];
      const blank = def?.blank?.() ?? {};
      createdItem = { id: nextId(list), ...blank };
      const next = { ...prev, [collectionKey]: [...list, createdItem] };
      persist(next);
      return next;
    });
    return createdItem;
  }, []);

  const resetCollection = useCallback((collectionKey) => {
    setCollections((prev) => {
      const def = SCHEMAS[collectionKey];
      const seeded = def?.seed?.() ?? [];
      const next = { ...prev, [collectionKey]: seeded };
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      collections,
      updateItem,
      deleteItem,
      addItem,
      resetCollection,
      schemas: SCHEMAS,
    }),
    [collections, updateItem, deleteItem, addItem, resetCollection],
  );

  return (
    <CollectionsAdminContext.Provider value={value}>
      {children}
    </CollectionsAdminContext.Provider>
  );
};

export const useCollection = (collectionKey) => {
  const ctx = useContext(CollectionsAdminContext);
  if (!ctx) {
    throw new Error(
      "useCollection must be used within a CollectionsAdminProvider",
    );
  }
  const items = ctx.collections[collectionKey] ?? [];
  return {
    items,
    schema: ctx.schemas[collectionKey],
    addItem: () => ctx.addItem(collectionKey),
    updateItem: (id, partial) => ctx.updateItem(collectionKey, id, partial),
    deleteItem: (id) => ctx.deleteItem(collectionKey, id),
    resetCollection: () => ctx.resetCollection(collectionKey),
  };
};
