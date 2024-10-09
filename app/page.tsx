"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useState } from "react";
import {
  MeshWobbleMaterial,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { Leva, useControls } from "leva";

const Cube = ({
  position = [0, 0, 0],
  color = "orange",
  size,
}: {
  position?: [number, number, number];
  color?: string;
  size: [number, number, number];
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
      ref.current.rotation.x += delta * 2.0;
      ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2;
    }
  });
  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Sphere = ({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  useFrame((state, delta) => {
    const speed = isHovered ? 1 : 0.2;
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
    }
  });
  return (
    <mesh
      position={position}
      ref={ref}
      onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
      onPointerLeave={(event) => (event.stopPropagation(), setIsHovered(false))}
      onClick={(event) => (event.stopPropagation(), setIsClicked(!isClicked))}
      scale={isClicked ? 1.5 : 1}
    >
      <sphereGeometry args={size} />
      <meshStandardMaterial
        color={isHovered ? "orange" : "lightblue"}
        wireframe
      />
    </mesh>
  );
};

const Torus = ({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number, number];
  color: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
      ref.current.rotation.x += delta * 2.0;
      ref.current.position.z = Math.sin(state.clock.elapsedTime) * 4;
    }
  });
  return (
    <mesh position={position} ref={ref}>
      <torusGeometry args={size} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  );
};

const TorusKnot = ({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number, number];
  color: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  // useFrame((state, delta) => {
  //   if (ref.current) {
  //     ref.current.rotation.y += delta;
  //     ref.current.rotation.x += delta * 2.0;
  //     ref.current.position.z = Math.sin(state.clock.elapsedTime) * 4;
  //   }
  // });
  return (
    <mesh position={position} ref={ref}>
      <torusKnotGeometry args={size} />
      {/* <meshStandardMaterial color={color} wireframe /> */}
      <MeshWobbleMaterial factor={3} speed={2} wireframe />
    </mesh>
  );
};

const Scene = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(
    directionalLightRef as React.MutableRefObject<THREE.Object3D>,
    THREE.DirectionalLightHelper,
    0.5,
    "white"
  );
  const { lightColor, lightIntensity } = useControls({
    lightColor: "white",
    lightIntensity: {
      value: 0.5,
      min: 0.5,
      max: 5,
    },
  });
  return (
    <>
      <directionalLight
        intensity={lightIntensity}
        position={[0, 0, 5]}
        ref={directionalLightRef}
        color={lightColor}
      />
      <ambientLight intensity={0.1} />
      <group position={[0, -1, 0]}>
        <Cube position={[1, 0, 0]} color="green" size={[1, 1, 1]} />
        <Cube position={[-1, 0, 0]} color="blue" size={[1, 1, 1]} />
        <Cube position={[-1, 2, 0]} color="red" size={[1, 1, 1]} />
        <Cube position={[1, 2, 0]} color="hotpink" size={[1, 1, 1]} />
      </group>
      <Cube position={[0, 0, 0]} color="orange" size={[1, 1, 1]} />
      <Sphere position={[0, 0, 0]} size={[1, 30, 30]} color="orange" />
      <Torus position={[2, 0, 0]} size={[0.8, 0.1, 30, 30]} color="green" />
      <TorusKnot
        position={[0, 0, 0]}
        size={[1, 0.1, 1000, 50]}
        color="hotpink"
      />
      <OrbitControls />
    </>
  );
};

export default function Home() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Leva collapsed />
      <Canvas camera={{ position: [0, 0, 7], fov: 100 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
