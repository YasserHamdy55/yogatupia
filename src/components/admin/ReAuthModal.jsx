import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    title: "Confirm with your password",
    body: "Please re-enter your admin password to continue.",
    password: "Password",
    confirm: "Confirm",
    cancel: "Cancel",
    invalid: "Wrong password.",
    notLocal: "Re-authentication is only available for password accounts.",
  },
  ar: {
    title: "أكّد بكلمة المرور",
    body: "أعد إدخال كلمة مرور الأدمن للمتابعة.",
    password: "كلمة المرور",
    confirm: "تأكيد",
    cancel: "إلغاء",
    invalid: "كلمة المرور غير صحيحة.",
    notLocal: "إعادة التحقق متاحة فقط لحسابات كلمة المرور.",
  },
};

// Modal that re-prompts the current admin for their password.
// Calls onConfirm() only after a successful password match.
const ReAuthModal = ({ open, onClose, onConfirm, message }) => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { currentUser, verifyCurrentPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const isLocalAccount = !!currentUser?.passwordHash;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLocalAccount) {
      // Skip verification for non-local accounts (no password set).
      onConfirm();
      onClose();
      return;
    }
    setBusy(true);
    const ok = await verifyCurrentPassword(password);
    setBusy(false);
    if (!ok) {
      setError(t.invalid);
      return;
    }
    setPassword("");
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-sage-500 hover:text-sage-700"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 text-sage-700 mb-2">
          <ShieldCheck size={20} />
          <h2 className="text-xl font-serif font-bold text-sage-900">
            {t.title}
          </h2>
        </div>
        <p className="text-sm text-sage-700 mb-4">{message || t.body}</p>

        <form onSubmit={submit} className="space-y-3">
          {isLocalAccount ? (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              autoFocus
              className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
            />
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              {t.notLocal}
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-sage-800 hover:bg-sand-100 rounded-lg"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary !py-2 !px-5 text-sm disabled:opacity-60"
            >
              {t.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReAuthModal;
