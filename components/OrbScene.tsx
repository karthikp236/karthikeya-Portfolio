
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, Stars } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  float wave(vec3 p) {
    return sin(p.x * 3.1 + uTime * .42) * cos(p.y * 2.7 - uTime * .28)
      + sin(p.z * 3.8 + uTime * .31) * .35;
  }
  void main() {
    vUv = uv;
    vec3 p = position;
    float displacement = wave(normalize(position) * 1.8) * .045;
    displacement += sin(position.y * 7.0 + uTime * .6) * .012;
    p += normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    vec4 worldPosition = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uIntensity;
  vec3 palette(float t) {
    vec3 a = vec3(.50, .50, .52);
    vec3 b = vec3(.50, .48, .50);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(.00, .13, .32);
    return a + b * cos(6.28318 * (c * t + d));
  }
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.35);
    float nse = noise3(vWorldPosition * 2.4 + vec3(uTime * .12));
    float bands = sin((vWorldPosition.y * 5.0 + vWorldPosition.x * 3.0) + uTime * .38 + nse * 3.0);
    float spectral = bands * .16 + nse * .24 + fresnel * .34;
    vec3 iridescence = palette(spectral + uTime * .025 + dot(n, vec3(uPointer * .12, .2)));
    vec3 deep = vec3(.018, .028, .055);
    vec3 color = mix(deep, iridescence, .30 + fresnel * .72);
    color += vec3(.30, .70, .92) * pow(max(dot(reflect(-v,n), normalize(vec3(-.5,.8,1.0))),0.0), 18.0) * .72;
    color += vec3(.65,.32,.95) * pow(max(dot(reflect(-v,n), normalize(vec3(1.0,-.2,.7))),0.0), 24.0) * .42;
    float edge = smoothstep(.05,.95,fresnel);
    color += iridescence * edge * .24;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function HeroSculpture() {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uIntensity: { value: 1 },
  }), []);
  const scroll = useRef(0);

  useEffect(() => {
    const update = () => {
      scroll.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 1.15));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (root.current) {
      root.current.rotation.y += delta * .075;
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        state.pointer.y * .18 + scroll.current * .34,
        2.0,
        delta
      );
      root.current.rotation.z = THREE.MathUtils.damp(
        root.current.rotation.z,
        -state.pointer.x * .16,
        2.0,
        delta
      );
      root.current.position.y = THREE.MathUtils.damp(
        root.current.position.y,
        -scroll.current * .52,
        2.5,
        delta
      );
      root.current.scale.setScalar(1 - scroll.current * .12);
    }

    if (core.current) {
      core.current.rotation.y -= delta * .035;
      core.current.rotation.x = Math.sin(t * .22) * .08;
    }

    if (ringA.current) ringA.current.rotation.z += delta * .11;
    if (ringB.current) ringB.current.rotation.x += delta * .075;
    if (ringC.current) ringC.current.rotation.y -= delta * .06;

    if (material.current) {
      material.current.uniforms.uTime.value = t;
      material.current.uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
    }
  });

  return (
    <group ref={root}>
      <Float speed={.65} rotationIntensity={.08} floatIntensity={.12}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.38, 8]} />
          <shaderMaterial
            ref={material}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>

        <mesh scale={1.012}>
          <icosahedronGeometry args={[1.38, 6]} />
          <meshPhysicalMaterial
            color="#d9f6ff"
            metalness={.22}
            roughness={.045}
            transmission={.16}
            thickness={1.8}
            ior={1.42}
            clearcoat={1}
            clearcoatRoughness={.015}
            transparent
            opacity={.22}
            side={THREE.BackSide}
          />
        </mesh>

        <mesh scale={1.035}>
          <icosahedronGeometry args={[1.38, 3]} />
          <meshBasicMaterial
            color="#b5eaff"
            wireframe
            transparent
            opacity={.075}
          />
        </mesh>
      </Float>

      <group rotation={[.72, .18, -.34]}>
        <mesh ref={ringA}>
          <torusGeometry args={[1.92, .009, 12, 280]} />
          <meshBasicMaterial color="#9deaff" transparent opacity={.8} />
        </mesh>

        <mesh ref={ringB} rotation={[.62, .3, 1.08]}>
          <torusGeometry args={[2.12, .006, 10, 280]} />
          <meshBasicMaterial color="#c6a0ff" transparent opacity={.62} />
        </mesh>

        <mesh ref={ringC} rotation={[1.25, .85, .2]}>
          <torusGeometry args={[2.32, .004, 8, 280]} />
          <meshBasicMaterial color="#f2d7ff" transparent opacity={.42} />
        </mesh>

        <mesh position={[1.92, 0, 0]}>
          <sphereGeometry args={[.055, 24, 24]} />
          <meshBasicMaterial color="#e6fbff" />
        </mesh>

        <mesh position={[-2.1, .1, 0]}>
          <sphereGeometry args={[.032, 20, 20]} />
          <meshBasicMaterial color="#d7baff" />
        </mesh>
      </group>

      <mesh position={[0, -2.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.8, 96]} />
        <meshBasicMaterial
          color="#80dfff"
          transparent
          opacity={.055}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function LightRig() {
  const moving = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!moving.current) return;

    const t = state.clock.elapsedTime;
    moving.current.position.set(
      Math.cos(t * .28) * 3.5,
      Math.sin(t * .38) * 2.2,
      2.2
    );
  });

  return (
    <>
      <ambientLight intensity={.28} />
      <hemisphereLight args={['#d9f5ff', '#10091f', .85]} />
      <spotLight position={[0, 5, 5]} intensity={72} angle={.5} penumbra={1} color="#e8f8ff" />
      <pointLight position={[-4, .5, 1]} intensity={36} color="#8755ff" />
      <pointLight position={[4, -1, 2]} intensity={34} color="#48dcff" />
      <pointLight ref={moving} intensity={26} color="#ff8edb" distance={10} />
    </>
  );
}

export default function OrbScene() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 700px)').matches;
    setLowPower(reduced || small);
  }, []);

  return (
    <div
      className="orb-canvas"
      aria-label="Interactive iridescent shader sculpture with animated orbital rings"
    >
      <Canvas
        camera={{ position: [0, 0, 6.7], fov: 34 }}
        dpr={lowPower ? [1, 1] : [1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#050609']} />
        <fog attach="fog" args={['#050609', 8, 18]} />

        <LightRig />
        <HeroSculpture />

        <Stars
          radius={70}
          depth={35}
          count={lowPower ? 360 : 1000}
          factor={2.1}
          saturation={.25}
          fade
          speed={lowPower ? .05 : .18}
        />

        <Sparkles
          count={lowPower ? 42 : 125}
          scale={[7, 6, 5]}
          size={1.4}
          speed={lowPower ? .08 : .22}
          opacity={.58}
          color="#b7eaff"
          noise={.6}
        />

        <Environment preset="studio" />

        <EffectComposer multisampling={lowPower ? 0 : 4}>
          <Bloom
            intensity={lowPower ? .62 : 1.05}
            luminanceThreshold={.2}
            luminanceSmoothing={.86}
            mipmapBlur
          />

          <ChromaticAberration
            offset={new THREE.Vector2(.00035, .00035)}
            radialModulation
            modulationOffset={.18}
          />

          <Noise opacity={.025} />
          <Vignette eskil={false} offset={.18} darkness={.64} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
