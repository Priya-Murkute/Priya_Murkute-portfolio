import { motion, type Variants } from "framer-motion";
import type { FlowerSpecies } from "../types";

interface FlowerProps {
  species: FlowerSpecies;
  petalFrom: string;
  petalTo: string;
  centerColor: string;
  size?: number;
}

interface Ring {
  count: number;
  widthPct: number;
  heightPct: number;
  reach: number; // how far the petal sits from center, as % translateY
  borderRadius?: string;
  clipPath?: string;
  opacity?: number;
  angleOffset?: number;
}

interface SpeciesDef {
  rings: Ring[];
  centerSizePct: number;
}

// Each species gets its own petal silhouette (shape + count + layering), not
// just a different color — that's what makes them read as different flowers.
const SPECIES: Record<FlowerSpecies, SpeciesDef> = {
  rose: {
    rings: [
      { count: 6, widthPct: 40, heightPct: 46, reach: 24, borderRadius: "62% 62% 45% 45%" },
      { count: 5, widthPct: 26, heightPct: 30, reach: 15, borderRadius: "62% 62% 45% 45%", angleOffset: 34, opacity: 0.97 },
    ],
    centerSizePct: 14,
  },
  tulip: {
    rings: [
      {
        count: 6,
        widthPct: 24,
        heightPct: 52,
        reach: 27,
        clipPath: "polygon(50% 0%, 82% 38%, 64% 100%, 36% 100%, 18% 38%)",
      },
    ],
    centerSizePct: 12,
  },
  daisy: {
    rings: [{ count: 13, widthPct: 10, heightPct: 58, reach: 30, borderRadius: "50%" }],
    centerSizePct: 28,
  },
  sunflower: {
    rings: [
      {
        count: 16,
        widthPct: 14,
        heightPct: 54,
        reach: 28,
        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
      },
    ],
    centerSizePct: 36,
  },
  lotus: {
    rings: [
      { count: 8, widthPct: 42, heightPct: 48, reach: 24, borderRadius: "55% 55% 50% 50%" },
      { count: 8, widthPct: 30, heightPct: 34, reach: 15, borderRadius: "55% 55% 50% 50%", angleOffset: 22.5, opacity: 0.95 },
    ],
    centerSizePct: 14,
  },
  poppy: {
    rings: [
      {
        count: 5,
        widthPct: 52,
        heightPct: 50,
        reach: 25,
        clipPath: "polygon(50% 4%, 72% 16%, 92% 42%, 80% 72%, 58% 96%, 42% 96%, 20% 72%, 8% 42%, 28% 16%)",
      },
    ],
    centerSizePct: 20,
  },
};

const petalVariants: Variants = {
  hidden: { scale: 0.05, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 13 },
  },
};

const centerVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 15 },
  },
};

export default function Flower({ species, petalFrom, petalTo, centerColor, size = 96 }: FlowerProps) {
  const def = SPECIES[species];
  const totalPetals = def.rings.reduce((sum, r) => sum + r.count, 0);
  // Keep total bloom time roughly similar whether a flower has 5 petals or 16.
  const staggerChildren = Math.min(0.06, 0.55 / totalPetals);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren: 0.04 } },
  };

  return (
    <motion.div
      className="flower"
      style={{ width: size, height: size }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {def.rings.map((ring, ringIndex) =>
        Array.from({ length: ring.count }).map((_, i) => {
          const angle = (360 / ring.count) * i + (ring.angleOffset ?? 0);
          return (
            <motion.span
              key={`${ringIndex}-${i}`}
              className="petal"
              variants={petalVariants}
              // See note in project history: transformTemplate keeps the static
              // rotate/translateY placement alongside Framer's animated scale,
              // which otherwise overwrites the whole transform.
              transformTemplate={(_, generated) =>
                `translate(-50%, -50%) rotate(${angle}deg) translateY(-${ring.reach}%) ${generated}`
              }
              style={{
                width: `${ring.widthPct}%`,
                height: `${ring.heightPct}%`,
                borderRadius: ring.borderRadius,
                clipPath: ring.clipPath,
                opacity: ring.opacity ?? 1,
                background: `linear-gradient(to bottom, ${petalFrom}, ${petalTo})`,
              }}
            />
          );
        })
      )}
      <motion.span
        className="flower-center"
        variants={centerVariants}
        transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
        style={{
          width: `${def.centerSizePct}%`,
          height: `${def.centerSizePct}%`,
          background: centerColor,
        }}
      />
    </motion.div>
  );
}
