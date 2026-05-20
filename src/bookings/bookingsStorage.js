import { readPersisted, writePersisted } from "../lib/createPersistentStore";

const BOOKINGS_KEY = "heba-bookings-v1";

export const loadBookings = () => readPersisted(BOOKINGS_KEY, []);
export const saveBookings = (bookings) =>
  writePersisted(BOOKINGS_KEY, bookings);
