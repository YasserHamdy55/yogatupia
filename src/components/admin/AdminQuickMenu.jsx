import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  CalendarRange,
  ScrollText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { ROLES } from "../../auth/roles";
import { useLanguage } from "../../context/LanguageContext";
import ViewAsSwitcher from "./ViewAsSwitcher";

const TEXT = {
  en: {
    open: "Open admin menu",
    close: "Close menu",
    title: "Admin shortcuts",
    dashboard: "Dashboard",
    users: "Users",
    content: "Content (CMS)",
    bookings: "Bookings desk",
    logs: "Logs & reports",
    viewAs: "View as",
    logout: "Log out",
  },
  ar: {
    open: "فتح قائمة الإدارة",
    close: "إغلاق",
    title: "اختصارات الإدارة",
    dashboard: "النظرة العامة",
    users: "المستخدمون",
    content: "المحتوى (CMS)",
    bookings: "لوحة الحجوزات",
    logs: "السجلات والتقارير",
    viewAs: "تصفح بصلاحية",
    logout: "تسجيل الخروج",
  },
};

const itemClass =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sage-800 hover:bg-sand-100";

const AdminQuickMenu = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Real admin only — impersonation does NOT hide it.
  if (currentUser?.role !== ROLES.ADMIN) return null;

  const isRtl = language === "ar";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t.open}
        className={`fixed bottom-6 z-[55] bg-sage-700 hover:bg-sage-800 text-white rounded-full shadow-lg p-3 ${
          isRtl ? "left-6" : "right-6"
        }`}
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className={`fixed top-0 z-[71] h-full w-80 max-w-full bg-white shadow-2xl flex flex-col ${
              isRtl ? "left-0" : "right-0"
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-sand-200">
              <h2 className="text-lg font-serif font-bold text-sage-900">
                {t.title}
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="text-sage-600 hover:text-sage-800"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              <Link to="/admin" className={itemClass}>
                <LayoutDashboard size={18} /> {t.dashboard}
              </Link>
              <Link to="/admin/users" className={itemClass}>
                <Users size={18} /> {t.users}
              </Link>
              <Link to="/admin/content" className={itemClass}>
                <FileText size={18} /> {t.content}
              </Link>
              <Link to="/admin/bookings" className={itemClass}>
                <CalendarRange size={18} /> {t.bookings}
              </Link>
              <Link to="/admin/logs" className={itemClass}>
                <ScrollText size={18} /> {t.logs}
              </Link>

              <div className="pt-3 mt-3 border-t border-sand-200">
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-sage-600">
                  {t.viewAs}
                </p>
                <div className="px-3">
                  <ViewAsSwitcher compact />
                </div>
              </div>
            </nav>

            <div className="border-t border-sand-200 p-3">
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} /> {t.logout}
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default AdminQuickMenu;
