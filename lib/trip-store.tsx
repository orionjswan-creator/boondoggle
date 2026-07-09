"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ScheduleItem = {
  id: string;
  title: string;
  city: string;
  date: string; // ISO yyyy-mm-dd, user-entered
  time?: string; // HH:mm, user-entered
  note?: string;
};

export type BookingKind = "room" | "dining" | "activity" | "venue";

export type BookingRequest = {
  id: string;
  kind: BookingKind;
  label: string;
  city: string;
  date: string;
  partySize: number;
  tier: string;
  name: string;
  email: string;
  notes?: string;
  reference: string;
  createdAt: string;
};

export type BookingDraft = {
  kind: BookingKind;
  label: string;
  city: string;
};

type TripState = {
  savedEventIds: string[];
  schedule: ScheduleItem[];
  bookings: BookingRequest[];
};

const STORAGE_KEY = "boondoggle-trip-v1";
const EMPTY_STATE: TripState = { savedEventIds: [], schedule: [], bookings: [] };

function loadState(): TripState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      savedEventIds: Array.isArray(parsed.savedEventIds) ? parsed.savedEventIds : [],
      schedule: Array.isArray(parsed.schedule) ? parsed.schedule : [],
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : []
    };
  } catch {
    return EMPTY_STATE;
  }
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeReference() {
  return `BNDG-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

type TripContextValue = {
  ready: boolean;
  savedEventIds: string[];
  schedule: ScheduleItem[];
  bookings: BookingRequest[];
  totalCount: number;
  isSaved: (eventId: string) => boolean;
  toggleSavedEvent: (eventId: string) => void;
  addScheduleItem: (item: Omit<ScheduleItem, "id">) => void;
  removeScheduleItem: (id: string) => void;
  addBooking: (booking: Omit<BookingRequest, "id" | "reference" | "createdAt">) => BookingRequest;
  removeBooking: (id: string) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  bookingDraft: BookingDraft | null;
  openBooking: (draft: BookingDraft) => void;
  closeBooking: () => void;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TripState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);

  // Load after mount so SSR and first client render both start from EMPTY_STATE (avoids hydration mismatch).
  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode / quota) */
    }
  }, [state, ready]);

  const value = useMemo<TripContextValue>(
    () => ({
      ready,
      savedEventIds: state.savedEventIds,
      schedule: state.schedule,
      bookings: state.bookings,
      totalCount: state.savedEventIds.length + state.schedule.length,
      isSaved: (eventId) => state.savedEventIds.includes(eventId),
      toggleSavedEvent: (eventId) =>
        setState((current) => ({
          ...current,
          savedEventIds: current.savedEventIds.includes(eventId)
            ? current.savedEventIds.filter((id) => id !== eventId)
            : [...current.savedEventIds, eventId]
        })),
      addScheduleItem: (item) =>
        setState((current) => ({ ...current, schedule: [...current.schedule, { ...item, id: makeId() }] })),
      removeScheduleItem: (id) =>
        setState((current) => ({ ...current, schedule: current.schedule.filter((item) => item.id !== id) })),
      addBooking: (booking) => {
        const full: BookingRequest = {
          ...booking,
          createdAt: new Date().toISOString(),
          id: makeId(),
          reference: makeReference()
        };
        setState((current) => ({ ...current, bookings: [full, ...current.bookings] }));
        return full;
      },
      removeBooking: (id) =>
        setState((current) => ({ ...current, bookings: current.bookings.filter((booking) => booking.id !== id) })),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleDrawer: () => setDrawerOpen((open) => !open),
      bookingDraft,
      openBooking: (draft) => setBookingDraft(draft),
      closeBooking: () => setBookingDraft(null)
    }),
    [state, ready, drawerOpen, bookingDraft]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used within a TripProvider");
  return context;
}
