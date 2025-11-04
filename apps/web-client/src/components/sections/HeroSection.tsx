import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
      <div className="text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-black mb-6 leading-tight tracking-tight">
          Create Stunning{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">AI Fashion Models</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h1>
        <p className="text-lg text-zinc-700 mb-10">
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
  );
}
