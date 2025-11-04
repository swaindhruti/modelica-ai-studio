import { create } from "zustand";

interface User {
  id: number;
  email: string;
  username: string;
  credits: number;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initAuth: () => void;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";
const EXPIRY_DAYS = 5;

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: User) => {
    // Calculate expiry date (5 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);

    console.log("🔐 Storing auth data", {
      tokenLength: token.length,
      user: user.username,
      expiryDate: expiryDate.toISOString(),
      expiryTimestamp: expiryDate.getTime(),
    });

    // Save to localStorage with expiry
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.getTime().toString());

    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);

    console.log("🔐 initAuth called", {
      hasToken: !!token,
      hasUser: !!userStr,
      hasExpiry: !!expiryStr,
      expiryStr,
    });

    // Check if token exists and is not expired
    if (token && userStr && expiryStr) {
      const expiryTime = parseInt(expiryStr, 10);
      const now = new Date().getTime();

      console.log("⏰ Token expiry check", {
        expiryTime: new Date(expiryTime).toISOString(),
        now: new Date(now).toISOString(),
        isValid: now < expiryTime,
        hoursRemaining: ((expiryTime - now) / (1000 * 60 * 60)).toFixed(2),
      });

      if (now < expiryTime) {
        // Token is still valid
        const user = JSON.parse(userStr);
        console.log("✅ Token valid, restoring auth state");
        set({ token, user, isAuthenticated: true });
      } else {
        // Token expired, clear everything
        console.log("❌ Token expired, clearing auth state");
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        set({ token: null, user: null, isAuthenticated: false });
      }
    } else {
      console.log("❌ Missing auth data in localStorage");
    }
  },
}));
