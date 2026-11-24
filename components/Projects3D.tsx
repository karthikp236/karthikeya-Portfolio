
"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Line,
  RoundedBox,
  Sparkles,
  Text,
  Torus,
} from "@react-three/drei";
import "./Projects3D.css";
type Project = {
  n: string | number;
  type: string;
  title: string;
  desc: string;
  stack: string;
  href: string;
};

type Props = {
  projects: Project[];
};

const themes = [
  {
    main: "#48caff",
    glow: "#176bff",
    soft: "#a5eaff",
    background: "#071321",
  },
  {
    main: "#64e5a5",
    glow: "#0c9b68",
    soft: "#c4ffe1",
    background: "#091b16",
  },
  {
    main: "#ffad59",
    glow: "#ff633f",
    soft: "#ffe0b5",
    background: "#21130e",
  },
];

/* =========================================
   INTERACTIVE MOVEMENT
========================================= */

function MotionGroup({
  children,
  speed = 0.5,
}: {
  children: ReactNode;
  speed?: number;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      pointer.x * 0.18,
      0.04
    );

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -pointer.y * 0.1,
      0.04
    );

    ref.current.position.y =
      Math.sin(clock.elapsedTime * speed) * 0.07;
  });

  return <group ref={ref}>{children}</group>;
}

/* =========================================
   REUSABLE 3D UI ELEMENTS
========================================= */

function Label({
  children,
  position,
  size = 0.11,
  color = "#ffffff",
  anchorX = "left",
}: {
  children: string;
  position: [number, number, number];
  size?: number;
  color?: string;
  anchorX?: "left" | "center" | "right";
}) {
  return (
    <Text
      position={position}
      fontSize={size}
      color={color}
      anchorX={anchorX}
      anchorY="middle"
      maxWidth={4}
      letterSpacing={0.01}
    >
      {children}
    </Text>
  );
}

function Surface({
  position,
  size,
  color,
  opacity = 1,
  radius = 0.06,
  emissive,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
  radius?: number;
  emissive?: string;
}) {
  return (
    <RoundedBox
      position={position}
      args={size}
      radius={radius}
      smoothness={4}
    >
      <meshPhysicalMaterial
        color={color}
        emissive={emissive || color}
        emissiveIntensity={emissive ? 0.35 : 0}
        metalness={0.35}
        roughness={0.3}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </RoundedBox>
  );
}

