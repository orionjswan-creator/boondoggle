"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, Line, useTexture } from "@react-three/drei";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const regions = [
  {
    accent: "#e23f5b",
    background: "rgba(67, 183, 222, 0.24)",
    city: "London",
    label: "Big Ben / capital rooms",
    model: "big-ben",
    secondary: "#43b7de"
  },
  {
    accent: "#f05a93",
    background: "rgba(240, 90, 147, 0.2)",
    city: "Tokyo",
    label: "Sakura / precision energy",
    model: "sakura",
    secondary: "#59c7e6"
  },
  {
    accent: "#1aa7c8",
    background: "rgba(26, 167, 200, 0.24)",
    city: "Hawaii",
    label: "Waves / executive memory",
    model: "waves",
    secondary: "#ff6f61"
  },
  {
    accent: "#ef3340",
    background: "rgba(239, 51, 64, 0.18)",
    city: "Las Vegas",
    label: "Racing / deal velocity",
    model: "race",
    secondary: "#4bbfe6"
  },
  {
    accent: "#3f7ee8",
    background: "rgba(63, 126, 232, 0.18)",
    city: "Paris",
    label: "Jet / aerospace hospitality",
    model: "jet",
    secondary: "#ff5266"
  }
] as const;

type Region = (typeof regions)[number];
type Segment = THREE.Vector3[];

const cutoutPaths = [
  "/assets/cutouts/big-ben.png",
  "/assets/cutouts/sakura.png",
  "/assets/cutouts/wave.png",
  "/assets/cutouts/race-car.png",
  "/assets/cutouts/jet.png"
];

const cutoutSizes = [
  [0.82, 2.08],
  [1.7, 0.92],
  [1.75, 1.08],
  [1.75, 0.9],
  [1.9, 0.82]
] as const;

function RouteArc({ color, offset = 0 }: { color: string; offset?: number }) {
  const points = useMemo(() => {
    return Array.from({ length: 64 }, (_, index) => {
      const t = index / 63;
      const angle = -1.75 + t * 3.5 + offset;
      const height = Math.sin(t * Math.PI) * (0.42 + Math.abs(Math.sin(offset)) * 0.16);
      return new THREE.Vector3(Math.cos(angle) * 1.16, height, Math.sin(angle) * 1.16);
    });
  }, [offset]);

  return <Line color={color} lineWidth={1.35} opacity={0.62} points={points} transparent />;
}

const cityNodes = [
  [-0.42, 0.44, 0.72],
  [0.1, 0.32, 0.86],
  [0.48, 0.02, 0.72],
  [-0.18, -0.22, 0.92],
  [0.3, -0.42, 0.72]
] as const;

function GlobalCore({ region }: { region: Region }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.22;
    group.current.rotation.x = -0.18 + Math.sin(clock.elapsedTime * 0.34) * 0.04;
  });

  return (
    <group ref={group} position={[1.12, -0.2, -1.2]} scale={0.8}>
      <mesh>
        <sphereGeometry args={[1, 56, 56]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.2} opacity={0.11} roughness={0.38} transparent wireframe />
      </mesh>
      {[0, Math.PI / 5, -Math.PI / 5, Math.PI / 2].map((rotation, index) => (
        <mesh key={rotation} rotation={[Math.PI / 2, rotation, index * 0.18]}>
          <torusGeometry args={[1.08 + index * 0.04, 0.005, 8, 128]} />
          <meshBasicMaterial color={index % 2 ? region.secondary : region.accent} opacity={0.34} transparent />
        </mesh>
      ))}
      {[-0.5, -0.22, 0.22, 0.5].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(1 - y * y), 0.0045, 8, 96]} />
          <meshBasicMaterial color="#ffffff" opacity={0.22} transparent />
        </mesh>
      ))}
      <RouteArc color={region.accent} offset={0} />
      <RouteArc color={region.secondary} offset={0.9} />
      <RouteArc color="#ffffff" offset={1.8} />
      {cityNodes.map(([x, y, z], index) => (
        <group key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.045, 18, 12]} />
            <meshStandardMaterial color={index % 2 ? region.secondary : region.accent} emissive={index % 2 ? region.secondary : region.accent} emissiveIntensity={0.9} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.11, 18, 12]} />
            <meshBasicMaterial color={index % 2 ? region.secondary : region.accent} opacity={0.16} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Tube({ color, points, radius = 0.025 }: { color: string; points: THREE.Vector3[]; radius?: number }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 52, radius, 10, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.35} />
    </mesh>
  );
}

