import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { classes as classesMockData } from "./mockData";
import { defaultSiteContent } from "../content/defaultSiteContent";

const STORAGE_KEY = "heba-classes-admin-v1";

const ClassesAdminContext = createContext(null);

// Seed the managed list once, combining mockData (non-localized fields)
// with the bilingual defaults defined in defaultSiteContent.classes.items.
const seedFromDefaults = () => {
  const enItems = defaultSiteContent?.en?.classes?.items ?? [];
  const arItems = defaultSiteContent?.ar?.classes?.items ?? [];

  return classesMockData.map((base, index) => {
    const en = enItems[index] ?? {};
    const ar = arItems[index] ?? {};
    return {
      id: base.id,
      type: base.type,
      instructor: base.instructor,
      dateTime: base.dateTime,
      duration: base.duration,
      totalSpots: base.totalSpots,
      availableSpots: base.availableSpots,
      price: base.price,
      image: base.image ?? "",
      images: Array.isArray(base.images) ? base.images : [],
      name: {
        en: en.name ?? base.name,
        ar: ar.name ?? base.name,
      },
      description: {
        en: en.description ?? base.description,
        ar: ar.description ?? base.description,
      },
      level: {
        en: en.level ?? base.level,
        ar: ar.level ?? base.level,
      },
    };
  });
};

const loadInitial = () => {
  if (typeof window === "undefined") return seedFromDefaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedFromDefaults();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seedFromDefaults();
    }
    return parsed;
  } catch {
    return seedFromDefaults();
  }
};

const persist = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
};

const nextId = (items) => {
  const maxNumeric = items
    .map((c) => Number(c.id))
    .filter((n) => Number.isFinite(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return maxNumeric + 1;
};

export const ClassesAdminProvider = ({ children }) => {
  const [items, setItems] = useState(loadInitial);

  const updateClass = useCallback((id, partial) => {
    setItems((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...partial } : c));
      persist(next);
      return next;
    });
  }, []);

  const deleteClass = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const addClass = useCallback(() => {
    let createdId;
    setItems((prev) => {
      createdId = nextId(prev);
      const blank = {
        id: createdId,
        type: "Yoga",
        instructor: "",
        dateTime: new Date().toISOString().slice(0, 16),
        duration: 60,
        totalSpots: 10,
        availableSpots: 10,
        price: 250,
        name: { en: "New Class", ar: "حصة جديدة" },
        description: { en: "", ar: "" },
        level: { en: "All Levels", ar: "كل المستويات" },
      };
      const next = [...prev, blank];
      persist(next);
      return next;
    });
    return createdId;
  }, []);

  const resetClasses = useCallback(() => {
    const seeded = seedFromDefaults();
    persist(seeded);
    setItems(seeded);
  }, []);

  const value = useMemo(
    () => ({ items, updateClass, deleteClass, addClass, resetClasses }),
    [items, updateClass, deleteClass, addClass, resetClasses],
  );

  return (
    <ClassesAdminContext.Provider value={value}>
      {children}
    </ClassesAdminContext.Provider>
  );
};

export const useClassesAdmin = () => {
  const ctx = useContext(ClassesAdminContext);
  if (!ctx) {
    throw new Error(
      "useClassesAdmin must be used within a ClassesAdminProvider",
    );
  }
  return ctx;
};
