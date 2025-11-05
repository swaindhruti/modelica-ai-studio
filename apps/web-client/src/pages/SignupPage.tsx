import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import toast from "react-hot-toast";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Suspense } from "react";
import AnimatedModel from "../components/AnimatedModel";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

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

  const signupMutation = useMutation({
    mutationFn: () => authApi.signup(email, password, username),
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || "Signup failed";
      toast.error(typeof message === "string" ? message : "Signup failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 grid-bg">
      {/* Left side - 3D Model */}
      <div className="hidden lg:flex items-center justify-center p-12">
        <div className="w-full max-w-lg aspect-square">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 1, 2.5]} />
            <ambientLight intensity={0.7} />
            <pointLight position={[-1, 2, 3]} intensity={1.5} color="#22c55e" />
            <pointLight position={[1, 2, 3]} intensity={1.5} color="#fde047" />
            <pointLight position={[0, 3, -2]} intensity={1} color="white" />

            <Suspense fallback={null}>
              <AnimatedModel action="wave" mousePosition={mousePosition} />
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

      {/* Right side - Signup Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 space-y-8">
            {/* Header */}
            <div className="text-center lg:text-left">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-black transition-colors mb-8"
              >
                <span>←</span> Back to Home
              </Link>
              <h1 className="text-4xl md:text-5xl font-medium text-black mb-3 tracking-tight">
                Get started
              </h1>
              <p className="text-lg text-zinc-600">
                Create your account and start designing stunning fashion models
              </p>
            </div>

            {/* Signup Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-black mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-zinc-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors rounded-none"
                  placeholder="coolcreator"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-zinc-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-colors rounded-none"
                  placeholder="min 8 characters"
                />
              </div>

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full px-8 py-4 font-semibold text-base text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {signupMutation.isPending ? (
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Sign in link */}
            <div className="text-center pt-4 border-t-2 border-zinc-100">
              <p className="text-sm text-zinc-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-black hover:text-green-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
