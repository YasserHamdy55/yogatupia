import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import BookingProgressSteps from "./BookingProgressSteps";
import BookingSummaryCard from "./BookingSummaryCard";
import PhoneInput from "./PhoneInput";
import { useAuth } from "../auth/useAuth";
import { useBookings } from "../bookings/BookingsContext";

const BookingModal = ({ classItem, onClose }) => {
  const stepLabels = ["Details", "Payment", "Confirm"];
  const { currentUser } = useAuth();
  const { createRequest } = useBookings();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: currentUser?.whatsapp || "",
    paymentMethod: "card",
    specialRequests: "",
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
      kind: "class",
      itemId: classItem.id,
      itemName: classItem.name,
      userId: currentUser?.id || null,
      clientName: formData.name,
      whatsapp: formData.phone,
      email: formData.email,
      paymentMethod: formData.paymentMethod,
      specialNotes: formData.specialRequests,
      meta: {
        instructor: classItem.instructor,
        dateTime: classItem.dateTime,
        price: classItem.price,
      },
    });
    setIsSubmitted(true);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-US", options);
  };

  const summaryRows = [
    { label: "Instructor:", value: classItem.instructor },
    { label: "Date & Time:", value: formatDateTime(classItem.dateTime) },
    { label: "Duration:", value: `${classItem.duration} minutes` },
    { label: "Level:", value: classItem.level },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-sand-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-sage-900">
            {isSubmitted ? "Request Received!" : "Book Your Class"}
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

              {/* Class Summary */}
              <BookingSummaryCard
                title={classItem.name}
                rows={summaryRows}
                footer={`Price: ${classItem.price} EGP`}
              />

              {/* Step 1: Personal Details */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      Phone Number *
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(v) => setFormData((d) => ({ ...d, phone: v }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-sage-600 focus:border-transparent"
                      placeholder="Any injuries, health concerns, or special requirements?"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-sage-800 mb-4">
                      Select Payment Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-sage-900">
                            Credit / Debit Card
                          </p>
                          <p className="text-sm text-sage-700">
                            Pay securely online
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={formData.paymentMethod === "cash"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-sage-900">
                            Pay at Studio
                          </p>
                          <p className="text-sm text-sage-700">
                            Cash payment on arrival
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-sand-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === "bank"}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-sage-600"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-sage-900">
                            Bank Transfer
                          </p>
                          <p className="text-sm text-sage-700">
                            Transfer to our account
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 p-4 bg-sand-50 rounded-lg">
                      <p className="text-sm text-sage-700 mb-4">
                        This is a mock payment form. No actual payment will be
                        processed.
                      </p>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-3 border border-sand-300 rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-4 py-3 border border-sand-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-4 py-3 border border-sand-300 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary"
                    >
                      Back
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      Review Booking
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-sand-50 rounded-lg p-6 space-y-3">
                    <h4 className="font-semibold text-sage-900">
                      Booking Summary
                    </h4>
                    <div className="text-sm text-sage-800 space-y-1">
                      <p>
                        <strong>Name:</strong> {formData.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {formData.phone}
                      </p>
                      <p>
                        <strong>Payment:</strong>{" "}
                        {formData.paymentMethod === "card"
                          ? "Card"
                          : formData.paymentMethod === "cash"
                            ? "Pay at Studio"
                            : "Bank Transfer"}
                      </p>
                      {formData.specialRequests && (
                        <p>
                          <strong>Special Requests:</strong>{" "}
                          {formData.specialRequests}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-sage-50 border-2 border-sage-200 rounded-lg p-4">
                    <p className="text-sm text-sage-800 leading-relaxed">
                      By confirming this booking, you agree to our cancellation
                      policy: cancellations must be made at least 12 hours
                      before class time for a full credit.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 btn-primary"
                    >
                      Confirm Booking
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
                Your request has been received
              </h3>
              <p className="text-sage-800 mb-6 leading-relaxed">
                Thanks! Your booking request for{" "}
                <strong>{classItem.name}</strong> is now under review. Our team
                will contact you on WhatsApp at{" "}
                <strong>{formData.phone}</strong> to confirm.
              </p>
              <div className="bg-sand-50 rounded-lg p-6 mb-6 text-left">
                <p className="text-sm text-sage-800 mb-2">
                  <strong>What to bring:</strong> Just wear comfortable clothes
                  you can move in. We provide mats and all equipment.
                </p>
                <p className="text-sm text-sage-800">
                  <strong>Arrival:</strong> Please arrive 10 minutes early for
                  check-in.
                </p>
              </div>
              <button onClick={onClose} className="btn-primary">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
