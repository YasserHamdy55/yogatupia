import React from "react";

// Mock social auth buttons. They do NOT integrate with real OAuth providers
// at this stage; they simply tell the parent which provider was chosen, and
// the parent uses the WhatsApp number as a stable mock account id.
// Replacing this with real OAuth later only requires updating this file.

const ProviderButton = ({ provider, label, onClick, disabled, color }) => (
  <button
    type="button"
    onClick={() => onClick(provider)}
    disabled={disabled}
    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full font-medium border transition-all ${
      disabled
        ? "bg-sand-100 text-sage-500 border-sand-200 cursor-not-allowed"
        : `bg-white border-sand-300 hover:bg-sand-50 ${color}`
    }`}
  >
    <span aria-hidden className="text-lg font-bold">
      {provider === "google" ? "G" : "f"}
    </span>
    <span>{label}</span>
  </button>
);

const SocialAuthButtons = ({ onSelect, disabled, labels }) => {
  return (
    <div className="space-y-3">
      <ProviderButton
        provider="google"
        label={labels?.google || "Continue with Google"}
        onClick={onSelect}
        disabled={disabled}
        color="text-sage-900"
      />
      <ProviderButton
        provider="facebook"
        label={labels?.facebook || "Continue with Facebook"}
        onClick={onSelect}
        disabled={disabled}
        color="text-blue-700"
      />
    </div>
  );
};

export default SocialAuthButtons;
