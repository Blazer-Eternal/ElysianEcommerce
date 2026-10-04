import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { LoginPayload, SignupPayload } from "../types/user.types";
import { authService } from "../services/authService";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "../constants/config";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  googleVerify: (email: string, otp: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  // Same-origin tabs share localStorage, so the most recent login is the session
  // every tab uses — without this, a tab still showing "Admin Dashboard" would
  // silently act under another account's token. Sync on cross-tab changes.
  useEffect(() => {
    const syncFromStorage = () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          return;
        } catch {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      setToken(null);
      setUser(null);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === TOKEN_STORAGE_KEY || event.key === USER_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }, []);

  const googleVerify = useCallback(async (email: string, otp: string) => {
    const response = await authService.googleVerify(email, otp);
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    await authService.signup(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      login,
      signup,
      logout,
      googleVerify,
    }),
    [user, token, isLoading, login, signup, logout, googleVerify]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
