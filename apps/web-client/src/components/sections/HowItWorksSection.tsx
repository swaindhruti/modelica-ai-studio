export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Reference",
      description: "Upload clothing images or describe your vision in detail",
    },
    {
      number: "02",
      title: "Customize Parameters",
      description:
        "Select model features, poses, backgrounds, and styling preferences",
    },
    {
      number: "03",
      title: "Generate with AI",
      description:
        "Our advanced AI creates your perfect fashion model in seconds",
    },
    {
      number: "04",
      title: "Download & Use",
      description:
        "Export in high resolution and use across all your marketing channels",
    },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
          How It{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Works</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-lg text-zinc-700 max-w-2xl mx-auto">
          Get started in four simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex">
            <div className="bg-white border-2 border-black p-6 flex-1 flex flex-col">
              <div className="text-6xl font-bold text-green-500 mb-4 opacity-20">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-black mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-zinc-700 flex-grow">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
