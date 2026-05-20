import { supabase } from "./supabase";

const BUCKET = "media";

const safeFilename = (name) =>
  String(name ?? "image")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";

const randomId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const extFromMime = (mime) => {
  if (!mime) return "jpg";
  const m = String(mime).toLowerCase();
  if (m.includes("png")) return "png";
  if (m.includes("webp")) return "webp";
  if (m.includes("gif")) return "gif";
  if (m.includes("svg")) return "svg";
  if (m.includes("avif")) return "avif";
  return "jpg";
};

/**
 * Resize/compress an image client-side using canvas.
 * Returns a Blob (JPEG) plus dimensions. Falls back to original file if anything
 * fails (e.g. unsupported types like SVG, animated GIF).
 */
export const compressImage = async (
  file,
  { maxWidth = 2048, maxHeight = 2048, quality = 0.85 } = {},
) => {
  // Skip compression for SVGs / GIFs (preserve animation/vectors).
  const passthrough = /^image\/(svg|gif)/i.test(file.type);
  if (passthrough) {
    return { blob: file, mime: file.type, width: null, height: null };
  }

  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Could not decode image"));
      i.src = dataUrl;
    });

    let { width, height } = img;
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(
        (b) => resolve(b ?? file),
        "image/jpeg",
        Math.max(0.5, Math.min(0.95, quality)),
      ),
    );
    return { blob, mime: "image/jpeg", width, height };
  } catch {
    return { blob: file, mime: file.type, width: null, height: null };
  }
};

/**
 * Upload a single file to Supabase Storage, then index it in media_assets.
 */
export const uploadFile = async (file, options = {}) => {
  if (!file) throw new Error("No file provided");

  const compressed = await compressImage(file, options);
  const ext = extFromMime(compressed.mime);
  const path = `uploads/${randomId()}-${safeFilename(
    file.name?.replace(/\.[^.]+$/, "") || "image",
  )}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed.blob, {
      contentType: compressed.mime,
      upsert: false,
      cacheControl: "31536000",
    });

  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub?.publicUrl;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row = {
    path,
    url: publicUrl,
    name: file.name ?? null,
    mime: compressed.mime,
    size_bytes: compressed.blob?.size ?? null,
    width: compressed.width,
    height: compressed.height,
    uploaded_by: user?.id ?? null,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("media_assets")
    .insert(row)
    .select()
    .single();

  if (insertError) {
    // Best-effort: clean up the uploaded file if metadata insert failed.
    await supabase.storage
      .from(BUCKET)
      .remove([path])
      .catch(() => {});
    throw insertError;
  }

  return inserted;
};

export const listAssets = async ({ search = "", limit = 200 } = {}) => {
  let query = supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},path.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

export const deleteAsset = async (asset) => {
  if (!asset?.id) throw new Error("Invalid asset");
  const { error: storageErr } = await supabase.storage
    .from(BUCKET)
    .remove([asset.path]);
  if (storageErr) throw storageErr;
  const { error: rowErr } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", asset.id);
  if (rowErr) throw rowErr;
  return true;
};

export const updateAsset = async (id, patch) => {
  const { data, error } = await supabase
    .from("media_assets")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
