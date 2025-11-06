import { useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export function LandingNavbar() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Entry animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 pt-4 md:pt-8 px-4 md:px-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      <nav className="max-w-7xl mx-auto bg-white border-2 border-black px-4 md:px-8 py-4 md:py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-black tracking-tight">
              Modelica AI Studio
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black hover:text-green-500 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Navigation Links - Desktop */}
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

          {/* Auth Buttons / User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 border-2 border-black flex items-center justify-center font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                  <svg
                    className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="p-4 border-b-2 border-black">
                      <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-black mt-1">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-zinc-600">
                          Credits:
                        </span>
                        <span className="text-sm font-bold text-green-500">
                          {user.credits}
                        </span>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate("/studio");
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-black hover:bg-green-500 transition-colors border-b-2 border-black"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Studio
                        </div>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-black hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-black bg-white border-2 border-black hover:bg-zinc-50 transition-colors tracking-wide"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                >
                  Start Now
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t-2 border-black"
          >
            <div className="flex flex-col space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide py-2"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide py-2"
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide py-2"
              >
                How it Works
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-black hover:text-green-500 transition-colors tracking-wide py-2"
              >
                Contact Us
              </a>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="flex flex-col gap-3 pt-3 border-t-2 border-black">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-semibold text-black bg-white border-2 border-black hover:bg-zinc-50 transition-colors tracking-wide"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                  >
                    Start Now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.div>
  );
}
