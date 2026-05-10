"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

type AuthMode = "google" | "register" | "login";
const GOOGLE_IDENTITY_SCRIPT_ID = "google-identity-services";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign in to unlock unlimited stock analysis",
  description = "You can explore one stock analysis without logging in. Create an account or continue with Gmail to analyze more tickers and keep your access synced."
}: AuthModalProps) {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>("google");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || mode !== "google" || !GOOGLE_CLIENT_ID) {
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response.credential) {
            setError("Google did not return a credential.");
            return;
          }

          setError("");
          setIsSubmitting(true);

          try {
            await loginWithGoogle(response.credential);
            onSuccess?.();
            onClose();
          } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Google sign-in failed.");
          } finally {
            setIsSubmitting(false);
          }
        }
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        type: "standard",
        text: "continue_with",
        shape: "pill",
        width: 320
      });
      setGoogleReady(true);
    };

    const existingScript = document.getElementById(GOOGLE_IDENTITY_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.accounts.id) {
        renderGoogleButton();
      } else {
        existingScript.addEventListener("load", renderGoogleButton, { once: true });
      }

      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_IDENTITY_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [isOpen, loginWithGoogle, mode, onClose, onSuccess]);

  if (!isOpen) {
    return null;
  }

  const submit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "google") {
        return;
      } else if (mode === "register") {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }

      onSuccess?.();
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-lg">
      <Card className="w-full max-w-3xl overflow-hidden rounded-[32px] border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(135deg,#0f172a,#1d4ed8,#0f766e)] p-8 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-200">Authentication Layer</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">{description}</p>
            <div className="mt-8 space-y-3">
              {[
                "One free stock analysis without login",
                "Unlimited ticker analysis after sign-in",
                "Continue with Gmail or create a basic account"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {[
                ["google", "Gmail"],
                ["register", "Create account"],
                ["login", "Log in"]
              ].map(([currentMode, label]) => (
                <button
                  key={currentMode}
                  type="button"
                  onClick={() => {
                    setMode(currentMode as AuthMode);
                    setError("");
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    mode === currentMode
                      ? "bg-slate-900 text-white dark:bg-blue-500"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {mode === "register" ? (
                <FieldRow icon={UserRound}>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Full name"
                  />
                </FieldRow>
              ) : null}

              {mode === "google" ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Continue with your Google account to create or access your AI Stock Analyses profile.
                  </p>
                  {GOOGLE_CLIENT_ID ? (
                    <div className="mt-5">
                      <div ref={googleButtonRef} className="min-h-11" />
                      {!googleReady ? (
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                          Loading Google sign-in...
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">
                      Google sign-in is not configured yet. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
                      in the frontend app to enable it.
                    </p>
                  )}
                </div>
              ) : (
                <FieldRow icon={Mail}>
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email address"
                    type="email"
                  />
                </FieldRow>
              )}

              {mode !== "google" ? (
                <FieldRow icon={LockKeyhole}>
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    type="password"
                  />
                </FieldRow>
              ) : null}
            </div>

            {error ? (
              <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {mode !== "google" ? (
                <Button type="button" onClick={submit} disabled={isSubmitting}>
                  {isSubmitting
                    ? "Please wait..."
                    : mode === "register"
                      ? "Create account"
                      : "Log in"}
                </Button>
              ) : null}
              <Button type="button" variant="secondary" onClick={onClose}>
                Maybe later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number>
          ) => void;
        };
      };
    };
  }
}

function FieldRow({
  icon: Icon,
  children
}: {
  icon: typeof Mail;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <div className="[&_input]:pl-11">{children}</div>
    </div>
  );
}
