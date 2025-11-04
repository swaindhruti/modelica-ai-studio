import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/studio");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white grid-bg">
      <div className="pt-8 px-8">
        <nav className="max-w-7xl mx-auto bg-white border-2 border-black px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-black">
                Modelica AI Studio
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-semibold text-black hover:text-green-500 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-semibold text-black hover:text-green-500 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-semibold text-black hover:text-green-500 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#contact"
                className="text-sm font-semibold text-black hover:text-green-500 transition-colors"
              >
                Contact Us
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 text-sm font-semibold text-black bg-white border-2 border-black hover:bg-zinc-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 text-sm font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
              >
                Start Now
              </button>
            </div>
          </div>
        </nav>
      </div>
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black mb-6 leading-tight">
            Create Stunning{" "}
            <span className="relative inline-block px-2">
              <span className="relative z-10 text-black">
                AI Fashion Models
              </span>
              <span className="absolute inset-0 bg-yellow-300"></span>
            </span>
          </h1>
          <p className="text-lg text-zinc-600 mb-10">
            Transform your ideas into stunning visuals with AI-powered model
            generation
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
