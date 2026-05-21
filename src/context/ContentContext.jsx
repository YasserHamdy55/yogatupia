import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { defaultSiteContent } from "../content/defaultSiteContent";

const CONTENT_KEY = "default";
const ContentContext = createContext();

const isObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const deepMerge = (base, override) => {
  if (!isObject(base) || !isObject(override)) {
    return override ?? base;
  }

  const merged = { ...base };
  Object.keys(override).forEach((key) => {
    merged[key] =
      key in base ? deepMerge(base[key], override[key]) : override[key];
  });
  return merged;
};

const getValueByPath = (source, path) =>
  path
    .split(".")
    .reduce(
      (current, key) => (current == null ? undefined : current[key]),
      source,
    );

const setValueByPath = (source, path, value) => {
  const keys = path.split(".");
  const cloned = structuredClone(source);
  let current = cloned;

  keys.slice(0, -1).forEach((key) => {
    if (!isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  });

  current[keys[keys.length - 1]] = value;
  return cloned;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load content from Supabase on mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("site_content")
          .select("en, ar")
          .eq("key", CONTENT_KEY)
          .single();

        if (err && err.code !== "PGRST116") {
          // PGRST116 = no rows found
          throw err;
        }

        if (data) {
          // Merge fetched content with defaults to ensure all keys exist
          setContent(
            deepMerge(defaultSiteContent, {
              en: data.en || {},
              ar: data.ar || {},
            })
          );
        } else {
          // No content in DB yet, use defaults
          setContent(defaultSiteContent);
        }
      } catch (err) {
        console.error("Failed to load content:", err);
        setError(err);
        // Fall back to defaults on error
        setContent(defaultSiteContent);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const saveContent = async (nextContent) => {
    const prevContent = content;
    try {
      setContent(nextContent);
      setError(null);

      // Try to upsert to Supabase
      const { error: err } = await supabase.from("site_content").upsert(
        {
          key: CONTENT_KEY,
          en: nextContent.en || {},
          ar: nextContent.ar || {},
        },
        { onConflict: "key" }
      );

      if (err) throw err;
      return true;
    } catch (err) {
      console.error("Failed to save content:", err);
      setError(err);
      // Revert optimistic update when remote save fails.
      setContent(prevContent);
      return false;
    }
  };

  const updateContentValue = (language, path, value) => {
    const nextContent = setValueByPath(content, `${language}.${path}`, value);
    return saveContent(nextContent);
  };

  const updateLocalizedContent = (path, { en, ar }) => {
    let nextContent = content;

    if (en !== undefined) {
      nextContent = setValueByPath(nextContent, `en.${path}`, en);
    }
    if (ar !== undefined) {
      nextContent = setValueByPath(nextContent, `ar.${path}`, ar);
    }

    return saveContent(nextContent);
  };

  const replaceContent = (nextContent) => {
    const merged = deepMerge(defaultSiteContent, nextContent);
    saveContent(merged);
  };

  const resetContent = async () => {
    try {
      setContent(defaultSiteContent);
      setError(null);
      // Delete the content row to reset to defaults
      await supabase.from("site_content").delete().eq("key", CONTENT_KEY);
    } catch (err) {
      console.error("Failed to reset content:", err);
      setError(err);
      // Still update local state
      setContent(defaultSiteContent);
    }
  };

  const value = useMemo(
    () => ({
      content,
      loading,
      error,
      updateContentValue,
      updateLocalizedContent,
      replaceContent,
      resetContent,
      getContentValue: (language, path, fallback = "") =>
        getValueByPath(content[language], path) ?? fallback,
    }),
    [content, loading, error]
  );

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
