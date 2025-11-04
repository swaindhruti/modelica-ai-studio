export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Generation",
      description:
        "Advanced AI technology creates realistic fashion models tailored to your brand's vision",
      icon: "✨",
    },
    {
      title: "Instant Results",
      description:
        "Generate professional-quality fashion models in seconds, not hours",
      icon: "⚡",
    },
    {
      title: "Customizable Styles",
      description:
        "Full control over poses, clothing, backgrounds, and styling details",
      icon: "🎨",
    },
    {
      title: "High Resolution",
      description:
        "Export images in stunning 4K resolution perfect for any marketing material",
      icon: "📸",
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
          <div
            key={index}
            className="bg-white border-2 border-black p-6 hover:translate-y-[-4px] transition-transform duration-200"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-black mb-2 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-zinc-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
