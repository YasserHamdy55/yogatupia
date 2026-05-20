import React, { useMemo } from "react";
import { useAuth } from "../../auth/useAuth";
import { useBookings } from "../../bookings/BookingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { BOOKING_STATUSES } from "../../bookings/bookingStatuses";
import ViewAsSwitcher from "../../components/admin/ViewAsSwitcher";
import CreateAdminForm from "../../components/admin/CreateAdminForm";

const TEXT = {
  en: {
    title: "Overview",
    users: "Registered users",
    newRequests: "New requests",
    confirmed: "Confirmed",
    waitlist: "Waitlist",
  },
  ar: {
    title: "نظرة عامة",
    users: "المستخدمون المسجلون",
    newRequests: "الطلبات الجديدة",
    confirmed: "مؤكدة",
    waitlist: "قائمة الانتظار",
  },
};

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-sand-200 p-6">
    <p className="text-sm text-sage-600 mb-1">{label}</p>
    <p className="text-3xl font-serif font-bold text-sage-700">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { users } = useAuth();
  const { bookings } = useBookings();

  const counts = useMemo(() => {
    const c = { new: 0, confirmed: 0, waitlist: 0 };
    bookings.forEach((b) => {
      if (b.status === BOOKING_STATUSES.NEW) c.new += 1;
      if (b.status === BOOKING_STATUSES.CONFIRMED) c.confirmed += 1;
      if (b.status === BOOKING_STATUSES.WAITLIST) c.waitlist += 1;
    });
    return c;
  }, [bookings]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-sage-900">{t.title}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label={t.users} value={users.length} />
        <Stat label={t.newRequests} value={counts.new} />
        <Stat label={t.confirmed} value={counts.confirmed} />
        <Stat label={t.waitlist} value={counts.waitlist} />
      </div>
      <ViewAsSwitcher />
      <CreateAdminForm />
    </div>
  );
};

export default AdminDashboard;
