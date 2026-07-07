"use client";

import { ClipboardCopy, Printer, Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { events, type EventItem } from "@/lib/data";
import { buildMemo, deliverables, objectives, roles, type CaseState } from "@/lib/memo";
import { money } from "@/lib/utils";

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink/55">{label}</span>
      {children}
    </label>
  );
}

export function BusinessCase({
  caseState,
  setCaseState
}: {
  caseState: CaseState;
  setCaseState: (next: CaseState) => void;
}) {
  const [copied, setCopied] = useState(false);
  const caseEvent: EventItem = events.find((event) => event.id === caseState.eventId) ?? events[0];
  const memo = buildMemo(caseState, caseEvent);
  const roi = caseState.cost > 0 ? caseState.pipeline / caseState.cost : 0;
  const hurdleMet = roi >= 3;

  const copyMemo = async () => {
    try {
      await navigator.clipboard.writeText(memo);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section aria-labelledby="case-title" className="scroll-mt-20 bg-cream py-24 md:py-32" id="business-case">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <span className="sr-only" id="case-title">
          The approval memo
        </span>
        <SectionHeading
          index="04"
          kicker="The approval memo"
          lede="Fun still needs a spreadsheet-proof argument. Set the targets, and Boondoggle writes the memo your manager actually wants to read."
          title="Generate the memo that gets the trip approved."
        />

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <form className="grid h-fit gap-4 rounded-[2rem] border border-line bg-paper p-6 shadow-soft md:p-7" onSubmit={(event) => event.preventDefault()}>
            <Field label="Event week">
              <select
                className="input"
                onChange={(event) => setCaseState({ ...caseState, eventId: event.target.value })}
                value={caseState.eventId}
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} — {event.city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Your role">
              <select className="input" onChange={(event) => setCaseState({ ...caseState, role: event.target.value })} value={caseState.role}>
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </Field>
            <Field label="Objective">
              <select
                className="input"
                onChange={(event) => setCaseState({ ...caseState, objective: event.target.value })}
                value={caseState.objective}
              >
                {objectives.map((objective) => (
                  <option key={objective}>{objective}</option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Meetings">
                <input
                  className="input"
                  min={0}
                  onChange={(event) => setCaseState({ ...caseState, meetings: Number(event.target.value) })}
                  type="number"
                  value={caseState.meetings}
                />
              </Field>
              <Field label="Opportunities">
                <input
                  className="input"
                  min={0}
                  onChange={(event) => setCaseState({ ...caseState, opportunities: Number(event.target.value) })}
                  type="number"
                  value={caseState.opportunities}
                />
              </Field>
              <Field label="Trip cost ($)">
                <input
                  className="input"
                  min={0}
                  onChange={(event) => setCaseState({ ...caseState, cost: Number(event.target.value) })}
                  type="number"
                  value={caseState.cost}
                />
              </Field>
              <Field label="Pipeline value ($)">
                <input
                  className="input"
                  min={0}
                  onChange={(event) => setCaseState({ ...caseState, pipeline: Number(event.target.value) })}
                  type="number"
                  value={caseState.pipeline}
                />
              </Field>
            </div>
            <Field label="Required deliverable">
              <select
                className="input"
                onChange={(event) => setCaseState({ ...caseState, deliverable: event.target.value })}
                value={caseState.deliverable}
              >
                {deliverables.map((deliverable) => (
                  <option key={deliverable}>{deliverable}</option>
                ))}
              </select>
            </Field>
            <Field label="Strategic notes">
              <textarea
                className="input min-h-24"
                onChange={(event) => setCaseState({ ...caseState, notes: event.target.value })}
                placeholder="Named accounts, launch context, hiring targets…"
                value={caseState.notes}
              />
            </Field>
          </form>

          <div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Trip cost", money(caseState.cost)],
                ["Pipeline", money(caseState.pipeline)],
                ["Multiple", `${roi.toFixed(1)}x`],
                ["Cost / meeting", money(caseState.meetings ? caseState.cost / caseState.meetings : 0)]
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-line bg-paper p-4" key={label}>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/55">{label}</span>
                  <span className="display mt-1.5 block text-2xl md:text-3xl">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-line bg-paper p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/55">
                  Break-even hurdle — 3.0x pipeline to cost
                </span>
                <span className={`font-mono text-[0.66rem] uppercase tracking-[0.14em] ${hurdleMet ? "text-sea" : "text-flare-deep"}`}>
                  {hurdleMet ? "Hurdle cleared" : "Below hurdle"}
                </span>
              </div>
              <div aria-hidden className="relative mt-3 h-2 overflow-hidden rounded-full bg-line/70">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-swift ${hurdleMet ? "bg-gold" : "bg-flare"}`}
                  style={{ width: `${Math.min((roi / 6) * 100, 100)}%` }}
                />
                <span className="absolute inset-y-0 left-1/2 w-px bg-ink/40" title="3x hurdle" />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[2rem] border border-line bg-paper shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink/60">
                  Approval packet — {caseEvent.city}
                </p>
                <div className="flex gap-2">
                  <Button onClick={copyMemo} type="button" variant="ghost">
                    {copied ? <Check aria-hidden className="size-4 text-sea" /> : <ClipboardCopy aria-hidden className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button onClick={() => window.print()} type="button" variant="ghost">
                    <Printer aria-hidden className="size-4" /> Print
                  </Button>
                </div>
              </div>
              <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap px-6 py-5 font-mono text-[0.8rem] leading-6 text-ink/85" id="approval-memo">
                {memo}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
