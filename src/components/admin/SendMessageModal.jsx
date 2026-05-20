import React, { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, Mail, Send, KeyRound, UserPlus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { appendLog, AUDIT_TYPES } from "../../lib/auditLog";

const TEXT = {
  en: {
    title: "Send Message",
    subtitle: "Choose what to send and how to deliver it.",
    stepType: "Message type",
    typeWelcome: "New account credentials",
    typeWelcomeHelp:
      "Send a welcome message with the login URL and credentials.",
    typeReset: "Password reset",
    typeResetHelp:
      "Triggers a secure reset link via email. The old password keeps working until the user sets a new one.",
    tempPassword: "Temporary password (the one you set when creating the user)",
    messagePreview: "Message preview",
    channel: "Delivery channel",
    channelWhatsapp: "WhatsApp",
    channelEmail: "Email",
    channelBoth: "Both",
    noPhone: "No WhatsApp number on file",
    noEmail: "No email on file",
    send: "Send",
    sending: "Sending…",
    cancel: "Cancel",
    successWhatsapp: "WhatsApp opened in a new tab.",
    successEmail: "Email client opened.",
    successReset: "Password reset email sent by Supabase.",
    error: "Something went wrong.",
    back: "Back",
    generateBtn: "Generate temporary password",
    generating: "Generating…",
    tempReady: "Temporary password generated. Review the message and click Send.",
    generateHint: "Click “Generate temporary password” to create credentials. They will appear in the message below.",
    tempPasswordLabel: "Temporary password",
    copy: "Copy",
    copied: "Copied!",
  },
  ar: {
    title: "إرسال رسالة",
    subtitle: "اختر نوع الرسالة ووسيلة الإرسال.",
    stepType: "نوع الرسالة",
    typeWelcome: "بيانات حساب جديد",
    typeWelcomeHelp: "إرسال رسالة ترحيبية تحتوى على رابط الدخول والبيانات.",
    typeReset: "إعادة تعيين كلمة المرور",
    typeResetHelp:
      "يتم إرسال رابط آمن لإعادة التعيين عبر البريد. كلمة المرور القديمة تظل صالحة لحين تعيين كلمة جديدة.",
    tempPassword: "كلمة المرور المؤقتة (التى أنشأتها عند إضافة المستخدم)",
    messagePreview: "معاينة الرسالة",
    channel: "وسيلة الإرسال",
    channelWhatsapp: "واتساب",
    channelEmail: "البريد الإلكتروني",
    channelBoth: "الاثنين",
    noPhone: "لا يوجد رقم واتساب",
    noEmail: "لا يوجد بريد إلكتروني",
    send: "إرسال",
    sending: "جارٍ الإرسال…",
    cancel: "إلغاء",
    successWhatsapp: "تم فتح واتساب فى نافذة جديدة.",
    successEmail: "تم فتح برنامج البريد.",
    successReset: "تم إرسال رسالة إعادة التعيين من Supabase.",
    error: "حدث خطأ.",
    back: "رجوع",
    generateBtn: "توليد كلمة مرور مؤقتة",
    generating: "جارٍ التوليد…",
    tempReady: "تم توليد كلمة المرور. راجع الرسالة ثم اضغط إرسال.",
    generateHint: "اضغط “توليد كلمة مرور مؤقتة” لإنشاء بيانات الدخول. ستظهر فى الرسالة بالأسفل.",
    tempPasswordLabel: "كلمة المرور المؤقتة",
    copy: "نسخ",
    copied: "تم النسخ!",
  },
};

const buildWelcomeMessage = ({
  name,
  email,
  phone,
  password,
  loginUrl,
  lang,
  channel,
}) => {
  const wantsEmail = channel === "email" || channel === "both";
  const contact = wantsEmail && email ? email : phone || email || "";
  if (lang === "ar") {
    return (
      `مرحبًا ${name || ""}،\n` +
      `تم إنشاء حسابك بنجاح فى yogaTupia.\n\n` +
      `يمكنك تسجيل الدخول من خلال الرابط:\n${loginUrl}\n\n` +
      `بيانات الدخول:\n` +
      `${wantsEmail ? "البريد" : "رقم الهاتف"}: ${contact}\n` +
      (password ? `كلمة المرور المؤقتة: ${password}\n\n` : `\n`) +
      `يرجى تغيير كلمة المرور بعد أول تسجيل دخول.`
    );
  }
  return (
    `Hi ${name || ""},\n` +
    `Your yogaTupia account has been created.\n\n` +
    `You can sign in at:\n${loginUrl}\n\n` +
    `Credentials:\n` +
    `${wantsEmail ? "Email" : "Phone"}: ${contact}\n` +
    (password ? `Temporary password: ${password}\n\n` : `\n`) +
    `Please change your password after your first sign-in.`
  );
};

const buildResetMessage = ({ name, email, lang, channel, loginUrl, password }) => {
  const viaEmail = channel === "email" || channel === "both";
  if (lang === "ar") {
    if (password) {
      return (
        `مرحبًا ${name || ""}،\n` +
        `تمت إعادة تعيين كلمة المرور لحسابك فى yogaTupia.\n\n` +
        `بيانات الدخول المؤقتة:\n` +
        (email ? `البريد: ${email}\n` : "") +
        `كلمة المرور المؤقتة: ${password}\n\n` +
        `رابط الدخول: ${loginUrl}\n\n` +
        `سيطلب منك تغيير كلمة المرور فور تسجيل دخولك.`
      );
    }
    if (viaEmail && email) {
      return (
        `مرحبًا ${name || ""}،\n` +
        `لقد طلبنا إعادة تعيين كلمة المرور لحسابك فى yogaTupia.\n\n` +
        `ستتلقّى رسالة على بريدك (${email}) تحتوى على رابط آمن لتعيين كلمة مرور جديدة.\n\n` +
        `كلمة المرور القديمة تظل صالحة لحين تعيين كلمة جديدة.`
      );
    }
    return (
      `مرحبًا ${name || ""}،\n` +
      `تمت إعادة تعيين كلمة المرور لحسابك فى yogaTupia.\n\n` +
      (email ? `البريد: ${email}\n\n` : "") +
      `برجاء الدخول على:\n${loginUrl}`
    );
  }
  if (password) {
    return (
      `Hi ${name || ""},\n` +
      `Your yogaTupia password has been reset.\n\n` +
      `Temporary credentials:\n` +
      (email ? `Email: ${email}\n` : "") +
      `Temporary password: ${password}\n\n` +
      `Sign in at: ${loginUrl}\n\n` +
      `You will be asked to choose a new password on first sign-in.`
    );
  }
  if (viaEmail && email) {
    return (
      `Hi ${name || ""},\n` +
      `A password reset was requested for your yogaTupia account.\n\n` +
      `You will receive an email at ${email} with a secure link to set a new password.\n\n` +
      `Your old password keeps working until you set a new one.`
    );
  }
  return (
    `Hi ${name || ""},\n` +
    `Your yogaTupia password has been reset.\n\n` +
    (email ? `Email: ${email}\n\n` : "") +
    `Please sign in at:\n${loginUrl}`
  );
};

const cleanPhone = (raw) => (raw || "").replace(/[^\d]/g, "");

const SendMessageModal = ({ open, onClose, user, actorId, language }) => {
  const t = TEXT[language] || TEXT.en;
  const lang = language === "ar" ? "ar" : "en";

  const [step, setStep] = useState(1); // 1: type, 2: compose
  const [type, setType] = useState(null); // 'welcome' | 'reset'
  const [tempPassword, setTempPassword] = useState("");
  const [channel, setChannel] = useState("whatsapp"); // 'whatsapp' | 'email' | 'both'
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetTempPassword, setResetTempPassword] = useState("");
  const [resolvedEmail, setResolvedEmail] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [phoneDraft, setPhoneDraft] = useState("");

  const loginUrl = `${window.location.origin}/login`;
  const phone = cleanPhone(phoneDraft || user?.phone || user?.whatsapp || "");
  const email = (emailDraft || user?.email || "").trim();
  const hasPhone = !!phone;
  const hasEmail = !!email;

  useEffect(() => {
    if (open) {
      setEmailDraft(user?.email || "");
      setPhoneDraft(user?.phone || user?.whatsapp || "");
      setStep(1);
      setType(null);
      setTempPassword("");
      setResetTempPassword("");
      setResolvedEmail("");
      setChannel("whatsapp");
      setBusy(false);
      setMessage("");
      setError("");
    }
  }, [open, user]);

  const previewText = useMemo(() => {
    if (!type) return "";
    if (type === "welcome") {
      return buildWelcomeMessage({
        name: user?.displayName || "",
        email,
        phone,
        password: tempPassword,
        loginUrl,
        lang,
        channel,
      });
    }
    return buildResetMessage({
      name: user?.displayName || "",
      email: resolvedEmail || email,
      lang,
      channel,
      loginUrl,
      password: resetTempPassword,
    });
  }, [type, user, email, phone, tempPassword, resetTempPassword, resolvedEmail, loginUrl, lang, channel]);

  const reset = () => {
    setStep(1);
    setType(null);
    setTempPassword("");
    setResetTempPassword("");
    setResolvedEmail("");
    setChannel("whatsapp");
    setBusy(false);
    setMessage("");
    setError("");
    setEmailDraft(user?.email || "");
    setPhoneDraft(user?.phone || user?.whatsapp || "");
  };

  const handleClose = () => {
    if (busy) return;
    reset();
    onClose?.();
  };

  const chooseType = (kind) => {
    setType(kind);
    setChannel(hasPhone ? "whatsapp" : hasEmail ? "email" : "whatsapp");
    setStep(2);
  };

  const openWhatsapp = () => {
    if (!phone) return false;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(previewText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  };

  const openEmail = (subject) => {
    if (!email) return false;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(previewText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  };

  const handleSend = async () => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const subject =
        type === "welcome"
          ? lang === "ar"
            ? "بيانات حسابك فى yogaTupia"
            : "Your yogaTupia account"
          : lang === "ar"
            ? "إعادة تعيين كلمة المرور"
            : "Password reset";

      // Reset via WhatsApp: invoke edge function to generate temp password
      if (
        type === "reset" &&
        (channel === "whatsapp" || channel === "both") &&
        !resetTempPassword
      ) {
        const { data, error: fnErr } = await supabase.functions.invoke(
          "reset-user-password",
          { body: { userId: user?.id } },
        );
        if (fnErr || !data?.tempPassword) {
          throw new Error(
            data?.error || fnErr?.message || "Failed to generate password.",
          );
        }
        setResetTempPassword(data.tempPassword);
        if (data.email) setResolvedEmail(data.email);
        appendLog({
          type: AUDIT_TYPES.PASSWORD_RESET_REQUESTED,
          actorId,
          targetId: user?.id,
          meta: { method: "temp_password" },
        });
        // Stop here so admin can review the message before sending.
        setBusy(false);
        return;
      }

      // Reset via Email only: trigger Supabase reset email
      if (type === "reset" && channel === "email") {
        if (!email) throw new Error(t.noEmail);
        const { error: rErr } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: `${window.location.origin}/account` },
        );
        if (rErr) throw rErr;
        appendLog({
          type: AUDIT_TYPES.PASSWORD_RESET_REQUESTED,
          actorId,
          targetId: user?.id,
          meta: { email, method: "reset_email" },
        });
      }

      const results = [];
      if (channel === "whatsapp" || channel === "both") {
        if (openWhatsapp()) results.push("whatsapp");
      }
      if (channel === "email" || channel === "both") {
        if (type === "reset" && !resetTempPassword) {
          // Supabase reset email already sent
          results.push("email-auto");
        } else if (openEmail(subject)) {
          results.push("email");
        }
      }

      appendLog({
        type: AUDIT_TYPES.MESSAGE_SENT,
        actorId,
        targetId: user?.id,
        meta: {
          messageType: type,
          channels: results,
        },
      });

      const parts = [];
      if (results.includes("whatsapp")) parts.push(t.successWhatsapp);
      if (results.includes("email")) parts.push(t.successEmail);
      if (results.includes("email-auto")) parts.push(t.successReset);
      setMessage(parts.join(" "));
    } catch (err) {
      setError(err?.message || t.error);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-sage-900/40 flex items-center justify-center px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-sand-200 w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-sage-900">
              {t.title}
            </h2>
            <p className="text-sm text-sage-700 mt-1">
              {user?.displayName || user?.email || "—"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-sage-500 hover:text-sage-800"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-sage-700">{t.stepType}</p>
            <button
              onClick={() => chooseType("welcome")}
              className="w-full text-start rtl:text-right border border-sand-300 hover:border-sage-500 rounded-xl p-4 flex gap-3 items-start"
            >
              <UserPlus className="text-sage-700 shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-medium text-sage-900">{t.typeWelcome}</div>
                <div className="text-xs text-sage-600 mt-1">
                  {t.typeWelcomeHelp}
                </div>
              </div>
            </button>
            <button
              onClick={() => chooseType("reset")}
              className="w-full text-start rtl:text-right border border-sand-300 hover:border-sage-500 rounded-xl p-4 flex gap-3 items-start"
            >
              <KeyRound className="text-sage-700 shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-medium text-sage-900">{t.typeReset}</div>
                <div className="text-xs text-sage-600 mt-1">
                  {t.typeResetHelp}
                </div>
              </div>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.channelEmail}
                </label>
                <input
                  type="email"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.channelWhatsapp}
                </label>
                <input
                  type="tel"
                  value={phoneDraft}
                  onChange={(e) => setPhoneDraft(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-300 rounded-lg text-sm"
                  placeholder="+20..."
                />
              </div>
            </div>

            {type === "welcome" && (
              <div>
                <label className="block text-sm font-medium text-sage-800 mb-1">
                  {t.tempPassword}
                </label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-300 rounded-lg font-mono text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-sage-800 mb-1">
                {t.messagePreview}
              </label>
              {type === "reset" &&
                (channel === "whatsapp" || channel === "both") &&
                !resetTempPassword && (
                  <div className="mb-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    {t.generateHint}
                  </div>
                )}
              {type === "reset" && resetTempPassword && (
                <div className="mb-2 p-2 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
                  <span>
                    <strong>{t.tempPasswordLabel}:</strong>{" "}
                    <code className="font-mono">{resetTempPassword}</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(resetTempPassword);
                      setMessage(t.copied);
                      window.setTimeout(() => setMessage(""), 1500);
                    }}
                    className="px-2 py-0.5 rounded border border-emerald-300 bg-white hover:bg-emerald-100"
                  >
                    {t.copy}
                  </button>
                </div>
              )}
              <textarea
                value={previewText}
                onChange={() => {}}
                readOnly
                rows={9}
                className="w-full px-3 py-2 border border-sand-300 rounded-lg text-sm font-mono bg-sand-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">
                {t.channel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <ChannelOption
                  active={channel === "whatsapp"}
                  disabled={!hasPhone}
                  onClick={() => setChannel("whatsapp")}
                  icon={<MessageCircle size={16} />}
                  label={t.channelWhatsapp}
                  hint={!hasPhone ? t.noPhone : null}
                />
                <ChannelOption
                  active={channel === "email"}
                  disabled={!hasEmail}
                  onClick={() => setChannel("email")}
                  icon={<Mail size={16} />}
                  label={t.channelEmail}
                  hint={!hasEmail ? t.noEmail : null}
                />
                <ChannelOption
                  active={channel === "both"}
                  disabled={!hasPhone || !hasEmail}
                  onClick={() => setChannel("both")}
                  icon={<Send size={16} />}
                  label={t.channelBoth}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={busy}
                className="px-4 py-2 rounded-lg border border-sand-300 bg-white text-sage-700 text-sm hover:bg-sand-50"
              >
                {t.back}
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={busy}
                className="flex-1 py-2 rounded-lg bg-sage-700 hover:bg-sage-800 text-white text-sm font-medium disabled:opacity-60"
              >
                {busy
                  ? type === "reset" &&
                    (channel === "whatsapp" || channel === "both") &&
                    !resetTempPassword
                    ? t.generating
                    : t.sending
                  : type === "reset" &&
                      (channel === "whatsapp" || channel === "both") &&
                      !resetTempPassword
                    ? t.generateBtn
                    : t.send}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={busy}
                className="px-4 py-2 rounded-lg border border-sand-300 bg-white text-sage-700 text-sm hover:bg-sand-50"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChannelOption = ({ active, disabled, onClick, icon, label, hint }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs ${
      active
        ? "border-sage-700 bg-sage-50 text-sage-900"
        : "border-sand-300 bg-white text-sage-700 hover:bg-sand-50"
    } disabled:opacity-40 disabled:cursor-not-allowed`}
  >
    <span>{icon}</span>
    <span className="font-medium">{label}</span>
    {hint && <span className="text-[10px] text-red-600">{hint}</span>}
  </button>
);

export default SendMessageModal;
