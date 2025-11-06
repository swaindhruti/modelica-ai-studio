import { useState } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const features = [
    {
      title: "AI-Powered Generation",
      description:
        "Advanced AI technology creates realistic fashion models tailored to your brand's vision",
    },
    {
      title: "Instant Results",
      description:
        "Generate professional-quality fashion models in seconds, not hours",
    },
    {
      title: "Customizable Styles",
      description:
        "Full control over poses, clothing, backgrounds, and styling details",
    },
    {
      title: "High Resolution",
      description:
        "Export images in stunning 4K resolution perfect for any marketing material",
    },
  ];

  return (
    <section
      ref={ref}
      id="features"
      className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-black dark:text-white mb-3 sm:mb-4 tracking-tight px-4 transition-colors duration-300">
          Powerful{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black dark:text-white">
              Features
            </span>
            <span className="absolute inset-0 bg-yellow-300 dark:bg-yellow-400"></span>
          </span>
        </h2>
        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto px-4 transition-colors duration-300">
          Everything you need to create stunning AI fashion models for your
          brand
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <FeatureCard feature={feature} />
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
}: {
  feature: { title: string; description: string };
}) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setRipple({ x, y });
  };

  const handleMouseLeave = () => {
    setRipple(null);
  };

  return (
    <div
      className="relative bg-white dark:bg-zinc-800 border-2 border-black dark:border-zinc-600 p-4 sm:p-6 overflow-hidden group cursor-pointer transition-colors duration-300"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radial gradient overlay that follows cursor */}
      {ripple && (
        <div
          className="absolute w-full h-full opacity-30 transition-all duration-500 ease-out"
          style={{
            left: 0,
            top: 0,
            background: `radial-gradient(circle 200px at ${ripple.x}% ${ripple.y}%, #22c55e 0%, #22c55e 20%, transparent 70%)`,
          }}
        ></div>
      )}

      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-2 tracking-tight transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
