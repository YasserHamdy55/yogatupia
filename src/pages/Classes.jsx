import React, { useMemo, useState } from "react";
import { Calendar, Clock, Users, Filter, Award } from "lucide-react";
import BookingModal from "../components/BookingModal";
import LoginPromptModal from "../components/auth/LoginPromptModal";
import ClassEditModal from "../components/admin/ClassEditModal";
import RetreatGallery from "../components/RetreatGallery";
import {
  useAdminEdit,
  AdminEditToggle,
  AdminEditBar,
  AdminCardControls,
} from "../components/admin/AdminInline";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { useBookingFlow } from "../hooks/useBookingFlow";
import { useClassesAdmin } from "../data/classesAdminStore";

const pickLocalized = (value, language, fallback = "") => {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  return value[language] ?? value.en ?? fallback;
};

const Classes = () => {
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const { isAdmin: adminMode, editMode } = useAdminEdit();
  const {
    items: managedClasses,
    updateClass,
    deleteClass,
    addClass,
  } = useClassesAdmin();

  const [selectedType, setSelectedType] = useState("All");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editorMode, setEditorMode] = useState("edit");
  const [showDetails, setShowDetails] = useState(null);
  const { requestBooking, promptOpen, closePrompt, redirectTo } =
    useBookingFlow();

  const adminText =
    language === "ar"
      ? {
          addNew: "إضافة حصة جديدة",
          confirmDelete: "هل أنت متأكد من حذف هذه الحصة؟",
        }
      : {
          addNew: "Add New Class",
          confirmDelete: "Are you sure you want to delete this class?",
        };

  const labels = {
    headerTitle: getContentValue(
      language,
      "classes.header.title",
      "Class Schedule",
    ),
    headerSubtitle: getContentValue(
      language,
      "classes.header.subtitle",
      "Find your perfect class and book your spot today.",
    ),
    filterLabel: getContentValue(
      language,
      "classes.filters.label",
      "Filter by:",
    ),
    minutes: getContentValue(language, "classes.labels.minutes", "minutes"),
    spotsAvailable: getContentValue(
      language,
      "classes.labels.spotsAvailable",
      "spots available",
    ),
    currency: getContentValue(language, "classes.labels.currency", "EGP"),
    noClasses: getContentValue(
      language,
      "classes.labels.noClasses",
      "No classes found for this filter.",
    ),
    fullyBooked: getContentValue(
      language,
      "classes.labels.fullyBooked",
      "Fully Booked",
    ),
    bookNow: getContentValue(language, "classes.labels.bookNow", "Book Now"),
    viewDetails: getContentValue(
      language,
      "classes.labels.viewDetails",
      language === "ar" ? "عرض التفاصيل" : "View Details",
    ),
    hideDetails: getContentValue(
      language,
      "classes.labels.hideDetails",
      language === "ar" ? "إخفاء التفاصيل" : "Hide Details",
    ),
    startingFrom: getContentValue(
      language,
      "classes.labels.startingFrom",
      language === "ar" ? "يبدأ من:" : "Starting from:",
    ),
    almostFull: getContentValue(
      language,
      "classes.labels.almostFull",
      language === "ar" ? "على وشك الاكتمال" : "Almost full",
    ),
    aboutThisClass: getContentValue(
      language,
      "classes.labels.aboutThisClass",
      language === "ar" ? "عن هذه الحصة" : "About this class",
    ),
  };

  const classTypes = useMemo(
    () => [
      {
        value: "All",
        label: getContentValue(language, "classes.filters.all", "All"),
      },
      {
        value: "Yoga",
        label: getContentValue(language, "classes.filters.yoga", "Yoga"),
      },
      {
        value: "Pilates",
        label: getContentValue(language, "classes.filters.pilates", "Pilates"),
      },
      {
        value: "Reformer",
        label: getContentValue(
          language,
          "classes.filters.reformer",
          "Reformer",
        ),
      },
    ],
    [getContentValue, language],
  );

  const localizedTypeLabel = (type) => {
    if (type === "Yoga") {
      return getContentValue(language, "classes.filters.yoga", "Yoga");
    }

    if (type === "Pilates") {
      return getContentValue(language, "classes.filters.pilates", "Pilates");
    }

    if (type === "Reformer") {
      return getContentValue(language, "classes.filters.reformer", "Reformer");
    }

    return type;
  };

  // Project bilingual storage onto the current language for display & booking.
  const displayClasses = useMemo(
    () =>
      managedClasses.map((c) => ({
        ...c,
        name: pickLocalized(c.name, language, ""),
        description: pickLocalized(c.description, language, ""),
        level: pickLocalized(c.level, language, ""),
      })),
    [managedClasses, language],
  );

  const filteredClasses =
    selectedType === "All"
      ? displayClasses
      : displayClasses.filter((classItem) => classItem.type === selectedType);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    if (Number.isNaN(date.getTime())) return dateTimeString;
    const options = {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString(language === "ar" ? "ar-EG" : "en-US", options);
  };

  const handleBookNow = (classItem) => {
    requestBooking(() => {
      setSelectedClass(classItem);
      setShowBookingModal(true);
    });
  };

  const handleEditClick = (classId) => {
    const target = managedClasses.find((c) => c.id === classId);
    if (!target) return;
    setEditingClass(target);
    setEditorMode("edit");
  };

  const handleDeleteClick = (classId) => {
    if (window.confirm(adminText.confirmDelete)) {
      deleteClass(classId);
    }
  };

  const handleAddClick = () => {
    const newId = addClass();
    setEditingClass({
      id: newId,
      type: "Yoga",
      instructor: "",
      dateTime: new Date().toISOString().slice(0, 16),
      duration: 60,
      totalSpots: 10,
      availableSpots: 10,
      price: 250,
      image: "",
      images: [],
      name: { en: "New Class", ar: "حصة جديدة" },
      description: { en: "", ar: "" },
      level: { en: "All Levels", ar: "كل المستويات" },
    });
    setEditorMode("add");
  };

  const handleViewDetails = (classItem) => {
    setShowDetails((current) =>
      current === classItem.id ? null : classItem.id,
    );
  };

  const handleEditorSave = (payload) => {
    const { id, ...rest } = payload;
    updateClass(id, rest);
    setEditingClass(null);
  };

  const handleEditorClose = () => {
    setEditingClass(null);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-sage-600 to-sage-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              {labels.headerTitle}
            </h1>
            <AdminEditToggle />
          </div>
          <p className="text-xl opacity-90 mt-6">{labels.headerSubtitle}</p>
        </div>
      </section>

      {/* Admin edit banner + Add New */}
      <AdminEditBar onAdd={handleAddClick} addLabel={adminText.addNew} />

      {/* Filters */}
      <section className="bg-white border-b border-sand-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-sage-800">
              <Filter size={20} />
              <span className="font-medium">{labels.filterLabel}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {classTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedType === type.value
                      ? "bg-sage-600 text-white shadow-md"
                      : "bg-sand-100 text-sage-800 hover:bg-sand-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16 px-4 bg-sand-50">
        <div className="max-w-7xl mx-auto">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sage-600 text-lg">{labels.noClasses}</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              {filteredClasses.map((classItem) => {
                const galleryImages =
                  Array.isArray(classItem.images) && classItem.images.length
                    ? classItem.images
                    : classItem.image
                      ? [classItem.image]
                      : [];
                const isFull = classItem.availableSpots === 0;
                const isAlmostFull =
                  classItem.availableSpots > 0 && classItem.availableSpots <= 3;
                const detailsOpen = showDetails === classItem.id;
                return (
                  <div key={classItem.id}>
                    <div
                      className={`card overflow-hidden relative ${
                        adminMode && editMode ? "ring-2 ring-sage-300" : ""
                      }`}
                    >
                      <AdminCardControls
                        onEdit={() => handleEditClick(classItem.id)}
                        onDelete={() => handleDeleteClick(classItem.id)}
                      />
                      <div className="md:flex">
                        {/* Image / Gallery */}
                        <div className="md:w-2/5">
                          {galleryImages.length > 0 ? (
                            <RetreatGallery
                              images={galleryImages}
                              alt={classItem.name}
                              fit="contain"
                            />
                          ) : (
                            <div className="w-full h-64 md:h-full bg-gradient-to-br from-sage-100 to-sand-100 flex items-center justify-center">
                              <span className="text-sage-500 text-sm">
                                {localizedTypeLabel(classItem.type)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="md:w-3/5 p-8">
                          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                            <h2 className="text-3xl font-serif font-bold text-sage-900">
                              {classItem.name}
                            </h2>
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-sage-600 to-sage-700 text-white text-xs font-semibold rounded-full">
                              {localizedTypeLabel(classItem.type)}
                            </span>
                          </div>
                          <p className="text-sage-700 mb-4">
                            {classItem.instructor}
                          </p>
                          {classItem.description && (
                            <p className="text-sage-800 mb-6 leading-relaxed">
                              {classItem.description}
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center text-sm text-sage-800">
                              <Calendar
                                size={18}
                                className="text-sage-600 mr-2 flex-shrink-0"
                              />
                              <span>{formatDateTime(classItem.dateTime)}</span>
                            </div>
                            <div className="flex items-center text-sm text-sage-800">
                              <Clock
                                size={18}
                                className="text-sage-600 mr-2 flex-shrink-0"
                              />
                              <span>
                                {classItem.duration} {labels.minutes}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-sage-800">
                              <Users
                                size={18}
                                className="text-sage-600 mr-2 flex-shrink-0"
                              />
                              <span>
                                {classItem.availableSpots}/
                                {classItem.totalSpots} {labels.spotsAvailable}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-sage-800">
                              <Award
                                size={18}
                                className="text-sage-600 mr-2 flex-shrink-0"
                              />
                              <span className="inline-block px-3 py-1 bg-sand-100 text-sage-700 text-xs font-medium rounded-full">
                                {classItem.level}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-6 pt-4 border-t border-sand-200">
                            <div>
                              <p className="text-sm text-sage-700">
                                {labels.startingFrom}
                              </p>
                              <p className="text-3xl font-serif font-bold text-sage-700">
                                {Number(classItem.price).toLocaleString(
                                  language === "ar" ? "ar-EG" : "en-US",
                                )}{" "}
                                {labels.currency}
                              </p>
                            </div>
                            {isAlmostFull && (
                              <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                                {labels.almostFull}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleViewDetails(classItem)}
                              className="flex-1 btn-secondary"
                            >
                              {detailsOpen
                                ? labels.hideDetails
                                : labels.viewDetails}
                            </button>
                            <button
                              onClick={() => handleBookNow(classItem)}
                              disabled={isFull || (adminMode && editMode)}
                              className={`flex-1 ${
                                isFull || (adminMode && editMode)
                                  ? "bg-gray-300 text-sage-600 px-8 py-3 rounded-full font-medium cursor-not-allowed"
                                  : "btn-primary"
                              }`}
                            >
                              {isFull ? labels.fullyBooked : labels.bookNow}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {detailsOpen && (
                        <div className="border-t border-sand-200 bg-white">
                          <div className="p-8">
                            <h3 className="text-xl font-serif font-semibold mb-3 text-sage-900">
                              {labels.aboutThisClass}
                            </h3>
                            <p className="text-sage-800 leading-relaxed whitespace-pre-line">
                              {classItem.description || labels.headerSubtitle}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedClass && (
        <BookingModal
          classItem={selectedClass}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedClass(null);
          }}
        />
      )}

      {/* Admin Edit Modal */}
      {adminMode && editingClass && (
        <ClassEditModal
          classItem={editingClass}
          mode={editorMode}
          onSave={handleEditorSave}
          onClose={handleEditorClose}
        />
      )}

      <LoginPromptModal
        open={promptOpen}
        onClose={closePrompt}
        redirectTo={redirectTo}
      />
    </div>
  );
};

export default Classes;
