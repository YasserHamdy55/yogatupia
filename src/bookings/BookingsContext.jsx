import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "../auth/useAuth";
import { BOOKING_STATUSES } from "./bookingStatuses";

const BookingsContext = createContext(null);

const fromDb = (row) => ({
  id: row.id,
  status: row.status,
  kind: row.booking_type,
  itemId: row.item_id,
  itemName: row.item_title,
  itemSubtitle: row.item_subtitle || "",
  userId: row.user_id,
  clientName: row.customer_name,
  email: row.customer_email,
  whatsapp: row.customer_phone,
  specialNotes: row.notes || "",
  scheduledFor: row.scheduled_for,
  price: row.price_amount,
  currency: row.price_currency,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  history: [],
  internalNotes: [],
});

const toDbInsert = (req, userId) => ({
  user_id: userId,
  booking_type: req.kind || "class",
  item_id: String(req.itemId ?? ""),
  item_title: req.itemName || "",
  item_subtitle: req.itemSubtitle || "",
  status: req.status || "pending",
  customer_name: req.clientName || "",
  customer_email: req.email || "",
  customer_phone: req.whatsapp || req.phone || "",
  notes: req.specialNotes || "",
  scheduled_for: req.meta?.dateTime || req.scheduledFor || null,
  price_amount: req.meta?.price ?? req.price ?? null,
  price_currency: req.currency || "EGP",
});

export const BookingsProvider = ({ children }) => {
  const { currentUser, role } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !currentUser) {
      setBookings([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setLoading(false);
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[bookings] load failed", error);
        return;
      }
      setBookings((data || []).map(fromDb));
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser, role]);

  const createRequest = useCallback(
    async (request) => {
      if (!currentUser) {
        throw new Error("You must be signed in to create a booking.");
      }
      const payload = toDbInsert(request, currentUser.id);
      const { data, error } = await supabase
        .from("bookings")
        .insert(payload)
        .select()
        .maybeSingle();
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[bookings] create failed", error);
        throw error;
      }
      const record = fromDb(data);
      setBookings((prev) => [record, ...prev]);
      return record;
    },
    [currentUser],
  );

  const updateStatus = useCallback(async (bookingId, nextStatus) => {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", bookingId)
      .select()
      .maybeSingle();
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[bookings] updateStatus failed", error);
      return;
    }
    if (data) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? fromDb(data) : b)),
      );
    }
  }, []);

  const addInternalNote = useCallback(() => {
    // eslint-disable-next-line no-console
    console.warn("[bookings] addInternalNote not persisted in Phase 1.");
  }, []);

  const getByUser = useCallback(
    (userId) => bookings.filter((b) => b.userId === userId),
    [bookings],
  );

  const value = useMemo(
    () => ({
      bookings,
      loading,
      createRequest,
      updateStatus,
      addInternalNote,
      getByUser,
      BOOKING_STATUSES,
    }),
    [
      bookings,
      loading,
      createRequest,
      updateStatus,
      addInternalNote,
      getByUser,
    ],
  );

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) {
    throw new Error("useBookings must be used within a BookingsProvider");
  }
  return ctx;
};
