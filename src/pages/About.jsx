import React from "react";
import { Heart, Award, Tv, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import InlineEditable from "../components/admin/InlineEditable";
import { AdminEditToggle } from "../components/admin/AdminInline";

const About = () => {
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const defaultCommunityStats = [
    { value: "500+", label: "Happy Students" },
    { value: "1,200+", label: "Classes Taught" },
    { value: "15+", label: "Retreats Led" },
  ];
  const defaultCertifications = [
    "RYT 500 Yoga Alliance Certified",
    "STOTT Pilates Certified Instructor",
    "Reformer Pilates Specialist",
    "Pre & Postnatal Yoga Certified",
    "Wellness & Nutrition Coach",
  ];

  const defaultMediaAppearances = [
    { outlet: "Good Morning Egypt", role: "Wellness Expert" },
    { outlet: "Cairo Today Magazine", role: "Featured Instructor" },
    { outlet: "Egyptian Fitness Awards", role: "Best Yoga Instructor 2025" },
    { outlet: "Wellness TV", role: "Regular Contributor" },
  ];

  const aboutContent = {
    headerTitle: getContentValue(language, "about.header.title", "About Heba"),
    headerSubtitle: getContentValue(
      language,
      "about.header.subtitle",
      "Wellness practitioner, movement educator, and your guide to mindful living.",
    ),
    journeyTitle: getContentValue(
      language,
      "about.journey.title",
      "The Journey",
    ),
    journeyParagraphs: getContentValue(
      language,
      "about.journey.paragraphs",
      [],
    ),
    philosophyTitle: getContentValue(
      language,
      "about.philosophy.title",
      "My Philosophy",
    ),
    philosophyQuote: getContentValue(language, "about.philosophy.quote", ""),
    philosophyParagraphs: getContentValue(
      language,
      "about.philosophy.paragraphs",
      [],
    ),
    certificationsTitle: getContentValue(
      language,
      "about.certifications.title",
      "Certifications & Training",
    ),
    certificationsIntro: getContentValue(
      language,
      "about.certifications.intro",
      "",
    ),
    certificationsItems: getContentValue(
      language,
      "about.certifications.items",
      defaultCertifications,
    ),
    mediaTitle: getContentValue(
      language,
      "about.media.title",
      "Media & Recognition",
    ),
    mediaSubtitle: getContentValue(language, "about.media.subtitle", ""),
    mediaItems: getContentValue(
      language,
      "about.media.items",
      defaultMediaAppearances,
    ),
    communityTitle: getContentValue(
      language,
      "about.community.title",
      "Join the Community",
    ),
    communityBody: getContentValue(language, "about.community.body", ""),
    communityStats: getContentValue(
      language,
      "about.community.stats",
      defaultCommunityStats,
    ),
    ctaTitle: getContentValue(
      language,
      "about.cta.title",
      "Ready to Start Your Journey?",
    ),
    ctaBody: getContentValue(language, "about.cta.body", ""),
    ctaButton: getContentValue(
      language,
      "about.cta.button",
      "Book Your First Class",
    ),
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-sage-600 to-sage-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              <InlineEditable
                path="about.header.title"
                multiline
                label="Header Title"
                fallback={aboutContent.headerTitle}
              />
            </h1>
            <AdminEditToggle />
          </div>
          <p className="text-xl opacity-90 leading-relaxed">
            <InlineEditable
              path="about.header.subtitle"
              multiline
              label="Header Subtitle"
              fallback={aboutContent.headerSubtitle}
            />
          </p>
        </div>
      </section>

      {/* Hero Image & Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
                alt="Heba Elshamy"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-serif font-bold text-sage-900 mb-6">
                <InlineEditable
                  path="about.journey.title"
                  label="Journey Title"
                  fallback={aboutContent.journeyTitle}
                />
              </h2>
              <div className="space-y-4 text-sage-800 leading-relaxed">
                <InlineEditable
                  as="div"
                  path="about.journey.paragraphs"
                  list
                  multiline
                  label="Journey Paragraphs (one per line)"
                >
                  {(items) =>
                    (Array.isArray(items) ? items : []).map(
                      (paragraph, index) => <p key={index}>{paragraph}</p>,
                    )
                  }
                </InlineEditable>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Heart size={48} className="text-sage-600 mx-auto mb-6" />
            <h2 className="section-title">
              <InlineEditable
                path="about.philosophy.title"
                label="Philosophy Title"
                fallback={aboutContent.philosophyTitle}
              />
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="space-y-6 text-sage-800 leading-relaxed text-lg">
              <p className="text-xl font-serif italic text-sage-700">
                "
                <InlineEditable
                  path="about.philosophy.quote"
                  multiline
                  label="Philosophy Quote"
                  fallback={aboutContent.philosophyQuote}
                />
                "
              </p>
              <InlineEditable
                as="div"
                path="about.philosophy.paragraphs"
                list
                multiline
                label="Philosophy Paragraphs (one per line)"
              >
                {(items) =>
                  (Array.isArray(items) ? items : []).map(
                    (paragraph, index) => <p key={index}>{paragraph}</p>,
                  )
                }
              </InlineEditable>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Award size={48} className="text-sage-600 mx-auto mb-6" />
            <h2 className="section-title">
              <InlineEditable
                path="about.certifications.title"
                label="Certifications Title"
                fallback={aboutContent.certificationsTitle}
              />
            </h2>
          </div>
          <InlineEditable
            as="div"
            path="about.certifications.items"
            list
            multiline
            label="Certifications (one per line)"
            className="grid md:grid-cols-2 gap-4"
          >
            {(items) =>
              (Array.isArray(items) ? items : []).map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-sand-50 rounded-lg"
                >
                  <Award size={20} className="text-sage-600 flex-shrink-0" />
                  <span className="text-sage-800">{cert}</span>
                </div>
              ))
            }
          </InlineEditable>
          <p className="text-center text-sage-700 mt-8">
            <InlineEditable
              path="about.certifications.intro"
              multiline
              label="Certifications Intro"
              fallback={aboutContent.certificationsIntro}
            />
          </p>
        </div>
      </section>

      {/* Media Appearances */}
      <section className="py-20 px-4 bg-sand-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Tv size={48} className="text-sage-600 mx-auto mb-6" />
            <h2 className="section-title">
              <InlineEditable
                path="about.media.title"
                label="Media Title"
                fallback={aboutContent.mediaTitle}
              />
            </h2>
            <p className="section-subtitle">
              <InlineEditable
                path="about.media.subtitle"
                multiline
                label="Media Subtitle"
                fallback={aboutContent.mediaSubtitle}
              />
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {aboutContent.mediaItems.map((appearance, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-serif font-semibold text-sage-900 mb-2">
                  <InlineEditable
                    path={`about.media.items.${index}.outlet`}
                    label={`Outlet ${index + 1}`}
                    fallback={appearance.outlet}
                  />
                </h3>
                <p className="text-sage-700 font-medium">
                  <InlineEditable
                    path={`about.media.items.${index}.role`}
                    label={`Role ${index + 1}`}
                    fallback={appearance.role}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <Users size={48} className="text-sage-600 mx-auto mb-6" />
          <h2 className="section-title">
            <InlineEditable
              path="about.community.title"
              label="Community Title"
              fallback={aboutContent.communityTitle}
            />
          </h2>
          <p className="section-subtitle mb-8">
            <InlineEditable
              path="about.community.body"
              multiline
              label="Community Body"
              fallback={aboutContent.communityBody}
            />
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {aboutContent.communityStats.map((stat, index) => (
              <div key={`${stat.value}-${index}`} className="p-6">
                <h3 className="text-3xl font-bold text-sage-700 mb-2">
                  <InlineEditable
                    path={`about.community.stats.${index}.value`}
                    label={`Stat ${index + 1} Value`}
                    fallback={stat.value}
                  />
                </h3>
                <p className="text-sage-700">
                  <InlineEditable
                    path={`about.community.stats.${index}.label`}
                    label={`Stat ${index + 1} Label`}
                    fallback={stat.label}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-sage-600 to-sage-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <InlineEditable
              path="about.cta.title"
              multiline
              label="CTA Title"
              fallback={aboutContent.ctaTitle}
            />
          </h2>
          <p className="text-xl mb-8 opacity-90">
            <InlineEditable
              path="about.cta.body"
              multiline
              label="CTA Body"
              fallback={aboutContent.ctaBody}
            />
          </p>
          <a
            href="/classes"
            className="inline-block px-10 py-4 bg-white text-sage-700 rounded-full text-lg font-semibold hover:bg-sand-50 transition-all shadow-lg"
          >
            <InlineEditable
              path="about.cta.button"
              label="CTA Button"
              fallback={aboutContent.ctaButton}
            />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
