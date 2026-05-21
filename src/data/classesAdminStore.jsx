import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { classes as classesMockData } from "./mockData";
import { defaultSiteContent } from "../content/defaultSiteContent";

const STORAGE_KEY = "heba-classes-admin-v1";
const CONTENT_KEY = "default";

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

const persistLocal = (items) => {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
};

const hasValidItems = (value) => Array.isArray(value) && value.length > 0;

const nextId = (items) => {
  const maxNumeric = items
    .map((c) => Number(c.id))
    .filter((n) => Number.isFinite(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return maxNumeric + 1;
};

export const ClassesAdminProvider = ({ children }) => {
  const [items, setItems] = useState(loadInitial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const saveRemote = useCallback(async (nextItems) => {
    const { error: upsertError } = await supabase
      .from("classes_content")
      .upsert(
        {
          key: CONTENT_KEY,
          items: nextItems,
        },
        { onConflict: "key" },
      );
    if (upsertError) throw upsertError;
  }, []);

  useEffect(() => {
    const loadRemote = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("classes_content")
          .select("items")
          .eq("key", CONTENT_KEY)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        if (hasValidItems(data?.items)) {
          setItems(data.items);
          persistLocal(data.items);
          return;
        }

        const local = loadInitial();
        if (hasValidItems(local)) {
          setItems(local);
          await saveRemote(local);
          return;
        }

        const seeded = seedFromDefaults();
        setItems(seeded);
        await saveRemote(seeded);
      } catch (err) {
        console.error("Failed to load classes from Supabase:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadRemote();
  }, [saveRemote]);

  const applyAndPersist = useCallback(
    (producer) => {
      setItems((prev) => {
        const next = producer(prev);
        persistLocal(next);

        saveRemote(next).catch((err) => {
          console.error("Failed to save classes to Supabase:", err);
          setError(err);
          setItems(prev);
          persistLocal(prev);
        });

        return next;
      });
    },
    [saveRemote],
  );

  const updateClass = useCallback((id, partial) => {
    applyAndPersist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    );
  }, [applyAndPersist]);

  const deleteClass = useCallback((id) => {
    applyAndPersist((prev) => prev.filter((c) => c.id !== id));
  }, [applyAndPersist]);

  const addClass = useCallback(() => {
    let createdId;
    applyAndPersist((prev) => {
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
      return next;
    });
    return createdId;
  }, [applyAndPersist]);

  const resetClasses = useCallback(() => {
    const seeded = seedFromDefaults();
    applyAndPersist(() => seeded);
  }, [applyAndPersist]);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      updateClass,
      deleteClass,
      addClass,
      resetClasses,
    }),
    [items, loading, error, updateClass, deleteClass, addClass, resetClasses],
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
