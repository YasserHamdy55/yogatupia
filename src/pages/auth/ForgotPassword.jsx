import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import BrandLogo from "../../components/BrandLogo";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    title: "Forgot password",
    subtitle:
      "Enter your account email and we'll send you a secure link to set a new password.",
    email: "Email",
    send: "Send reset link",
    sending: "Sending…",
    success:
      "If an account exists for this email, a reset link has been sent. Please check your inbox.",
    back: "Back to sign in",
    failed: "Could not send the reset link.",
  },
  ar: {
    title: "نسيت كلمة المرور",
    subtitle:
      "أدخل بريدك الإلكتروني وسنرسل لك رابطًا آمنًا لتعيين كلمة مرور جديدة.",
    email: "البريد الإلكتروني",
    send: "إرسال رابط إعادة التعيين",
    sending: "جارٍ الإرسال…",
    success:
      "إذا كان هناك حساب بهذا البريد، تم إرسال رابط إعادة التعيين. تحقق من بريدك.",
    back: "العودة لتسجيل الدخول",
    failed: "تعذر إرسال الرابط.",
  },
};

const ForgotPassword = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { error: rErr } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/account` },
      );
      if (rErr) throw rErr;
      setDone(true);
    } catch (err) {
      setError(err?.message || t.failed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-sage-100 p-8">
        <div className="flex justify-center mb-6">
          <BrandLogo size="md" />
        </div>
        <h1 className="text-2xl font-serif text-center text-sage-900 mb-2">
          {t.title}
        </h1>
        <p className="text-center text-sage-600 mb-6 text-sm">{t.subtitle}</p>

        {done ? (
          <p className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            {t.success}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 rounded-lg bg-sage-700 hover:bg-sage-800 text-white font-medium transition disabled:opacity-60"
            >
              {busy ? t.sending : t.send}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-sage-600 mt-6">
          <Link to="/login" className="text-sage-800 underline">
            {t.back}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
