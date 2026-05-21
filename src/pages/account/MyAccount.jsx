import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import PhoneInput from "../../components/PhoneInput";
import { supabase } from "../../lib/supabase";

const TEXT = {
  en: {
    title: "My account",
    subtitle: "Update your profile information.",
    whatsapp: "WhatsApp number",
    name: "Full name",
    email: "Email",
    role: "Role",
    provider: "Linked provider",
    save: "Save changes",
    saved: "Profile updated.",
    passwordTitle: "Change password",
    passwordSubtitle: "Set a new password for your account.",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    updatePassword: "Update password",
    passwordUpdated: "Password updated.",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "Password must be at least 6 characters.",
    updating: "Updating…",
    skipForNow: "Skip for now",
    changePasswordLink: "Change password",
  },
  ar: {
    title: "حسابي",
    subtitle: "تحديث بيانات ملفك الشخصي.",
    whatsapp: "رقم الواتساب",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    role: "الدور",
    provider: "وسيلة الدخول المرتبطة",
    save: "حفظ التغييرات",
    saved: "تم تحديث الملف.",
    passwordTitle: "تغيير كلمة المرور",
    passwordSubtitle: "اضبط كلمة مرور جديدة لحسابك.",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
    updatePassword: "تحديث كلمة المرور",
    passwordUpdated: "تم تحديث كلمة المرور.",
    passwordMismatch: "كلمتا المرور غير متطابقتين.",
    passwordTooShort: "كلمة المرور يجب ألا تقل عن 6 أحرف.",
    updating: "جارٍ التحديث…",
    skipForNow: "تخطّى الآن",
    changePasswordLink: "تغيير كلمة المرور",
  },
};

const MyAccount = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { currentUser, updateCurrentUser } = useAuth();
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || "",
  );
  const [email, setEmail] = useState(currentUser?.email || "");
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || "");
  const [message, setMessage] = useState("");

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const mustChange = !!currentUser?.mustChangePassword;
  const [showProfile, setShowProfile] = useState(!mustChange);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    updateCurrentUser({ displayName, email, whatsapp });
    setMessage(t.saved);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    if (pw.length < 6) {
      setPwError(t.passwordTooShort);
      return;
    }
    if (pw !== pw2) {
      setPwError(t.passwordMismatch);
      return;
    }
    setPwBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      // Password changed successfully: clear temporary password metadata.
      if (currentUser?.id) {
        await supabase
          .from("profiles")
          .update({
            must_change_password: false,
            temporary_password: null,
          })
          .eq("id", currentUser.id);
      }
      setPwMessage(t.passwordUpdated);
      setPw("");
      setPw2("");
      window.setTimeout(() => {
        setPwMessage("");
        if (mustChange) {
          // Force a full reload so AuthContext re-reads the cleared flag,
          // then go home.
          window.location.assign("/");
        } else {
          navigate("/");
        }
      }, 1200);
    } catch (err) {
      setPwError(err?.message || "Failed to update password.");
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-sand-50">
      {!showProfile && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-sand-200 p-8">
          {mustChange && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              {language === "ar"
                ? "تم تعيين كلمة مرور مؤقتة لحسابك. يجب تغييرها قبل المتابعة."
                : "A temporary password is set on your account. You must change it before continuing."}
            </div>
          )}
          <h2 className="text-2xl font-serif font-bold text-sage-900 mb-2">
            {t.passwordTitle}
          </h2>
          <p className="text-sage-700 mb-6">{t.passwordSubtitle}</p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">
                {t.newPassword}
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">
                {t.confirmPassword}
              </label>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
              />
            </div>

            {pwError && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {pwError}
              </p>
            )}
            {pwMessage && <p className="text-sm text-green-700">{pwMessage}</p>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pwBusy}
                className="btn-primary w-full sm:w-auto disabled:opacity-60"
              >
                {pwBusy ? t.updating : t.updatePassword}
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                disabled={mustChange}
                className={`text-sm underline ${mustChange ? "text-sage-300 cursor-not-allowed" : "text-sage-700"}`}
              >
                {t.skipForNow}
              </button>
            </div>
          </form>
        </div>
      )}

      {showProfile && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-sand-200 p-8">
          <h1 className="text-3xl font-serif font-bold text-sage-900 mb-2">
            {t.title}
          </h1>
          <p className="text-sage-700 mb-6">{t.subtitle}</p>

          <form onSubmit={handleSave} className="space-y-4">
            <Field
              label={t.name}
              value={displayName}
              onChange={setDisplayName}
            />
            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">
                {t.whatsapp}
              </label>
              <PhoneInput value={whatsapp} onChange={setWhatsapp} />
            </div>
            <Field
              label={t.email}
              value={email}
              onChange={setEmail}
              type="email"
            />

            <div className="grid grid-cols-2 gap-4 pt-2">
              <ReadOnly label={t.role} value={currentUser?.role} />
              <ReadOnly label={t.provider} value={currentUser?.provider} />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary w-full sm:w-auto">
                {t.save}
              </button>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="text-sm text-sage-700 underline"
              >
                {t.changePasswordLink}
              </button>
            </div>
            {message && <p className="text-sm text-green-700">{message}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-sage-800 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
    />
  </div>
);

const ReadOnly = ({ label, value }) => (
  <div>
    <p className="text-xs text-sage-600 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-sage-900">{value || "—"}</p>
  </div>
);

export default MyAccount;
