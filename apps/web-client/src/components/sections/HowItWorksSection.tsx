import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);

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
    <section
      ref={ref}
      id="how-it-works"
      className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-black mb-3 sm:mb-4 tracking-tight px-4">
          How It{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Works</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto px-4">
          Get started in four simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="bg-white border-2 border-black p-4 sm:p-6 flex-1 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 cursor-pointer group">
              <div className="text-5xl sm:text-6xl font-bold text-green-500 mb-3 sm:mb-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                {step.number}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-700 flex-grow">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
