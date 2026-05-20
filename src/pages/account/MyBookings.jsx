import React from "react";
import { useAuth } from "../../auth/useAuth";
import { useBookings } from "../../bookings/BookingsContext";
import { useLanguage } from "../../context/LanguageContext";
import BookingStatusBadge from "../../components/bookings/BookingStatusBadge";

const TEXT = {
  en: {
    title: "My bookings",
    empty: "You have no booking requests yet.",
    type: "Type",
    item: "Item",
    submitted: "Submitted",
    status: "Status",
    classes: "Class",
    retreat: "Retreat",
  },
  ar: {
    title: "حجوزاتي",
    empty: "لا توجد طلبات حجز بعد.",
    type: "النوع",
    item: "الفعالية",
    submitted: "تاريخ الطلب",
    status: "الحالة",
    classes: "حصة",
    retreat: "رحلة",
  },
};

const MyBookings = () => {
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;
  const { currentUser } = useAuth();
  const { getByUser } = useBookings();
  const list = currentUser ? getByUser(currentUser.id) : [];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-sand-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-sand-200 p-8">
        <h1 className="text-3xl font-serif font-bold text-sage-900 mb-6">
          {t.title}
        </h1>

        {list.length === 0 ? (
          <p className="text-sage-700">{t.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left rtl:text-right text-sage-600 border-b border-sand-200">
                  <th className="py-2 pr-4">{t.type}</th>
                  <th className="py-2 pr-4">{t.item}</th>
                  <th className="py-2 pr-4">{t.submitted}</th>
                  <th className="py-2 pr-4">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((b) => (
                  <tr key={b.id} className="border-b border-sand-100">
                    <td className="py-3 pr-4">
                      {b.kind === "retreat" ? t.retreat : t.classes}
                    </td>
                    <td className="py-3 pr-4 font-medium text-sage-900">
                      {b.itemName}
                    </td>
                    <td className="py-3 pr-4 text-sage-700">
                      {new Date(b.createdAt).toLocaleString(
                        language === "ar" ? "ar-EG" : "en-US",
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