function TexturePlanes({ index, region }: { index: number; region: Region }) {
  const atlas = useTexture("/assets/destination-texture-atlas.png");
  const maps = useMemo(() => {
    return [0, 1, 2, 3, 4].map((panel) => {
      const texture = atlas.clone();
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(0.2, 1);
      texture.offset.set(panel * 0.2, 0);
      texture.needsUpdate = true;
      return texture;
    });
  }, [atlas]);

  const active = maps[index % maps.length];
  const previous = maps[(index + maps.length - 1) % maps.length];
  const next = maps[(index + 1) % maps.length];

  return (
    <group position={[0, -0.04, -1.55]}>
      <mesh position={[0, 0, 0]} rotation={[0, -0.1, 0]}>
        <planeGeometry args={[2.95, 2.05]} />
        <meshBasicMaterial color="#ffffff" map={active} opacity={0.52} transparent />
      </mesh>
      <mesh position={[-1.28, -0.16, -0.18]} rotation={[0, 0.34, 0.04]}>
        <planeGeometry args={[0.92, 1.38]} />
        <meshBasicMaterial color="#ffffff" map={previous} opacity={0.26} transparent />
      </mesh>
      <mesh position={[1.34, 0.16, -0.2]} rotation={[0, -0.36, -0.04]}>
        <planeGeometry args={[0.98, 1.48]} />
        <meshBasicMaterial color="#ffffff" map={next} opacity={0.28} transparent />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[3.08, 2.18]} />
        <meshBasicMaterial color={region.secondary} opacity={0.08} transparent />
      </mesh>
    </group>
  );
}

function CutoutBillboards({ index, region }: { index: number; region: Region }) {
  const group = useRef<THREE.Group>(null);
  const activeMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const previousMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const textures = useTexture(cutoutPaths);
  const activeIndex = index % textures.length;
  const nextIndex = (activeIndex + 1) % textures.length;
  const sideIndex = (activeIndex + textures.length - 1) % textures.length;
  const lastIndex = useRef(activeIndex);
  const transition = useRef(1);
  const [previousIndex, setPreviousIndex] = useState(activeIndex);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });
  }, [textures]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    transition.current = Math.min(1, transition.current + 0.035);
    const eased = 1 - Math.pow(1 - transition.current, 3);
    if (activeMaterial.current) activeMaterial.current.opacity = eased;
    if (previousMaterial.current) previousMaterial.current.opacity = Math.max(0, 1 - eased);
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.72) * 0.24 + pointer.x * 0.05;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.48) * 0.045 + pointer.y * 0.035;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.035;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.35) * 0.018;
    group.current.scale.setScalar(0.96 + eased * 0.08 + (1 - eased) * 0.1 + pulse * 0.02);
  });

  useEffect(() => {
    if (lastIndex.current === activeIndex) return;
    setPreviousIndex(lastIndex.current);
    lastIndex.current = activeIndex;
    transition.current = 0;
  }, [activeIndex]);

  const [width, height] = cutoutSizes[activeIndex];
  const [previousWidth, previousHeight] = cutoutSizes[previousIndex];

  return (
    <group ref={group} position={[-0.42, 0.08, 0.56]}>
      <mesh position={[-0.04, 0.02, -0.01]} rotation={[0, -0.08, 0]}>
        <planeGeometry args={[previousWidth, previousHeight]} />
        <meshBasicMaterial ref={previousMaterial} alphaTest={0.035} color="#ffffff" depthWrite={false} map={textures[previousIndex]} opacity={0} transparent />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial ref={activeMaterial} alphaTest={0.035} color="#ffffff" depthWrite={false} map={textures[activeIndex]} transparent />
      </mesh>
      <mesh position={[0.04, -0.03, -0.04]} scale={[1.08, 1.08, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial alphaTest={0.035} color={region.secondary} depthWrite={false} map={textures[activeIndex]} opacity={0.16} transparent />
      </mesh>
      <mesh position={[-1.42, -0.24, -0.18]} rotation={[0, 0.38, -0.04]} scale={0.42}>
        <planeGeometry args={cutoutSizes[sideIndex]} />
        <meshBasicMaterial alphaTest={0.04} color="#ffffff" depthWrite={false} map={textures[sideIndex]} opacity={0.32} transparent />
      </mesh>
      <mesh position={[1.22, 0.22, -0.22]} rotation={[0, -0.34, 0.04]} scale={0.42}>
        <planeGeometry args={cutoutSizes[nextIndex]} />
        <meshBasicMaterial alphaTest={0.04} color="#ffffff" depthWrite={false} map={textures[nextIndex]} opacity={0.34} transparent />
      </mesh>
      <Line
        color={region.accent}
        lineWidth={1.5}
        opacity={0.55}
        points={[
          new THREE.Vector3(-width / 2, -height / 2, 0.02),
          new THREE.Vector3(width / 2, -height / 2, 0.02),
          new THREE.Vector3(width / 2, height / 2, 0.02),
          new THREE.Vector3(-width / 2, height / 2, 0.02),
          new THREE.Vector3(-width / 2, -height / 2, 0.02)
        ]}
        transparent
      />
    </group>
  );
}

function p(x: number, y: number, z = 0) {
  return new THREE.Vector3((x - 40) / 27, (35 - y) / 27, z);
}

function circle(cx: number, cy: number, radius: number, steps = 42, z = 0) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = (index / steps) * Math.PI * 2;
    return p(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, z);
  });
}

