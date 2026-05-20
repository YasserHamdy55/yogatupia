import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import CollectionEditModal from "../components/admin/CollectionEditModal";
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

const Pricing = () => {
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const { isAdmin: adminMode, editMode } = useAdminEdit();
  const {
    items: rawPlans,
    schema,
    addItem,
    updateItem,
    deleteItem,
  } = useCollection("pricing");
  const [editingItem, setEditingItem] = useState(null);
  const [editorMode, setEditorMode] = useState("edit");

  const plans = useMemo(
    () => rawPlans.map((p) => projectItemLocalized(p, language)),
    [rawPlans, language],
  );
  const pricingContent = {
    headerTitle: getContentValue(
      language,
      "pricing.header.title",
      "Pricing & Packages",
    ),
    headerSubtitle: getContentValue(
      language,
      "pricing.header.subtitle",
      "Flexible options to fit your wellness journey and budget.",
    ),
    popular: getContentValue(
      language,
      "pricing.labels.popular",
      "Most Popular",
    ),
    currency: getContentValue(language, "pricing.labels.currency", "EGP"),
    getStarted: getContentValue(
      language,
      "pricing.labels.getStarted",
      "Get Started",
    ),
    plans: getContentValue(language, "pricing.plans", []),
    faqTitle: getContentValue(language, "pricing.faq.title", "Pricing FAQs"),
    faqIntro: getContentValue(language, "pricing.faq.intro", ""),
    faqItems: getContentValue(language, "pricing.faq.items", []),
    ctaTitle: getContentValue(
      language,
      "pricing.cta.title",
      "Not Sure Which Package is Right for You?",
    ),
    ctaBody: getContentValue(
      language,
      "pricing.cta.body",
      "Try a drop-in class first, or contact us for personalized recommendations.",
    ),
    ctaPrimary: getContentValue(
      language,
      "pricing.cta.primaryButton",
      "Book a Drop-In Class",
    ),
    ctaSecondary: getContentValue(
      language,
      "pricing.cta.secondaryButton",
      "Contact Us",
    ),
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-sage-600 to-sage-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              {pricingContent.headerTitle}
            </h1>
            <AdminEditToggle />
          </div>
          <p className="text-xl opacity-90 leading-relaxed">
            {pricingContent.headerSubtitle}
          </p>
        </div>
      </section>

      <AdminEditBar
        onAdd={() => {
          const created = addItem();
          setEditingItem(created);
          setEditorMode("add");
        }}
      />

      {/* Pricing Cards */}
      <section className="py-16 px-4 bg-sand-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const features = Array.isArray(plan.features)
                ? plan.features
                : [];
              return (
                <div
                  key={plan.id}
                  className={`card relative ${
                    plan.popular ? "ring-4 ring-sage-600 scale-105" : ""
                  }`}
                >
                  <AdminCardControls
                    onEdit={() => {
                      const target = rawPlans.find((p) => p.id === plan.id);
                      if (target) {
                        setEditingItem(target);
                        setEditorMode("edit");
                      }
                    }}
                    onDelete={() => {
                      const msg =
                        schema.confirmDelete?.[language] ??
                        schema.confirmDelete?.en;
                      if (window.confirm(msg)) deleteItem(plan.id);
                    }}
                  />
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-sage-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                        <Sparkles size={16} />
                        <span>{pricingContent.popular}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-sage-700">
                        {Number(plan.price ?? 0).toLocaleString()}
                      </span>
                      <span className="text-sage-700 ml-2">
                        {pricingContent.currency}
                      </span>
                      <p className="text-sm text-sage-600 mt-1">
                        {plan.period}
                      </p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start text-sm text-sage-800"
                        >
                          <Check
                            size={18}
                            className="text-sage-600 mr-2 flex-shrink-0 mt-0.5"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/classes"
                      className={`block text-center py-3 rounded-full font-semibold transition-all ${
                        plan.popular
                          ? "bg-sage-600 text-white hover:bg-sage-700 shadow-md hover:shadow-lg"
                          : "bg-sand-100 text-sage-700 hover:bg-sand-200"
                      }`}
                    >
                      {pricingContent.getStarted}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">{pricingContent.faqTitle}</h2>
            <p className="section-subtitle">{pricingContent.faqIntro}</p>
          </div>
          <div className="space-y-6">
            {pricingContent.faqItems.map((item, index) => (
              <div key={index} className="bg-sand-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-sage-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-sage-800">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-sage-600 to-sage-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {pricingContent.ctaTitle}
          </h2>
          <p className="text-xl mb-8 opacity-90">{pricingContent.ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/classes"
              className="px-10 py-4 bg-white text-sage-700 rounded-full text-lg font-semibold hover:bg-sand-50 transition-all shadow-lg"
            >
              {pricingContent.ctaPrimary}
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
            >
              {pricingContent.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {editingItem && (
        <CollectionEditModal
          item={editingItem}
          schema={schema}
          mode={editorMode}
          onSave={(payload) => {
            const { id, ...rest } = payload;
            updateItem(id, rest);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default Pricing;
