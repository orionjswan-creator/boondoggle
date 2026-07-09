"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, MapPin, Plus, Star, Ticket, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { events, type EventItem } from "@/lib/data";
import { useTrip } from "@/lib/trip-store";

function formatDay(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", weekday: "short" });
}

function AddScheduleItemForm({ onAdd }: { onAdd: (fields: { title: string; city: string; date: string; time: string; note: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  if (!open) {
    return (
      <button
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-paper/30 py-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/70 transition hover:border-gold hover:text-gold"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Plus aria-hidden className="size-3.5" /> Add to schedule
      </button>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !date) return;
    onAdd({ city: city.trim() || "—", date, note: note.trim(), time, title: title.trim() });
    setTitle("");
    setCity("");
    setTime("");
    setNote("");
    setOpen(false);
  };

  return (
    <form className="grid gap-2.5 rounded-2xl border border-paper/20 bg-paper/5 p-4" onSubmit={submit}>
      <input
        autoFocus
        className="w-full rounded-lg border border-paper/25 bg-transparent px-3 py-2 text-sm text-paper outline-none placeholder:text-paper/40 focus:border-gold"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Flight, check-in, meeting…"
        required
        type="text"
        value={title}
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          className="col-span-1 rounded-lg border border-paper/25 bg-transparent px-2 py-2 text-xs text-paper outline-none focus:border-gold"
          onChange={(event) => setDate(event.target.value)}
          required
          type="date"
          value={date}
        />
        <input
          className="col-span-1 rounded-lg border border-paper/25 bg-transparent px-2 py-2 text-xs text-paper outline-none focus:border-gold"
          onChange={(event) => setTime(event.target.value)}
          type="time"
          value={time}
        />
        <input
          className="col-span-1 rounded-lg border border-paper/25 bg-transparent px-2 py-2 text-xs text-paper outline-none placeholder:text-paper/40 focus:border-gold"
          onChange={(event) => setCity(event.target.value)}
          placeholder="City"
          type="text"
          value={city}
        />
      </div>
      <input
        className="w-full rounded-lg border border-paper/25 bg-transparent px-3 py-2 text-xs text-paper outline-none placeholder:text-paper/40 focus:border-gold"
        onChange={(event) => setNote(event.target.value)}
        placeholder="Note (optional)"
        type="text"
        value={note}
      />
      <div className="flex gap-2">
        <Button className="flex-1 justify-center" type="submit" variant="gold">
          Add
        </Button>
        <Button onClick={() => setOpen(false)} type="button" variant="inverse">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function TripDrawer({ onOpenEvent }: { onOpenEvent: (event: EventItem) => void }) {
  const { bookings, closeDrawer, drawerOpen, removeBooking, removeScheduleItem, savedEventIds, schedule, addScheduleItem, toggleSavedEvent } =
    useTrip();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  const savedEvents = useMemo(
    () => savedEventIds.map((id) => events.find((event) => event.id === id)).filter((event): event is EventItem => Boolean(event)),
    [savedEventIds]
  );

  const scheduleByDay = useMemo(() => {
    const sorted = [...schedule].sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));
    const groups: { day: string; items: typeof sorted }[] = [];
    for (const item of sorted) {
      const existing = groups.find((group) => group.day === item.date);
      if (existing) existing.items.push(item);
      else groups.push({ day: item.date, items: [item] });
    }
    return groups;
  }, [schedule]);

  const isEmpty = savedEvents.length === 0 && schedule.length === 0 && bookings.length === 0;

  return (
    <AnimatePresence>
      {drawerOpen ? (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[75] bg-ink/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeDrawer}
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            animate={{ x: 0 }}
            aria-label="Your trip"
            className="grain fixed inset-y-0 right-0 z-[76] flex w-full max-w-[440px] flex-col overflow-y-auto bg-ink text-paper shadow-lift"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-paper/12 bg-ink/95 px-6 py-5 backdrop-blur">
              <div>
                <p className="kicker text-glow">Your trip</p>
                <h2 className="display mt-1 text-2xl leading-none">The plan so far</h2>
              </div>
              <button
                aria-label="Close trip panel"
                className="grid size-10 place-items-center rounded-full border border-paper/20 text-paper/70 transition hover:border-paper hover:text-paper"
                onClick={closeDrawer}
                type="button"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6">
              {isEmpty ? (
                <div className="grid gap-4 rounded-2xl border border-dashed border-paper/25 px-5 py-10 text-center">
                  <Ticket aria-hidden className="mx-auto size-6 text-paper/40" />
                  <p className="text-sm leading-relaxed text-paper/65">
                    Nothing planned yet. Save an event, request a room, or add a flight to start building your week.
                  </p>
                  <Button
                    className="mx-auto"
                    onClick={() => {
                      closeDrawer();
                      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    type="button"
                    variant="gold"
                  >
                    Browse the event board
                  </Button>
                </div>
              ) : (
                <div className="grid gap-8">
                  {savedEvents.length > 0 ? (
                    <section>
                      <p className="kicker mb-3 text-glow">Saved events — {savedEvents.length}</p>
                      <div className="grid gap-2.5">
                        {savedEvents.map((event) => (
                          <div className="rounded-2xl border border-paper/15 bg-paper/5 p-4" key={event.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="display truncate text-xl leading-tight">{event.name}</h3>
                                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper/55">
                                  {event.city} · {event.dates}
                                </p>
                              </div>
                              <button
                                aria-label={`Remove ${event.name} from trip`}
                                className="grid size-8 shrink-0 place-items-center rounded-full text-gold transition hover:bg-paper/10"
                                onClick={() => toggleSavedEvent(event.id)}
                                type="button"
                              >
                                <Star aria-hidden className="size-4 fill-gold" />
                              </button>
                            </div>
                            <button
                              className="link-swipe mt-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-paper/70 hover:text-paper"
                              onClick={() => {
                                onOpenEvent(event);
                                closeDrawer();
                              }}
                              type="button"
                            >
                              Open intelligence ↗
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  <section>
                    <p className="kicker mb-3 text-glow">Schedule</p>
                    {scheduleByDay.length > 0 ? (
                      <div className="mb-3 grid gap-4">
                        {scheduleByDay.map((group) => (
                          <div key={group.day}>
                            <p className="mb-2 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-gold">
                              <CalendarClock aria-hidden className="size-3.5" /> {formatDay(group.day)}
                            </p>
                            <div className="grid gap-2">
                              {group.items.map((item) => (
                                <div className="flex items-start justify-between gap-3 rounded-xl border border-paper/12 bg-paper/5 px-4 py-3" key={item.id}>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-paper">
                                      {item.time ? <span className="mr-2 font-mono text-xs text-paper/55">{item.time}</span> : null}
                                      {item.title}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-paper/55">
                                      <MapPin aria-hidden className="size-3" /> {item.city}
                                      {item.note ? ` · ${item.note}` : ""}
                                    </p>
                                  </div>
                                  <button
                                    aria-label={`Remove ${item.title}`}
                                    className="grid size-7 shrink-0 place-items-center rounded-full text-paper/45 transition hover:bg-paper/10 hover:text-flare"
                                    onClick={() => removeScheduleItem(item.id)}
                                    type="button"
                                  >
                                    <Trash2 aria-hidden className="size-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <AddScheduleItemForm onAdd={addScheduleItem} />
                  </section>

                  {bookings.length > 0 ? (
                    <section>
                      <p className="kicker mb-3 text-glow">Booking requests — {bookings.length}</p>
                      <div className="grid gap-2.5">
                        {bookings.map((booking) => (
                          <div className="rounded-2xl border border-gold/30 bg-gold/8 p-4" key={booking.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-paper">{booking.label}</p>
                                <p className="mt-1 text-xs text-paper/60">
                                  {booking.city} · {booking.date} · {booking.partySize} guests
                                </p>
                              </div>
                              <button
                                aria-label={`Cancel request for ${booking.label}`}
                                className="grid size-7 shrink-0 place-items-center rounded-full text-paper/45 transition hover:bg-paper/10 hover:text-flare"
                                onClick={() => removeBooking(booking.id)}
                                type="button"
                              >
                                <Trash2 aria-hidden className="size-3.5" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="chip border-gold/40 bg-transparent text-gold">Request sent</span>
                              <span className="font-mono text-[0.6rem] text-paper/45">{booking.reference}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 border-t border-paper/12 bg-ink/95 px-6 py-5 backdrop-blur">
              <Button
                className="w-full justify-center"
                onClick={() => {
                  closeDrawer();
                  document.getElementById("business-case")?.scrollIntoView({ behavior: "smooth" });
                }}
                type="button"
                variant="gold"
              >
                Build the approval memo
              </Button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