function ellipse(cx: number, cy: number, rx: number, ry: number, rotation = 0, steps = 44) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = (index / steps) * Math.PI * 2;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    return p(cx + x * Math.cos(rotation) - y * Math.sin(rotation), cy + x * Math.sin(rotation) + y * Math.cos(rotation), 0);
  });
}

function getSegments(model: Region["model"]) {
  if (model === "big-ben") {
    return [
      [p(34, 58), p(34, 21), p(40, 9), p(46, 21), p(46, 58), p(34, 58)],
      [p(28, 22), p(52, 22)],
      [p(32, 58), p(48, 58)],
      [p(35, 30), p(45, 30)],
      [p(35, 38), p(45, 38)],
      [p(35, 46), p(45, 46)],
      circle(40, 25, 4.5, 34),
      [p(40, 14), p(40, 4)],
      [p(20, 58), p(60, 58)]
    ];
  }

  if (model === "sakura") {
    const petals = [0, 1, 2, 3, 4].map((index) => ellipse(40, 34, 6, 16, index * 1.256));
    return [
      [p(12, 56), p(25, 44), p(38, 34), p(55, 24), p(70, 12)],
      [p(28, 42), p(34, 30)],
      [p(50, 26), p(60, 20)],
      circle(40, 34, 3.2, 24),
      ...petals
    ];
  }

  if (model === "waves") {
    const waveOne = Array.from({ length: 72 }, (_, index) => {
      const x = 6 + index * 0.95;
      return p(x, 42 + Math.sin(index / 7) * 5);
    });
    const waveTwo = Array.from({ length: 72 }, (_, index) => {
      const x = 9 + index * 0.9;
      return p(x, 52 + Math.sin(index / 6 + 1.2) * 3.8);
    });
    return [
      waveOne,
      waveTwo,
      [p(24, 41), p(30, 25), p(44, 18), p(58, 27), p(55, 43), p(42, 36), p(31, 42)],
      [p(44, 18), p(50, 32), p(41, 43)]
    ];
  }

  if (model === "race") {
    return [
      [p(8, 43), p(22, 29), p(36, 19), p(51, 22), p(62, 31), p(73, 34), p(65, 43), p(8, 43)],
      [p(24, 29), p(51, 29)],
      [p(4, 34), p(18, 34)],
      [p(2, 26), p(23, 26)],
      circle(24, 46, 7, 34),
      circle(61, 46, 7, 34),
      circle(24, 46, 2, 20),
      circle(61, 46, 2, 20)
    ];
  }

  return [
    [p(7, 42), p(72, 16), p(46, 43), p(51, 63), p(39, 67), p(31, 49), p(14, 58), p(7, 51), p(24, 41), p(10, 31), p(22, 26), p(43, 36), p(72, 16)],
    [p(18, 48), p(40, 55), p(55, 66)],
    [p(43, 36), p(63, 45)],
    [p(56, 23), p(70, 31)]
  ];
}

