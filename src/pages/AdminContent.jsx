import React, { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { defaultSiteContent } from "../content/defaultSiteContent";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";

const getPathValue = (source, path) =>
  path.split(".").reduce((current, key) => current?.[key], source);

const getRows = (path) =>
  path.includes("body") || path.includes("title") || path.includes("subtitle")
    ? 4
    : 3;

const FieldControl = ({ dir, controlType, path, value, onChange }) => {
  const normalizedValue = Array.isArray(value)
    ? value.join("\n")
    : (value ?? "");
  const commonProps = {
    dir,
    value: normalizedValue,
    onChange,
  };

  if (controlType === "textarea") {
    return (
      <textarea
        {...commonProps}
        rows={getRows(path)}
        className="w-full rounded-2xl border border-sand-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-500"
      />
    );
  }

  return (
    <input
      {...commonProps}
      className="w-full rounded-full border border-sand-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sage-500"
    />
  );
};

const FieldsColumn = ({
  draft,
  fields,
  languageCode,
  languageLabel,
  onChange,
}) => (
  <div className="space-y-4">
    <div className="text-sm font-semibold tracking-[0.12em] uppercase text-sage-700">
      {languageLabel}
    </div>
    {fields.map(([fieldLabel, path, controlType]) => (
      <label key={`${languageCode}-${path}`} className="block">
        <span className="block text-sm font-medium text-sage-800 mb-2">
          {fieldLabel}
        </span>
        <FieldControl
          dir={languageCode === "ar" ? "rtl" : undefined}
          controlType={controlType}
          path={path}
          value={getPathValue(draft[languageCode], path)}
          onChange={(event) => {
            const currentValue = getPathValue(draft[languageCode], path);
            const nextValue = Array.isArray(currentValue)
              ? event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : event.target.value;

            onChange(languageCode, path, nextValue);
          }}
        />
      </label>
    ))}
  </div>
);

const sections = [
  {
    title: "Navigation",
    fields: [
      ["Home", "nav.home"],
      ["Classes", "nav.classes"],
      ["Retreats", "nav.retreats"],
      ["Pricing", "nav.pricing"],
      ["About", "nav.about"],
      ["Contact", "nav.contact"],
      ["Book CTA", "nav.bookNow"],
    ],
  },
  {
    title: "Home Hero",
    fields: [
      ["Title", "home.hero.title", "textarea"],
      ["Subtitle", "home.hero.subtitle", "textarea"],
      ["Primary CTA", "home.hero.primaryCta"],
      ["Secondary CTA", "home.hero.secondaryCta"],
    ],
  },
  {
    title: "Home Intro",
    fields: [
      ["Section Title", "home.intro.title"],
      ["Body", "home.intro.body", "textarea"],
    ],
  },
  {
    title: "Home Services",
    fields: [
      ["Service 1 Title", "home.services.0.title"],
      ["Service 1 Description", "home.services.0.description", "textarea"],
      ["Service 2 Title", "home.services.1.title"],
      ["Service 2 Description", "home.services.1.description", "textarea"],
      ["Service 3 Title", "home.services.2.title"],
      ["Service 3 Description", "home.services.2.description", "textarea"],
      ["Service 4 Title", "home.services.3.title"],
      ["Service 4 Description", "home.services.3.description", "textarea"],
      ["Service 5 Title", "home.services.4.title"],
      ["Service 5 Description", "home.services.4.description", "textarea"],
      ["Service 6 Title", "home.services.5.title"],
      ["Service 6 Description", "home.services.5.description", "textarea"],
    ],
  },
  {
    title: "Home Testimonials",
    fields: [
      ["Testimonial 1 Name", "home.testimonialsList.0.name"],
      ["Testimonial 1 Text", "home.testimonialsList.0.text", "textarea"],
      ["Testimonial 1 Location", "home.testimonialsList.0.location"],
      ["Testimonial 2 Name", "home.testimonialsList.1.name"],
      ["Testimonial 2 Text", "home.testimonialsList.1.text", "textarea"],
      ["Testimonial 2 Location", "home.testimonialsList.1.location"],
      ["Testimonial 3 Name", "home.testimonialsList.2.name"],
      ["Testimonial 3 Text", "home.testimonialsList.2.text", "textarea"],
      ["Testimonial 3 Location", "home.testimonialsList.2.location"],
      ["Testimonial 4 Name", "home.testimonialsList.3.name"],
      ["Testimonial 4 Text", "home.testimonialsList.3.text", "textarea"],
      ["Testimonial 4 Location", "home.testimonialsList.3.location"],
    ],
  },
  {
    title: "Home CTA",
    fields: [
      ["Title", "home.cta.title", "textarea"],
      ["Body", "home.cta.body", "textarea"],
      ["Button", "home.cta.button"],
    ],
  },
  {
    title: "Classes",
    fields: [
      ["Header Title", "classes.header.title", "textarea"],
      ["Header Subtitle", "classes.header.subtitle", "textarea"],
      ["Filter Label", "classes.filters.label"],
      ["Filter All", "classes.filters.all"],
      ["Filter Yoga", "classes.filters.yoga"],
      ["Filter Pilates", "classes.filters.pilates"],
      ["Filter Reformer", "classes.filters.reformer"],
      ["Minutes Label", "classes.labels.minutes"],
      ["Spots Available Label", "classes.labels.spotsAvailable"],
      ["Currency Label", "classes.labels.currency"],
      ["No Classes Message", "classes.labels.noClasses", "textarea"],
      ["Fully Booked Label", "classes.labels.fullyBooked"],
      ["Book Now Label", "classes.labels.bookNow"],
      ["Class 1 Name", "classes.items.0.name"],
      ["Class 1 Level", "classes.items.0.level"],
      ["Class 1 Description", "classes.items.0.description", "textarea"],
      ["Class 2 Name", "classes.items.1.name"],
      ["Class 2 Level", "classes.items.1.level"],
      ["Class 2 Description", "classes.items.1.description", "textarea"],
      ["Class 3 Name", "classes.items.2.name"],
      ["Class 3 Level", "classes.items.2.level"],
      ["Class 3 Description", "classes.items.2.description", "textarea"],
      ["Class 4 Name", "classes.items.3.name"],
      ["Class 4 Level", "classes.items.3.level"],
      ["Class 4 Description", "classes.items.3.description", "textarea"],
      ["Class 5 Name", "classes.items.4.name"],
      ["Class 5 Level", "classes.items.4.level"],
      ["Class 5 Description", "classes.items.4.description", "textarea"],
      ["Class 6 Name", "classes.items.5.name"],
      ["Class 6 Level", "classes.items.5.level"],
      ["Class 6 Description", "classes.items.5.description", "textarea"],
      ["Class 7 Name", "classes.items.6.name"],
      ["Class 7 Level", "classes.items.6.level"],
      ["Class 7 Description", "classes.items.6.description", "textarea"],
      ["Class 8 Name", "classes.items.7.name"],
      ["Class 8 Level", "classes.items.7.level"],
      ["Class 8 Description", "classes.items.7.description", "textarea"],
    ],
  },
  {
    title: "Retreats",
    fields: [
      ["Header Title", "retreats.header.title", "textarea"],
      ["Header Subtitle", "retreats.header.subtitle", "textarea"],
      ["Spots Left Label", "retreats.labels.spotsLeft"],
      ["Starting From Label", "retreats.labels.startingFrom"],
      ["Almost Full Label", "retreats.labels.almostFull"],
      ["Hide Details Label", "retreats.labels.hideDetails"],
      ["View Details Label", "retreats.labels.viewDetails"],
      ["Fully Booked Label", "retreats.labels.fullyBooked"],
      ["Book Your Spot Label", "retreats.labels.bookYourSpot"],
      ["About This Retreat Label", "retreats.labels.aboutThisRetreat"],
      ["What's Included Label", "retreats.labels.whatsIncluded"],
      ["What to Bring Label", "retreats.labels.whatToBring"],
      ["Details CTA", "retreats.labels.detailsCta", "textarea"],
      ["Book Now Label", "retreats.labels.bookNow"],
      ["Why Join Title", "retreats.labels.whyJoinTitle", "textarea"],
      ["Benefit 1 Title", "retreats.benefits.0.title"],
      ["Benefit 1 Description", "retreats.benefits.0.description", "textarea"],
      ["Benefit 2 Title", "retreats.benefits.1.title"],
      ["Benefit 2 Description", "retreats.benefits.1.description", "textarea"],
      ["Benefit 3 Title", "retreats.benefits.2.title"],
      ["Benefit 3 Description", "retreats.benefits.2.description", "textarea"],
      ["Retreat 1 Title", "retreats.items.0.title"],
      ["Retreat 1 Destination", "retreats.items.0.destination"],
      ["Retreat 1 Short Description", "retreats.items.0.shortDescription", "textarea"],
      ["Retreat 1 Full Description", "retreats.items.0.fullDescription", "textarea"],
      ["Retreat 1 Included", "retreats.items.0.included", "textarea"],
      ["Retreat 1 To Bring", "retreats.items.0.toBring", "textarea"],
      ["Retreat 2 Title", "retreats.items.1.title"],
      ["Retreat 2 Destination", "retreats.items.1.destination"],
      ["Retreat 2 Short Description", "retreats.items.1.shortDescription", "textarea"],
      ["Retreat 2 Full Description", "retreats.items.1.fullDescription", "textarea"],
      ["Retreat 2 Included", "retreats.items.1.included", "textarea"],
      ["Retreat 2 To Bring", "retreats.items.1.toBring", "textarea"],
      ["Retreat 3 Title", "retreats.items.2.title"],
      ["Retreat 3 Destination", "retreats.items.2.destination"],
      ["Retreat 3 Short Description", "retreats.items.2.shortDescription", "textarea"],
      ["Retreat 3 Full Description", "retreats.items.2.fullDescription", "textarea"],
      ["Retreat 3 Included", "retreats.items.2.included", "textarea"],
      ["Retreat 3 To Bring", "retreats.items.2.toBring", "textarea"],
    ],
  },
  {
    title: "Retreat Booking Modal",
    fields: [
      ["Confirmed Title", "retreats.booking.confirmedTitle"],
      ["Modal Title", "retreats.booking.title"],
      ["Step Details", "retreats.booking.steps.details"],
      ["Step Payment", "retreats.booking.steps.payment"],
      ["Step Confirm", "retreats.booking.steps.confirm"],
      ["Summary Destination", "retreats.booking.summary.destination"],
      ["Summary Date", "retreats.booking.summary.date"],
      ["Summary Duration", "retreats.booking.summary.duration"],
      ["Summary Spots Left", "retreats.booking.summary.spotsLeft"],
      ["Summary Full Price", "retreats.booking.summary.fullPrice"],
      ["Full Name Label", "retreats.booking.form.fullName"],
      ["Full Name Placeholder", "retreats.booking.form.fullNamePlaceholder"],
      ["Email Label", "retreats.booking.form.email"],
      ["Email Placeholder", "retreats.booking.form.emailPlaceholder"],
      ["Phone Label", "retreats.booking.form.phone"],
      ["Phone Placeholder", "retreats.booking.form.phonePlaceholder"],
      ["Room Type Label", "retreats.booking.form.roomType"],
      ["Shared Room", "retreats.booking.form.sharedRoom"],
      ["Shared Room Description", "retreats.booking.form.sharedRoomDescription", "textarea"],
      ["Private Room", "retreats.booking.form.privateRoom"],
      ["Private Room Description", "retreats.booking.form.privateRoomDescription", "textarea"],
      ["Special Notes Label", "retreats.booking.form.specialNotes"],
      ["Special Notes Placeholder", "retreats.booking.form.specialNotesPlaceholder", "textarea"],
      ["Continue To Payment", "retreats.booking.form.continueToPayment"],
      ["Payment Option Label", "retreats.booking.payment.optionLabel"],
      ["Deposit Title", "retreats.booking.payment.depositTitle"],
      ["Deposit Description", "retreats.booking.payment.depositDescription", "textarea"],
      ["Full Payment Title", "retreats.booking.payment.fullTitle"],
      ["Full Payment Description", "retreats.booking.payment.fullDescription", "textarea"],
      ["Payment Summary", "retreats.booking.payment.paymentSummary"],
      ["Retreat Package", "retreats.booking.payment.retreatPackage"],
      ["Private Room Upgrade", "retreats.booking.payment.privateRoomUpgrade"],
      ["Amount Due Now", "retreats.booking.payment.amountDueNow"],
      ["Cancellation Policy Title", "retreats.booking.payment.cancellationPolicyTitle"],
      ["Cancellation Policy Body", "retreats.booking.payment.cancellationPolicyBody", "textarea"],
      ["Mock Payment Notice", "retreats.booking.payment.mockPaymentNotice", "textarea"],
      ["Card Number Placeholder", "retreats.booking.payment.cardNumber"],
      ["Expiry Placeholder", "retreats.booking.payment.expiry"],
      ["CVV Placeholder", "retreats.booking.payment.cvv"],
      ["Back Label", "retreats.booking.payment.back"],
      ["Review Booking", "retreats.booking.payment.reviewBooking"],
      ["Booking Summary", "retreats.booking.confirmation.bookingSummary"],
      ["Name Label", "retreats.booking.confirmation.name"],
      ["Confirmation Email Label", "retreats.booking.confirmation.email"],
      ["Confirmation Phone Label", "retreats.booking.confirmation.phone"],
      ["Confirmation Room Type Label", "retreats.booking.confirmation.roomType"],
      ["Confirmation Payment Label", "retreats.booking.confirmation.payment"],
      ["Amount Paid Label", "retreats.booking.confirmation.amountPaid"],
      ["Confirmation Special Notes Label", "retreats.booking.confirmation.specialNotes"],
      ["Deposit Label", "retreats.booking.confirmation.deposit"],
      ["Full Payment Label", "retreats.booking.confirmation.fullPayment"],
      ["Confirm Booking", "retreats.booking.confirmation.confirmBooking"],
      ["Success Title", "retreats.booking.success.title"],
      ["Success Body Before", "retreats.booking.success.bodyBefore", "textarea"],
      ["Success Body Middle", "retreats.booking.success.bodyMiddle", "textarea"],
      ["Success Body After", "retreats.booking.success.bodyAfter", "textarea"],
      ["Next Steps Label", "retreats.booking.success.nextSteps"],
      ["Itinerary Step", "retreats.booking.success.itinerary", "textarea"],
      ["Packing Step", "retreats.booking.success.packing", "textarea"],
      ["Remaining Balance Prefix", "retreats.booking.success.remainingBalance", "textarea"],
      ["Remaining Balance Suffix", "retreats.booking.success.remainingBalanceAfter", "textarea"],
      ["Contact Step", "retreats.booking.success.contact", "textarea"],
      ["Close Button", "retreats.booking.success.close"],
    ],
  },
  {
    title: "Footer",
    fields: [
      ["Brand Text", "footer.brand", "textarea"],
      ["Quick Links", "footer.quickLinks"],
      ["Services", "footer.services"],
      ["Get In Touch", "footer.getInTouch"],
      ["Rights", "footer.rights"],
      ["Designed With Care", "footer.designedWithCare", "textarea"],
      ["WhatsApp", "footer.whatsapp"],
    ],
  },
  {
    title: "Pricing",
    fields: [
      ["Header Title", "pricing.header.title", "textarea"],
      ["Header Subtitle", "pricing.header.subtitle", "textarea"],
      ["Popular Label", "pricing.labels.popular"],
      ["Currency Label", "pricing.labels.currency"],
      ["Get Started Button", "pricing.labels.getStarted"],
      ["FAQ Title", "pricing.faq.title"],
      ["FAQ Subtitle", "pricing.faq.intro", "textarea"],
      ["CTA Title", "pricing.cta.title", "textarea"],
      ["CTA Body", "pricing.cta.body", "textarea"],
      ["CTA Primary Button", "pricing.cta.primaryButton"],
      ["CTA Secondary Button", "pricing.cta.secondaryButton"],
      ["Plan 1 Name", "pricing.plans.0.name"],
      ["Plan 1 Period", "pricing.plans.0.period"],
      ["Plan 1 Features", "pricing.plans.0.features", "textarea"],
      ["Plan 2 Name", "pricing.plans.1.name"],
      ["Plan 2 Period", "pricing.plans.1.period"],
      ["Plan 2 Features", "pricing.plans.1.features", "textarea"],
      ["Plan 3 Name", "pricing.plans.2.name"],
      ["Plan 3 Period", "pricing.plans.2.period"],
      ["Plan 3 Features", "pricing.plans.2.features", "textarea"],
      ["Plan 4 Name", "pricing.plans.3.name"],
      ["Plan 4 Period", "pricing.plans.3.period"],
      ["Plan 4 Features", "pricing.plans.3.features", "textarea"],
      ["Plan 5 Name", "pricing.plans.4.name"],
      ["Plan 5 Period", "pricing.plans.4.period"],
      ["Plan 5 Features", "pricing.plans.4.features", "textarea"],
      ["Plan 6 Name", "pricing.plans.5.name"],
      ["Plan 6 Period", "pricing.plans.5.period"],
      ["Plan 6 Features", "pricing.plans.5.features", "textarea"],
    ],
  },
  {
    title: "About",
    fields: [
      ["Header Title", "about.header.title"],
      ["Header Subtitle", "about.header.subtitle", "textarea"],
      ["Journey Title", "about.journey.title"],
      ["Journey Paragraph 1", "about.journey.paragraphs.0", "textarea"],
      ["Journey Paragraph 2", "about.journey.paragraphs.1", "textarea"],
      ["Journey Paragraph 3", "about.journey.paragraphs.2", "textarea"],
      ["Journey Paragraph 4", "about.journey.paragraphs.3", "textarea"],
      ["Philosophy Title", "about.philosophy.title"],
      ["Philosophy Quote", "about.philosophy.quote", "textarea"],
      ["Philosophy Paragraph 1", "about.philosophy.paragraphs.0", "textarea"],
      ["Philosophy Paragraph 2", "about.philosophy.paragraphs.1", "textarea"],
      ["Certifications Title", "about.certifications.title"],
      ["Certifications Intro", "about.certifications.intro", "textarea"],
      ["Certification 1", "about.certifications.items.0"],
      ["Certification 2", "about.certifications.items.1"],
      ["Certification 3", "about.certifications.items.2"],
      ["Certification 4", "about.certifications.items.3"],
      ["Certification 5", "about.certifications.items.4"],
      ["Media Title", "about.media.title"],
      ["Media Subtitle", "about.media.subtitle", "textarea"],
      ["Media 1 Outlet", "about.media.items.0.outlet"],
      ["Media 1 Role", "about.media.items.0.role"],
      ["Media 2 Outlet", "about.media.items.1.outlet"],
      ["Media 2 Role", "about.media.items.1.role"],
      ["Media 3 Outlet", "about.media.items.2.outlet"],
      ["Media 3 Role", "about.media.items.2.role"],
      ["Media 4 Outlet", "about.media.items.3.outlet"],
      ["Media 4 Role", "about.media.items.3.role"],
      ["Community Title", "about.community.title"],
      ["Community Body", "about.community.body", "textarea"],
      ["Community Stat 1 Value", "about.community.stats.0.value"],
      ["Community Stat 1 Label", "about.community.stats.0.label"],
      ["Community Stat 2 Value", "about.community.stats.1.value"],
      ["Community Stat 2 Label", "about.community.stats.1.label"],
      ["Community Stat 3 Value", "about.community.stats.2.value"],
      ["Community Stat 3 Label", "about.community.stats.2.label"],
      ["CTA Title", "about.cta.title", "textarea"],
      ["CTA Body", "about.cta.body", "textarea"],
      ["CTA Button", "about.cta.button"],
    ],
  },
  {
    title: "Contact",
    fields: [
      ["Header Title", "contact.header.title"],
      ["Header Subtitle", "contact.header.subtitle", "textarea"],
      ["Info Title", "contact.info.title"],
      ["Studio Location", "contact.info.studioLocation"],
      ["Phone Label", "contact.info.phone"],
      ["Email Label", "contact.info.email"],
      ["Hours Label", "contact.info.hours"],
      ["WhatsApp Label", "contact.info.whatsapp"],
      ["Follow Us", "contact.info.followUs"],
      ["Form Title", "contact.form.title"],
      ["Name Label", "contact.form.name"],
      ["Email Label", "contact.form.email"],
      ["Phone Label", "contact.form.phone"],
      ["Subject Label", "contact.form.subject"],
      ["Message Label", "contact.form.message"],
      ["Submit Button", "contact.form.submit"],
      ["Name Placeholder", "contact.form.namePlaceholder"],
      ["Email Placeholder", "contact.form.emailPlaceholder"],
      ["Phone Placeholder", "contact.form.phonePlaceholder"],
      ["Subject Placeholder", "contact.form.subjectPlaceholder"],
      ["Message Placeholder", "contact.form.messagePlaceholder", "textarea"],
      ["Success Title", "contact.form.successTitle"],
      ["Success Body", "contact.form.successBody", "textarea"],
      ["FAQ Title", "contact.faq.title"],
      ["FAQ Subtitle", "contact.faq.subtitle", "textarea"],
      ["FAQ 1 Question", "contact.faq.items.0.question", "textarea"],
      ["FAQ 1 Answer", "contact.faq.items.0.answer", "textarea"],
      ["FAQ 2 Question", "contact.faq.items.1.question", "textarea"],
      ["FAQ 2 Answer", "contact.faq.items.1.answer", "textarea"],
      ["FAQ 3 Question", "contact.faq.items.2.question", "textarea"],
      ["FAQ 3 Answer", "contact.faq.items.2.answer", "textarea"],
      ["FAQ 4 Question", "contact.faq.items.3.question", "textarea"],
      ["FAQ 4 Answer", "contact.faq.items.3.answer", "textarea"],
      ["FAQ 5 Question", "contact.faq.items.4.question", "textarea"],
      ["FAQ 5 Answer", "contact.faq.items.4.answer", "textarea"],
      ["FAQ 6 Question", "contact.faq.items.5.question", "textarea"],
      ["FAQ 6 Answer", "contact.faq.items.5.answer", "textarea"],
      ["Map Title", "contact.map.title"],
      ["Map Subtitle", "contact.map.subtitle", "textarea"],
    ],
  },
];

const buildDraftFromContent = (content) => content;

const AdminContent = () => {
  const { language } = useLanguage();
  const { content, replaceContent, resetContent, getContentValue } =
    useContent();
  const [draft, setDraft] = useState(() => buildDraftFromContent(content));
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(buildDraftFromContent(content));
  }, [content]);

  const labels = useMemo(
    () => ({
      title: getContentValue(language, "admin.title", "Content Manager"),
      subtitle: getContentValue(
        language,
        "admin.subtitle",
        "Edit the site copy in English and Arabic.",
      ),
      save: getContentValue(language, "admin.save", "Save Changes"),
      reset: getContentValue(language, "admin.reset", "Reset Defaults"),
      saved: getContentValue(language, "admin.saved", "Changes saved locally."),
      english: getContentValue(language, "admin.english", "English"),
      arabic: getContentValue(language, "admin.arabic", "Arabic"),
    }),
    [getContentValue, language],
  );

  const updateDraftValue = (targetLanguage, path, value) => {
    const keys = `${targetLanguage}.${path}`.split(".");
    const nextDraft = structuredClone(draft);
    let current = nextDraft;

    keys.slice(0, -1).forEach((key) => {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    });

    current[keys[keys.length - 1]] = value;
    setDraft(nextDraft);
  };

  const handleSave = () => {
    replaceContent(draft);
    setMessage(labels.saved);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const handleReset = () => {
    resetContent();
    setDraft(buildDraftFromContent(defaultSiteContent));
    setMessage("");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-sand-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-sand-200 p-8 md:p-10 mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-sage-900 mb-4">
            {labels.title}
          </h1>
          <p className="text-sage-700 text-lg leading-relaxed max-w-3xl">
            {labels.subtitle}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Save size={18} />
              <span>{labels.save}</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              <span>{labels.reset}</span>
            </button>
          </div>
          {message && (
            <p className="mt-4 text-sage-700 font-medium">{message}</p>
          )}
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-white rounded-3xl shadow-sm border border-sand-200 p-6 md:p-8"
            >
              <h2 className="text-2xl font-serif font-semibold text-sage-900 mb-6">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FieldsColumn
                  draft={draft}
                  fields={section.fields}
                  languageCode="en"
                  languageLabel={labels.english}
                  onChange={updateDraftValue}
                />
                <FieldsColumn
                  draft={draft}
                  fields={section.fields}
                  languageCode="ar"
                  languageLabel={labels.arabic}
                  onChange={updateDraftValue}
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
