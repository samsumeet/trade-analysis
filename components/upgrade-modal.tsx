"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { CreditCard, ShieldCheck, Sparkles, UserRound, X } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const { startUpgradeCheckout, confirmUpgradeCheckout, user } = useAuth();
  const [cardholderName, setCardholderName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [cardNumber, setCardNumber] = useState("");
  const [checkoutId, setCheckoutId] = useState("");
  const [last4, setLast4] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"details" | "confirm">("details");

  const maskedCardPreview = useMemo(
    () => (last4 ? `•••• •••• •••• ${last4}` : ""),
    [last4]
  );

  useEffect(() => {
    setCardholderName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.email, user?.name]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setError("");
    setIsSubmitting(false);
    setStep("details");
    setCardNumber("");
    setCheckoutId("");
    setLast4("");
    onClose();
  };

  const handleStartCheckout = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const checkout = await startUpgradeCheckout({
        cardholderName,
        email,
        cardNumber
      });

      setCheckoutId(checkout.checkoutId);
      setLast4(checkout.cardLast4);
      setStep("confirm");
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCheckout = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await confirmUpgradeCheckout(checkoutId);
      onSuccess?.();
      handleClose();
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Payment confirmation failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-lg sm:items-center sm:p-4">
      <Card className="h-[92dvh] w-full overflow-hidden rounded-t-[28px] border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950 sm:h-auto sm:max-h-[90dvh] sm:max-w-4xl sm:rounded-[32px]">
        <CardContent className="grid h-full min-h-0 gap-0 overflow-hidden p-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-y-auto bg-[linear-gradient(135deg,#082f49,#1d4ed8,#0f766e)] px-4 pb-5 pt-4 text-white overscroll-contain sm:px-5 sm:pb-6 sm:pt-5 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-blue-200 sm:text-sm sm:tracking-[0.18em]">
                  Upgrade to Paid
                </p>
                <h2 className="mt-3 text-[1.65rem] font-semibold leading-tight sm:mt-4 sm:text-3xl">
                  Unlock unlimited stock analyses
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 sm:hidden"
                aria-label="Close upgrade dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-[13px] leading-5 text-slate-100 sm:mt-4 sm:text-sm sm:leading-7">
              Free accounts can analyze up to 5 stocks per day. Paid accounts can
              run unlimited live analyses with the same dashboard and AI workflow.
            </p>

            <div className="mt-5 grid gap-2.5 sm:mt-8 sm:gap-3">
              {[
                "Unlimited live stock analyses",
                "No daily cap after upgrade",
                "Backend-backed subscription state"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-[13px] leading-5 text-white/90 sm:px-4 sm:py-3 sm:text-sm sm:leading-6"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-3.5 sm:mt-8 sm:p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-blue-100 sm:text-xs sm:tracking-[0.18em]">
                Plan
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-semibold sm:text-4xl">$20</span>
                <span className="pb-1 text-sm text-slate-200">/ month</span>
              </div>
              <p className="mt-3 text-[13px] leading-5 text-slate-200 sm:text-sm sm:leading-6">
                Pro Trader gives the account unlimited daily analysis access.
              </p>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-4 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.85rem))] overscroll-contain sm:p-5 sm:pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] lg:p-8">
            <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 border-b border-slate-200/80 bg-white/95 px-4 pb-3 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:-mx-5 sm:-mt-5 sm:mb-5 sm:px-5 sm:pb-4 sm:pt-5 lg:static lg:m-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
                    Secure checkout
                  </p>
                  {step === "details" ? (
                    <>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl lg:text-2xl">
                        Enter payment details
                      </h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-7">
                        This checkout module upgrades the account immediately after confirmation.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl lg:text-2xl">
                        Confirm upgrade
                      </h3>
                      <p className="mt-2 text-[13px] leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-7">
                        Review the payment and confirm to activate unlimited stock analysis.
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 sm:inline-flex"
                  aria-label="Close upgrade dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {step === "details" ? (
              <>
                <div className="space-y-3 sm:space-y-4">
                  <FieldRow icon={UserRound}>
                    <Input
                      value={cardholderName}
                      onChange={(event) => setCardholderName(event.target.value)}
                      placeholder="Cardholder name"
                    />
                  </FieldRow>
                  <FieldRow icon={Sparkles}>
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Billing email"
                      type="email"
                    />
                  </FieldRow>
                  <FieldRow icon={CreditCard}>
                    <Input
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                    />
                  </FieldRow>
                </div>

                {error ? (
                  <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                    {error}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    onClick={handleStartCheckout}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Starting checkout..." : "Continue to Checkout"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Plan</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Pro Trader, billed at $20/month
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Payment method
                    </p>
                    <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {maskedCardPreview}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div className="flex items-start gap-2 text-sm font-medium leading-6 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="mt-1 h-4 w-4 shrink-0" />
                      <span>Upgrade will activate instantly after confirmation</span>
                    </div>
                  </div>
                </div>

                {error ? (
                  <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                    {error}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    onClick={handleConfirmCheckout}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Confirming..." : "Pay and Upgrade"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep("details")}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FieldRow({
  icon: Icon,
  children
}: {
  icon: typeof UserRound;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <div className="[&_input]:pl-11">{children}</div>
    </div>
  );
}
