import { useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function LandingNavbar() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 pt-8 px-8"
    >
      <nav className="max-w-7xl mx-auto bg-white border-2 border-black px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-black tracking-tight">
              Modelica AI Studio
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide"
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide"
            >
              How it Works
            </a>
            <a
              href="#contact"
              className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide"
            >
              Contact Us
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-sm font-semibold text-black bg-white border-2 border-black hover:bg-zinc-50 transition-colors tracking-wide"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 text-sm font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
            >
              Start Now
            </button>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}
