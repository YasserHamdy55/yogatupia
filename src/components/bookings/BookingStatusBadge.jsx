import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONES,
} from "../../bookings/bookingStatuses";

const BookingStatusBadge = ({ status }) => {
  const { language } = useLanguage();
  const label =
    BOOKING_STATUS_LABELS[language]?.[status] ||
    BOOKING_STATUS_LABELS.en[status] ||
    status;
  const tone = BOOKING_STATUS_TONES[status] || "bg-sand-100 text-sage-800";
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${tone}`}
    >
      {label}
    </span>
  );
};

export default BookingStatusBadge;
