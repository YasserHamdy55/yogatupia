import React from "react";

const BookingProgressSteps = ({ step, labels }) => (
  <div className="flex items-center justify-center mb-8">
    {labels.map((label, index) => {
      const stepNumber = index + 1;
      const isActive = step >= stepNumber;
      const isLast = index === labels.length - 1;

      return (
        <React.Fragment key={label}>
          <div
            className={`flex items-center ${isActive ? "text-sage-600" : "text-sage-500"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${isActive ? "bg-sage-600 text-white" : "bg-gray-200"}`}
            >
              {stepNumber}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              {label}
            </span>
          </div>
          {!isLast && (
            <div
              className={`w-16 h-0.5 mx-2 ${step > stepNumber ? "bg-sage-600" : "bg-gray-300"}`}
            ></div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default BookingProgressSteps;