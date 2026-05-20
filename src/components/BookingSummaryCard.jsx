import React from "react";

const BookingSummaryCard = ({ title, rows, footer }) => (
  <div className="bg-sand-50 rounded-xl p-6 mb-8">
    <h3 className="text-xl font-serif font-semibold mb-3">{title}</h3>
    <div className="space-y-2 text-sm text-sage-800">
      {rows.map(({ label, value }, index) => (
        <p key={`${label}-${index}`}>
          <strong>{label}</strong> {value}
        </p>
      ))}
      {footer ? (
        <p className="text-lg font-semibold text-sage-700 mt-4">{footer}</p>
      ) : null}
    </div>
  </div>
);

export default BookingSummaryCard;