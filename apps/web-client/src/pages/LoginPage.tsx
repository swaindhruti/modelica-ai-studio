import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import toast from "react-hot-toast";
import type { ApiError } from "../types";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { theme, toggleTheme } = useThemeStore();

  const loginMutation = useMutation({
    mutationFn: () => authApi.login(email, password),
    onSuccess: (response) => {
      const { token, user } = response.data;
      login(token, user);
      toast.success("Login successful!");
      navigate("/studio");
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    loginMutation.mutate();
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
      <div className="absolute top-10 left-10 w-24 h-24 bg-accent-orange dark:bg-dark-accent brutal-border brutal-shadow rotate-12 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent-yellow dark:bg-dark-primary brutal-border brutal-shadow -rotate-6 hidden md:block" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-5xl font-black text-border dark:text-dark-text mb-4 uppercase">
            Welcome Back!
          </h2>
          <p className="text-lg font-bold text-border dark:text-dark-text">
            Sign in to continue creating
          </p>
          <p className="mt-2 text-sm font-medium text-border dark:text-dark-text">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-secondary dark:text-dark-accent underline font-bold hover:translate-x-1 inline-block transition-transform"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card-brutal space-y-6">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-brutal w-full text-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-primary w-full text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
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
