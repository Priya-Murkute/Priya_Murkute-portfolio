import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  Object3D,
  PerspectiveCamera,
  Shape,
  ShapeGeometry,
  Vector3,
} from "three";
import { cherryBlossomColor, seededRandom } from "@/lib/cherryBlossom";
import { onPetalRelease } from "@/lib/petalRelease";
import { useTheme } from "@/context/useTheme";

/**
 * Cherry blossom petals drifting down the hero. One InstancedMesh, one
 * useFrame loop. The material is unlit so petal colour doesn't depend on
 * which way each one happens to be rotated relative to a light.
 */
/**
 * Every petal costs a matrix rebuild on the main thread each frame, so the
 * count scales with the device rather than being fixed at the desktop value.
 * A phone shows a narrower slice of the scene anyway, so fewer petals read
 * as much the same density.
 */
function petalCountForViewport(): number {
  const width = typeof window === "undefined" ? 1280 : window.innerWidth;
  if (width < 640) return 55;
  if (width < 1024) return 95;
  return 150;
}

const SPREAD_X = 9;
const SPREAD_Z = 5;
const TOP_Y = 6.5;
const BOTTOM_Y = -6.5;

function petalColor(random: () => number, isDark: boolean) {
  return new Color(cherryBlossomColor(random(), isDark));
}

/**
 * Two sine waves at different speeds, moving every petal together, so it
 * reads as gusting rather than N independent particles.
 */
