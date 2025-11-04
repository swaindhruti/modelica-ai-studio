import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { useThemeStore } from "../store/themeStore";
import toast from "react-hot-toast";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const signupMutation = useMutation({
    mutationFn: () => authApi.signup(email, password, username),
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || "Signup failed";
      toast.error(typeof message === "string" ? message : "Signup failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-dark-bg px-4 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className="bg-primary dark:bg-dark-primary text-border dark:text-dark-bg font-bold py-2 px-4 brutal-border brutal-shadow-sm brutal-hover uppercase text-sm"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-28 h-28 bg-secondary dark:bg-dark-accent brutal-border brutal-shadow -rotate-12 hidden md:block" />
      <div className="absolute bottom-20 left-20 w-20 h-20 bg-primary dark:bg-dark-primary brutal-border brutal-shadow rotate-45 hidden md:block" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-5xl font-black text-border dark:text-dark-text mb-4 uppercase">
            Join Us!
          </h2>
          <p className="text-lg font-bold text-border dark:text-dark-text">
            Create your free account
          </p>
          <p className="mt-2 text-sm font-medium text-border dark:text-dark-text">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary dark:text-dark-accent underline font-bold hover:translate-x-1 inline-block transition-transform"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card-brutal space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-border dark:text-dark-text mb-2 uppercase"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-brutal w-full text-lg"
                placeholder="coolcreator"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-border dark:text-dark-text mb-2 uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-brutal w-full text-lg"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-border dark:text-dark-text mb-2 uppercase"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-brutal w-full text-lg"
                placeholder="min 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="btn-primary w-full text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signupMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm font-bold text-secondary dark:text-dark-primary hover:underline uppercase"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
