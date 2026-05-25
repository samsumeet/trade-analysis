"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { LockKeyhole, Mail, Sparkles, UserRound, X } from "lucide-react";

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
  initialMode?: AuthMode;
}

type AuthMode = "google" | "register" | "login";
const GOOGLE_IDENTITY_SCRIPT_ID = "google-identity-services";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign in to unlock unlimited stock analysis",
  description = "You can explore one stock analysis without logging in. Create an account or continue with Gmail to analyze more tickers and keep your access synced.",
  initialMode = "google"
}: AuthModalProps) {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
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
        width: typeof window !== "undefined" && window.innerWidth < 420 ? 280 : 320
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
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-lg sm:items-center sm:p-4">
      <Card className="h-[84dvh] w-full overflow-hidden rounded-t-[24px] border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950 sm:h-auto sm:max-h-[90dvh] sm:max-w-3xl sm:rounded-[28px]">
        <CardContent className="grid h-full min-h-0 gap-0 overflow-hidden p-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden overflow-y-auto bg-[linear-gradient(135deg,#0f172a,#1d4ed8,#0f766e)] px-4 pb-4 pt-4 text-white overscroll-contain lg:block lg:p-8">
            <div className="flex items-start justify-between gap-4 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-blue-100">
                <Sparkles className="h-3.5 w-3.5" />
                Access unlocked
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
                aria-label="Close authentication dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-blue-200 sm:mt-0 sm:text-sm">
              Authentication Layer
            </p>
            <h2 className="mt-2.5 text-[1.35rem] font-semibold leading-tight sm:mt-4 sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2.5 text-[13px] leading-5 text-slate-200 sm:mt-4 sm:text-sm sm:leading-7">
              {description}
            </p>
            <div className="mt-4 grid gap-2 sm:mt-8 sm:space-y-0">
              {[
                "One free stock analysis without login",
                "Unlimited ticker analysis after sign-in",
                "Continue with Gmail or create a basic account"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-[12px] leading-5 text-white/90 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden p-3.5 pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] sm:p-8">
            <div className="sticky top-0 z-10 -mx-3.5 -mt-3.5 border-b border-slate-200/80 bg-white/95 px-3.5 pb-3 pt-3.5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:static sm:m-0 sm:border-0 sm:bg-transparent sm:p-0">
              <div className="mb-3 flex items-start justify-between gap-4 lg:hidden">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
                    Continue
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-slate-950 dark:text-slate-50">
                    {mode === "google"
                      ? "Continue with Gmail"
                      : mode === "register"
                        ? "Create your account"
                        : "Log in to continue"}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close authentication dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden items-start justify-between gap-4 lg:flex">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Continue
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Pick Gmail, create an account, or log in.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close authentication dialog"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-0 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-2">
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
                    className={`w-full rounded-2xl px-3 py-2.5 text-[13px] font-medium transition sm:w-auto sm:rounded-full sm:px-4 sm:py-2 sm:text-sm ${
                      mode === currentMode
                        ? "bg-slate-900 text-white dark:bg-blue-500"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto overscroll-contain pr-0.5 space-y-3 sm:mt-6 sm:space-y-4">
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
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/70 sm:p-5">
                  <p className="text-[13px] leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-7">
                    Continue with your Google account to create or access your AI Stock Analyses profile.
                  </p>
                  {GOOGLE_CLIENT_ID ? (
                    <p className="mt-3 text-[12px] leading-5 text-slate-500 dark:text-slate-400 sm:mt-4 sm:text-sm">
                      Use the secure Google button below to continue.
                    </p>
                  ) : (
                    <p className="mt-3 text-[13px] text-amber-600 dark:text-amber-400 sm:mt-4 sm:text-sm">
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
              <p className="mt-3.5 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] leading-5 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300 sm:mt-4 sm:px-4 sm:py-3 sm:text-sm sm:leading-6">
                {error}
              </p>
            ) : null}

            <div className="mt-3 border-t border-slate-200/80 bg-white/95 pt-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:mt-6 sm:border-0 sm:bg-transparent sm:pt-0">
              {mode === "google" && GOOGLE_CLIENT_ID ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/70 sm:max-w-fit sm:p-0 sm:border-0 sm:bg-transparent">
                  <div ref={googleButtonRef} className="min-h-10 overflow-hidden" />
                  {!googleReady ? (
                    <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400 sm:text-sm">
                      Loading Google sign-in...
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:flex-row sm:flex-wrap sm:gap-3">
                {mode !== "google" ? (
                  <Button type="button" onClick={submit} disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting
                      ? "Please wait..."
                      : mode === "register"
                        ? "Create account"
                        : "Log in"}
                  </Button>
                ) : null}
                <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                  Maybe later
                </Button>
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400 sm:hidden">
              Choose Gmail for the smallest flow, or create an account with basic details.
            </p>
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
      <div className="[&_input]:h-10 [&_input]:pl-11 [&_input]:text-[13px] sm:[&_input]:h-11 sm:[&_input]:text-sm">
        {children}
      </div>
    </div>
  );
}
