import { useState } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export function ContactSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      ref={ref}
      id="contact"
      className={`max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-black mb-3 sm:mb-4 tracking-tight px-4">
          Get In{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Touch</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto px-4">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Contact Form */}
        <div
          className={`bg-white border-2 border-black p-6 sm:p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-black mb-2 tracking-wide"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black mb-2 tracking-wide"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-black mb-2 tracking-wide"
              >
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info & Social Links */}
        <div
          className={`space-y-4 sm:space-y-6 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          <div className="bg-white border-2 border-black p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-black mb-4 sm:mb-6 tracking-tight">
              Connect With Us
            </h3>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-black mb-1 tracking-wide">
                  Email
                </p>
                <p className="text-sm sm:text-base text-zinc-700">
                  support@modelica.ai
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-black mb-1 tracking-wide">
                  Hours
                </p>
                <p className="text-sm sm:text-base text-zinc-700">
                  Monday-Friday, 9am-5pm EST
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-black mb-3 sm:mb-4 tracking-wide">
                Follow Us
              </p>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                >
                  Twitter
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                >
                  GitHub
                </a>
              </div>
              <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                >
                  LinkedIn
                </a>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center font-semibold text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 tracking-wide"
                >
                  Dribbble
                </a>
              </div>
            </div>
          </div>

          <div className="bg-yellow-300 border-2 border-black p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-black mb-2 tracking-tight">
              Quick Response
            </h4>
            <p className="text-black text-xs sm:text-sm">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
