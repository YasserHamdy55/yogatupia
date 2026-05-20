import React, { useMemo, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../auth/useAuth";
import { useBookings } from "../bookings/BookingsContext";
import BookingProgressSteps from "./BookingProgressSteps";
import BookingSummaryCard from "./BookingSummaryCard";
import PhoneInput from "./PhoneInput";

const RetreatBookingModal = ({ retreat, onClose }) => {
  const { language } = useLanguage();
  const { getContentValue } = useContent();
  const { currentUser } = useAuth();
  const { createRequest } = useBookings();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: currentUser?.whatsapp || "",
    roomType: "shared",
    paymentType: "deposit",
    specialNotes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequest({
      kind: "retreat",
      itemId: retreat.id,
      itemName: retreat.title,
      userId: currentUser?.id || null,
      clientName: formData.name,
      whatsapp: formData.phone,
      email: formData.email,
      roomType: formData.roomType,
      paymentType: formData.paymentType,
      specialNotes: formData.specialNotes,
      meta: {
        destination: retreat.destination,
        dateRange: retreat.dateRange,
        price: retreat.price,
      },
    });
    setIsSubmitted(true);
  };

  const depositAmount = 5000;
  const fullPrice = retreat.price;
  const paymentAmount =
    formData.paymentType === "deposit" ? depositAmount : fullPrice;
  const totalWithRoomUpgrade =
    formData.roomType === "private" ? retreat.price + 3000 : retreat.price;

  const labels = useMemo(
    () => ({
      confirmedTitle: getContentValue(
        language,
        "retreats.booking.confirmedTitle",
        "Booking Confirmed!",
      ),
      title: getContentValue(
        language,
        "retreats.booking.title",
        "Book Your Retreat",
      ),
      stepDetails: getContentValue(
        language,
        "retreats.booking.steps.details",
        "Details",
      ),
      stepPayment: getContentValue(
        language,
        "retreats.booking.steps.payment",
        "Payment",
      ),
      stepConfirm: getContentValue(
        language,
        "retreats.booking.steps.confirm",
        "Confirm",
      ),
      summaryDestination: getContentValue(
        language,
        "retreats.booking.summary.destination",
        "Destination:",
      ),
      summaryDate: getContentValue(
        language,
        "retreats.booking.summary.date",
        "Date:",
      ),
      summaryDuration: getContentValue(
        language,
        "retreats.booking.summary.duration",
        "Duration:",
      ),
      summarySpotsLeft: getContentValue(
        language,
        "retreats.booking.summary.spotsLeft",
        "Spots Left:",
      ),
      summaryFullPrice: getContentValue(
        language,
        "retreats.booking.summary.fullPrice",
        "Full Price:",
      ),
      formFullName: getContentValue(
        language,
        "retreats.booking.form.fullName",
        "Full Name *",
      ),
      formFullNamePlaceholder: getContentValue(
        language,
        "retreats.booking.form.fullNamePlaceholder",
        "Enter your full name",
      ),
      formEmail: getContentValue(
        language,
        "retreats.booking.form.email",
        "Email Address *",
      ),
      formEmailPlaceholder: getContentValue(
        language,
        "retreats.booking.form.emailPlaceholder",
        "your.email@example.com",
      ),
      formPhone: getContentValue(
        language,
        "retreats.booking.form.phone",
        "Phone Number *",
      ),
      formPhonePlaceholder: getContentValue(
        language,
        "retreats.booking.form.phonePlaceholder",
        "+20 100 123 4567",
      ),
      formRoomType: getContentValue(
        language,
        "retreats.booking.form.roomType",
        "Preferred Room Type *",
      ),
      formSharedRoom: getContentValue(
        language,
        "retreats.booking.form.sharedRoom",
        "Shared Room",
      ),
      formSharedRoomDescription: getContentValue(
        language,
        "retreats.booking.form.sharedRoomDescription",
        "2-4 guests per room (included in price)",
      ),
      formPrivateRoom: getContentValue(
        language,
        "retreats.booking.form.privateRoom",
        "Private Room",
      ),
      formPrivateRoomDescription: getContentValue(
        language,
        "retreats.booking.form.privateRoomDescription",
        "Single occupancy (+3,000 EGP)",
      ),
      formSpecialNotes: getContentValue(
        language,
        "retreats.booking.form.specialNotes",
        "Special Notes (Optional)",
      ),
      formSpecialNotesPlaceholder: getContentValue(
        language,
        "retreats.booking.form.specialNotesPlaceholder",
        "Dietary restrictions, health concerns, or any questions?",
      ),
      continueToPayment: getContentValue(
        language,
        "retreats.booking.form.continueToPayment",
        "Continue to Payment",
      ),
      paymentOptionLabel: getContentValue(
        language,
        "retreats.booking.payment.optionLabel",
        "Payment Option *",
      ),
      paymentDepositTitle: getContentValue(
        language,
        "retreats.booking.payment.depositTitle",
        "Pay Deposit (Recommended)",
      ),
      paymentDepositDescription: getContentValue(
        language,
        "retreats.booking.payment.depositDescription",
        "5,000 EGP now, remaining balance due 30 days before retreat",
      ),
      paymentFullTitle: getContentValue(
        language,
        "retreats.booking.payment.fullTitle",
        "Pay in Full",
      ),
      paymentFullDescription: getContentValue(
        language,
        "retreats.booking.payment.fullDescription",
        "Complete payment now",
      ),
      paymentSummary: getContentValue(
        language,
        "retreats.booking.payment.paymentSummary",
        "Payment Summary",
      ),
      paymentRetreatPackage: getContentValue(
        language,
        "retreats.booking.payment.retreatPackage",
        "Retreat Package",
      ),
      paymentPrivateRoomUpgrade: getContentValue(
        language,
        "retreats.booking.payment.privateRoomUpgrade",
        "Private Room Upgrade",
      ),
      paymentAmountDueNow: getContentValue(
        language,
        "retreats.booking.payment.amountDueNow",
        "Amount Due Now",
      ),
      paymentCancellationPolicyTitle: getContentValue(
        language,
        "retreats.booking.payment.cancellationPolicyTitle",
        "Cancellation Policy:",
      ),
      paymentCancellationPolicyBody: getContentValue(
        language,
        "retreats.booking.payment.cancellationPolicyBody",
        "Deposits are refundable until 30 days before the retreat start date. After that, deposits are non-refundable but transferable to another retreat or person.",
      ),
      paymentMockNotice: getContentValue(
        language,
        "retreats.booking.payment.mockPaymentNotice",
        "Mock payment form - no actual charges will be made.",
      ),
      paymentCardNumber: getContentValue(
        language,
        "retreats.booking.payment.cardNumber",
        "Card Number",
      ),
      paymentExpiry: getContentValue(
        language,
        "retreats.booking.payment.expiry",
        "MM/YY",
      ),
      paymentCvv: getContentValue(
        language,
        "retreats.booking.payment.cvv",
        "CVV",
      ),
      paymentBack: getContentValue(
        language,
        "retreats.booking.payment.back",
        "Back",
      ),
      paymentReviewBooking: getContentValue(
        language,
        "retreats.booking.payment.reviewBooking",
        "Review Booking",
      ),
      confirmationBookingSummary: getContentValue(
        language,
        "retreats.booking.confirmation.bookingSummary",
        "Booking Summary",
      ),
      confirmationName: getContentValue(
        language,
        "retreats.booking.confirmation.name",
        "Name:",
      ),
      confirmationEmail: getContentValue(
        language,
        "retreats.booking.confirmation.email",
        "Email:",
      ),
      confirmationPhone: getContentValue(
        language,
        "retreats.booking.confirmation.phone",
        "Phone:",
      ),
      confirmationRoomType: getContentValue(
        language,
        "retreats.booking.confirmation.roomType",
        "Room Type:",
      ),
      confirmationPayment: getContentValue(
        language,
        "retreats.booking.confirmation.payment",
        "Payment:",
      ),
      confirmationAmountPaid: getContentValue(
        language,
        "retreats.booking.confirmation.amountPaid",
        "Amount Paid:",
      ),
      confirmationSpecialNotes: getContentValue(
        language,
        "retreats.booking.confirmation.specialNotes",
        "Special Notes:",
      ),
      confirmationDeposit: getContentValue(
        language,
        "retreats.booking.confirmation.deposit",
        "Deposit",
      ),
      confirmationFullPayment: getContentValue(
        language,
        "retreats.booking.confirmation.fullPayment",
        "Full Payment",
      ),
      confirmationConfirmBooking: getContentValue(
        language,
        "retreats.booking.confirmation.confirmBooking",
        "Confirm Booking",
      ),
      successTitle: getContentValue(
        language,
        "retreats.booking.success.title",
        "Your Spot is Reserved!",
      ),
      successBodyBefore: getContentValue(
        language,
        "retreats.booking.success.bodyBefore",
        "Congratulations! You're booked for",
      ),
      successBodyMiddle: getContentValue(
        language,
        "retreats.booking.success.bodyMiddle",
        ". We've sent a confirmation email to",
      ),
      successBodyAfter: getContentValue(
        language,
        "retreats.booking.success.bodyAfter",
        "with your booking details and next steps.",
      ),
      successNextSteps: getContentValue(
        language,
        "retreats.booking.success.nextSteps",
        "What happens next:",
      ),
      successItinerary: getContentValue(
        language,
        "retreats.booking.success.itinerary",
        "You'll receive a detailed itinerary via email within 48 hours",
      ),
      successPacking: getContentValue(
        language,
        "retreats.booking.success.packing",
        "We'll send packing list and preparation tips 2 weeks before the retreat",
      ),
      successRemainingBalance: getContentValue(
        language,
        "retreats.booking.success.remainingBalance",
        "Remaining balance of",
      ),
      successRemainingBalanceAfter: getContentValue(
        language,
        "retreats.booking.success.remainingBalanceAfter",
        "EGP due 30 days before retreat",
      ),
      successContact: getContentValue(
        language,
        "retreats.booking.success.contact",
        "Contact us anytime with questions: hello@hebamindbody.com",
      ),
      successClose: getContentValue(
        language,
        "retreats.booking.success.close",
        "Close",
      ),
    }),
    [getContentValue, language],
  );

  const stepLabels = [
    labels.stepDetails,
    labels.stepPayment,
    labels.stepConfirm,
  ];
  const summaryRows = [
    { label: labels.summaryDestination, value: retreat.destination },
    { label: labels.summaryDate, value: retreat.dateRange },
    { label: labels.summaryDuration, value: retreat.duration },
    {
      label: labels.summarySpotsLeft,
      value: `${retreat.availableSpots} of ${retreat.spots}`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-sand-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-sage-900">
            {isSubmitted ? labels.confirmedTitle : labels.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand-100 rounded-full transition-colors"
          >
            <X size={24} className="text-sage-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <>
              {/* Progress Steps */}
              <BookingProgressSteps step={step} labels={stepLabels} />

              {/* Retreat Summary */}
              <BookingSummaryCard
                title={retreat.title}
                rows={summaryRows}
                footer={`${labels.summaryFullPrice} ${retreat.price.toLocaleString()} EGP`}
              />

              {/* Step 1: Personal Details */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      {labels.formFullName}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={labels.formFullNamePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      {labels.formEmail}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={labels.formEmailPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      {labels.formPhone}
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(v) => setFormData((d) => ({ ...d, phone: v }))}
                      required
                      placeholder={labels.formPhonePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-4">
                      {labels.formRoomType}
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="roomType"
                          value="shared"
                          checked={formData.roomType === "shared"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-sage-900">
                            {labels.formSharedRoom}
                          </p>
                          <p className="text-sm text-sage-700">
                            {labels.formSharedRoomDescription}
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="roomType"
                          value="private"
                          checked={formData.roomType === "private"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-sage-900">
                            {labels.formPrivateRoom}
                          </p>
                          <p className="text-sm text-sage-700">
                            {labels.formPrivateRoomDescription}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      {labels.formSpecialNotes}
                    </label>
                    <textarea
                      name="specialNotes"
                      value={formData.specialNotes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder={labels.formSpecialNotesPlaceholder}
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    {labels.continueToPayment}
                  </button>
                </form>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-4">
                      {labels.paymentOptionLabel}
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentType"
                          value="deposit"
                          checked={formData.paymentType === "deposit"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-sage-900">
                            {labels.paymentDepositTitle}
                          </p>
                          <p className="text-sm text-sage-700">
                            {labels.paymentDepositDescription}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-sage-700">
                          5,000 EGP
                        </p>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentType"
                          value="full"
                          checked={formData.paymentType === "full"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-sage-900">
                            {labels.paymentFullTitle}
                          </p>
                          <p className="text-sm text-sage-700">
                            {labels.paymentFullDescription}
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-sage-700">
                          {totalWithRoomUpgrade.toLocaleString()} EGP
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="bg-sand-50 rounded-lg p-6">
                    <h4 className="font-semibold text-sage-900 mb-4">
                      {labels.paymentSummary}
                    </h4>
                    <div className="space-y-2 text-sm text-sage-800">
                      <div className="flex justify-between">
                        <span>{labels.paymentRetreatPackage}</span>
                        <span>{retreat.price.toLocaleString()} EGP</span>
                      </div>
                      {formData.roomType === "private" && (
                        <div className="flex justify-between">
                          <span>{labels.paymentPrivateRoomUpgrade}</span>
                          <span>+3,000 EGP</span>
                        </div>
                      )}
                      <div className="border-t border-sand-300 pt-2 mt-2 flex justify-between font-semibold text-base">
                        <span>{labels.paymentAmountDueNow}</span>
                        <span className="text-sage-700">
                          {formData.paymentType === "deposit"
                            ? depositAmount.toLocaleString()
                            : totalWithRoomUpgrade.toLocaleString()}{" "}
                          EGP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-sage-50 border-2 border-sage-200 rounded-lg p-4">
                    <p className="text-xs text-sage-800">
                      <strong>{labels.paymentCancellationPolicyTitle}</strong>{" "}
                      {labels.paymentCancellationPolicyBody}
                    </p>
                  </div>

                  <div className="p-4 bg-sand-50 rounded-lg">
                    <p className="text-sm text-sage-700 mb-4">
                      {labels.paymentMockNotice}
                    </p>
                    <input
                      type="text"
                      placeholder={labels.paymentCardNumber}
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg mb-3"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder={labels.paymentExpiry}
                        className="px-4 py-3 border border-sand-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder={labels.paymentCvv}
                        className="px-4 py-3 border border-sand-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary"
                    >
                      {labels.paymentBack}
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      {labels.paymentReviewBooking}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-sand-50 rounded-lg p-6 space-y-3">
                    <h4 className="font-semibold text-sage-900">
                      {labels.confirmationBookingSummary}
                    </h4>
                    <div className="text-sm text-sage-800 space-y-1">
                      <p>
                        <strong>{labels.confirmationName}</strong>{" "}
                        {formData.name}
                      </p>
                      <p>
                        <strong>{labels.confirmationEmail}</strong>{" "}
                        {formData.email}
                      </p>
                      <p>
                        <strong>{labels.confirmationPhone}</strong>{" "}
                        {formData.phone}
                      </p>
                      <p>
                        <strong>{labels.confirmationRoomType}</strong>{" "}
                        {formData.roomType === "private"
                          ? labels.formPrivateRoom
                          : labels.formSharedRoom}
                      </p>
                      <p>
                        <strong>{labels.confirmationPayment}</strong>{" "}
                        {formData.paymentType === "deposit"
                          ? labels.confirmationDeposit
                          : labels.confirmationFullPayment}
                      </p>
                      <p>
                        <strong>{labels.confirmationAmountPaid}</strong>{" "}
                        {paymentAmount.toLocaleString()} EGP
                      </p>
                      {formData.specialNotes && (
                        <p>
                          <strong>{labels.confirmationSpecialNotes}</strong>{" "}
                          {formData.specialNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 btn-secondary"
                    >
                      {labels.paymentBack}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 btn-primary"
                    >
                      {labels.confirmationConfirmBooking}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Success Message
            <div className="text-center py-8">
              <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-4">
                {labels.successTitle}
              </h3>
              <p className="text-sage-800 mb-6 leading-relaxed">
                {labels.successBodyBefore} <strong>{retreat.title}</strong>.
                We've sent a confirmation
                {labels.successBodyMiddle} <strong>{formData.email}</strong>{" "}
                {labels.successBodyAfter}
              </p>
              <div className="bg-sand-50 rounded-lg p-6 mb-6 text-left space-y-3">
                <p className="text-sm text-sage-800">
                  <strong>{labels.successNextSteps}</strong>
                </p>
                <ul className="text-sm text-sage-800 space-y-2 ml-4">
                  <li>• {labels.successItinerary}</li>
                  <li>• {labels.successPacking}</li>
                  {formData.paymentType === "deposit" && (
                    <li>
                      • {labels.successRemainingBalance}{" "}
                      {(totalWithRoomUpgrade - depositAmount).toLocaleString()}{" "}
                      {labels.successRemainingBalanceAfter}
                    </li>
                  )}
                  <li>• {labels.successContact}</li>
                </ul>
              </div>
              <button onClick={onClose} className="btn-primary">
                {labels.successClose}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetreatBookingModal;