function Dot({
  position,
  color,
  size = 0.045,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 20, 20]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function ScreenFrame({
  children,
  accent,
  title,
}: {
  children: ReactNode;
  accent: string;
  title: string;
}) {
  return (
    <group>
      {/* Outer display */}
      <RoundedBox
        args={[4.9, 2.9, 0.18]}
        radius={0.12}
        smoothness={6}
      >
        <meshPhysicalMaterial
          color="#111a25"
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
        />
      </RoundedBox>

      {/* Inner screen */}
      <Surface
        position={[0, 0, 0.105]}
        size={[4.72, 2.72, 0.025]}
        color="#080d15"
        radius={0.07}
      />

      {/* Top bar */}
      <Surface
        position={[0, 1.17, 0.13]}
        size={[4.7, 0.36, 0.025]}
        color="#121c29"
        radius={0.04}
      />

      <Label
        position={[-2.12, 1.17, 0.17]}
        size={0.13}
        color="#f3f7ff"
      >
        {title}
      </Label>

      <Dot position={[1.85, 1.17, 0.17]} color={accent} size={0.05} />
      <Dot position={[2.02, 1.17, 0.17]} color="#66758b" size={0.05} />

      {children}
    </group>
  );
}

/* =========================================
   01 — AUTOMATE AI
   AI AGENT WORKSPACE
========================================= */

function AutomationScene() {
  const nodes = [
    { x: -1.65, y: 0.42, name: "TRIGGER" },
    { x: 0, y: 0.42, name: "AI AGENT" },
    { x: 1.65, y: 0.42, name: "ACTION" },
  ];

  return (
    <MotionGroup speed={0.42}>
      <ScreenFrame accent="#48caff" title="AUTOMATE AI / WORKSPACE">
        {/* Left sidebar */}
        <Surface
          position={[-2.02, -0.22, 0.15]}
          size={[0.42, 2.22, 0.035]}
          color="#101d2b"
        />

        {[-0.85, -0.4, 0.05, 0.5].map((y, i) => (
          <Surface
            key={i}
            position={[-2.02, y, 0.19]}
            size={[0.2, 0.07, 0.025]}
            color={i === 1 ? "#48caff" : "#34475b"}
          />
        ))}

        {/* Header content */}
        <Label
          position={[-1.65, 0.83, 0.18]}
          size={0.12}
          color="#a9bdd2"
        >
          WORKFLOW BUILDER
        </Label>

        <Label
          position={[1.83, 0.83, 0.18]}
          size={0.09}
          color="#55e3a3"
          anchorX="right"
        >
          ● RUNNING
        </Label>

        {/* Workflow cards */}
        {nodes.map((node, i) => (
          <group key={node.name} position={[node.x, node.y, 0.22]}>
            <Float
              speed={1.4 + i * 0.2}
              floatIntensity={0.07}
              rotationIntensity={0.04}
            >
              <Surface
                position={[0, 0, 0]}
                size={[0.9, 0.48, 0.09]}
                color={i === 1 ? "#123a5a" : "#172738"}
                emissive={i === 1 ? "#087dff" : undefined}
              />

              <Dot
                position={[-0.32, 0.06, 0.06]}
                color={i === 1 ? "#69d9ff" : "#7295b8"}
                size={0.055}
              />

              <Label
                position={[-0.19, 0.06, 0.07]}
                size={0.085}
                color="#edf6ff"
              >
                {node.name}
              </Label>

              <Label
                position={[-0.19, -0.1, 0.07]}
                size={0.06}
                color="#849bb1"
              >
                {i === 0
                  ? "Event"
                  : i === 1
                    ? "Process"
                    : "Execute"}
              </Label>
            </Float>
          </group>
        ))}

        {/* Connections */}
        <Line
          points={[
            [-1.18, 0.42, 0.25],
            [-0.48, 0.42, 0.25],
          ]}
          color="#48caff"
          lineWidth={2}
        />

        <Line
          points={[
            [0.48, 0.42, 0.25],
            [1.18, 0.42, 0.25],
          ]}
          color="#48caff"
          lineWidth={2}
        />

        {/* Bottom tool cards */}
        {[
          { x: -1.15, label: "LANGCHAIN" },
          { x: 0, label: "MCP TOOLS" },
          { x: 1.15, label: "OUTPUT" },
        ].map((item) => (
          <group key={item.label} position={[item.x, -0.55, 0.2]}>
            <Surface
              position={[0, 0, 0]}
              size={[0.95, 0.43, 0.05]}
              color="#111f30"
            />
            <Label
              position={[0, 0, 0.05]}
              size={0.085}
              color="#b7d6ed"
              anchorX="center"
            >
              {item.label}
            </Label>
          </group>
        ))}

        {/* Activity indicator */}
        <Label
          position={[-1.65, -1.05, 0.18]}
          size={0.075}
          color="#7f99b2"
        >
          AGENT EXECUTION / LIVE
        </Label>

        <Label
          position={[1.8, -1.05, 0.18]}
          size={0.075}
          color="#54dba0"
          anchorX="right"
        >
          ALL SYSTEMS ACTIVE
        </Label>
      </ScreenFrame>

      {/* Floating AI processing core */}
      <Float speed={1.8} floatIntensity={0.3}>
        <group position={[0, -1.83, 0.5]}>
          <mesh>
            <icosahedronGeometry args={[0.36, 2]} />
            <meshPhysicalMaterial
              color="#4bcaff"
              emissive="#087dff"
              emissiveIntensity={2}
              wireframe
              metalness={0.8}
            />
          </mesh>

          <mesh>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshBasicMaterial color="#d7f6ff" />
          </mesh>
        </group>
      </Float>

      {/* Orbital paths */}
      <Torus
        args={[2.8, 0.012, 12, 150]}
        rotation={[1.1, 0.2, 0.1]}
      >
        <meshBasicMaterial color="#48caff" transparent opacity={0.5} />
      </Torus>

      <Sparkles
        count={90}
        scale={7}
        size={2}
        speed={0.4}
        color="#5bd5ff"
      />
    </MotionGroup>
  );
}

/* =========================================
   02 — INTERVIEW IQ
   INTERVIEW ANALYTICS WORKSPACE
========================================= */

function InterviewScene() {
  return (
    <MotionGroup speed={0.38}>
      <ScreenFrame accent="#64e5a5" title="INTERVIEWIQ / CANDIDATE ANALYSIS">
        {/* Main candidate panel */}
        <Surface
          position={[-1.15, 0.05, 0.18]}
          size={[1.8, 1.65, 0.055]}
          color="#13231e"
        />

        {/* Candidate avatar */}
        <Float speed={1.1} floatIntensity={0.08}>
          <mesh position={[-1.15, 0.3, 0.28]}>
            <sphereGeometry args={[0.32, 32, 32]} />
            <meshStandardMaterial
              color="#8dbda6"
              roughness={0.7}
            />
          </mesh>

          <mesh position={[-1.15, -0.43, 0.27]}>
            <capsuleGeometry args={[0.28, 0.4, 4, 12]} />
            <meshStandardMaterial color="#315c4c" />
          </mesh>
        </Float>

        <Label
          position={[-1.15, -0.83, 0.29]}
          size={0.09}
          color="#e1fff0"
          anchorX="center"
        >
          CANDIDATE
        </Label>

        {/* Performance score */}
        <Surface
          position={[0.5, 0.48, 0.18]}
          size={[1.8, 0.62, 0.05]}
          color="#12251d"
        />

        <Label
          position={[-0.25, 0.59, 0.25]}
          size={0.08}
          color="#9cb9aa"
        >
          OVERALL SCORE
        </Label>

        <Label
          position={[1.15, 0.48, 0.25]}
          size={0.3}
          color="#70f0ae"
          anchorX="center"
        >
          92
        </Label>

        {/* Evaluation metrics */}
        {[
          { y: -0.05, label: "Communication", width: 0.85 },
          { y: -0.42, label: "Confidence", width: 0.7 },
          { y: -0.79, label: "Technical", width: 0.95 },
        ].map((metric) => (
          <group key={metric.label}>
            <Label
              position={[-0.28, metric.y, 0.25]}
              size={0.075}
              color="#b9d0c4"
            >
              {metric.label}
            </Label>

            <Surface
              position={[0.8, metric.y - 0.12, 0.24]}
              size={[1.05, 0.055, 0.025]}
              color="#243a30"
              radius={0.02}
            />

            <Surface
              position={[
                0.8 - (1.05 - metric.width) / 2,
                metric.y - 0.12,
                0.27,
              ]}
              size={[metric.width, 0.055, 0.03]}
              color="#63e6a2"
              radius={0.02}
              emissive="#13a96c"
            />
          </group>
        ))}

        {/* Interview status */}
        <Label
          position={[1.7, -1.08, 0.22]}
          size={0.075}
          color="#65e7a4"
          anchorX="right"
        >
          ANALYSIS COMPLETE
        </Label>

        {/* Bottom status line */}
        <Label
          position={[-1.95, -1.08, 0.22]}
          size={0.075}
          color="#8da99a"
        >
          AI EVALUATION REPORT
        </Label>
      </ScreenFrame>

      {/* Microphone */}
      <Float
        speed={1.7}
        rotationIntensity={0.16}
        floatIntensity={0.25}
      >
        <group position={[1.95, -1.45, 0.8]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.13, 0.55, 32]} />
            <meshPhysicalMaterial
              color="#a6ffd0"
              emissive="#10b878"
              emissiveIntensity={1.4}
              metalness={0.8}
            />
          </mesh>

          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.14, 32, 32]} />
            <meshPhysicalMaterial
              color="#c7ffe0"
              emissive="#10b878"
              emissiveIntensity={1.4}
            />
          </mesh>

          <mesh position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 32]} />
            <meshStandardMaterial color="#26875f" />
          </mesh>
        </group>
      </Float>

      {/* Audio waveform */}
      {Array.from({ length: 19 }).map((_, i) => {
        const height = 0.16 + Math.abs(Math.sin(i * 0.7)) * 0.55;

        return (
          <Float key={i} speed={2 + i * 0.06} floatIntensity={0.12}>
            <mesh
              position={[
                (i - 9) * 0.13,
                -2.08,
                0.9,
              ]}
            >
              <boxGeometry args={[0.055, height, 0.055]} />
              <meshBasicMaterial color="#69eab0" />
            </mesh>
          </Float>
        );
      })}

      {/* Analysis rings */}
      {[1.1, 1.5, 1.9].map((radius, i) => (
        <Torus
          key={radius}
          args={[radius, 0.009, 10, 120]}
          rotation={[1.1 + i * 0.25, 0.4, i * 0.2]}
        >
          <meshBasicMaterial
            color="#64e5a5"
            transparent
            opacity={0.45}
          />
        </Torus>
      ))}

      <Sparkles
        count={90}
        scale={7}
        size={2}
        speed={0.4}
        color="#a1ffd0"
      />
    </MotionGroup>
  );
}

