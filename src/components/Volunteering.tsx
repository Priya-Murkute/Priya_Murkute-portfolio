import Timeline from "@/components/Timeline";
import { volunteering } from "@/data/resume";

/** Unpaid work, tagged so it never reads as a paid role in the timeline. */
export default function Volunteering() {
  if (volunteering.length === 0) return null;

  return (
    <Timeline
      eyebrow="Volunteering"
      entries={volunteering.map((item) => ({ ...item, badges: [{ label: "Volunteer", tone: "pass" as const }] }))}
    />
  );
}
