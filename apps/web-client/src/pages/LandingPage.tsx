import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/sections/HeroSection";
import { FeaturesSection } from "../components/sections/FeaturesSection";
import { PricingSection } from "../components/sections/PricingSection";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { ContactSection } from "../components/sections/ContactSection";
import { Footer } from "../components/Footer";

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
      <LandingNavbar />

      {/* Add top padding to account for fixed navbar */}
      <div className="pt-32">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <HowItWorksSection />
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
}
