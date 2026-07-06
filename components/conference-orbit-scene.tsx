"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Points, PointMaterial, Sphere } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { EventItem } from "@/lib/data";

type SceneProps = {
  events: EventItem[];
  selectedId: string;
};

const segmentColor: Record<EventItem["segment"], string> = {
  finance: "#178fbd",
  insurance: "#3f7ee8",
  medical: "#ef3340",
  petrochemical: "#ff6f61",
  power: "#1aa7c8",
  technology: "#43b7de"
};

function seededPoint(index: number) {
  const angle = index * 2.3999632297;
  const band = index % 181;
  const y = 1 - (band / 180) * 2;
  const radius = Math.sqrt(1 - y * y);
  return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
}

function OrbitCore({ events, selectedId }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const selectedIndex = Math.max(0, events.findIndex((event) => event.id === selectedId));

  const stars = useMemo(() => {
    const positions = new Float32Array(140 * 3);
    for (let index = 0; index < 140; index += 1) {
      const point = seededPoint(index + 11).multiplyScalar(3.4 + ((index * 17) % 70) / 70);
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    }
    return positions;
  }, []);

  const nodes = useMemo(() => {
    return events.map((event, index) => {
      const point = seededPoint(index * 19 + 7).multiplyScalar(1.72);
      return { event, point };
    });
  }, [events]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.08 + pointer.x * 0.08;
    group.current.rotation.x = -0.12 + pointer.y * 0.05;
  });

  return (
    <group ref={group}>
      <Points positions={stars} stride={3}>
        <PointMaterial transparent color="#43b7de" size={0.012} sizeAttenuation depthWrite={false} opacity={0.16} />
      </Points>

      <Float speed={0.52} rotationIntensity={0.08} floatIntensity={0.1}>
        <Sphere args={[0.96, 28, 28]}>
          <meshStandardMaterial
            color="#178fbd"
            emissive="#43b7de"
            emissiveIntensity={0.08}
            metalness={0.12}
            roughness={0.7}
            transparent
            opacity={0.055}
            wireframe
          />
        </Sphere>
      </Float>

      {[1.28, 1.78].map((radius, index) => {
        const points = Array.from({ length: 96 }, (_, step) => {
          const angle = (step / 95) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.18, Math.sin(angle) * radius);
        });
        return <Line key={radius} points={points} color={index % 2 ? "#178fbd" : "#ef3340"} transparent opacity={0.14} lineWidth={0.8} />;
      })}

      {nodes.map(({ event, point }, index) => {
        const selected = index === selectedIndex;
        const color = segmentColor[event.segment];
        const nodePoint = point.clone().multiplyScalar(1.13);
        return (
          <group key={event.id} position={nodePoint}>
            <Sphere args={[selected ? 0.062 : 0.036, 18, 18]}>
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 0.42 : 0.18} roughness={0.55} />
            </Sphere>
            <Sphere args={[selected ? 0.13 : 0.08, 18, 18]}>
              <meshBasicMaterial color={color} transparent opacity={selected ? 0.055 : 0.02} depthWrite={false} />
            </Sphere>
            <Line points={[new THREE.Vector3(0, 0, 0), nodePoint.clone().normalize().multiplyScalar(0.26)]} color={color} transparent opacity={0.14} lineWidth={0.7} />
          </group>
        );
      })}
    </group>
  );
}

export function ConferenceOrbitScene(props: SceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0.5, 0.18, 4.8], fov: 34 }} dpr={[1, 1.45]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.72} />
        <directionalLight color="#fff2ce" intensity={1.9} position={[2.5, 2.4, 4]} />
        <pointLight color="#43b7de" intensity={1.4} position={[-2.5, -1.2, 2]} />
        <pointLight color="#ef3340" intensity={1.25} position={[2, 0.4, 2.2]} />
        <OrbitCore {...props} />
      </Canvas>
    </div>
  );
}
