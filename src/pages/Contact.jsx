import React, { useMemo, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import CollectionEditModal from "../components/admin/CollectionEditModal";
import InlineEditable from "../components/admin/InlineEditable";
import {
  useAdminEdit,
  AdminEditToggle,
  AdminCardControls,
} from "../components/admin/AdminInline";
import {
  useCollection,
  projectItemLocalized,
} from "../data/collectionsAdminStore";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const { isAdmin: adminMode, editMode } = useAdminEdit();
  const {
    items: rawFaqs,
    schema: faqSchema,
    addItem: addFaq,
    updateItem: updateFaq,
    deleteItem: deleteFaq,
  } = useCollection("faqs");
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqEditorMode, setFaqEditorMode] = useState("edit");
  const managedFaqs = useMemo(
    () => rawFaqs.map((f) => projectItemLocalized(f, language)),
    [rawFaqs, language],
  );

  const contactContent = {
    headerTitle: getContentValue(
      language,
      "contact.header.title",
      "Get in Touch",
    ),
    headerSubtitle: getContentValue(
      language,
      "contact.header.subtitle",
      "We'd love to hear from you. Reach out with any questions or to book a session.",
    ),
    infoTitle: getContentValue(
      language,
      "contact.info.title",
      "Contact Information",
    ),
    studioLocation: getContentValue(
      language,
      "contact.info.studioLocation",
      "Studio Location",
    ),
    phoneLabel: getContentValue(language, "contact.info.phone", "Phone"),
    emailLabel: getContentValue(language, "contact.info.email", "Email"),
    hoursLabel: getContentValue(language, "contact.info.hours", "Studio Hours"),
    whatsapp: getContentValue(language, "contact.info.whatsapp", "WhatsApp"),
    followUs: getContentValue(language, "contact.info.followUs", "Follow Us"),
    formTitle: getContentValue(
      language,
      "contact.form.title",
      "Send Us a Message",
    ),
    formName: getContentValue(language, "contact.form.name", "Name *"),
    formEmail: getContentValue(language, "contact.form.email", "Email *"),
    formPhone: getContentValue(language, "contact.form.phone", "Phone"),
    formSubject: getContentValue(language, "contact.form.subject", "Subject *"),
    formMessage: getContentValue(language, "contact.form.message", "Message *"),
    submit: getContentValue(language, "contact.form.submit", "Send Message"),
    namePlaceholder: getContentValue(
      language,
      "contact.form.namePlaceholder",
      "Your full name",
    ),
    emailPlaceholder: getContentValue(
      language,
      "contact.form.emailPlaceholder",
      "your.email@example.com",
    ),
    phonePlaceholder: getContentValue(
      language,
      "contact.form.phonePlaceholder",
      "+20 100 123 4567",
    ),
    subjectPlaceholder: getContentValue(
      language,
      "contact.form.subjectPlaceholder",
      "What can we help you with?",
    ),
    messagePlaceholder: getContentValue(
      language,
      "contact.form.messagePlaceholder",
      "Tell us more...",
    ),
    successTitle: getContentValue(
      language,
      "contact.form.successTitle",
      "Message Sent!",
    ),
    successBody: getContentValue(
      language,
      "contact.form.successBody",
      "Thank you for reaching out. We'll get back to you within 24 hours.",
    ),
    faqTitle: getContentValue(
      language,
      "contact.faq.title",
      "Frequently Asked Questions",
    ),
    faqSubtitle: getContentValue(
      language,
      "contact.faq.subtitle",
      "Quick answers to common questions. Don't see yours? Contact us!",
    ),
    mapTitle: getContentValue(
      language,
      "contact.map.title",
      "Map integration placeholder",
    ),
    mapSubtitle: getContentValue(
      language,
      "contact.map.subtitle",
      "26 Shagaret El Dor St, Zamalek, Cairo",
    ),
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-sage-600 to-sage-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <AdminEditToggle />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            <InlineEditable
              path="contact.header.title"
              multiline
              label="Header Title"
              fallback={contactContent.headerTitle}
            />
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            <InlineEditable
              path="contact.header.subtitle"
              multiline
              label="Header Subtitle"
              fallback={contactContent.headerSubtitle}
            />
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-sage-900 mb-8">
                <InlineEditable
                  path="contact.info.title"
                  label="Info Title"
                  fallback={contactContent.infoTitle}
                />
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-900 mb-1">
                      <InlineEditable
                        path="contact.info.studioLocation"
                        label="Studio Location Label"
                        fallback={contactContent.studioLocation}
                      />
                    </h3>
                    <p className="text-sage-800">
                      26 Shagaret El Dor Street
                      <br />
                      Zamalek, Cairo
                      <br />
                      Egypt
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-900 mb-1">
                      <InlineEditable
                        path="contact.info.phone"
                        label="Phone Label"
                        fallback={contactContent.phoneLabel}
                      />
                    </h3>
                    <p className="text-sage-800">+20 100 123 4567</p>
                    <a
                      href="https://wa.me/20100123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 mt-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Phone size={16} />
                      <span>
                        <InlineEditable
                          path="contact.info.whatsapp"
                          label="WhatsApp Label"
                          fallback={contactContent.whatsapp}
                        />
                      </span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-900 mb-1">
                      <InlineEditable
                        path="contact.info.email"
                        label="Email Label"
                        fallback={contactContent.emailLabel}
                      />
                    </h3>
                    <p className="text-sage-800">hello@hebamindbody.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-900 mb-1">
                      <InlineEditable
                        path="contact.info.hours"
                        label="Hours Label"
                        fallback={contactContent.hoursLabel}
                      />
                    </h3>
                    <div className="text-sage-800 space-y-1">
                      <p>Saturday - Thursday: 7:00 AM - 8:00 PM</p>
                      <p>Friday: 8:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-sage-900 mb-4">
                  <InlineEditable
                    path="contact.info.followUs"
                    label="Follow Us Label"
                    fallback={contactContent.followUs}
                  />
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center hover:bg-sage-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-serif font-bold text-sage-900 mb-6">
                <InlineEditable
                  path="contact.form.title"
                  label="Form Title"
                  fallback={contactContent.formTitle}
                />
              </h2>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      <InlineEditable
                        path="contact.form.name"
                        label="Name Field Label"
                        fallback={contactContent.formName}
                      />
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={contactContent.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      <InlineEditable
                        path="contact.form.email"
                        label="Email Field Label"
                        fallback={contactContent.formEmail}
                      />
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={contactContent.emailPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      <InlineEditable
                        path="contact.form.phone"
                        label="Phone Field Label"
                        fallback={contactContent.formPhone}
                      />
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={contactContent.phonePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      <InlineEditable
                        path="contact.form.subject"
                        label="Subject Field Label"
                        fallback={contactContent.formSubject}
                      />
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={contactContent.subjectPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      <InlineEditable
                        path="contact.form.message"
                        label="Message Field Label"
                        fallback={contactContent.formMessage}
                      />
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={contactContent.messagePlaceholder}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Send size={20} />
                    <span>
                      <InlineEditable
                        path="contact.form.submit"
                        label="Submit Button"
                        fallback={contactContent.submit}
                      />
                    </span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle
                    size={64}
                    className="text-green-600 mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">
                    <InlineEditable
                      path="contact.form.successTitle"
                      label="Success Title"
                      fallback={contactContent.successTitle}
                    />
                  </h3>
                  <p className="text-sage-800">
                    <InlineEditable
                      path="contact.form.successBody"
                      multiline
                      label="Success Body"
                      fallback={contactContent.successBody}
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h2 className="section-title">
                <InlineEditable
                  path="contact.faq.title"
                  label="FAQ Title"
                  fallback={contactContent.faqTitle}
                />
              </h2>
              <AdminEditToggle />
            </div>
            <p className="section-subtitle">
              <InlineEditable
                path="contact.faq.subtitle"
                multiline
                label="FAQ Subtitle"
                fallback={contactContent.faqSubtitle}
              />
            </p>
          </div>
          {adminMode && editMode && (
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => {
                  const created = addFaq();
                  setEditingFaq(created);
                  setFaqEditorMode("add");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-600 text-white font-semibold hover:bg-sage-700 shadow-md"
              >
                {language === "ar" ? "إضافة سؤال" : "Add FAQ"}
              </button>
            </div>
          )}
          <div className="space-y-4">
            {managedFaqs.map((faq, index) => (
              <div
                key={faq.id ?? index}
                className="bg-sand-50 rounded-xl overflow-hidden relative"
              >
                <AdminCardControls
                  onEdit={() => {
                    const target = rawFaqs.find((f) => f.id === faq.id);
                    if (target) {
                      setEditingFaq(target);
                      setFaqEditorMode("edit");
                    }
                  }}
                  onDelete={() => {
                    const msg =
                      faqSchema.confirmDelete?.[language] ??
                      faqSchema.confirmDelete?.en;
                    if (window.confirm(msg)) deleteFaq(faq.id);
                  }}
                />
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-sand-100 transition-colors"
                >
                  <span className="font-semibold text-sage-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-sage-600 text-2xl flex-shrink-0">
                    {expandedFaq === index ? "−" : "+"}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-sage-800 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {editingFaq && (
        <CollectionEditModal
          item={editingFaq}
          schema={faqSchema}
          mode={faqEditorMode}
          onSave={(payload) => {
            const { id, ...rest } = payload;
            updateFaq(id, rest);
            setEditingFaq(null);
          }}
          onClose={() => setEditingFaq(null)}
        />
      )}

      {/* Map Placeholder */}
      <section className="h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-sand-100">
          <div className="text-center">
            <MapPin size={48} className="text-sage-600 mx-auto mb-4" />
            <p className="text-sage-800 font-medium">
              <InlineEditable
                path="contact.map.title"
                label="Map Title"
                fallback={contactContent.mapTitle}
              />
            </p>
            <p className="text-sm text-sage-700">
              <InlineEditable
                path="contact.map.subtitle"
                label="Map Subtitle"
                fallback={contactContent.mapSubtitle}
              />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
