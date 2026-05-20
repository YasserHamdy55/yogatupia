import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    title: "Admin",
    dashboard: "Dashboard",
    users: "Users",
    bookings: "Bookings",
    content: "Content",
    gallery: "Gallery",
    logs: "Logs",
  },
  ar: {
    title: "الإدارة",
    dashboard: "النظرة العامة",
    users: "المستخدمون",
    bookings: "الحجوزات",
    content: "المحتوى",
    gallery: "معرض الصور",
    logs: "السجلات",
  },
};

const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg text-sm font-medium ${
    isActive ? "bg-sage-600 text-white" : "text-sage-800 hover:bg-sand-100"
  }`;

const AdminLayout = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-sand-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-2xl border border-sand-200 p-4 h-fit">
          <h2 className="text-lg font-serif font-bold text-sage-900 mb-4">
            {t.title}
          </h2>
          <nav className="space-y-1">
            <NavLink to="/admin" end className={linkClass}>
              {t.dashboard}
            </NavLink>
            <NavLink to="/admin/users" className={linkClass}>
              {t.users}
            </NavLink>
            <NavLink to="/admin/bookings" className={linkClass}>
              {t.bookings}
            </NavLink>
            <NavLink to="/admin/content" className={linkClass}>
              {t.content}
            </NavLink>
            <NavLink to="/admin/gallery" className={linkClass}>
              {t.gallery}
            </NavLink>
            <NavLink to="/admin/logs" className={linkClass}>
              {t.logs}
            </NavLink>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
