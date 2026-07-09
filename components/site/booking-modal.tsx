"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useTrip, type BookingRequest } from "@/lib/trip-store";

const TIERS = ["Standard", "Premium", "Ultra-premium"];

const KIND_LABEL: Record<string, string> = {
  activity: "Activity",
  dining: "Private dining",
  room: "Private room",
  venue: "Venue"
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingModal() {
  const { bookingDraft, closeBooking, addBooking } = useTrip();
  const [date, setDate] = useState(todayISO());
  const [partySize, setPartySize] = useState(4);
  const [tier, setTier] = useState(TIERS[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<BookingRequest | null>(null);
  const titleId = useId();

  const open = Boolean(bookingDraft);

  useEffect(() => {
    if (!open) return;
    setDate(todayISO());
    setPartySize(4);
    setTier(TIERS[1]);
    setName("");
    setEmail("");
    setNotes("");
    setError("");
    setConfirmed(null);
  }, [open, bookingDraft?.label]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeBooking();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, closeBooking]);

  if (!bookingDraft) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError("Add a name so the concierge team knows who to confirm with.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Add a valid email so we can send the confirmation.");
    setError("");
    const request = addBooking({
      city: bookingDraft.city,
      date,
      email: email.trim(),
      kind: bookingDraft.kind,
      label: bookingDraft.label,
      name: name.trim(),
      notes: notes.trim() || undefined,
      partySize,
      tier
    });
    setConfirmed(request);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80] grid place-items-end bg-ink/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-5"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeBooking();
          }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby={titleId}
            aria-modal="true"
            className="grain relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-t-[2rem] bg-cream p-7 shadow-lift sm:rounded-[2rem] sm:p-8"
            exit={{ opacity: 0, y: 24 }}
            initial={{ opacity: 0, y: 24 }}
            role="dialog"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              aria-label="Close"
              className="absolute right-5 top-5 z-20 grid size-9 place-items-center rounded-full border border-line text-ink/60 transition hover:border-ink hover:text-ink"
              onClick={closeBooking}
              type="button"
            >
              <X aria-hidden className="size-4" />
            </button>

            {confirmed ? (
              <div className="relative z-10 pt-2">
                <div className="grid size-14 place-items-center rounded-full bg-sea/12 text-sea">
                  <Check aria-hidden className="size-6" />
                </div>
                <h2 className="display mt-5 text-3xl leading-tight" id={titleId}>
                  Request sent.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Our concierge team will confirm availability for <strong className="text-ink">{confirmed.label}</strong> in{" "}
                  {confirmed.city} within one business day. A copy goes to {confirmed.email}.
                </p>
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3">
                  <span className="kicker text-ink/50">Reference</span>
                  <span className="font-mono text-sm font-medium text-ink">{confirmed.reference}</span>
                </div>
                <Button className="mt-6 w-full justify-center" onClick={closeBooking} type="button" variant="gold">
                  Done
                </Button>
              </div>
            ) : (
              <form className="relative z-10 grid gap-4" onSubmit={submit}>
                <div className="pr-8">
                  <p className="kicker text-sea">{KIND_LABEL[bookingDraft.kind] ?? "Request"}</p>
                  <h2 className="display mt-2 text-3xl leading-tight" id={titleId}>
                    {bookingDraft.label}
                  </h2>
                  <p className="mt-1 text-sm text-ink/55">{bookingDraft.city}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5">
                    <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">Date</span>
                    <input className="input" onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
                  </label>
                  <label className="grid gap-1.5">
                    <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">Party size</span>
                    <input
                      className="input"
                      min={1}
                      onChange={(event) => setPartySize(Number(event.target.value))}
                      required
                      type="number"
                      value={partySize}
                    />
                  </label>
                </div>

                <label className="grid gap-1.5">
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">Tier</span>
                  <select className="input" onChange={(event) => setTier(event.target.value)} value={tier}>
                    {TIERS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5">
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">Name</span>
                  <input className="input" onChange={(event) => setName(event.target.value)} placeholder="Full name" type="text" value={name} />
                </label>

                <label className="grid gap-1.5">
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">Email</span>
                  <input
                    className="input"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    value={email}
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">Notes (optional)</span>
                  <textarea
                    className="input min-h-20"
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Dietary needs, seating preference, occasion…"
                    value={notes}
                  />
                </label>

                {error ? <p className="text-sm font-medium text-flare-deep">{error}</p> : null}

                <Button className="mt-1 w-full justify-center" type="submit" variant="gold">
                  Send request
                </Button>
                <p className="text-center text-xs text-ink/45">No payment required — this reserves nothing until confirmed.</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
