import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { readLog, clearLog, AUDIT_TYPES } from "../../lib/auditLog";
import { useAuth } from "../../auth/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import ReAuthModal from "../../components/admin/ReAuthModal";
import { appendLog } from "../../lib/auditLog";

const TEXT = {
  en: {
    title: "Logs & reports",
    subtitle:
      "Recent administrative actions captured locally. Limited to last 500 entries.",
    when: "When",
    who: "Actor",
    what: "Action",
    details: "Details",
    empty: "No log entries yet.",
    clear: "Clear logs",
    confirmClear: "Re-enter your password to clear all logs.",
  },
  ar: {
    title: "السجلات والتقارير",
    subtitle: "الإجراءات الإدارية المسجلة محلياً. آخر 500 إدخال فقط.",
    when: "الوقت",
    who: "المنفّذ",
    what: "الإجراء",
    details: "تفاصيل",
    empty: "لا توجد سجلات بعد.",
    clear: "مسح السجلات",
    confirmClear: "أعد إدخال كلمة المرور لمسح جميع السجلات.",
  },
};

const ACTION_LABELS = {
  [AUDIT_TYPES.LOGIN]: "Login",
  [AUDIT_TYPES.LOGIN_FAIL]: "Login failed",
  [AUDIT_TYPES.LOGOUT]: "Logout",
  [AUDIT_TYPES.ROLE_CHANGE]: "Role change",
  [AUDIT_TYPES.USER_TOGGLE]: "User toggled",
  [AUDIT_TYPES.USER_DELETE]: "User deleted",
  [AUDIT_TYPES.ADMIN_CREATED]: "Admin created",
  [AUDIT_TYPES.IMPERSONATION_START]: "Impersonation start",
  [AUDIT_TYPES.IMPERSONATION_STOP]: "Impersonation stop",
  [AUDIT_TYPES.LOGS_CLEARED]: "Logs cleared",
  [AUDIT_TYPES.MESSAGE_SENT]: "Message sent",
  [AUDIT_TYPES.PASSWORD_RESET_REQUESTED]: "Password reset requested",
};

const AdminLogs = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { users, currentUser } = useAuth();
  const [version, setVersion] = useState(0);
  const [reauthOpen, setReauthOpen] = useState(false);

  const entries = readLog().slice().reverse();

  const labelFor = (id) => {
    if (!id) return "—";
    const u = users.find((x) => x.id === id);
    return u?.displayName || u?.username || u?.whatsapp || id;
  };

  const handleClear = () => {
    clearLog();
    appendLog({
      type: AUDIT_TYPES.LOGS_CLEARED,
      actorId: currentUser?.id,
    });
    setVersion((v) => v + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-900">
            {t.title}
          </h1>
          <p className="text-sage-700">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setReauthOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
        >
          <Trash2 size={16} /> {t.clear}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sand-50">
            <tr className="text-left rtl:text-right text-sage-700">
              <th className="px-4 py-3">{t.when}</th>
              <th className="px-4 py-3">{t.who}</th>
              <th className="px-4 py-3">{t.what}</th>
              <th className="px-4 py-3">{t.details}</th>
            </tr>
          </thead>
          <tbody key={version}>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sage-600">
                  {t.empty}
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id} className="border-t border-sand-100">
                  <td className="px-4 py-3 text-sage-800 whitespace-nowrap">
                    {new Date(e.at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sage-900">
                    {labelFor(e.actorId)}
                  </td>
                  <td className="px-4 py-3 text-sage-900">
                    {ACTION_LABELS[e.type] || e.type}
                  </td>
                  <td className="px-4 py-3 text-sage-700 break-all">
                    {e.meta ? JSON.stringify(e.meta) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReAuthModal
        open={reauthOpen}
        onClose={() => setReauthOpen(false)}
        onConfirm={handleClear}
        message={t.confirmClear}
      />
    </div>
  );
};

export default AdminLogs;