function gustAt(elapsed: number) {
  return Math.sin(elapsed * 0.15) * 0.9 + Math.sin(elapsed * 0.37 + 1.3) * 0.4;
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

/** Obovate with a notched tip, then cupped by displacing Z after triangulation. */
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

function makePetals(count: number): PetalData[] {
  const random = seededRandom(11);
  return Array.from({ length: count }, () => ({
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

function Petals({ isDark, animate, count }: { isDark: boolean; animate: boolean; count: number }) {
  const meshRef = useRef<InstancedMesh>(null);
  const petals = useMemo(() => makePetals(count), [count]);
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

    const gust = gustAt(elapsed);

    petals.forEach((petal, index) => {
      petal.y -= petal.fallSpeed * step;
      if (petal.y < BOTTOM_Y) petal.y = TOP_Y;

      petal.rotation[0] += petal.spinSpeed[0] * step;
      petal.rotation[1] += petal.spinSpeed[1] * step;
      petal.rotation[2] += petal.spinSpeed[2] * step;

      const sway = Math.sin(petal.y * petal.swaySpeed + petal.swayPhase) * petal.swayAmplitude;
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
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      <meshBasicMaterial toneMapped={false} side={DoubleSide} transparent opacity={0.95} />
    </instancedMesh>
  );
}

/**
 * Petals the hero name lets go of (see useNamePetals). A separate pool, so
 * the ambient loop above is untouched: same geometry, colours, tumble and
 * gust, but each one starts at a point under the cursor and falls once.
 */
const RELEASE_POOL = 64;
/** "Gentle": a quarter faster than the ambient petals' own speed range. */
const RELEASE_SPEED = 1.25;
const FADE_IN_SECONDS = 0.7;
/** Distance above the hero's bottom edge over which a petal shrinks away. */
const FADE_OUT_UNITS = 1.4;

type ReleasedPetal = {
  active: boolean;
  x: number;
  y: number;
  z: number;
  bottomY: number;
  age: number;
  fallSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayPhase: number;
  swayOrigin: number;
  gustOrigin: number;
  spinSpeed: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

function makeReleasePool(): ReleasedPetal[] {
  return Array.from({ length: RELEASE_POOL }, () => ({
    active: false,
    x: 0,
    y: 0,
    z: 0,
    bottomY: 0,
    age: 0,
    fallSpeed: 0,
    swayAmplitude: 0,
    swaySpeed: 0,
    swayPhase: 0,
    swayOrigin: 0,
    gustOrigin: 0,
    spinSpeed: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 0,
  }));
}

function ReleasedPetals({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => createPetalGeometry(), []);
  const dummy = useMemo(() => new Object3D(), []);
  const pool = useMemo(() => makeReleasePool(), []);
  const nextSlot = useRef(0);
  const isDarkRef = useRef(isDark);
  const { camera, gl, clock } = useThree();

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  // Every slot starts hidden, and gets a colour now so the instance-colour
  // attribute exists before the material first compiles.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    const random = seededRandom(7);
    for (let index = 0; index < RELEASE_POOL; index += 1) {
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, petalColor(random, isDarkRef.current));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy]);

  useEffect(
    () =>
      onPetalRelease(({ clientX, clientY }) => {
        const mesh = meshRef.current;
        const rect = gl.domElement.getBoundingClientRect();
        if (!mesh || rect.width === 0 || rect.height === 0) return;

        // Cast a ray from the camera through the screen point to a depth just
        // in front of the scene's middle, so released petals read slightly forward.
        const z = 0.5 + Math.random();
        const through = new Vector3(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -((clientY - rect.top) / rect.height) * 2 + 1,
          0.5,
        ).unproject(camera);
        const direction = through.sub(camera.position).normalize();
        const point = camera.position
          .clone()
          .add(direction.multiplyScalar((z - camera.position.z) / direction.z));
        const fov = camera instanceof PerspectiveCamera ? camera.fov : 45;
        const halfHeight = (camera.position.z - z) * Math.tan((fov * Math.PI) / 360);

        const index = nextSlot.current;
        nextSlot.current = (index + 1) % RELEASE_POOL;
        const petal = pool[index];
        const swaySpeed = 0.3 + Math.random() * 0.6;
        const swayPhase = Math.random() * Math.PI * 2;
        petal.active = true;
        petal.x = point.x;
        petal.y = point.y;
        petal.z = z;
        petal.bottomY = -halfHeight;
        petal.age = 0;
        petal.fallSpeed = (0.32 + Math.random() * 0.72) * RELEASE_SPEED;
        petal.swayAmplitude = 0.2 + Math.random() * 0.4;
        petal.swaySpeed = swaySpeed;
        petal.swayPhase = swayPhase;
        petal.swayOrigin = Math.sin(point.y * swaySpeed + swayPhase);
        petal.gustOrigin = gustAt(clock.elapsedTime);
        petal.spinSpeed = [
          (Math.random() - 0.5) * 0.85,
          (Math.random() - 0.5) * 0.85,
          (Math.random() - 0.5) * 1.25,
        ];
        // Near face-on to begin with, so it reads as a petal as it leaves the letter.
        petal.rotation = [
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 1.6,
          Math.random() * Math.PI * 2,
        ];
        petal.scale = 0.13 + Math.random() * 0.15;

        mesh.setColorAt(index, new Color(cherryBlossomColor(Math.random(), isDarkRef.current)));
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }),
    [camera, gl, clock, pool],
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const step = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const gust = gustAt(elapsed);
    let changed = false;

    pool.forEach((petal, index) => {
      if (!petal.active) return;
      changed = true;
      petal.age += step;
      petal.y -= petal.fallSpeed * step;
      petal.rotation[0] += petal.spinSpeed[0] * step;
      petal.rotation[1] += petal.spinSpeed[1] * step;
      petal.rotation[2] += petal.spinSpeed[2] * step;

      if (petal.y <= petal.bottomY) {
        petal.active = false;
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
        return;
      }

      const sway =
        (Math.sin(petal.y * petal.swaySpeed + petal.swayPhase) - petal.swayOrigin) *
        petal.swayAmplitude;
      const flutter = Math.sin(elapsed * 2.4 + petal.swayPhase) * 0.15;
      // Grows in as it leaves the letter, shrinks away near the bottom edge.
      const fadeIn = Math.min(petal.age / FADE_IN_SECONDS, 1);
      const fadeOut = Math.min((petal.y - petal.bottomY) / FADE_OUT_UNITS, 1);
      const presence = (1 - (1 - fadeIn) ** 3) * fadeOut;

      dummy.position.set(petal.x + sway + (gust - petal.gustOrigin), petal.y, petal.z);
      dummy.rotation.set(
        petal.rotation[0] + flutter,
        petal.rotation[1],
        petal.rotation[2] + flutter * 0.6,
      );
      dummy.scale.setScalar(petal.scale * presence);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    if (changed) mesh.instanceMatrix.needsUpdate = true;
  });

  // Instances move far from the geometry's origin, so skip frustum culling.
  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, RELEASE_POOL]} frustumCulled={false}>
      <meshBasicMaterial toneMapped={false} side={DoubleSide} transparent opacity={0.95} />
    </instancedMesh>
  );
}

function Scene({
  isDark,
  animate,
  count,
}: {
  isDark: boolean;
  animate: boolean;
  count: number;
}) {
  const groupRef = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Nothing to track on a touch device, and the listener would keep the
    // parallax useFrame doing work for a pointer that never moves.
    if (!animate || !window.matchMedia("(pointer: fine)").matches) return;
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
    <>
      <group ref={groupRef}>
        <Petals isDark={isDark} animate={animate} count={count} />
      </group>
      {/* Outside the parallax group, so a petal starts exactly under the cursor. */}
      {animate ? <ReleasedPetals isDark={isDark} /> : null}
    </>
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
  // Read outside the Canvas: r3f is a separate React root that context
  // doesn't reliably bridge into, so isDark is passed down as a plain prop.
  const { isDark } = useTheme();

  // Fixed at mount: re-seeding the whole instanced mesh mid-resize would be a
  // far more visible jolt than a phone keeping its phone-sized petal count
  // after a rotation.
  const [count] = useState(petalCountForViewport);

  // "never" stops r3f rendering entirely, not just useFrame. "demand" still
  // gives the reduced-motion case the one frame it needs to appear.
  const frameloop = !animate ? "demand" : isOnScreen ? "always" : "never";

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop={frameloop}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene isDark={isDark} animate={animate} count={count} />
    </Canvas>
  );
}
