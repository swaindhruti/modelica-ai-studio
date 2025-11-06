import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export function PricingSection() {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation(0.2);

  const plans = [
    {
      name: "Starter",
      price: "$29",
      credits: "100",
      features: [
        "100 AI generations per month",
        "HD quality exports",
        "Basic customization",
        "Email support",
      ],
    },
    {
      name: "Professional",
      price: "$79",
      credits: "500",
      features: [
        "500 AI generations per month",
        "4K quality exports",
        "Advanced customization",
        "Priority support",
        "Commercial license",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      credits: "Unlimited",
      features: [
        "Unlimited AI generations",
        "8K quality exports",
        "Full customization suite",
        "24/7 dedicated support",
        "API access",
        "Custom integrations",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      id="pricing"
      className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-black mb-3 sm:mb-4 tracking-tight px-4">
          Simple{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Pricing</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto px-4">
          Choose the perfect plan for your needs. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border-2 border-black p-6 sm:p-8 flex flex-col transition-all duration-700 ease-in-out hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer group ${
              plan.highlighted
                ? "bg-green-50 hover:bg-green-100"
                : "bg-white hover:bg-green-50"
            } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <div className="flex-grow">
              <h3 className="text-xl sm:text-2xl font-semibold text-black mb-2 tracking-tight transition-colors duration-500 group-hover:text-green-600">
                {plan.name}
              </h3>
              <div className="mb-4 sm:mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-black transition-colors duration-500 group-hover:text-green-600">
                  {plan.price}
                </span>
                <span className="text-sm sm:text-base text-zinc-700">
                  /month
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-zinc-700 mb-4 sm:mb-6 transition-colors duration-500 group-hover:text-zinc-900">
                {plan.credits} credits
              </p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2 text-sm sm:text-base transition-all duration-500 group-hover:scale-125">
                      ✓
                    </span>
                    <span className="text-sm sm:text-base text-zinc-700 transition-colors duration-500 group-hover:text-black">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className={`w-full px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 ${
                plan.highlighted ? "bg-green-500" : "bg-white"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
