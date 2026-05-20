import React, { useMemo, useState } from "react";
import { MapPin, Calendar, Users, Clock, Check } from "lucide-react";
import RetreatBookingModal from "../components/RetreatBookingModal";
import RetreatGallery from "../components/RetreatGallery";
import LoginPromptModal from "../components/auth/LoginPromptModal";
import CollectionEditModal from "../components/admin/CollectionEditModal";
import {
  useAdminEdit,
  AdminEditToggle,
  AdminEditBar,
  AdminCardControls,
} from "../components/admin/AdminInline";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { useBookingFlow } from "../hooks/useBookingFlow";
import {
  useCollection,
  projectItemLocalized,
} from "../data/collectionsAdminStore";

const Retreats = () => {
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const { isAdmin: adminMode, editMode } = useAdminEdit();
  const {
    items: rawRetreats,
    schema,
    addItem,
    updateItem,
    deleteItem,
  } = useCollection("retreats");
  const [selectedRetreat, setSelectedRetreat] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editorMode, setEditorMode] = useState("edit");
  const { requestBooking, promptOpen, closePrompt, redirectTo } =
    useBookingFlow();

  const defaultBenefits = [
    {
      title: "Connect",
      description:
        "Build meaningful connections with like-minded souls in a supportive community.",
    },
    {
      title: "Explore",
      description:
        "Discover Egypt's hidden gems while deepening your practice in stunning settings.",
    },
    {
      title: "Transform",
      description:
        "Return home renewed, recharged, and reconnected to what matters most.",
    },
  ];

  const labels = useMemo(
    () => ({
      headerTitle: getContentValue(
        language,
        "retreats.header.title",
        "Wellness Retreats",
      ),
      headerSubtitle: getContentValue(
        language,
        "retreats.header.subtitle",
        "Escape the everyday and immerse yourself in transformative wellness experiences in Egypt's most beautiful destinations.",
      ),
      spotsLeft: getContentValue(
        language,
        "retreats.labels.spotsLeft",
        "spots left",
      ),
      startingFrom: getContentValue(
        language,
        "retreats.labels.startingFrom",
        "Starting from",
      ),
      almostFull: getContentValue(
        language,
        "retreats.labels.almostFull",
        "Almost Full!",
      ),
      hideDetails: getContentValue(
        language,
        "retreats.labels.hideDetails",
        "Hide Details",
      ),
      viewDetails: getContentValue(
        language,
        "retreats.labels.viewDetails",
        "View Details",
      ),
      fullyBooked: getContentValue(
        language,
        "retreats.labels.fullyBooked",
        "Fully Booked",
      ),
      bookYourSpot: getContentValue(
        language,
        "retreats.labels.bookYourSpot",
        "Book Your Spot",
      ),
      aboutThisRetreat: getContentValue(
        language,
        "retreats.labels.aboutThisRetreat",
        "About This Retreat",
      ),
      whatsIncluded: getContentValue(
        language,
        "retreats.labels.whatsIncluded",
        "What's Included",
      ),
      whatToBring: getContentValue(
        language,
        "retreats.labels.whatToBring",
        "What to Bring",
      ),
      detailsCta: getContentValue(
        language,
        "retreats.labels.detailsCta",
        "Ready to embark on this journey? Secure your spot today!",
      ),
      bookNow: getContentValue(language, "retreats.labels.bookNow", "Book Now"),
      whyJoinTitle: getContentValue(
        language,
        "retreats.labels.whyJoinTitle",
        "Why Join a Retreat?",
      ),
    }),
    [getContentValue, language],
  );

  const benefits = getContentValue(
    language,
    "retreats.benefits",
    defaultBenefits,
  );
  const mergedRetreats = useMemo(
    () => rawRetreats.map((r) => projectItemLocalized(r, language)),
    [rawRetreats, language],
  );

  const handleViewDetails = (retreat) => {
    setShowDetails(showDetails === retreat.id ? null : retreat.id);
  };

  const handleBookRetreat = (retreat) => {
    requestBooking(() => {
      setSelectedRetreat(retreat);
      setShowBookingModal(true);
    });
  };

  const handleEditClick = (id) => {
    const target = rawRetreats.find((r) => r.id === id);
    if (!target) return;
    setEditingItem(target);
    setEditorMode("edit");
  };

  const handleDeleteClick = (id) => {
    const msg = schema.confirmDelete?.[language] ?? schema.confirmDelete?.en;
    if (window.confirm(msg)) deleteItem(id);
  };

  const handleAddClick = () => {
    const created = addItem();
    setEditingItem(created);
    setEditorMode("add");
  };

  const handleEditorSave = (payload) => {
    const { id, ...rest } = payload;
    updateItem(id, rest);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-sage-600 to-sage-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              {labels.headerTitle}
            </h1>
            <AdminEditToggle />
          </div>
          <p className="text-xl opacity-90 leading-relaxed">
            {labels.headerSubtitle}
          </p>
        </div>
      </section>

      <AdminEditBar onAdd={handleAddClick} />

      {/* Retreats List */}
      <section className="py-16 px-4 bg-sand-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {mergedRetreats.map((retreat) => (
            <div key={retreat.id}>
              {/* Retreat Card */}
              <div className="card overflow-hidden relative">
                <AdminCardControls
                  onEdit={() => handleEditClick(retreat.id)}
                  onDelete={() => handleDeleteClick(retreat.id)}
                />
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-2/5">
                    <RetreatGallery
                      images={
                        Array.isArray(retreat.images) && retreat.images.length
                          ? retreat.images
                          : retreat.image
                            ? [retreat.image]
                            : []
                      }
                      alt={retreat.title}
                    />
                  </div>

                  {/* Content */}
                  <div className="md:w-3/5 p-8">
                    <h2 className="text-3xl font-serif font-bold text-sage-900 mb-3">
                      {retreat.title}
                    </h2>
                    <p className="text-sage-800 mb-6 leading-relaxed">
                      {retreat.shortDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-sm text-sage-800">
                        <MapPin
                          size={18}
                          className="text-sage-600 mr-2 flex-shrink-0"
                        />
                        <span>{retreat.destination}</span>
                      </div>
                      <div className="flex items-center text-sm text-sage-800">
                        <Calendar
                          size={18}
                          className="text-sage-600 mr-2 flex-shrink-0"
                        />
                        <span>{retreat.dateRange}</span>
                      </div>
                      <div className="flex items-center text-sm text-sage-800">
                        <Clock
                          size={18}
                          className="text-sage-600 mr-2 flex-shrink-0"
                        />
                        <span>{retreat.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-sage-800">
                        <Users
                          size={18}
                          className="text-sage-600 mr-2 flex-shrink-0"
                        />
                        <span>
                          {retreat.availableSpots} / {retreat.spots}{" "}
                          {labels.spotsLeft}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-sand-200">
                      <div>
                        <p className="text-sm text-sage-700">
                          {labels.startingFrom}
                        </p>
                        <p className="text-3xl font-serif font-bold text-sage-700">
                          {retreat.price.toLocaleString(
                            language === "ar" ? "ar-EG" : "en-US",
                          )}{" "}
                          EGP
                        </p>
                      </div>
                      {retreat.availableSpots <= 3 && (
                        <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                          {labels.almostFull}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(retreat)}
                        className="flex-1 btn-secondary"
                      >
                        {showDetails === retreat.id
                          ? labels.hideDetails
                          : labels.viewDetails}
                      </button>
                      <button
                        onClick={() => handleBookRetreat(retreat)}
                        disabled={retreat.availableSpots === 0}
                        className={`flex-1 ${
                          retreat.availableSpots === 0
                            ? "bg-gray-300 text-sage-600 px-8 py-3 rounded-full font-medium cursor-not-allowed"
                            : "btn-primary"
                        }`}
                      >
                        {retreat.availableSpots === 0
                          ? labels.fullyBooked
                          : labels.bookYourSpot}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {showDetails === retreat.id && (
                  <div className="border-t border-sand-200 bg-white">
                    <div className="p-8 space-y-8">
                      {/* Full Description */}
                      <div>
                        <h3 className="text-xl font-serif font-semibold mb-3">
                          {labels.aboutThisRetreat}
                        </h3>
                        <p className="text-sage-800 leading-relaxed">
                          {retreat.fullDescription}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* What's Included */}
                        <div>
                          <h3 className="text-xl font-serif font-semibold mb-4 flex items-center">
                            <Check size={24} className="text-sage-600 mr-2" />
                            {labels.whatsIncluded}
                          </h3>
                          <ul className="space-y-2">
                            {retreat.included.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start text-sage-800"
                              >
                                <Check
                                  size={16}
                                  className="text-sage-600 mr-2 mt-1 flex-shrink-0"
                                />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* What to Bring */}
                        <div>
                          <h3 className="text-xl font-serif font-semibold mb-4">
                            {labels.whatToBring}
                          </h3>
                          <ul className="space-y-2">
                            {retreat.toBring.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start text-sage-800"
                              >
                                <div className="w-1.5 h-1.5 bg-sage-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="bg-sage-50 rounded-lg p-6 text-center">
                        <p className="text-sage-800 mb-4">
                          {labels.detailsCta}
                        </p>
                        <button
                          onClick={() => handleBookRetreat(retreat)}
                          disabled={retreat.availableSpots === 0}
                          className={
                            retreat.availableSpots === 0
                              ? "bg-gray-300 text-sage-600 px-8 py-3 rounded-full font-medium cursor-not-allowed"
                              : "btn-primary"
                          }
                        >
                          {retreat.availableSpots === 0
                            ? labels.fullyBooked
                            : labels.bookNow}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title">{labels.whyJoinTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => {
              const icons = [Users, MapPin, Check];
              const Icon = icons[index] || Check;

              return (
                <div key={benefit.title}>
                  <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sage-700 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedRetreat && (
        <RetreatBookingModal
          retreat={selectedRetreat}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRetreat(null);
          }}
        />
      )}

      <LoginPromptModal
        open={promptOpen}
        onClose={closePrompt}
        redirectTo={redirectTo}
      />

      {editingItem && (
        <CollectionEditModal
          item={editingItem}
          schema={schema}
          mode={editorMode}
          onSave={handleEditorSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default Retreats;
