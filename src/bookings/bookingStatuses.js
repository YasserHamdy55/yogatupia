// Booking request lifecycle. Used by client UI, staff dashboard, and admin.

export const BOOKING_STATUSES = Object.freeze({
  NEW: "new",
  IN_REVIEW: "in_review",
  AWAITING_CLIENT: "awaiting_client",
  AWAITING_PAYMENT: "awaiting_payment",
  CONFIRMED: "confirmed",
  WAITLIST: "waitlist",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
});

export const BOOKING_STATUS_ORDER = [
  BOOKING_STATUSES.NEW,
  BOOKING_STATUSES.IN_REVIEW,
  BOOKING_STATUSES.AWAITING_CLIENT,
  BOOKING_STATUSES.AWAITING_PAYMENT,
  BOOKING_STATUSES.CONFIRMED,
  BOOKING_STATUSES.WAITLIST,
  BOOKING_STATUSES.REJECTED,
  BOOKING_STATUSES.CANCELLED,
  BOOKING_STATUSES.COMPLETED,
];

export const BOOKING_STATUS_LABELS = {
  en: {
    new: "New",
    in_review: "In review",
    awaiting_client: "Awaiting client",
    awaiting_payment: "Awaiting payment",
    confirmed: "Confirmed",
    waitlist: "Waitlist",
    rejected: "Rejected",
    cancelled: "Cancelled",
    completed: "Completed",
  },
  ar: {
    new: "جديد",
    in_review: "قيد المراجعة",
    awaiting_client: "بانتظار رد العميل",
    awaiting_payment: "بانتظار الدفع",
    confirmed: "مؤكد",
    waitlist: "قائمة انتظار",
    rejected: "مرفوض",
    cancelled: "ملغي",
    completed: "مكتمل",
  },
};

export const BOOKING_STATUS_TONES = {
  new: "bg-sage-100 text-sage-800",
  in_review: "bg-amber-100 text-amber-800",
  awaiting_client: "bg-blue-100 text-blue-800",
  awaiting_payment: "bg-orange-100 text-orange-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  waitlist: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
  completed: "bg-slate-200 text-slate-700",
};
