import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
          Get In{" "}
          <span className="relative inline-block px-2">
            <span className="relative z-10 text-black">Touch</span>
            <span className="absolute inset-0 bg-yellow-300"></span>
          </span>
        </h2>
        <p className="text-lg text-zinc-700 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-2 border-black p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 font-semibold text-black bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
