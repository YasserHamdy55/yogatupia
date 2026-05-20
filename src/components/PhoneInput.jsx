import React, { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "../auth/useAuth";

// Built-in country codes. Ordered with Egypt and the Arabian Gulf at the
// top since most clients are from this region.
export const BUILT_IN_COUNTRY_CODES = [
  { code: "+20", label: "Egypt", flag: "🇪🇬" },
  { code: "+966", label: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", label: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+965", label: "Kuwait", flag: "🇰🇼" },
  { code: "+974", label: "Qatar", flag: "🇶🇦" },
  { code: "+973", label: "Bahrain", flag: "🇧🇭" },
  { code: "+968", label: "Oman", flag: "🇴🇲" },
  { code: "+962", label: "Jordan", flag: "🇯🇴" },
  { code: "+961", label: "Lebanon", flag: "🇱🇧" },
  { code: "+212", label: "Morocco", flag: "🇲🇦" },
  { code: "+216", label: "Tunisia", flag: "🇹🇳" },
  { code: "+213", label: "Algeria", flag: "🇩🇿" },
  { code: "+249", label: "Sudan", flag: "🇸🇩" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", label: "United States / Canada", flag: "🇺🇸" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
  { code: "+39", label: "Italy", flag: "🇮🇹" },
  { code: "+34", label: "Spain", flag: "🇪🇸" },
  { code: "+90", label: "Turkey", flag: "🇹🇷" },
];

const DEFAULT_CODE = "+20";
const CUSTOM_OPTION = "__custom__";

// Module-level cache so we only fetch once per page load.
let cachedRemoteCodes = null;
const subscribers = new Set();

const fetchRemoteCodes = async () => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("country_codes")
    .select("code, label, flag")
    .order("created_at", { ascending: true });
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("[PhoneInput] could not load custom codes", error);
    return [];
  }
  return data || [];
};

const ensureRemoteCodes = async () => {
  if (cachedRemoteCodes) return cachedRemoteCodes;
  cachedRemoteCodes = await fetchRemoteCodes();
  subscribers.forEach((cb) => cb(cachedRemoteCodes));
  return cachedRemoteCodes;
};

const invalidateRemoteCodes = (next) => {
  cachedRemoteCodes = next;
  subscribers.forEach((cb) => cb(next));
};

// Normalise free-form input ("+962", "962", "00962") → "+962".
const normaliseCode = (raw) => {
  let v = (raw || "").trim().replace(/\s+/g, "");
  if (!v) return "";
  if (v.startsWith("00")) v = v.slice(2);
  if (v.startsWith("+")) v = v.slice(1);
  const digits = v.replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits.slice(0, 4)}`;
};

export const splitPhone = (value, knownCodes) => {
  const v = (value || "").trim().replace(/\s+/g, "");
  if (!v) return { code: DEFAULT_CODE, rest: "" };
  const match = knownCodes
    .slice()
    .sort((a, b) => b.code.length - a.code.length)
    .find((c) => v.startsWith(c.code));
  if (match) return { code: match.code, rest: v.slice(match.code.length) };
  return { code: DEFAULT_CODE, rest: v.startsWith("+") ? v.slice(1) : v };
};

export const joinPhone = (code, rest) => {
  const digits = (rest || "").replace(/\D/g, "");
  if (!digits) return "";
  return `${code}${digits}`;
};

const PhoneInput = ({
  value,
  onChange,
  required = false,
  placeholder = "1006123023",
  id,
  name = "phone",
  disabled = false,
}) => {
  const { role } = useAuth() || {};
  const [remoteCodes, setRemoteCodes] = useState(cachedRemoteCodes || []);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDraft, setCustomDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load shared custom codes once and subscribe to updates.
  useEffect(() => {
    let mounted = true;
    ensureRemoteCodes().then((codes) => {
      if (mounted) setRemoteCodes(codes);
    });
    const onUpdate = (codes) => {
      if (mounted) setRemoteCodes(codes);
    };
    subscribers.add(onUpdate);
    return () => {
      mounted = false;
      subscribers.delete(onUpdate);
    };
  }, []);

  const allCodes = useMemo(() => {
    const seen = new Set();
    const merged = [];
    [...BUILT_IN_COUNTRY_CODES, ...remoteCodes].forEach((c) => {
      if (seen.has(c.code)) return;
      seen.add(c.code);
      merged.push(c);
    });
    return merged;
  }, [remoteCodes]);

  const { code, rest } = useMemo(
    () => splitPhone(value, allCodes),
    [value, allCodes],
  );

  // Permissions: only staff/admin can add new shared codes (matches RLS).
  const canAddCode = role === "staff" || role === "admin";

  const handleCodeChange = (e) => {
    if (e.target.value === CUSTOM_OPTION) {
      if (!canAddCode) {
        setError(
          "Only staff or admins can add new country codes. Please ask an admin.",
        );
        return;
      }
      setError("");
      setShowCustomInput(true);
      setCustomDraft("+");
      return;
    }
    onChange(joinPhone(e.target.value, rest));
  };

  const handleRestChange = (e) => {
    onChange(joinPhone(code, e.target.value));
  };

  const saveCustomCode = async () => {
    const normalised = normaliseCode(customDraft);
    if (!normalised || normalised === "+") {
      cancelCustom();
      return;
    }
    if (allCodes.find((c) => c.code === normalised)) {
      onChange(joinPhone(normalised, rest));
      cancelCustom();
      return;
    }
    setSaving(true);
    setError("");
    const newEntry = { code: normalised, label: "Custom", flag: "🌐" };
    const { error: insertError } = await supabase
      .from("country_codes")
      .insert(newEntry);
    setSaving(false);
    if (insertError) {
      setError(insertError.message || "Could not save country code.");
      return;
    }
    invalidateRemoteCodes([...(cachedRemoteCodes || []), newEntry]);
    onChange(joinPhone(normalised, rest));
    cancelCustom();
  };

  const cancelCustom = () => {
    setShowCustomInput(false);
    setCustomDraft("");
    setError("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          value={code}
          onChange={handleCodeChange}
          disabled={disabled}
          aria-label="Country code"
          className="px-3 py-3 border border-sand-300 rounded-lg bg-white focus:ring-2 focus:ring-sage-600 focus:border-transparent text-sm max-w-[140px]"
        >
          {allCodes.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
          {canAddCode && <option value={CUSTOM_OPTION}>＋ Other code…</option>}
        </select>
        <input
          id={id}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={rest}
          onChange={handleRestChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
        />
      </div>

      {showCustomInput && (
        <div className="flex items-center gap-2 bg-sand-50 border border-sand-200 rounded-lg p-2">
          <input
            type="text"
            value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            placeholder="+962"
            className="flex-1 px-3 py-2 border border-sand-300 rounded-lg text-sm"
            autoFocus
            disabled={saving}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveCustomCode();
              }
              if (e.key === "Escape") cancelCustom();
            }}
          />
          <button
            type="button"
            onClick={saveCustomCode}
            disabled={saving}
            className="px-3 py-2 rounded-lg bg-sage-700 hover:bg-sage-800 text-white text-sm disabled:opacity-60"
          >
            {saving ? "…" : "Save"}
          </button>
          <button
            type="button"
            onClick={cancelCustom}
            disabled={saving}
            className="px-3 py-2 rounded-lg border border-sand-300 bg-white text-sage-700 text-sm hover:bg-sand-50"
          >
            Cancel
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneInput;
