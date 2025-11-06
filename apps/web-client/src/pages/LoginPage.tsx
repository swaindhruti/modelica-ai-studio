import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import type { ApiError } from "../types";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Suspense } from "react";
import AnimatedModel from "../components/AnimatedModel";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
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

  const loginMutation = useMutation({
    mutationFn: () => authApi.login(email, password),
    onSuccess: (response) => {
      const { token, user } = response.data;
      login(token, user);
      toast.success("Login successful!");
      navigate("/studio");
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 grid-bg">
      {/* Left side - 3D Model with decorative elements */}
      <div
        className={`hidden lg:flex items-center justify-center p-12 relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
      >
        <div className="w-full max-w-lg aspect-square relative">
          {/* Decorative text overlay */}
          <div className="absolute top-8 left-8 z-10">
            <h2 className="text-5xl font-medium text-black mb-2 tracking-tight">
              Welcome
            </h2>
            <h3 className="text-3xl font-medium tracking-tight">
              <span className="relative inline-block px-2">
                <span className="relative z-10 text-black">Back!</span>
                <span className="absolute inset-0 bg-yellow-300"></span>
              </span>
            </h3>
          </div>

          {/* Animated gradient orbs */}
          <div
            className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full blur-2xl opacity-30 -z-10 transition-all duration-1000 delay-300 ${isVisible ? "scale-100" : "scale-0"}`}
          ></div>
          <div
            className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-green-400 to-green-500 rounded-full blur-2xl opacity-30 -z-10 transition-all duration-1000 delay-400 ${isVisible ? "scale-100" : "scale-0"}`}
          ></div>

          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 1, 2.5]} />
            <ambientLight intensity={0.7} />
            <pointLight position={[-1, 2, 3]} intensity={1.5} color="#22c55e" />
            <pointLight position={[1, 2, 3]} intensity={1.5} color="#fde047" />
            <pointLight position={[0, 3, -2]} intensity={1} color="white" />

            <Suspense fallback={null}>
              <AnimatedModel action="idle" mousePosition={mousePosition} />
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
      </div>

      {/* Right side - Login Form */}
      <div
        className={`flex items-center justify-center p-6 lg:p-12 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
      >
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black transition-colors mb-8"
              >
                <span className="">←</span> Back to Home
              </Link>
              <h1 className="text-4xl md:text-5xl font-medium text-black mb-3 tracking-tight">
                Welcome back
              </h1>
              <p className="text-lg text-zinc-600">
                Sign in to continue creating amazing fashion models
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-zinc-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors rounded-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-zinc-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors rounded-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full px-8 py-4 font-semibold text-base text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center pt-4 border-t-2 border-zinc-100">
              <p className="text-sm text-zinc-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-black hover:text-green-500 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
