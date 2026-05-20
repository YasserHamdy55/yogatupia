import React from "react";
import { X } from "lucide-react";
import { useImpersonation } from "../../auth/ImpersonationContext";
import { useLanguage } from "../../context/LanguageContext";
import { ROLES } from "../../auth/roles";

const TEXT = {
  en: {
    label: "You are browsing as",
    exit: "Exit",
    roles: { client: "Client", staff: "Staff", admin: "Admin" },
  },
  ar: {
    label: "أنت تتصفح الآن بصلاحية",
    exit: "خروج",
    roles: { client: "عميل", staff: "موظف", admin: "أدمن" },
  },
};

const ImpersonationBanner = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { isImpersonating, impersonatedRole, resetImpersonation } =
    useImpersonation();

  if (!isImpersonating) return null;

  const roleLabel =
    t.roles[impersonatedRole] || t.roles[ROLES.CLIENT] || impersonatedRole;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[60] w-full bg-amber-500 text-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-sm font-medium">
        <span className="flex-1 truncate">
          {t.label}: <span className="font-bold">{roleLabel}</span>
        </span>
        <button
          onClick={resetImpersonation}
          className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
        >
          <X size={14} />
          {t.exit}
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
