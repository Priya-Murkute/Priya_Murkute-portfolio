import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  Object3D,
  Shape,
  ShapeGeometry,
} from "three";
import { cherryBlossomColor, seededRandom } from "@/lib/cherryBlossom";
import { useTheme } from "@/context/ThemeContext";

/**
 * The hero's background: cherry blossom petals drifting down through the
 * scene. One InstancedMesh, one useFrame loop — cheap regardless of petal
 * count since there's a single draw call.
 *
 * The material is unlit (MeshBasicMaterial, toneMapped off). Petals were
 * physically lit at first, but that made their color depend on which way
 * each one happened to be rotated relative to the lights — some read fine,
 * others read muddy/gray. Flat petals don't have that problem, and it also
 * matches the reference: a soft, evenly-colored falling-petals look, not
 * hard 3D shading.
 *
 * Split out of HeroScene.tsx and loaded lazily — three + @react-three/fiber
 * are the single heaviest thing in this project's bundle, so nothing here
 * should be in the initial chunk.
 */
const PETAL_COUNT = 150;
const SPREAD_X = 9;
const SPREAD_Z = 5;
const TOP_Y = 6.5;
const BOTTOM_Y = -6.5;

function petalColor(random: () => number, isDark: boolean) {
  return new Color(cherryBlossomColor(random(), isDark));
}

type PetalData = {
  baseX: number;
  baseZ: number;
  y: number;
  fallSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayPhase: number;
  spinSpeed: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

/**
 * A real sakura petal is obovate — narrow at the base, rounding out wide,
 * with a shallow notch at the outer tip — not a plain teardrop. Built with
 * that notch, then given a gentle cupped curl (real petals aren't flat) by
 * displacing Z after the flat shape is triangulated.
 */
function createPetalGeometry() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.05, 0.22, 0.44, 0.32, 0.46, 0.62);
  shape.bezierCurveTo(0.47, 0.78, 0.32, 0.87, 0.16, 0.83);
  shape.quadraticCurveTo(0.08, 0.9, 0, 0.8);
  shape.quadraticCurveTo(-0.08, 0.9, -0.16, 0.83);
  shape.bezierCurveTo(-0.32, 0.87, -0.47, 0.78, -0.46, 0.62);
  shape.bezierCurveTo(-0.44, 0.32, -0.05, 0.22, 0, 0);

  const geometry = new ShapeGeometry(shape, 12);
  geometry.center();

  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const curl = Math.cos(x * 1.8) * 0.05 * (y + 0.4);
    position.setZ(i, curl);
  }
  position.needsUpdate = true;

  return geometry;
}

function makePetals(): PetalData[] {
  const random = seededRandom(11);
  return Array.from({ length: PETAL_COUNT }, () => ({
    baseX: (random() - 0.5) * SPREAD_X,
    baseZ: (random() - 0.5) * SPREAD_Z,
    y: BOTTOM_Y + random() * (TOP_Y - BOTTOM_Y),
    fallSpeed: 0.32 + random() * 0.72,
    swayAmplitude: 0.6 + random() * 1.6,
    swaySpeed: 0.3 + random() * 0.6,
    swayPhase: random() * Math.PI * 2,
    spinSpeed: [
      (random() - 0.5) * 0.85,
      (random() - 0.5) * 0.85,
      (random() - 0.5) * 1.25,
    ],
    rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI],
    scale: 0.13 + random() * 0.15,
  }));
}

function Petals({ isDark, animate }: { isDark: boolean; animate: boolean }) {
  const meshRef = useRef<InstancedMesh>(null);
  const petals = useMemo(() => makePetals(), []);
  const geometry = useMemo(() => createPetalGeometry(), []);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const random = seededRandom(isDark ? 29 : 13);
    petals.forEach((petal, index) => {
      dummy.position.set(petal.baseX, petal.y, petal.baseZ);
      dummy.rotation.set(...petal.rotation);
      dummy.scale.setScalar(petal.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, petalColor(random, isDark));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petals, isDark]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !animate) return;
    const step = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;

    // A shared breeze on top of each petal's own sway — two sine waves at
    // different speeds so it reads as gusting rather than a metronome, and
    // it moves every petal together so the scene periodically feels like a
    // gust passed through it, not just N independent particles.
    const gust = Math.sin(elapsed * 0.15) * 0.9 + Math.sin(elapsed * 0.37 + 1.3) * 0.4;

    petals.forEach((petal, index) => {
      petal.y -= petal.fallSpeed * step;
      if (petal.y < BOTTOM_Y) petal.y = TOP_Y;

      petal.rotation[0] += petal.spinSpeed[0] * step;
      petal.rotation[1] += petal.spinSpeed[1] * step;
      petal.rotation[2] += petal.spinSpeed[2] * step;

      const sway = Math.sin(petal.y * petal.swaySpeed + petal.swayPhase) * petal.swayAmplitude;
      // A quick flutter layered on the steady tumble, like a petal catching
      // and losing the wind rather than spinning at one constant rate.
      const flutter = Math.sin(elapsed * 2.4 + petal.swayPhase) * 0.15;

      dummy.position.set(petal.baseX + sway + gust, petal.y, petal.baseZ);
      dummy.rotation.set(
        petal.rotation[0] + flutter,
        petal.rotation[1],
        petal.rotation[2] + flutter * 0.6,
      );
      dummy.scale.setScalar(petal.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, PETAL_COUNT]}>
      <meshBasicMaterial toneMapped={false} side={DoubleSide} transparent opacity={0.95} />
    </instancedMesh>
  );
}

function Scene({ isDark, animate }: { isDark: boolean; animate: boolean }) {
  const groupRef = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animate) return;
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [animate]);

  useFrame(() => {
    if (!groupRef.current || !animate) return;
    const targetX = pointer.current.y * 0.08;
    const targetY = pointer.current.x * 0.12;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <Petals isDark={isDark} animate={animate} />
    </group>
  );
}

export default function HeroSceneCanvas({
  animate,
  isOnScreen,
}: {
  animate: boolean;
  /** False once the hero scrolls away — stops the render loop entirely. */
  isOnScreen: boolean;
}) {
  // Petals/Scene below run inside react-three-fiber's own Canvas reconciler,
  // a separate React root that context doesn't reliably bridge into — so
  // isDark is read from context once here, outside the Canvas, and handed
  // down to them as a plain prop instead.
  const { isDark } = useTheme();

  // "never" doesn't just skip useFrame — it stops r3f rendering at all, so an
  // off-screen hero costs nothing instead of running at 60fps for the life of
  // the page. Under reduced motion the scene still needs one frame to appear,
  // which "demand" gives it (r3f renders once on mount and on prop changes).
  const frameloop = !animate ? "demand" : isOnScreen ? "always" : "never";

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop={frameloop}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene isDark={isDark} animate={animate} />
    </Canvas>
  );
}
