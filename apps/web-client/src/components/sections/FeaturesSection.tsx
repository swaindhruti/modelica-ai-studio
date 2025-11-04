import { useState } from "react";

export function FeaturesSection() {
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
    <section id="features" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
          Powerful{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Features</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-lg text-zinc-700 max-w-2xl mx-auto">
          Everything you need to create stunning AI fashion models for your
          brand
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
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
      className="relative bg-white border-2 border-black p-6 overflow-hidden group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radial gradient overlay that follows cursor */}
      {ripple && (
        <div
          className="absolute w-full h-full opacity-30 transition-opacity duration-300"
          style={{
            left: 0,
            top: 0,
            background: `radial-gradient(circle at ${ripple.x}% ${ripple.y}%, #22c55e 0%, transparent 60%)`,
          }}
        ></div>
      )}

      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-black mb-2 tracking-tight">
          {feature.title}
        </h3>
        <p className="text-zinc-700">{feature.description}</p>
      </div>
    </div>
  );
}
