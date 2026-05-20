import React from "react";
import { ROLES } from "../../auth/roles";
import { useImpersonation } from "../../auth/ImpersonationContext";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    title: "View as",
    hint: "Switch the visible role to test the user experience.",
    client: "Client",
    staff: "Staff",
    admin: "Admin (default)",
  },
  ar: {
    title: "تصفح بصلاحية",
    hint: "بدّل الدور الظاهر لاختبار تجربة المستخدم.",
    client: "عميل",
    staff: "موظف",
    admin: "أدمن (الافتراضي)",
  },
};

const ViewAsSwitcher = ({ compact = false }) => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { effectiveRole, setEffectiveRole } = useImpersonation();

  const options = [
    { key: ROLES.ADMIN, label: t.admin },
    { key: ROLES.STAFF, label: t.staff },
    { key: ROLES.CLIENT, label: t.client },
  ];

  return (
    <div
      className={
        compact
          ? "space-y-2"
          : "bg-white rounded-2xl border border-sand-200 p-5 space-y-3"
      }
    >
      {!compact && (
        <>
          <h3 className="text-lg font-serif font-bold text-sage-900">
            {t.title}
          </h3>
          <p className="text-sm text-sage-700">{t.hint}</p>
        </>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = effectiveRole === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setEffectiveRole(opt.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                active
                  ? "bg-sage-700 text-white border-sage-700"
                  : "bg-white text-sage-700 border-sage-200 hover:bg-sage-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewAsSwitcher;
