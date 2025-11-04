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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative bg-white border-2 border-black p-6 overflow-hidden group"
          >
            {/* Gradient overlay that appears on hover */}
            <div className="absolute top-0 left-0 w-0 h-0 bg-gradient-to-br from-green-500 to-transparent opacity-0 group-hover:w-full group-hover:h-full group-hover:opacity-20 transition-all duration-500 ease-out"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-black mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-zinc-700">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
