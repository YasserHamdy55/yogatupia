import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Heart,
  Activity,
  Zap,
  User,
  Palmtree,
  Monitor,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations/translations";
import { useContent } from "../context/ContentContext";
import CollectionEditModal from "../components/admin/CollectionEditModal";
import InlineEditable from "../components/admin/InlineEditable";
import {
  useAdminEdit,
  AdminEditToggle,
  AdminEditBar,
  AdminCardControls,
} from "../components/admin/AdminInline";
import {
  useCollection,
  projectItemLocalized,
} from "../data/collectionsAdminStore";

const Home = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const t = useTranslation(language);
  const { isAdmin: adminMode, editMode } = useAdminEdit();

  const servicesCol = useCollection("services");
  const testimonialsCol = useCollection("testimonials");
  const services = useMemo(
    () => servicesCol.items.map((s) => projectItemLocalized(s, language)),
    [servicesCol.items, language],
  );
  const testimonials = useMemo(
    () => testimonialsCol.items.map((s) => projectItemLocalized(s, language)),
    [testimonialsCol.items, language],
  );

  const [editingService, setEditingService] = useState(null);
  const [serviceMode, setServiceMode] = useState("edit");
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialMode, setTestimonialMode] = useState("edit");

  const heroTitle = getContentValue(
    language,
    "home.hero.title",
    t("home.hero.title"),
  );
  const heroSubtitle = getContentValue(
    language,
    "home.hero.subtitle",
    t("home.hero.subtitle"),
  );
  const heroPrimaryCta = getContentValue(
    language,
    "home.hero.primaryCta",
    t("home.hero.cta"),
  );
  const heroSecondaryCta = getContentValue(
    language,
    "home.hero.secondaryCta",
    t("nav.retreats"),
  );
  const introTitle = getContentValue(
    language,
    "home.intro.title",
    "Welcome to Your Sanctuary",
  );
  const introBody = getContentValue(language, "home.intro.body", "");
  const homeCtaTitle = getContentValue(
    language,
    "home.cta.title",
    "Ready to Begin Your Journey?",
  );
  const homeCtaBody = getContentValue(language, "home.cta.body", "");
  const homeCtaButton = getContentValue(
    language,
    "home.cta.button",
    "View Schedule",
  );

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  const iconComponents = {
    Activity,
    Zap,
    Heart,
    User,
    Palmtree,
    Monitor,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-to-br from-sand-100 via-sand-50 to-sage-100 overflow-hidden py-20 sm:py-24">
        {/* Background photo */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80')] bg-cover bg-center opacity-25"></div>
        {/* Plum tint overlay to unify with brand palette */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-700/40 via-sage-500/20 to-sand-200/30 mix-blend-multiply"></div>
        {/* Soft fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <AdminEditToggle />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl landscape:max-[900px]:text-3xl font-serif font-bold text-sage-900 mb-5 sm:mb-8 leading-tight md:leading-[1.15] drop-shadow-sm">
            <InlineEditable
              path="home.hero.title"
              multiline
              label="Hero Title"
              fallback={heroTitle}
            />
          </h1>
          <p className="text-base sm:text-xl md:text-2xl landscape:max-[900px]:text-base text-sage-800 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            <InlineEditable
              path="home.hero.subtitle"
              multiline
              label="Hero Subtitle"
              fallback={heroSubtitle}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/classes" className="btn-primary text-base sm:text-lg">
              <InlineEditable
                path="home.hero.primaryCta"
                label="Primary CTA"
                fallback={heroPrimaryCta}
              />
            </Link>
            <Link to="/retreats" className="btn-secondary text-base sm:text-lg">
              <InlineEditable
                path="home.hero.secondaryCta"
                label="Secondary CTA"
                fallback={heroSecondaryCta}
              />
            </Link>
          </div>
        </div>
        <div className="hidden sm:block landscape:max-[900px]:hidden absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight size={32} className="text-sage-600 transform rotate-90" />
        </div>
      </section>

      {/* Brand Intro */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">
            <InlineEditable
              path="home.intro.title"
              label="Intro Title"
              fallback={introTitle}
            />
          </h2>
          <p className="section-subtitle leading-relaxed">
            <InlineEditable
              path="home.intro.body"
              multiline
              label="Intro Body"
              fallback={introBody}
            />
          </p>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h2 className="section-title">{t("home.services.title")}</h2>
              <AdminEditToggle />
            </div>
            <p className="section-subtitle">{t("home.services.subtitle")}</p>
          </div>
          {adminMode && editMode && (
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => {
                  const created = servicesCol.addItem();
                  setEditingService(created);
                  setServiceMode("add");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-600 text-white font-semibold hover:bg-sage-700 shadow-md"
              >
                {language === "ar" ? "إضافة خدمة" : "Add Service"}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = iconComponents[service.icon] ?? Heart;
              return (
                <div
                  key={service.id}
                  className="card p-8 text-center group hover:scale-105 relative"
                >
                  <AdminCardControls
                    onEdit={() => {
                      const target = servicesCol.items.find(
                        (s) => s.id === service.id,
                      );
                      if (target) {
                        setEditingService(target);
                        setServiceMode("edit");
                      }
                    }}
                    onDelete={() => {
                      const msg =
                        servicesCol.schema.confirmDelete?.[language] ??
                        servicesCol.schema.confirmDelete?.en;
                      if (window.confirm(msg))
                        servicesCol.deleteItem(service.id);
                    }}
                  />
                  <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mx-auto mb-6 group-hover:bg-sage-600 group-hover:text-white transition-colors">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold mb-3 text-sage-900">
                    {service.title}
                  </h3>
                  <p className="text-sage-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">{t("home.testimonials.title")}</h2>
            <p className="section-subtitle">
              {t("home.testimonials.subtitle")}
            </p>
          </div>
          {adminMode && editMode && (
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => {
                  const created = testimonialsCol.addItem();
                  setEditingTestimonial(created);
                  setTestimonialMode("add");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-600 text-white font-semibold hover:bg-sage-700 shadow-md"
              >
                {language === "ar" ? "إضافة شهادة" : "Add Testimonial"}
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => {
              return (
                <div
                  key={testimonial.id}
                  className="card p-6 flex flex-col relative"
                >
                  <AdminCardControls
                    onEdit={() => {
                      const target = testimonialsCol.items.find(
                        (s) => s.id === testimonial.id,
                      );
                      if (target) {
                        setEditingTestimonial(target);
                        setTestimonialMode("edit");
                      }
                    }}
                    onDelete={() => {
                      const msg =
                        testimonialsCol.schema.confirmDelete?.[language] ??
                        testimonialsCol.schema.confirmDelete?.en;
                      if (window.confirm(msg))
                        testimonialsCol.deleteItem(testimonial.id);
                    }}
                  />
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating ?? 5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-sage-800 mb-4 flex-grow italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-sage-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-sage-600">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sage-600 to-sage-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <InlineEditable
              path="home.cta.title"
              multiline
              label="CTA Title"
              fallback={homeCtaTitle}
            />
          </h2>
          <p className="text-xl mb-8 opacity-90">
            <InlineEditable
              path="home.cta.body"
              multiline
              label="CTA Body"
              fallback={homeCtaBody}
            />
          </p>
          <Link
            to="/classes"
            className="inline-flex items-center space-x-2 px-10 py-4 bg-white text-sage-700 rounded-full text-lg font-semibold hover:bg-sand-50 transition-all shadow-lg hover:shadow-xl"
          >
            <span>
              <InlineEditable
                path="home.cta.button"
                label="CTA Button"
                fallback={homeCtaButton}
              />
            </span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-2xl mx-auto text-center">
          <Heart size={48} className="text-sage-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-sage-900 mb-4">
            {t("home.newsletter.title")}
          </h2>
          <p className="text-sage-700 mb-8 leading-relaxed">
            {t("home.newsletter.subtitle")}
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("home.newsletter.placeholder")}
              required
              className="flex-1 px-6 py-3 rounded-full border-2 border-sand-300 focus:border-sage-600 focus:outline-none"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              {t("home.newsletter.button")}
            </button>
          </form>
          {subscribed && (
            <p className="mt-4 text-sage-600 font-medium">
              {t("home.newsletter.success")}
            </p>
          )}
        </div>
      </section>

      {editingService && (
        <CollectionEditModal
          item={editingService}
          schema={servicesCol.schema}
          mode={serviceMode}
          onSave={(payload) => {
            const { id, ...rest } = payload;
            servicesCol.updateItem(id, rest);
            setEditingService(null);
          }}
          onClose={() => setEditingService(null)}
        />
      )}

      {editingTestimonial && (
        <CollectionEditModal
          item={editingTestimonial}
          schema={testimonialsCol.schema}
          mode={testimonialMode}
          onSave={(payload) => {
            const { id, ...rest } = payload;
            testimonialsCol.updateItem(id, rest);
            setEditingTestimonial(null);
          }}
          onClose={() => setEditingTestimonial(null)}
        />
      )}
    </div>
  );
};

export default Home;