function WireModel({ region }: { region: Region }) {
  const group = useRef<THREE.Group>(null);
  const segments = useMemo(() => getSegments(region.model), [region.model]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.65) * 0.42 + pointer.x * 0.08;
    group.current.rotation.x = -0.08 + Math.sin(clock.elapsedTime * 0.38) * 0.08 + pointer.y * 0.04;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.28) * 0.03;
  });

  return (
    <group ref={group} scale={1.55}>
      <Float floatIntensity={0.12} rotationIntensity={0.08} speed={0.9}>
        <DestinationMesh region={region} />
      </Float>
      {segments.map((segment, index) => (
        <Line
          color={index % 3 === 0 ? region.accent : region.secondary}
          key={`${region.model}-${index}`}
          lineWidth={index % 3 === 0 ? 2.1 : 1.45}
          points={segment}
          transparent
          opacity={index % 3 === 0 ? 0.98 : 0.78}
        />
      ))}
      {segments.slice(0, 5).map((segment, index) => (
        <Line
          color="#ffffff"
          key={`${region.model}-shine-${index}`}
          lineWidth={0.8}
          points={segment.map((point) => point.clone().add(new THREE.Vector3(0.03, 0.03, -0.08)))}
          transparent
          opacity={0.44}
        />
      ))}
    </group>
  );
}

function BigBenMesh({ region }: { region: Region }) {
  const tiers = [
    { position: [0, -0.72, 0] as [number, number, number], scale: [0.78, 0.34, 0.42] as [number, number, number] },
    { position: [0, -0.2, 0] as [number, number, number], scale: [0.58, 0.92, 0.34] as [number, number, number] },
    { position: [0, 0.44, 0] as [number, number, number], scale: [0.72, 0.34, 0.42] as [number, number, number] }
  ];

  return (
    <group position={[0, -0.1, -0.08]}>
      {tiers.map((tier) => (
        <mesh key={tier.position.join("-")} position={tier.position}>
          <boxGeometry args={tier.scale} />
          <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.12} opacity={0.26} roughness={0.28} transparent />
          <Edges color={region.accent} threshold={15} />
        </mesh>
      ))}
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, -0.2, 0.2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.55, 12]} />
          <meshStandardMaterial color="#ffffff" emissive={region.secondary} emissiveIntensity={0.25} opacity={0.5} transparent />
        </mesh>
      ))}
      <mesh position={[0, 0.78, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.36, 0.36, 0.36]} />
        <meshStandardMaterial color={region.accent} emissive={region.accent} emissiveIntensity={0.34} opacity={0.38} transparent />
        <Edges color="#ffffff" threshold={15} />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <coneGeometry args={[0.24, 0.5, 4]} />
        <meshStandardMaterial color={region.accent} emissive={region.accent} emissiveIntensity={0.32} opacity={0.44} transparent />
        <Edges color={region.accent} threshold={12} />
      </mesh>
      <mesh position={[0, 0.57, 0.18]}>
        <torusGeometry args={[0.2, 0.012, 10, 36]} />
        <meshBasicMaterial color="#ffffff" opacity={0.76} transparent />
      </mesh>
      <Line color="#ffffff" lineWidth={1.1} points={[new THREE.Vector3(0, 0.57, 0.2), new THREE.Vector3(0, 0.66, 0.2), new THREE.Vector3(0.09, 0.57, 0.2)]} transparent opacity={0.82} />
    </group>
  );
}

