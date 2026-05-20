import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import BrandLogo from "./BrandLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const { getContentValue } = useContent();

  const quickLinksTitle = getContentValue(
    language,
    "footer.quickLinks",
    "Quick Links",
  );
  const servicesTitle = getContentValue(
    language,
    "footer.services",
    "Services",
  );
  const getInTouchTitle = getContentValue(
    language,
    "footer.getInTouch",
    "Get in Touch",
  );
  const brandText = getContentValue(language, "footer.brand", "");
  const rights = getContentValue(
    language,
    "footer.rights",
    "All rights reserved.",
  );
  const designedWithCare = getContentValue(
    language,
    "footer.designedWithCare",
    "Designed with care for your wellness journey.",
  );
  const whatsappLabel = getContentValue(
    language,
    "footer.whatsapp",
    "WhatsApp",
  );
  const navLinks = [
    { name: getContentValue(language, "nav.home", "Home"), path: "/" },
    {
      name: getContentValue(language, "nav.classes", "Classes"),
      path: "/classes",
    },
    {
      name: getContentValue(language, "nav.retreats", "Retreats"),
      path: "/retreats",
    },
    {
      name: getContentValue(language, "nav.pricing", "Pricing"),
      path: "/pricing",
    },
    { name: getContentValue(language, "nav.about", "About"), path: "/about" },
    {
      name: getContentValue(language, "nav.contact", "Contact"),
      path: "/contact",
    },
  ];

  return (
    <footer className="bg-sand-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <BrandLogo variant="stacked" className="items-start text-left" />
            <p className="text-sage-700 text-sm leading-relaxed">{brandText}</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors text-sm font-semibold"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors text-sm font-semibold"
              >
                ig
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors text-sm font-semibold"
              >
                yt
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-sage-900 mb-4">
              {quickLinksTitle}
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sage-700 hover:text-sage-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-sage-900 mb-4">
              {servicesTitle}
            </h4>
            <ul className="space-y-2">
              <li className="text-sage-700 text-sm">Mat Pilates</li>
              <li className="text-sage-700 text-sm">Reformer Pilates</li>
              <li className="text-sage-700 text-sm">Yoga Flow</li>
              <li className="text-sage-700 text-sm">Private Sessions</li>
              <li className="text-sage-700 text-sm">Wellness Retreats</li>
              <li className="text-sage-700 text-sm">Online Classes</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-sage-900 mb-4">
              {getInTouchTitle}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-sage-700">
                <MapPin
                  size={18}
                  className="text-sage-600 flex-shrink-0 mt-0.5"
                />
                <span>Zamalek Studio, Cairo, Egypt</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-sage-700">
                <Phone size={18} className="text-sage-600 flex-shrink-0" />
                <span>+20 100 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-sage-700">
                <Mail size={18} className="text-sage-600 flex-shrink-0" />
                <span>hello@hebamindbody.com</span>
              </li>
            </ul>
            <a
              href="https://wa.me/20100123456"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Phone size={16} />
              <span>{whatsappLabel}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sand-300 text-center text-sm text-sage-700">
          <p>
            &copy; {currentYear} yogaTupia. {rights}
          </p>
          <p className="mt-2">{designedWithCare}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
