import { getCityGuide, getCosts, getScore, getSignalLabel, sectorProfiles, type EventItem } from "@/lib/data";
import { money } from "@/lib/utils";

export type CaseState = {
  eventId: string;
  role: string;
  objective: string;
  deliverable: string;
  meetings: number;
  opportunities: number;
  cost: number;
  pipeline: number;
  notes: string;
};

export const roles = [
  "Sales / Business Development",
  "Founder / Executive",
  "Marketing / Events",
  "Partnerships",
  "Investor Relations",
  "Product / Strategy"
];

export const objectives = [
  "Meet current customers and expand accounts",
  "Build qualified new pipeline",
  "Evaluate market trends and competitors",
  "Launch or promote a product",
  "Recruit partners, sponsors, or investors"
];

export const deliverables = [
  "Post-event pipeline and meeting report",
  "Market intelligence and competitor brief",
  "Customer expansion plan",
  "Partner or sponsor target list",
  "Product feedback and buyer insight summary"
];

export function buildMemo(caseState: CaseState, event: EventItem) {
  const profile = sectorProfiles[event.segment];
  const city = getCityGuide(event.city);
  const costs = getCosts(event.city);
  const score = getScore(event);
  const roi = caseState.cost > 0 ? (caseState.pipeline / caseState.cost).toFixed(1) : "N/A";
  const breakEven = caseState.cost * 3;
  const dinner = city.picks[0];
  const activity = city.activities[0];

  return `Subject: Business justification to attend ${event.name}

Recommendation
I recommend attending ${event.name} in ${event.city} (${event.dates}) because it is a ${getSignalLabel(score).toLowerCase()} ${event.segmentLabel.toLowerCase()} event with a Boondoggle planning score of ${score}/100. The event aligns with my role in ${caseState.role} and supports the objective to ${caseState.objective.toLowerCase()}.

Why this event matters
${event.why}

Relevant audience
The expected audience includes ${event.audience}. The likely buyer and stakeholder set for this segment includes ${profile.buyer}.

Expected business value
- Expected meetings: ${caseState.meetings}
- Target opportunities: ${caseState.opportunities}
- Estimated pipeline or strategic value: ${money(caseState.pipeline)}
- Estimated trip cost: ${money(caseState.cost)}
- Potential pipeline-to-cost multiple: ${roi}x

Trip plan
- Venue: ${event.venue}
- City booking pressure: ${costs.pressure}
- Typical hotel range: ${costs.hotel}
- Typical client dinner range: ${costs.dinner}
- Recommended client hosting: ${dinner.name} (${dinner.note})
- Recommended relationship activity: ${activity.name} (${activity.note})

Best corporate plays
${event.plays.map((play) => `- ${play}`).join("\n")}

Approval conditions
- Minimum target before final approval: ${caseState.meetings} scheduled meetings or ${caseState.opportunities} named opportunities.
- Break-even hurdle: at least ${money(breakEven)} in qualified pipeline, expansion value, or documented strategic benefit.
- Required post-event artifact: ${caseState.deliverable}.

Risk control
- Meetings should be pre-booked before travel is approved.
- Attendance should be tied to named accounts, customers, partners, or sponsors.
- Client dinners should be capped by attendee value and expected relationship impact.
- A post-event recap should be delivered within five business days.

Additional notes
${caseState.notes || "No additional notes provided yet."}`;
}
