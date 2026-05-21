import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations/translations";
import { useContent } from "../context/ContentContext";
import BrandLogo from "./BrandLogo";
import AccountMenu from "./layout/AccountMenu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { getContentValue } = useContent();
  const t = useTranslation(language);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: getContentValue(language, "nav.home", t("nav.home")), path: "/" },
    {
      name: getContentValue(language, "nav.classes", t("nav.classes")),
      path: "/classes",
    },
    {
      name: getContentValue(language, "nav.retreats", t("nav.retreats")),
      path: "/retreats",
    },
    {
      name: getContentValue(language, "nav.pricing", t("nav.pricing")),
      path: "/pricing",
    },
    {
      name: getContentValue(language, "nav.about", t("nav.about")),
      path: "/about",
    },
    {
      name: getContentValue(language, "nav.contact", t("nav.contact")),
      path: "/contact",
    },
  ];

  const bookNowLabel = getContentValue(
    language,
    "nav.bookNow",
    t("classes.bookNow"),
  );

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled
          ? "bg-white/90 shadow-md border-b border-sand-200"
          : "bg-sand-50/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-6 h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            aria-label="yogaTupia home"
          >
            <BrandLogo className="max-w-full" />
          </Link>

          {/* Desktop Navigation links (center) */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-sage-700 border-b-2 border-sage-700"
                    : "text-sage-800 hover:text-sage-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop actions (right) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-sage-700 hover:text-sage-900 hover:bg-sage-50 rounded-lg transition-colors"
              title={
                language === "en" ? "التبديل إلى العربية" : "Switch to English"
              }
              aria-label="Toggle language"
            >
              <Languages size={18} />
              <span>{language === "en" ? "ع" : "EN"}</span>
            </button>

            <Link
              to="/classes"
              className="btn-primary !py-2 !px-5 text-sm whitespace-nowrap"
            >
              {bookNowLabel}
            </Link>

            <AccountMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 text-sage-800 hover:text-sage-700"
              title={
                language === "en" ? "التبديل إلى العربية" : "Switch to English"
              }
            >
              <Languages size={20} />
            </button>
            <button
              className="p-2 text-sage-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-sand-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <div className="px-4 py-3 border-b border-sand-200 mb-2">
              <BrandLogo
                variant="icon"
                showText={false}
                className="justify-center"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-sage-100 text-sage-700 font-medium"
                    : "text-sage-800 hover:bg-sand-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/classes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block btn-primary text-center mt-4"
            >
              {bookNowLabel}
            </Link>
            <div className="mt-3 flex justify-center">
              <AccountMenu onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
