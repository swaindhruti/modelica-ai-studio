import { useNavigate } from "react-router-dom";

export function PricingSection() {
  const navigate = useNavigate();

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
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
          Simple{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Pricing</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-lg text-zinc-700 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white border-2 border-black p-8 ${
              plan.highlighted ? "bg-green-50" : ""
            }`}
          >
            <h3 className="text-2xl font-semibold text-black mb-2 tracking-tight">
              {plan.name}
            </h3>
            <div className="mb-6">
              <span className="text-5xl font-bold text-black">
                {plan.price}
              </span>
              <span className="text-zinc-700">/month</span>
            </div>
            <p className="text-sm font-semibold text-zinc-700 mb-6">
              {plan.credits} credits
            </p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-zinc-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/signup")}
              className={`w-full px-6 py-3 font-semibold text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 ${
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
