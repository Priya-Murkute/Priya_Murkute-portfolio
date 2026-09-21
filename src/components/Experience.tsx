import Timeline from "@/components/Timeline";
import { experience } from "@/data/resume";

export default function Experience() {
  return (
    <Timeline
      id="experience"
      eyebrow="Experience"
      entries={experience.map(({ honors, ...role }) => ({
        ...role,
        badges: honors?.map((label) => ({ label, tone: "flaky" as const })),
      }))}
    />
  );
}
