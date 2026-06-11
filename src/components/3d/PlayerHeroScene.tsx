import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTournamentStore } from '../../store/tournamentStore';
import type { LegendCharacter } from '../../types';
import gsap from 'gsap';

function PlayerAura({ color, particleColor }: { color: string; particleColor: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles count={200} scale={[4, 5, 4]} size={2} speed={0.5} color={particleColor} opacity={0.8} />
      <pointLight intensity={3} color={color} distance={6} decay={2} />
    </group>
  );
}

function PlayerSilhouette({ legend, phase }: { legend: LegendCharacter; phase: number }) {
  const bodyRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!bodyRef.current || phase < 2) return;
    const t = state.clock.elapsedTime;
    // Idle animation — gentle sway
    bodyRef.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    bodyRef.current.position.y = Math.sin(t * 0.6) * 0.05 - 0.5;
  });

  if (phase < 1) return null;

  const color = new THREE.Color(legend.signatureColor);

  return (
    <group ref={bodyRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 1.2, 0]}>
        <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.55, 1.4, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.1, 0.7, 6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.55, 1.4, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.1, 0.7, 6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.35, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[0.2, 0.35, 0]}>
        <capsuleGeometry args={[0.12, 0.8, 6, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
      </mesh>
      {/* Glow ball at feet */}
      <mesh position={[0.25, -0.2, 0.3]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} roughness={0.5} />
      </mesh>
    </group>
  );
}

function EntranceScene({ legend }: { legend: LegendCharacter }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [legend.id]);

  return (
    <>
      <PlayerSilhouette legend={legend} phase={phase} />
      {phase >= 2 && <PlayerAura color={legend.glowAura} particleColor={legend.particleColor} />}
    </>
  );
}

interface PlayerHeroSceneProps {
  legend: LegendCharacter;
}

export default function PlayerHeroScene({ legend }: PlayerHeroSceneProps) {
  const { performanceMode } = useTournamentStore();

  if (performanceMode) return null;

  return (
    <Canvas
      style={{ width: '100%', height: '100%', minHeight: 320 }}
      camera={{ position: [0, 1.5, 6], fov: 65 }}
      gl={{ antialias: true, alpha: true }}
      dpr={Math.min(window.devicePixelRatio, 1.5)}
    >
      <color attach="background" args={['#080D1A']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 4, 3]} intensity={2} color={legend.signatureColor} />
      <pointLight position={[-3, 2, -2]} intensity={1.5} color={legend.particleColor} />

      <Float floatIntensity={0.2} rotationIntensity={0.05}>
        <EntranceScene legend={legend} />
      </Float>

      <Sparkles count={60} scale={[10, 8, 10]} size={1} speed={0.3} color={legend.particleColor} opacity={0.5} />
    </Canvas>
  );
}
