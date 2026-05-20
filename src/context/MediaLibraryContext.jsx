import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteAsset as deleteAssetApi,
  listAssets,
  uploadFile,
} from "../lib/mediaStorage";

const MediaLibraryContext = createContext(null);

export const MediaLibraryProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const refresh = useCallback(async ({ search = "" } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAssets({ search });
      setAssets(data);
      fetchedRef.current = true;
      return data;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (fetchedRef.current) return assets;
    return refresh();
  }, [assets, refresh]);

  const upload = useCallback(async (files, options = {}) => {
    const arr = Array.isArray(files) ? files : Array.from(files ?? []);
    const results = [];
    const errors = [];
    for (const file of arr) {
      try {
        const asset = await uploadFile(file, options);
        results.push(asset);
      } catch (e) {
        errors.push({ file, error: e });
      }
    }
    if (results.length) {
      setAssets((prev) => [...results, ...prev]);
    }
    return { results, errors };
  }, []);

  const remove = useCallback(async (asset) => {
    await deleteAssetApi(asset);
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
  }, []);

  // Optional initial fetch when provider first mounts in admin context.
  // We do NOT auto-fetch globally to avoid hitting Supabase for anon visitors.
  useEffect(() => {
    return () => {
      fetchedRef.current = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      assets,
      loading,
      error,
      refresh,
      ensureLoaded,
      upload,
      remove,
    }),
    [assets, loading, error, refresh, ensureLoaded, upload, remove],
  );

  return (
    <MediaLibraryContext.Provider value={value}>
      {children}
    </MediaLibraryContext.Provider>
  );
};

export const useMediaLibrary = () => {
  const ctx = useContext(MediaLibraryContext);
  if (!ctx) {
    throw new Error(
      "useMediaLibrary must be used inside <MediaLibraryProvider>",
    );
  }
  return ctx;
};

export default MediaLibraryContext;
