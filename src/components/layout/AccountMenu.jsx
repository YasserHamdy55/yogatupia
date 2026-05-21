import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogIn, User as UserIcon, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { useEffectiveRole } from "../../auth/useEffectiveRole";
import { isStaffOrAdmin, isAdmin, ROLES } from "../../auth/roles";
import { useLanguage } from "../../context/LanguageContext";

const TEXT = {
  en: {
    login: "Log in",
    signup: "Sign up",
    account: "My account",
    bookings: "My bookings",
    staff: "Bookings desk",
    admin: "Admin",
    logout: "Log out",
  },
  ar: {
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    account: "حسابي",
    bookings: "حجوزاتي",
    staff: "لوحة الحجوزات",
    admin: "الإدارة",
    logout: "تسجيل الخروج",
  },
};

const AccountMenu = ({ onCloseMobileMenu }) => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { isAuthenticated, currentUser, logout } = useAuth();
  const role = useEffectiveRole();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          onClick={() => onCloseMobileMenu?.()}
          className="text-sm font-medium text-sage-700 hover:text-sage-900 px-3 py-2 rounded-lg flex items-center gap-1 whitespace-nowrap"
        >
          <LogIn size={16} /> {t.login}
        </Link>
        <Link
          to="/signup"
          onClick={() => onCloseMobileMenu?.()}
          className="btn-primary !py-2 !px-5 text-sm whitespace-nowrap"
        >
          {t.signup}
        </Link>
      </div>
    );
  }

  const label = currentUser?.displayName || currentUser?.whatsapp || t.account;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-sage-200 hover:bg-sage-50 text-sm font-medium text-sage-800"
      >
        <UserIcon size={16} />
        <span className="max-w-[120px] truncate">{label}</span>
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white border border-sand-200 rounded-xl shadow-lg py-2 z-50">
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-sage-800 hover:bg-sand-50"
          >
            {t.account}
          </Link>
          <Link
            to="/account/bookings"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-sage-800 hover:bg-sand-50"
          >
            {t.bookings}
          </Link>

          {isStaffOrAdmin(role) && (
            <Link
              to="/staff/bookings"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-sage-800 hover:bg-sand-50"
            >
              {t.staff}
            </Link>
          )}

          {isAdmin(role) && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-sage-800 hover:bg-sand-50"
            >
              {t.admin}
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left rtl:text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut size={14} />
            {t.logout}
          </button>

          <p className="px-4 pt-2 mt-1 border-t border-sand-200 text-[11px] text-sage-500">
            {role === ROLES.ADMIN
              ? "admin"
              : role === ROLES.STAFF
                ? "staff"
                : "client"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
