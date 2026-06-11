import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTournamentStore } from '../../store/tournamentStore';

function RotatingTrophy() {
  const groupRef = useRef<THREE.Group>(null!);

  const trophyProfile = useMemo(() => {
    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.6, 0),
      new THREE.Vector2(0.5, 0.3),
      new THREE.Vector2(0.2, 0.8),
      new THREE.Vector2(0.2, 1.4),
      new THREE.Vector2(0.8, 2.0),
      new THREE.Vector2(1.0, 2.6),
      new THREE.Vector2(0.9, 3.0),
      new THREE.Vector2(0.5, 3.2),
      new THREE.Vector2(0.3, 3.5),
    ];
    return new THREE.LatheGeometry(points, 48);
  }, []);

  const baseProfile = useMemo(() => {
    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.9, 0),
      new THREE.Vector2(0.9, 0.2),
      new THREE.Vector2(0.7, 0.3),
      new THREE.Vector2(0.7, 0),
    ];
    return new THREE.LatheGeometry(points, 48);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <mesh geometry={trophyProfile}>
        <meshStandardMaterial color="#FFD700" metalness={1.0} roughness={0.05} envMapIntensity={3} />
      </mesh>
      <mesh geometry={baseProfile} position={[0, 0, 0]}>
        <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.1} />
      </mesh>
      <pointLight position={[0, 2, 2]} intensity={3} color="#FFD700" />
      <pointLight position={[0, 2, -2]} intensity={2} color="#FF4444" />
    </group>
  );
}

function FloatingBall({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);

  const footballShader = useMemo(() => ({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      float hexPattern(vec2 uv) {
        vec2 h = mod(uv * 5.0, 1.0) - 0.5;
        return step(0.35, abs(h.x) + abs(h.y) * 0.866);
      }
      void main() {
        float panels = hexPattern(vUv);
        vec3 white = vec3(0.95);
        vec3 dark = vec3(0.06, 0.07, 0.12);
        vec3 color = mix(dark, white, panels);
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        color += fresnel * 0.3;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.rotation.x = t;
      ref.current.rotation.z = t * 0.7;
      ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <shaderMaterial args={[footballShader]} />
    </mesh>
  );
}

function StadiumRing() {
  const ringRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const lights = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return { x: Math.cos(angle) * 8, z: Math.sin(angle) * 8 };
    });
  }, []);

  return (
    <group ref={ringRef} position={[0, -3, 0]}>
      {lights.map((l, i) => (
        <pointLight key={i} position={[l.x, 4, l.z]} intensity={0.8} color={i % 2 === 0 ? '#FFD700' : '#C8102E'} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6, 8, 64]} />
        <meshStandardMaterial color="#0D1E10" roughness={1} />
      </mesh>
    </group>
  );
}

interface WorldCupScene3DProps {
  variant?: 'dashboard' | 'minimal';
}

export default function WorldCupScene3D({ variant = 'dashboard' }: WorldCupScene3DProps) {
  const { performanceMode } = useTournamentStore();

  if (performanceMode) return null;

  return (
    <Canvas
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
      camera={{ position: [0, 2, 10], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={Math.min(window.devicePixelRatio, 1.5)}
    >
      <ambientLight intensity={0.15} color="#0D1E3A" />

      <Stars radius={80} depth={60} count={2500} factor={3} saturation={0.3} fade speed={0.3} />

      <Sparkles
        count={100}
        scale={[18, 12, 18]}
        size={1.5}
        speed={0.2}
        color="#FFD700"
        opacity={0.4}
      />

      {variant === 'dashboard' && (
        <>
          <Float floatIntensity={0.3} rotationIntensity={0.1}>
            <RotatingTrophy />
          </Float>

          <FloatingBall position={[-4, 0, -3]} />
          <FloatingBall position={[4, 1, -4]} />
          <FloatingBall position={[-3, -1, -2]} />
          <FloatingBall position={[3, -2, -5]} />
        </>
      )}

      <StadiumRing />
    </Canvas>
  );
}
