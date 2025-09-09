import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Sphere,
  Box,
  Octahedron,
  Float,
  MeshDistortMaterial,
  PresentationControls,
} from "@react-three/drei";
import { motion } from "framer-motion";
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

const ThreeJSHero: React.FC = () => {
  return (
    <section id="home">
      <div className="relative w-full h-[70vh] overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-white/95 to-blue-50/90 dark:from-blue-900/90 dark:via-gray-900/95 dark:to-blue-900/90 z-10" />

        {/* Three.js Canvas */}
        <div className="absolute inset-0">
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
              <Suspense fallback={null}>
                <FloatingShapes />
              </Suspense>
            </PresentationControls>

            <CameraRig />
          </Canvas>
        </div>

        {/* Content overlay */}
        <div className="relative z-20 flex items-center justify-center h-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center max-w-4xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-6xl md:text-8xl font-bold mb-6 text-gray-800 dark:text-white"
            >
              <span className="text-blue-600">Ayush Rai</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              AI Engineer & Full-Stack Developer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Exploring the intersection of artificial intelligence, web
              technologies, and innovative problem-solving to create
              transformative solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <a href="https://drive.google.com/file/d/1oJlYWL4UAavvSwbjwwptoGWizPXjYtAn/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-lg">
                Download Resume
              </a>
              <a href="#projects" className="btn-primary px-8 py-4 text-lg">
                View My Work
              </a>
              <a href="#contact" className="btn-secondary px-8 py-4 text-lg">
                Let's Connect
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-gray-500 dark:text-gray-400"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-500 dark:border-gray-400 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-blue-600 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThreeJSHero;
