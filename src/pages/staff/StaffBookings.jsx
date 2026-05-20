import React, { useMemo, useState } from "react";
import { useBookings } from "../../bookings/BookingsContext";
import { useAuth } from "../../auth/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_ORDER,
  BOOKING_STATUS_LABELS,
} from "../../bookings/bookingStatuses";
import BookingStatusBadge from "../../components/bookings/BookingStatusBadge";

const TEXT = {
  en: {
    title: "Bookings desk",
    subtitle: "Review and respond to incoming booking requests.",
    filter: "Filter by status",
    all: "All",
    empty: "No requests match this filter.",
    client: "Client",
    contact: "WhatsApp",
    item: "Item",
    submitted: "Submitted",
    notes: "Notes",
    actions: "Update status",
    addNote: "Add internal note",
    save: "Save",
    internalNotes: "Internal notes",
  },
  ar: {
    title: "لوحة الحجوزات",
    subtitle: "مراجعة طلبات الحجز الواردة والرد عليها.",
    filter: "تصفية حسب الحالة",
    all: "الكل",
    empty: "لا توجد طلبات بهذه الحالة.",
    client: "العميل",
    contact: "واتساب",
    item: "الفعالية",
    submitted: "تاريخ الطلب",
    notes: "الملاحظات",
    actions: "تحديث الحالة",
    addNote: "إضافة ملاحظة داخلية",
    save: "حفظ",
    internalNotes: "ملاحظات داخلية",
  },
};

const StaffBookings = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { bookings, updateStatus, addInternalNote } = useBookings();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-sand-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-sand-200 p-6 mb-6">
          <h1 className="text-3xl font-serif font-bold text-sage-900 mb-1">
            {t.title}
          </h1>
          <p className="text-sage-700 mb-4">{t.subtitle}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-sage-800">
              {t.filter}:
            </span>
            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              {t.all}
            </FilterButton>
            {BOOKING_STATUS_ORDER.map((s) => (
              <FilterButton
                key={s}
                active={filter === s}
                onClick={() => setFilter(s)}
              >
                {BOOKING_STATUS_LABELS[language]?.[s] ||
                  BOOKING_STATUS_LABELS.en[s]}
              </FilterButton>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sage-700 text-center py-12">{t.empty}</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onUpdateStatus={(next) => updateStatus(b.id, next)}
                onAddNote={(text) =>
                  addInternalNote(b.id, text, currentUser?.id)
                }
                t={t}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      active
        ? "bg-sage-600 text-white border-sage-600"
        : "bg-white text-sage-800 border-sand-200 hover:bg-sand-50"
    }`}
  >
    {children}
  </button>
);

const BookingCard = ({ booking, onUpdateStatus, onAddNote, t, language }) => {
  const [note, setNote] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-sand-200 p-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-sage-900">
            {booking.itemName}
          </h3>
          <p className="text-sm text-sage-600">
            {new Date(booking.createdAt).toLocaleString(
              language === "ar" ? "ar-EG" : "en-US",
            )}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
        <Info label={t.client} value={booking.clientName || "—"} />
        <Info label={t.contact} value={booking.whatsapp || "—"} />
        <Info label={t.item} value={booking.kind} />
      </div>

      {booking.specialNotes && (
        <div className="mt-4 p-3 bg-sand-50 rounded-lg text-sm text-sage-800">
          <strong>{t.notes}:</strong> {booking.specialNotes}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm font-medium text-sage-800 mb-2">{t.actions}</p>
        <div className="flex flex-wrap gap-2">
          {BOOKING_STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => onUpdateStatus(s)}
              disabled={booking.status === s}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                booking.status === s
                  ? "bg-sand-100 text-sage-500 border-sand-200 cursor-not-allowed"
                  : "bg-white text-sage-800 border-sand-200 hover:bg-sand-50"
              }`}
            >
              {BOOKING_STATUS_LABELS[language]?.[s] ||
                BOOKING_STATUS_LABELS.en[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-sand-200 pt-4">
        <p className="text-sm font-medium text-sage-800 mb-2">
          {t.internalNotes}
        </p>
        {(booking.internalNotes || []).length > 0 ? (
          <ul className="space-y-1 mb-3">
            {booking.internalNotes.map((n, i) => (
              <li key={i} className="text-xs text-sage-700">
                <span className="text-sage-500">
                  {new Date(n.at).toLocaleString(
                    language === "ar" ? "ar-EG" : "en-US",
                  )}
                </span>{" "}
                — {n.text}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.addNote}
            className="flex-1 px-3 py-2 border border-sand-300 rounded-lg text-sm"
          />
          <button
            onClick={() => {
              if (!note.trim()) return;
              onAddNote(note.trim());
              setNote("");
            }}
            className="btn-primary text-sm py-2 px-4"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-sage-600 uppercase tracking-wide">{label}</p>
    <p className="font-medium text-sage-900">{value}</p>
  </div>
);

export default StaffBookings;
