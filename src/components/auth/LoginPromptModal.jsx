import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    title: "Sign in to continue",
    body: "To request a booking, please sign in or create a free account.",
    login: "Log in",
    signup: "Create account",
    cancel: "Keep browsing",
  },
  ar: {
    title: "سجلي الدخول للمتابعة",
    body: "لطلب الحجز يرجى تسجيل الدخول أو إنشاء حساب جديد.",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    cancel: "متابعة التصفح",
  },
};

const LoginPromptModal = ({ open, onClose, redirectTo = "/" }) => {
  const { language } = useLanguage();
  if (!open) return null;
  const t = TEXT[language] || TEXT.en;
  const next = encodeURIComponent(redirectTo);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-serif font-bold text-sage-900">
            {t.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand-100 rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sage-800 mb-6 leading-relaxed">{t.body}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/login?next=${next}`}
            className="flex-1 btn-primary text-center"
          >
            {t.login}
          </Link>
          <Link
            to={`/signup?next=${next}`}
            className="flex-1 btn-secondary text-center"
          >
            {t.signup}
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-sage-600 hover:text-sage-800"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;
