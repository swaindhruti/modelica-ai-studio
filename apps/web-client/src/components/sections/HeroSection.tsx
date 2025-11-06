import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import AnimatedModel from "../AnimatedModel";

// Fallback 3D Fashion Model Component - More realistic human
function FashionMannequin() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Smoothly rotate the entire body based on cursor position
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.4,
        0.08
      );
    }

    // Head follows cursor more responsively
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mousePosition.x * 0.3,
        0.15
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        mousePosition.y * 0.2,
        0.15
      );
    }
  });

  // Skin tone color - fairer skin
  const skinColor = "#ffd4b8";
  const hairColor = "#2d1f1a";

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* HEAD GROUP */}
      <group ref={headRef} position={[0, 1.85, 0]}>
        {/* Head - more realistic oval shape */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color={skinColor}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Face elongation */}
        <mesh position={[0, -0.08, 0.05]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={skinColor}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Hair - stylized fashion model hair */}
        <mesh position={[0, 0.15, -0.02]} castShadow>
          <sphereGeometry args={[0.23, 32, 32]} />
          <meshStandardMaterial
            color={hairColor}
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Eyes - Left */}
        <mesh position={[-0.08, 0.02, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Eyes - Right */}
        <mesh position={[0.08, 0.02, 0.17]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.05, 0.2]} castShadow>
          <coneGeometry args={[0.03, 0.08, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* NECK */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.25, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* SHOULDERS & UPPER TORSO */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[0.65, 0.3, 0.28]} />
        <meshStandardMaterial color="#fde047" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* MAIN TORSO - Fashion outfit */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.25]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Torso accent stripe */}
      <mesh position={[0, 0.95, 0.126]}>
        <boxGeometry args={[0.56, 0.1, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      {/* UPPER ARMS - Left */}
      <mesh position={[-0.38, 1.2, 0]} rotation={[0, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.45, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* UPPER ARMS - Right */}
      <mesh position={[0.38, 1.2, 0]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.45, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* LOWER ARMS - Left */}
      <mesh position={[-0.45, 0.88, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.4, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* LOWER ARMS - Right */}
      <mesh position={[0.45, 0.88, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.4, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* HANDS - Left */}
      <mesh position={[-0.53, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* HANDS - Right */}
      <mesh position={[0.53, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* WAIST/HIPS */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* UPPER LEGS - Left */}
      <mesh position={[-0.14, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.7, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* UPPER LEGS - Right */}
      <mesh position={[0.14, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.09, 0.7, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* LOWER LEGS - Left */}
      <mesh position={[-0.14, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* LOWER LEGS - Right */}
      <mesh position={[0.14, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* FEET - Left */}
      <mesh position={[-0.14, -0.7, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* FEET - Right */}
      <mesh position={[0.14, -0.7, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* BASE PLATFORM */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 32]} />
        <meshStandardMaterial
          color="#e5e5e5"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Platform border accent */}
      <mesh position={[0, -0.77, 0]}>
        <torusGeometry args={[0.4, 0.02, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function HeroSection() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [useAnimated] = useState(true);
  const [currentAction, setCurrentAction] = useState("wave");
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cycle through different actions every 5 seconds
  useEffect(() => {
    const actions = ["wave", "idle", "look", "tought", "neck"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % actions.length;
      setCurrentAction(actions[currentIndex]);
    }, 5000); // Change animation every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="w-full h-screen flex items-center -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 w-full transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div
            className={`text-center lg:text-left order-2 lg:order-1 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-black dark:text-white mb-4 sm:mb-5 md:mb-6 leading-tight tracking-tight transition-colors duration-300">
              Create Stunning{" "}
              <span className="relative inline-block px-1 sm:px-2">
                <span className="relative z-10 text-black dark:text-white">
                  Fashion Models
                </span>
                <span className="absolute inset-0 bg-yellow-300 dark:bg-yellow-400"></span>
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0 transition-colors duration-300">
              Transform your ideas into stunning visuals with AI-powered model
              generation. Professional quality in seconds, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base text-black dark:text-white bg-green-500 dark:bg-green-600 border-2 border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(63,63,70,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(63,63,70,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 font-semibold text-sm sm:text-base text-black dark:text-white bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(63,63,70,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(63,63,70,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right side - 3D Animated Humanoid - No border */}
          <div
            className={`relative aspect-square w-full max-w-md mx-auto lg:max-w-none order-1 lg:order-2 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
          >
            <div className="w-full h-full flex items-center justify-center">
              <Canvas shadows camera={{ position: [0, 1, 3], fov: 50 }}>
                <PerspectiveCamera makeDefault position={[0, 1, 2.5]} />
                <ambientLight intensity={0.7} />
                <pointLight
                  position={[-1, 2, 3]}
                  intensity={1.5}
                  color="#22c55e"
                />
                <pointLight
                  position={[1, 2, 3]}
                  intensity={1.5}
                  color="#fde047"
                />
                <pointLight position={[0, 3, -2]} intensity={1} color="white" />

                <Suspense fallback={null}>
                  {useAnimated ? (
                    <AnimatedModel
                      action={currentAction}
                      mousePosition={mousePosition}
                    />
                  ) : (
                    <FashionMannequin />
                  )}
                </Suspense>

                <Environment preset="studio" />
                <OrbitControls
                  target={[0, 1, 0]}
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                  autoRotate={false}
                />
              </Canvas>
            </div>
            {/* Animated gradient orbs - modern decorative elements */}
            <div
              className={`absolute -top-8 -right-8 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full blur-2xl opacity-30 -z-10 transition-all duration-1000 delay-500 ${isVisible ? "scale-100" : "scale-0"}`}
            ></div>
            <div
              className={`absolute -bottom-8 -left-8 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gradient-to-tr from-green-400 to-green-500 rounded-full blur-2xl opacity-30 -z-10 transition-all duration-1000 delay-600 ${isVisible ? "scale-100" : "scale-0"}`}
            ></div>
            <div
              className={`absolute top-1/2 -right-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-bl from-green-300 to-green-400 rounded-full blur-xl opacity-20 -z-10 transition-all duration-1000 delay-700 ${isVisible ? "scale-100" : "scale-0"}`}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
