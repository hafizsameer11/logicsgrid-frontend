import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * LogicsGrid core visual: a modular digital structure of interconnected
 * cubes, glowing edges, nodes and illuminated pathways.
 * `assembled` = fully converged form (final CTA).
 */

type ModuleSpec = {
  pos: [number, number, number];
  size: number;
  color: string;
  glass?: boolean;
};

const MODULES: ModuleSpec[] = [
  { pos: [0, 0, 0], size: 1.5, color: "#3a37e2", glass: true },
  { pos: [1.6, 0.4, -0.6], size: 0.8, color: "#5bdbd0" },
  { pos: [-1.5, 0.7, 0.4], size: 0.9, color: "#575dd0", glass: true },
  { pos: [0.6, 1.5, 0.8], size: 0.6, color: "#9aa9f2" },
  { pos: [-0.8, -1.3, -0.8], size: 0.7, color: "#3a37e2" },
  { pos: [1.4, -1.1, 0.9], size: 0.55, color: "#5bdbd0", glass: true },
  { pos: [-1.8, -0.4, -1.2], size: 0.5, color: "#2e2f93" },
  { pos: [0.2, 2.1, -0.9], size: 0.45, color: "#9aa9f2", glass: true },
  { pos: [2.3, 1.1, 0.2], size: 0.4, color: "#413cdf" },
  { pos: [-2.2, 1.4, 1.0], size: 0.38, color: "#5bdbd0" },
];

function Module({ spec, assembled }: { spec: ModuleSpec; assembled: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const scatter = useMemo(
    () =>
      new THREE.Vector3(
        spec.pos[0] * (assembled ? 1 : 2.1),
        spec.pos[1] * (assembled ? 1 : 2.1) + (assembled ? 0 : 0.6),
        spec.pos[2] * (assembled ? 1 : 2.1),
      ),
    [spec, assembled],
  );

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const dt = Math.min(delta, 0.05);
    mesh.current.position.lerp(scatter, 1 - Math.exp(-2.2 * dt));
    mesh.current.rotation.y += dt * 0.15;
    mesh.current.rotation.x += dt * 0.07;
    const t = state.clock.elapsedTime;
    mesh.current.position.y += Math.sin(t * 0.6 + spec.pos[0] * 2) * 0.0012;
  });

  return (
    <mesh ref={mesh} position={scatter.toArray()}>
      <boxGeometry args={[spec.size, spec.size, spec.size]} />
      <meshStandardMaterial
        color={spec.color}
        metalness={0.85}
        roughness={0.25}
        transparent
        opacity={spec.glass ? 0.35 : 0.92}
        emissive={spec.color}
        emissiveIntensity={spec.glass ? 0.25 : 0.12}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(spec.size, spec.size, spec.size)]} />
        <lineBasicMaterial color={spec.color} transparent opacity={0.9} />
      </lineSegments>
    </mesh>
  );
}

function Connections() {
  const lines = useMemo(() => {
    const pairs: [number, number][] = [
      ...MODULES.map((_, i) => [0, i] as [number, number]).slice(1),
      [1, 3],
      [2, 4],
    ];
    return pairs.map(([a, b]) => {
      const ma = MODULES[a]!;
      const mb = MODULES[b]!;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...ma.pos),
        new THREE.Vector3(...mb.pos),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: "#3a37e2",
        transparent: true,
        opacity: 0.28,
      });
      return new THREE.Line(geo, mat);
    });
  }, []);

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

function Nodes({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9aa9f2" size={0.035} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    const { x, y } = state.pointer;
    group.current.rotation.y += dt * 0.08;
    group.current.rotation.x += (y * 0.18 - group.current.rotation.x) * (1 - Math.exp(-3 * dt));
    group.current.rotation.z += (x * 0.08 - group.current.rotation.z) * (1 - Math.exp(-3 * dt));
  });
  return <group ref={group}>{children}</group>;
}

/** `lite` is the phone version: lower pixel ratio, fewer particles, camera pulled back to fit a narrow frame. */
export function GridSystem({
  assembled = false,
  className,
  lite = false,
}: {
  assembled?: boolean;
  className?: string;
  lite?: boolean;
}) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        eventSource={document.body}
        eventPrefix="client"
        dpr={lite ? [1, 1.5] : [1, 1.75]}
        camera={{ position: [0, lite ? 1 : 0.6, lite ? 10.5 : 7.5], fov: 50 }}
        gl={{
          antialias: !lite,
          alpha: true,
          powerPreference: lite ? "low-power" : "high-performance",
        }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={1.4} color="#eef0ff" />
        <pointLight position={[-6, -3, -4]} intensity={12} color="#3a37e2" />
        <pointLight position={[5, -2, 3]} intensity={8} color="#5bdbd0" />
        <Rig>
          {MODULES.map((m, i) => (
            <Module key={i} spec={m} assembled={assembled} />
          ))}
          <Connections />
          <Nodes count={lite ? 110 : 220} />
        </Rig>
      </Canvas>
    </div>
  );
}
