import React, { createContext, useContext, useMemo, useState } from "react";
import { defaultSiteContent } from "../content/defaultSiteContent";

const STORAGE_KEY = "heba-site-content-v1";
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

const getInitialContent = () => {
  if (typeof window === "undefined") {
    return defaultSiteContent;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return defaultSiteContent;
  }

  try {
    return deepMerge(defaultSiteContent, JSON.parse(saved));
  } catch {
    return defaultSiteContent;
  }
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
  const [content, setContent] = useState(getInitialContent);

  const saveContent = (nextContent) => {
    setContent(nextContent);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
    }
  };

  const updateContentValue = (language, path, value) => {
    const nextContent = setValueByPath(content, `${language}.${path}`, value);
    saveContent(nextContent);
  };

  const replaceContent = (nextContent) => {
    saveContent(deepMerge(defaultSiteContent, nextContent));
  };

  const resetContent = () => {
    setContent(defaultSiteContent);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      content,
      updateContentValue,
      replaceContent,
      resetContent,
      getContentValue: (language, path, fallback = "") =>
        getValueByPath(content[language], path) ?? fallback,
    }),
    [content],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
