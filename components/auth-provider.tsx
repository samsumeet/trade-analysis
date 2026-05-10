"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  AnalysisAllowance,
  AuthSuccessResponse,
  AuthUser,
  GuestUsage,
  PaymentCheckoutPreview
} from "@/types/auth";

const AUTH_STORAGE_KEY = "trade-analysis:auth-session";
const GUEST_ID_STORAGE_KEY = "trade-analysis:guest-id";

type StoredAuthSession = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  guestId: string;
  guestUsage: GuestUsage | null;
  allowance: AnalysisAllowance | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setGuestUsage: (usage: GuestUsage | null) => void;
  setAllowance: (allowance: AnalysisAllowance | null) => void;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  startUpgradeCheckout: (input: {
    cardholderName: string;
    email: string;
    cardNumber: string;
  }) => Promise<PaymentCheckoutPreview>;
  confirmUpgradeCheckout: (checkoutId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function generateGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

async function handleAuthRequest(
  input: RequestInfo,
  init?: RequestInit
): Promise<AuthSuccessResponse> {
  const response = await fetch(input, init);
  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    token?: string;
    user?: AuthUser;
    allowance?: AnalysisAllowance | null;
  };

  if (!response.ok || !payload.token || !payload.user) {
    throw new Error(payload.error ?? "Authentication request failed.");
  }

  return {
    token: payload.token,
    user: payload.user,
    allowance: payload.allowance ?? null
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [guestId, setGuestId] = useState("");
  const [guestUsage, setGuestUsage] = useState<GuestUsage | null>(null);
  const [allowance, setAllowance] = useState<AnalysisAllowance | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    try {
      const storedGuestId = window.localStorage.getItem(GUEST_ID_STORAGE_KEY);
      const nextGuestId = storedGuestId || generateGuestId();
      setGuestId(nextGuestId);
      window.localStorage.setItem(GUEST_ID_STORAGE_KEY, nextGuestId);
    } catch {
      setGuestId(generateGuestId());
    }

    try {
      const storedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedSession) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(storedSession) as StoredAuthSession;

      if (parsed?.token && parsed?.user) {
        setToken(parsed.token);
        setUser(parsed.user);
        void fetch("/api/auth/session", {
          headers: {
            "x-trade-session": parsed.token
          }
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("Session expired.");
            }

            const payload = (await response.json()) as {
              user?: AuthUser;
              token?: string;
              allowance?: AnalysisAllowance | null;
            };

            if (!isMounted || !payload.user || !payload.token) {
              return;
            }

            setUser(payload.user);
            setToken(payload.token);
            setAllowance(payload.allowance ?? null);
            window.localStorage.setItem(
              AUTH_STORAGE_KEY,
              JSON.stringify({ token: payload.token, user: payload.user })
            );
          })
          .catch(() => {
            if (!isMounted) {
              return;
            }

            setToken(null);
            setUser(null);
            setAllowance(null);
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
          });
      }
    } catch {
      setToken(null);
      setUser(null);
      setAllowance(null);
    }

    setIsHydrated(true);

    return () => {
      isMounted = false;
    };
  }, []);

  const saveSession = (session: StoredAuthSession) => {
    setToken(session.token);
    setUser(session.user);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setGuestUsage(null);
  };

  const login = async (input: { email: string; password: string }) => {
    const session = await handleAuthRequest("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    saveSession(session);
    setAllowance(session.allowance ?? null);
  };

  const register = async (input: { name: string; email: string; password: string }) => {
    const session = await handleAuthRequest("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    saveSession(session);
    setAllowance(session.allowance ?? null);
  };

  const loginWithGoogle = async (credential: string) => {
    const session = await handleAuthRequest("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ credential })
    });

    saveSession(session);
    setAllowance(session.allowance ?? null);
  };

  const logout = async () => {
    if (token) {
      await fetch("/api/auth/session", {
        method: "DELETE",
        headers: {
          "x-trade-session": token
        }
      }).catch(() => undefined);
    }

    setToken(null);
    setUser(null);
    setGuestUsage(null);
    setAllowance(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const startUpgradeCheckout = async (input: {
    cardholderName: string;
    email: string;
    cardNumber: string;
  }) => {
    if (!token) {
      throw new Error("Please sign in before upgrading.");
    }

    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trade-session": token
      },
      body: JSON.stringify(input)
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      checkout?: PaymentCheckoutPreview;
    };

    if (!response.ok || !payload.checkout) {
      throw new Error(payload.error ?? "Failed to start checkout.");
    }

    return payload.checkout;
  };

  const confirmUpgradeCheckout = async (checkoutId: string) => {
    if (!token) {
      throw new Error("Please sign in before confirming payment.");
    }

    const response = await fetch("/api/billing/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-trade-session": token
      },
      body: JSON.stringify({ checkoutId })
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      user?: AuthUser;
      allowance?: AnalysisAllowance | null;
    };

    if (!response.ok || !payload.user) {
      throw new Error(payload.error ?? "Failed to confirm payment.");
    }

    setUser(payload.user);
    setAllowance(payload.allowance ?? null);
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token, user: payload.user })
    );
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      guestId,
      guestUsage,
      allowance,
      isAuthenticated: Boolean(user && token),
      isHydrated,
      setGuestUsage,
      setAllowance,
      login,
      register,
      loginWithGoogle,
      logout,
      startUpgradeCheckout,
      confirmUpgradeCheckout
    }),
    [allowance, guestId, guestUsage, isHydrated, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
