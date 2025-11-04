import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black mb-6 leading-tight tracking-tight">
            Create Stunning{" "}
            <span className="relative inline-block px-2">
              <span className="relative z-10 text-black">Fashion Models</span>
              <span className="absolute inset-0 bg-yellow-300"></span>
            </span>
          </h1>
          <p className="text-lg text-zinc-700 mb-10">
            Transform your ideas into stunning visuals with AI-powered model
            generation. Professional quality in seconds, not hours.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
            >
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right side - 3D Model placeholder */}
        <div className="relative">
          <div className="bg-white border-2 border-black p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-green-500 via-yellow-300 to-white border-2 border-black"></div>
              <p className="text-sm font-semibold text-zinc-600 tracking-wide">
                3D Fashion Model Preview
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 border-2 border-black -z-10"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500 border-2 border-black -z-10"></div>
        </div>
      </div>
    </section>
  );
}
