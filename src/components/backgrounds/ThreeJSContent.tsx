import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  Box,
  Octahedron,
  Float,
  MeshDistortMaterial,
  PresentationControls,
} from "@react-three/drei";
import * as THREE from "three";

// Floating geometric shapes component
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary floating sphere */}
      <Float speed={1.4} rotationIntensity={2} floatIntensity={0.5}>
        <Sphere position={[-1, 0, 0]} args={[0.8, 32, 32]}>
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0}
          />
        </Sphere>
      </Float>

      {/* Secondary octahedron */}
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={0.8}>
        <Octahedron position={[1.5, 1, -1]} args={[0.6]}>
          <MeshDistortMaterial
            color="#a855f7"
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.1}
          />
        </Octahedron>
      </Float>

      {/* Tertiary cube */}
      <Float speed={2.2} rotationIntensity={1} floatIntensity={0.6}>
        <Box position={[-1.5, -1, 1]} args={[0.7, 0.7, 0.7]}>
          <MeshDistortMaterial
            color="#f59e0b"
            attach="material"
            distort={0.1}
            speed={1.2}
            roughness={0.2}
          />
        </Box>
      </Float>

      {/* Smaller floating elements */}
      <Float speed={3} rotationIntensity={3} floatIntensity={1}>
        <Sphere position={[2, -1.5, 0.5]} args={[0.3, 16, 16]}>
          <meshStandardMaterial color="#10b981" />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={2.5} floatIntensity={0.8}>
        <Octahedron position={[-2, 1.5, -0.5]} args={[0.4]}>
          <meshStandardMaterial color="#ef4444" />
        </Octahedron>
      </Float>
    </group>
  );
}

// Interactive camera controls
function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    // Subtle camera movement based on mouse position
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.x * 0.5,
      0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.y * 0.5,
      0.05
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Three.js Canvas with error handling
function ThreeJSContent() {
  const [webGLError, setWebGLError] = React.useState(false);

  // WebGL availability check
  const isWebGLAvailable = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  React.useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebGLError(true);
    }
  }, []);

  if (webGLError) {
    return null; // Don't render Canvas if WebGL is not available
  }

  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false, // Don't fail on low-performance devices
      }}
      onCreated={({ gl }) => {
        // Set up error handling for WebGL context
        const context = gl.getContext();
        if (context) {
          context.getExtension('WEBGL_debug_renderer_info');
        }
      }}
      onError={(error: any) => {
        console.warn('Three.js Canvas error:', error);
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.5}
        color="#6366f1"
      />

      {/* Presentation controls for interactivity */}
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <FloatingShapes />
      </PresentationControls>

      <CameraRig />
    </Canvas>
  );
}

export { ThreeJSContent };