function SakuraMesh({ region }: { region: Region }) {
  const branch = useMemo(
    () => [new THREE.Vector3(-1.18, -0.7, -0.1), new THREE.Vector3(-0.58, -0.2, 0), new THREE.Vector3(0.08, 0.18, 0.08), new THREE.Vector3(0.92, 0.62, 0)],
    []
  );

  return (
    <group position={[0, 0, -0.06]}>
      <Tube color={region.secondary} points={branch} radius={0.035} />
      {[
        [0, 0, 1],
        [0.58, 0.32, 0.68],
        [-0.48, -0.04, 0.58]
      ].map(([x, y, scale]) => (
        <group key={`${x}-${y}`} position={[x, y, 0]} scale={scale}>
          {[0, 1, 2, 3, 4].map((item) => (
            <mesh key={`petal-${item}`} position={[Math.sin(item * 1.256) * 0.28, Math.cos(item * 1.256) * 0.28, 0]} rotation={[0.52, 0.12, -item * 1.256]} scale={[0.58, 1.38, 0.13]}>
              <sphereGeometry args={[0.22, 32, 16]} />
              <meshStandardMaterial color={region.accent} emissive={region.accent} emissiveIntensity={0.34} opacity={0.58} transparent />
              <Edges color="#ffffff" threshold={18} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.09, 24, 12]} />
            <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
      <mesh>
        <sphereGeometry args={[0.08, 24, 12]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function WavesMesh({ region }: { region: Region }) {
  const waveA = useMemo(() => Array.from({ length: 7 }, (_, i) => new THREE.Vector3(-1.25 + i * 0.42, Math.sin(i * 0.9) * 0.24, Math.cos(i * 0.72) * 0.08)), []);
  const waveB = useMemo(() => Array.from({ length: 7 }, (_, i) => new THREE.Vector3(-1.15 + i * 0.4, -0.34 + Math.sin(i * 0.85 + 1) * 0.18, Math.cos(i * 0.5) * 0.05)), []);
  return (
    <group rotation={[0.16, -0.18, 0]}>
      <Tube color={region.secondary} points={waveA} radius={0.036} />
      <Tube color={region.accent} points={waveB} radius={0.03} />
      <Tube color="#ffffff" points={waveA.map((point) => point.clone().add(new THREE.Vector3(0, 0.11, 0.04)))} radius={0.012} />
      {waveA.filter((_, index) => index % 2 === 0).map((point, index) => (
        <mesh key={index} position={[point.x, point.y + 0.12, point.z + 0.08]}>
          <sphereGeometry args={[0.035, 14, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.54} transparent />
        </mesh>
      ))}
      <mesh position={[0.2, 0.1, -0.1]} rotation={[0, 0, -0.38]}>
        <torusGeometry args={[0.62, 0.028, 10, 96, Math.PI * 1.34]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function RaceMesh({ region }: { region: Region }) {
  return (
    <group position={[0, -0.1, 0]} rotation={[0.08, -0.16, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.52, 0.34, 0.42]} />
        <meshStandardMaterial color={region.accent} emissive={region.accent} emissiveIntensity={0.18} opacity={0.45} transparent />
        <Edges color="#ffffff" threshold={18} />
      </mesh>
      <mesh position={[-0.2, 0.27, 0]}>
        <boxGeometry args={[0.64, 0.32, 0.38]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.22} opacity={0.36} transparent />
        <Edges color={region.secondary} threshold={18} />
      </mesh>
      <mesh position={[0.66, 0.18, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.38, 0.08, 0.6]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.34} opacity={0.5} transparent />
      </mesh>
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, -0.24, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.19, 0.04, 14, 36]} />
          <meshStandardMaterial color="#17202a" emissive={region.secondary} emissiveIntensity={0.12} />
        </mesh>
      ))}
      <Tube color={region.secondary} points={[new THREE.Vector3(-1.55, 0.08, -0.18), new THREE.Vector3(-1.04, 0.04, -0.1), new THREE.Vector3(-0.56, 0.03, 0)]} radius={0.014} />
      <Tube color={region.accent} points={[new THREE.Vector3(-1.48, -0.12, 0.16), new THREE.Vector3(-1, -0.08, 0.1), new THREE.Vector3(-0.54, -0.04, 0.02)]} radius={0.01} />
    </group>
  );
}

function JetMesh({ region }: { region: Region }) {
  return (
    <group rotation={[0.08, -0.72, -0.22]} position={[0, 0.02, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1.8]}>
        <coneGeometry args={[0.18, 1.58, 28]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.22} opacity={0.55} transparent />
        <Edges color="#ffffff" threshold={14} />
      </mesh>
      <mesh position={[0, -0.02, 0]} scale={[1.25, 0.06, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={region.accent} emissive={region.accent} emissiveIntensity={0.22} opacity={0.48} transparent />
        <Edges color={region.accent} threshold={14} />
      </mesh>
      <mesh position={[-0.55, 0, 0]} scale={[0.4, 0.05, 0.42]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={region.accent} emissive={region.accent} emissiveIntensity={0.18} opacity={0.44} transparent />
      </mesh>
      <mesh position={[-0.82, -0.03, 0.16]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.018, 10, 28]} />
        <meshStandardMaterial color={region.secondary} emissive={region.secondary} emissiveIntensity={0.28} opacity={0.72} transparent />
      </mesh>
      <Tube color="#ffffff" points={[new THREE.Vector3(-1.25, -0.18, -0.16), new THREE.Vector3(-1.62, -0.3, -0.28), new THREE.Vector3(-1.94, -0.38, -0.35)]} radius={0.012} />
      <Tube color={region.accent} points={[new THREE.Vector3(-1.18, 0.08, 0.14), new THREE.Vector3(-1.54, 0.18, 0.26), new THREE.Vector3(-1.86, 0.24, 0.35)]} radius={0.01} />
    </group>
  );
}

function DestinationMesh({ region }: { region: Region }) {
  if (region.model === "big-ben") return <BigBenMesh region={region} />;
  if (region.model === "sakura") return <SakuraMesh region={region} />;
  if (region.model === "waves") return <WavesMesh region={region} />;
  if (region.model === "race") return <RaceMesh region={region} />;
  return <JetMesh region={region} />;
}

export function RegionWireScene() {
  const [index, setIndex] = useState(0);
  const region = regions[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % regions.length), 4300);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ backgroundColor: region.background }}
        className="absolute right-0 top-0 h-full w-[70%] blur-3xl"
        transition={{ duration: 0.9 }}
      />
      <div className="absolute right-[2%] top-[9%] z-[2] h-[520px] w-[620px] md:right-[5%] lg:right-[29%] lg:top-[10%] xl:right-[31%]">
        <Canvas camera={{ position: [0, 0, 4.15], fov: 38 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={1.18} />
          <pointLight color={region.secondary} intensity={3.8} position={[-2.5, 2.4, 3]} />
          <pointLight color={region.accent} intensity={4.2} position={[2.5, -1.4, 2.4]} />
          <TexturePlanes index={index} region={region} />
          <GlobalCore region={region} />
          <CutoutBillboards index={index} region={region} />
        </Canvas>
      </div>
      <motion.div
        animate={{ borderColor: region.accent, color: region.accent }}
        className="absolute bottom-12 right-8 z-[3] hidden rounded-full border bg-white/82 px-4 py-3 text-xs font-black uppercase shadow-[0_16px_40px_rgba(28,101,132,0.18)] backdrop-blur md:block"
      >
        {region.city} / {region.label}
      </motion.div>
    </div>
  );
}

export function RegionWireStage() {
  const [index, setIndex] = useState(0);
  const region = regions[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % regions.length), 4300);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-[#43b7de]/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(207,242,255,0.74))] shadow-[0_24px_70px_rgba(28,101,132,0.18)]">
      <motion.div
        animate={{ backgroundColor: region.background }}
        className="absolute inset-0 opacity-100 blur-2xl"
        transition={{ duration: 0.9 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.8),transparent_28%),radial-gradient(circle_at_72%_78%,rgba(239,51,64,0.16),transparent_26%)]" />
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 4.05], fov: 39 }} dpr={[1, 1.8]} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={1.25} />
          <pointLight color={region.secondary} intensity={4.3} position={[-2.7, 2.2, 3]} />
          <pointLight color={region.accent} intensity={4.8} position={[2.7, -1.4, 2.4]} />
          <TexturePlanes index={index} region={region} />
          <GlobalCore region={region} />
          <CutoutBillboards index={index} region={region} />
        </Canvas>
      </div>
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/82 px-3 py-1 text-xs font-black uppercase text-[#123347] shadow-sm backdrop-blur">Rotating destination model</span>
        <motion.span
          animate={{ backgroundColor: region.accent }}
          className="rounded-full px-3 py-1 text-xs font-black uppercase text-white shadow-sm"
        >
          {region.city}
        </motion.span>
      </div>
      <motion.div
        animate={{ borderColor: region.secondary }}
        className="absolute bottom-4 left-4 right-4 z-10 rounded-xl border bg-white/78 p-3 shadow-[0_12px_30px_rgba(28,101,132,0.16)] backdrop-blur"
      >
        <motion.p key={region.label} animate={{ opacity: 1, y: 0 }} className="text-sm font-black text-[#123347]" initial={{ opacity: 0, y: 8 }}>
          {region.city}: {region.label}
        </motion.p>
      </motion.div>
    </div>
  );
}
