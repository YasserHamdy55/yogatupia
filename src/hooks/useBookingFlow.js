import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

// Centralizes the "guarded booking" decision so Classes/Retreats pages
// don't each re-implement: "if not signed in, prompt; otherwise open modal".
//
// Usage:
//   const { requestBooking, promptOpen, closePrompt, redirectTo } = useBookingFlow();
//   const handleBookNow = (item) => requestBooking(() => openModalFor(item));
export const useBookingFlow = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [promptOpen, setPromptOpen] = useState(false);

  const requestBooking = useCallback(
    (proceed) => {
      if (isAuthenticated) {
        proceed();
        return true;
      }
      setPromptOpen(true);
      return false;
    },
    [isAuthenticated],
  );

  const closePrompt = useCallback(() => setPromptOpen(false), []);

  return {
    requestBooking,
    promptOpen,
    closePrompt,
    redirectTo: location.pathname + location.search,
  };
};