/* =========================================
   03 — SITEFORGE AI
   AI WEBSITE BUILDER
========================================= */

function SiteForgeScene() {
  return (
    <MotionGroup speed={0.4}>
      <ScreenFrame accent="#ffad59" title="SITEFORGE / WEBSITE STUDIO">
        {/* Editor sidebar */}
        <Surface
          position={[-1.93, -0.15, 0.17]}
          size={[0.55, 2.2, 0.04]}
          color="#211710"
        />

        <Label
          position={[-2.13, 0.75, 0.22]}
          size={0.075}
          color="#ffc28b"
        >
          EDITOR
        </Label>

        {[-0.05, -0.35, -0.65, -0.95].map((y, i) => (
          <Surface
            key={i}
            position={[-1.93, y, 0.21]}
            size={[0.32, 0.12, 0.03]}
            color={i === 1 ? "#a95026" : "#443026"}
          />
        ))}

        {/* Website preview */}
        <Surface
          position={[0.45, 0, 0.18]}
          size={[3.75, 2.18, 0.045]}
          color="#f3eee6"
          radius={0.04}
        />

        {/* Browser bar */}
        <Surface
          position={[0.45, 0.96, 0.22]}
          size={[3.72, 0.22, 0.035]}
          color="#ded7ce"
          radius={0.02}
        />

        {[-1.22, -1.09, -0.96].map((x, i) => (
          <Dot
            key={i}
            position={[x, 0.96, 0.26]}
            color={["#ff755f", "#ffc45d", "#62c98a"][i]}
            size={0.035}
          />
        ))}

        {/* Website heading */}
        <Label
          position={[-0.95, 0.58, 0.25]}
          size={0.14}
          color="#28231f"
        >
          CREATE SOMETHING
        </Label>

        <Label
          position={[-0.95, 0.37, 0.25]}
          size={0.14}
          color="#d66c34"
        >
          AMAZING.
        </Label>

        {/* Description lines */}
        {[0.12, -0.02].map((y, i) => (
          <Surface
            key={i}
            position={[-0.83, y, 0.25]}
            size={[1.15 - i * 0.2, 0.045, 0.025]}
            color="#b9aaa0"
            radius={0.015}
          />
        ))}

        {/* Preview call-to-action */}
        <Surface
          position={[-0.92, -0.28, 0.26]}
          size={[0.68, 0.2, 0.035]}
          color="#ed8548"
          radius={0.035}
        />

        <Label
          position={[-0.92, -0.28, 0.31]}
          size={0.065}
          color="#ffffff"
          anchorX="center"
        >
          EXPLORE
        </Label>

        {/* Website hero image placeholder */}
        <Surface
          position={[1.35, 0.18, 0.25]}
          size={[1.25, 1.05, 0.04]}
          color="#d5a47c"
          emissive="#8e4b29"
        />

        <mesh position={[1.35, 0.18, 0.3]}>
          <icosahedronGeometry args={[0.38, 1]} />
          <meshStandardMaterial
            color="#ffe0ba"
            metalness={0.45}
            roughness={0.3}
          />
        </mesh>

        {/* Content cards */}
        {[-0.85, 0, 0.85].map((x, i) => (
          <group key={i} position={[x, -0.72, 0.26]}>
            <Surface
              position={[0, 0, 0]}
              size={[0.85, 0.35, 0.04]}
              color="#e4d7cb"
            />
            <Surface
              position={[0, 0.02, 0.035]}
              size={[0.58, 0.045, 0.02]}
              color="#ad7758"
            />
          </group>
        ))}

        <Label
          position={[-1.6, -1.08, 0.22]}
          size={0.07}
          color="#c28a62"
        >
          LIVE PREVIEW
        </Label>

        <Label
          position={[2.12, -1.08, 0.22]}
          size={0.07}
          color="#c28a62"
          anchorX="right"
        >
          RESPONSIVE LAYOUT
        </Label>
      </ScreenFrame>

      {/* Floating design components */}
      {[
        [-2.7, 1.55, 0.3],
        [2.7, 1.55, 0.3],
        [-2.7, -1.55, 0.3],
        [2.7, -1.55, 0.3],
      ].map((position, i) => (
        <Float
          key={i}
          speed={1.5 + i * 0.25}
          floatIntensity={0.3}
          rotationIntensity={0.4}
        >
          <mesh position={position as [number, number, number]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshPhysicalMaterial
              color="#ffb36b"
              emissive="#ff6738"
              emissiveIntensity={1.2}
              metalness={0.75}
              roughness={0.15}
              clearcoat={1}
            />
          </mesh>
        </Float>
      ))}

      {/* Design orbits */}
      <Torus
        args={[2.85, 0.01, 12, 140]}
        rotation={[1.15, 0.3, 0.2]}
      >
        <meshBasicMaterial
          color="#ffb66c"
          transparent
          opacity={0.55}
        />
      </Torus>

      <Sparkles
        count={100}
        scale={7}
        size={2}
        speed={0.4}
        color="#ffc58e"
      />
    </MotionGroup>
  );
}

/* =========================================
   SCENE CONTROLLER
========================================= */

function ProjectScene({ active }: { active: number }) {
  const theme = themes[active];

  return (
    <>
      <color attach="background" args={["#05070c"]} />
      <fog attach="fog" args={["#05070c", 9, 17]} />

      <ambientLight intensity={1.1} />

      <pointLight
        position={[4, 4, 5]}
        intensity={55}
        color={theme.main}
      />

      <pointLight
        position={[-4, -3, 4]}
        intensity={30}
        color={theme.glow}
      />

      <directionalLight
        position={[0, 5, 6]}
        intensity={1.8}
      />

      {active === 0 && <AutomationScene />}
      {active === 1 && <InterviewScene />}
      {active === 2 && <SiteForgeScene />}
    </>
  );
}

/* =========================================
   MAIN PROJECTS COMPONENT
========================================= */

export default function Projects3D({ projects }: Props) {
  const [active, setActive] = useState(0);

  if (!projects || projects.length < 3) {
    return null;
  }

  const project = projects[active];
  const theme = themes[active];

  return (
    <section className="projects3d" id="projects">
      <div className="projects3d-heading">
        <span>/ 03 — SELECTED WORK</span>

        <h2>
          Ideas into <i>dimensions.</i>
        </h2>

        <p>
          Explore the technology and thinking behind each creation.
        </p>
      </div>

      <div
        className="projects3d-stage"
        style={
          {
            "--project-accent": theme.main,
          } as React.CSSProperties
        }
      >
        <div className="projects3d-canvas">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 42 }}
            dpr={[1, 1.75]}
            gl={{
              antialias: true,
              alpha: false,
            }}
          >
            <ProjectScene active={active} />
          </Canvas>

          <div className="canvas-label canvas-label-top">
            <span>{theme === themes[0] ? "AI AUTOMATION" : active === 1 ? "INTERVIEW INTELLIGENCE" : "AI WEBSITE STUDIO"}</span>
            <span>0{active + 1} / 03</span>
          </div>

          <div className="canvas-label canvas-label-bottom">
            <span>MOVE YOUR CURSOR TO EXPLORE</span>
            <span>REAL-TIME 3D</span>
          </div>
        </div>

        <div className="projects3d-details" key={project.n}>
          <div className="details-number">
            PROJECT / 0{active + 1}
            <span>2026</span>
          </div>

          <span className="details-type">
            {project.type}
          </span>

          <h3>{project.title}</h3>

          <p className="details-description">
            {project.desc}
          </p>

          <div className="details-tech">
            <span>TECHNOLOGY STACK</span>
            <p>{project.stack}</p>
          </div>

          <div className="details-links">
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              EXPLORE LIVE PROJECT <span>↗</span>
            </a>

            <a
              href="https://github.com/karthikp236"
              target="_blank"
              rel="noopener noreferrer"
            >
              GITHUB PROFILE <span>↗</span>
            </a>
          </div>

          <div className="projects3d-navigation">
            <button
              onClick={() => setActive((active + 2) % 3)}
              aria-label="Previous project"
            >
              ←
            </button>

            <div className="project3d-tabs">
              {projects.slice(0, 3).map((item, index) => (
                <button
                  key={item.n}
                  onClick={() => setActive(index)}
                  className={active === index ? "selected" : ""}
                  aria-label={`Show ${item.title}`}
                >
                  0{index + 1}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setActive((active + 1) % 3)}
              aria-label="Next project"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="projects3d-footer">
        <span>DESIGNED TO EXPLORE / BUILT TO INSPIRE</span>
        <span>THREE PROJECTS · THREE WORLDS</span>
      </div>
    </section>
  );
}
