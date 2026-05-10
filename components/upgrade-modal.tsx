"use client";

import { ReactNode, useMemo, useState } from "react";
import { CreditCard, ShieldCheck, Sparkles, UserRound } from "lucide-react";

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

  if (!isOpen) {
    return null;
  }

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
      onClose();
      setStep("details");
      setCardNumber("");
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Payment confirmation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-lg">
      <Card className="w-full max-w-4xl overflow-hidden rounded-[32px] border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[linear-gradient(135deg,#082f49,#1d4ed8,#0f766e)] p-8 text-white">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-200">Upgrade to Paid</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Unlock unlimited stock analyses
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-100">
              Free accounts can analyze up to 3 stocks per day. Paid accounts can
              run unlimited live analyses with the same dashboard and AI workflow.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Unlimited live stock analyses",
                "No daily cap after upgrade",
                "Backend-backed subscription state"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Plan</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold">$20</span>
                <span className="pb-1 text-sm text-slate-200">/ month</span>
              </div>
              <p className="mt-3 text-sm text-slate-200">
                Pro Trader gives the account unlimited daily analysis access.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {step === "details" ? (
              <>
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  Enter payment details
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  This checkout module upgrades the account immediately after confirmation.
                </p>

                <div className="mt-6 space-y-4">
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
                  <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button type="button" onClick={handleStartCheckout} disabled={isSubmitting}>
                    {isSubmitting ? "Starting checkout..." : "Continue to Checkout"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  Confirm upgrade
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Review the payment and confirm to activate unlimited stock analysis.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Plan</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      Pro Trader, billed at $20/month
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Payment method</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {maskedCardPreview}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      Upgrade will activate instantly after confirmation
                    </div>
                  </div>
                </div>

                {error ? (
                  <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button type="button" onClick={handleConfirmCheckout} disabled={isSubmitting}>
                    {isSubmitting ? "Confirming..." : "Pay and Upgrade"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep("details")}
                    disabled={isSubmitting}
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
