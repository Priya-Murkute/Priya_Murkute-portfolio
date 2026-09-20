import Timeline from "@/components/Timeline";
import { experience } from "@/data/resume";

export default function Experience() {
  return (
    <Timeline
      id="experience"
      eyebrow="Experience"
      entries={experience.map(({ honors, ...role }) => ({
        ...role,
        badge: honors ? { label: honors, tone: "flaky" as const } : undefined,
      }))}
    />
  );
}
