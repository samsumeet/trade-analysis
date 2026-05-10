"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Crown,
  Globe2,
  LayoutDashboard,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User
} from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PROFILE_STORAGE_KEY = "trade-analysis:investor-profile";

interface InvestorProfile {
  capitalRange: string;
  riskTolerance: string;
  investmentStyle: string[];
  sectors: string[];
  horizon: string;
  marketFocus: string[];
  notes: string;
}

const defaultProfile: InvestorProfile = {
  capitalRange: "",
  riskTolerance: "",
  investmentStyle: [],
  sectors: [],
  horizon: "",
  marketFocus: [],
  notes: ""
};

const capitalRanges = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-10k", label: "$1,000 – $10,000" },
  { value: "10k-50k", label: "$10,000 – $50,000" },
  { value: "50k-100k", label: "$50,000 – $100,000" },
  { value: "100k-500k", label: "$100,000 – $500,000" },
  { value: "500k-plus", label: "$500,000+" }
];

const riskOptions = [
  { value: "conservative", label: "Conservative", desc: "Preserve capital, low volatility", color: "emerald" },
  { value: "moderate", label: "Moderate", desc: "Balanced growth and safety", color: "blue" },
  { value: "aggressive", label: "Aggressive", desc: "High growth, high risk", color: "orange" },
  { value: "speculative", label: "Speculative", desc: "Short-term momentum plays", color: "red" }
];

const investmentStyles = [
  { value: "growth", label: "Growth", icon: TrendingUp },
  { value: "value", label: "Value", icon: Target },
  { value: "momentum", label: "Momentum", icon: BarChart3 },
  { value: "swing", label: "Swing Trading", icon: Sparkles },
  { value: "day-trading", label: "Day Trading", icon: Clock },
  { value: "long-term", label: "Long-Term Hold", icon: Briefcase }
];

const sectorOptions = [
  "Technology", "Financials", "Healthcare", "Consumer Discretionary",
  "Energy", "Industrials", "Materials", "Real Estate",
  "Communication Services", "Utilities", "Consumer Staples"
];

const horizonOptions = [
  { value: "intraday", label: "Intraday", desc: "Hours" },
  { value: "short", label: "Short-term", desc: "Days – weeks" },
  { value: "medium", label: "Medium-term", desc: "1 – 12 months" },
  { value: "long", label: "Long-term", desc: "1 – 3 years" },
  { value: "very-long", label: "Very long-term", desc: "3+ years" }
];

const marketFocusOptions = [
  { value: "us-large-cap", label: "US Large Cap" },
  { value: "us-mid-cap", label: "US Mid Cap" },
  { value: "us-small-cap", label: "US Small Cap" },
  { value: "international", label: "International" },
  { value: "etfs", label: "ETFs" },
  { value: "options", label: "Options" },
  { value: "crypto", label: "Crypto" }
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function ToggleChip({
  selected,
  onClick,
  children
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        selected
          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600"
      )}
    >
      {children}
    </button>
  );
}

export function ProfilePage() {
  const { user, isAuthenticated, isHydrated, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<InvestorProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<InvestorProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    async function loadProfile() {
      if (token) {
        setIsLoadingProfile(true);
        try {
          const response = await fetch("/api/profile", {
            headers: { "x-trade-session": token }
          });
          if (response.ok) {
            const data = (await response.json()) as { profile: InvestorProfile | null };
            if (data.profile) {
              setProfile(data.profile);
              setDraft(data.profile);
              window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
              return;
            }
          }
        } catch {
          // fall through to localStorage
        } finally {
          setIsLoadingProfile(false);
        }
      }

      // fallback: localStorage
      try {
        const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as InvestorProfile;
          setProfile(parsed);
          setDraft(parsed);
        }
      } catch {
        // ignore
      }
    }

    void loadProfile();
  }, [isAuthenticated, isHydrated, router, token]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
    setSaved(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      if (token) {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-trade-session": token
          },
          body: JSON.stringify(draft)
        });

        if (response.ok) {
          const data = (await response.json()) as { profile: InvestorProfile };
          const saved = data.profile ?? draft;
          setProfile(saved);
          window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(saved));
          setIsEditing(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          return;
        }

        setSaveError("Failed to save to server. Changes saved locally.");
      }
    } catch {
      setSaveError("Failed to save to server. Changes saved locally.");
    } finally {
      setIsSaving(false);
    }

    // Fallback: save to localStorage only
    setProfile(draft);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft));
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const toggleMulti = (field: "investmentStyle" | "sectors" | "marketFocus", value: string) => {
    setDraft((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value]
    }));
  };

  const isFreeUser = user.accountTier === "free";

  return (
    <>
      <main className="min-h-screen pb-16">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_26%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,8,23,1))]" />
          <SiteHeader
            navItems={[
              { href: "/", label: "Home" },
              { href: "/dashboard", label: "Dashboard" }
            ]}
          />
        </div>

        <div className="container mt-10 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <a href="/dashboard" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
              <LayoutDashboard size={14} />
              Dashboard
            </a>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-white">Profile</span>
          </nav>

          {/* Profile header card */}
          <Card className="overflow-hidden rounded-[28px] border-slate-200/70 shadow-soft dark:border-slate-800">
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-8 py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-2xl font-bold text-white shadow-lg">
                    {getInitials(user.name)}
                  </span>
                  <div>
                    <h1 className="text-2xl font-semibold text-white">{user.name}</h1>
                    <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {isFreeUser ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300">
                          Free plan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                          <Crown size={11} />
                          Pro plan
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300">
                        <ShieldCheck size={11} />
                        {user.provider === "google" ? "Google account" : "Email account"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400">
                      Saved!
                    </span>
                  )}
                  {isEditing ? (
                    <>
                      <Button type="button" variant="ghost" size="sm" onClick={handleCancel}
                        className="text-slate-300 hover:bg-white/10 hover:text-white">
                        Cancel
                      </Button>
                      <Button type="button" size="sm" onClick={() => void handleSave()} disabled={isSaving} className="gap-2">
                        <Save size={14} />
                        {isSaving ? "Saving…" : "Save profile"}
                      </Button>
                    </>
                  ) : (
                    <Button type="button" variant="secondary" size="sm" onClick={handleEdit} className="gap-2">
                      <Pencil size={14} />
                      Edit profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Account stats strip */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800 sm:grid-cols-4">
              {[
                { label: "Account tier", value: isFreeUser ? "Free" : "Pro" },
                { label: "Daily limit", value: user.dailyAnalysisLimit ? `${user.dailyAnalysisLimit} analyses` : "Unlimited" },
                { label: "Subscription", value: user.subscriptionStatus === "active" ? "Active" : "Inactive" },
                { label: "Plan", value: user.subscriptionPlan === "pro-monthly" ? "Pro Monthly" : "Free" }
              ].map(({ label, value }) => (
                <div key={label} className="px-5 py-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Investor preferences */}
          <div className="mt-8 grid gap-6">

            {/* Capital to deploy */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CircleDollarSign size={18} className="text-blue-500" />
                  Capital to deploy
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  How much capital are you typically working with per trade or portfolio?
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {capitalRanges.map((opt) => (
                    <ToggleChip
                      key={opt.value}
                      selected={isEditing ? draft.capitalRange === opt.value : profile.capitalRange === opt.value}
                      onClick={() => isEditing && setDraft((p) => ({ ...p, capitalRange: opt.value }))}
                    >
                      {opt.label}
                    </ToggleChip>
                  ))}
                </div>
                {!isEditing && !profile.capitalRange && (
                  <p className="mt-2 text-sm text-slate-400 italic">Not set — click Edit profile to configure.</p>
                )}
              </CardContent>
            </Card>

            {/* Risk tolerance */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Risk tolerance
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  How much risk are you comfortable taking in your positions?
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {riskOptions.map((opt) => {
                    const active = isEditing ? draft.riskTolerance === opt.value : profile.riskTolerance === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => isEditing && setDraft((p) => ({ ...p, riskTolerance: opt.value }))}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/40"
                            : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50",
                          !isEditing && "cursor-default"
                        )}
                      >
                        <p className="font-medium text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {!isEditing && !profile.riskTolerance && (
                  <p className="mt-2 text-sm text-slate-400 italic">Not set — click Edit profile to configure.</p>
                )}
              </CardContent>
            </Card>

            {/* Investment style */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp size={18} className="text-indigo-500" />
                  Investment style
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select all styles that apply to your trading approach.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {investmentStyles.map(({ value, label, icon: Icon }) => {
                    const selected = isEditing
                      ? draft.investmentStyle.includes(value)
                      : profile.investmentStyle.includes(value);
                    return (
                      <ToggleChip
                        key={value}
                        selected={selected}
                        onClick={() => isEditing && toggleMulti("investmentStyle", value)}
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon size={13} />
                          {label}
                        </span>
                      </ToggleChip>
                    );
                  })}
                </div>
                {!isEditing && profile.investmentStyle.length === 0 && (
                  <p className="mt-2 text-sm text-slate-400 italic">Not set — click Edit profile to configure.</p>
                )}
              </CardContent>
            </Card>

            {/* Preferred sectors */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2 size={18} className="text-cyan-500" />
                  Preferred sectors
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Which market sectors do you focus on or want analyzed?
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {sectorOptions.map((sector) => (
                    <ToggleChip
                      key={sector}
                      selected={isEditing ? draft.sectors.includes(sector) : profile.sectors.includes(sector)}
                      onClick={() => isEditing && toggleMulti("sectors", sector)}
                    >
                      {sector}
                    </ToggleChip>
                  ))}
                </div>
                {!isEditing && profile.sectors.length === 0 && (
                  <p className="mt-2 text-sm text-slate-400 italic">Not set — click Edit profile to configure.</p>
                )}
              </CardContent>
            </Card>

            {/* Investment horizon */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock size={18} className="text-violet-500" />
                  Investment horizon
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  What's your typical holding period?
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {horizonOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => isEditing && setDraft((p) => ({ ...p, horizon: opt.value }))}
                      className={cn(
                        "rounded-xl border px-4 py-2.5 text-left transition-all",
                        (isEditing ? draft.horizon === opt.value : profile.horizon === opt.value)
                          ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/40"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50",
                        !isEditing && "cursor-default"
                      )}
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{opt.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {!isEditing && !profile.horizon && (
                  <p className="mt-2 text-sm text-slate-400 italic">Not set — click Edit profile to configure.</p>
                )}
              </CardContent>
            </Card>

            {/* Market focus */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 size={18} className="text-amber-500" />
                  Market & instrument focus
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  What types of markets or instruments do you trade?
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {marketFocusOptions.map((opt) => (
                    <ToggleChip
                      key={opt.value}
                      selected={isEditing ? draft.marketFocus.includes(opt.value) : profile.marketFocus.includes(opt.value)}
                      onClick={() => isEditing && toggleMulti("marketFocus", opt.value)}
                    >
                      {opt.label}
                    </ToggleChip>
                  ))}
                </div>
                {!isEditing && profile.marketFocus.length === 0 && (
                  <p className="mt-2 text-sm text-slate-400 italic">Not set — click Edit profile to configure.</p>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="rounded-[24px] border-slate-200/70 shadow-none dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User size={18} className="text-slate-500" />
                  Investor notes
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Anything else about your strategy, goals, or preferences.
                </p>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={draft.notes}
                    onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
                    rows={4}
                    placeholder="e.g. I focus on high-momentum breakouts above VWAP in the first hour..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-950"
                  />
                ) : profile.notes ? (
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{profile.notes}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No notes — click Edit profile to add.</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Save bar at bottom when editing */}
          {isEditing && (
            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 px-6 py-4 dark:border-blue-900 dark:bg-blue-950/30">
              <div className="flex items-center justify-end gap-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">Unsaved changes</p>
                <Button type="button" variant="secondary" size="sm" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                <Button type="button" size="sm" onClick={() => void handleSave()} disabled={isSaving} className="gap-2">
                  <Save size={14} />
                  {isSaving ? "Saving…" : "Save profile"}
                </Button>
              </div>
              {saveError && (
                <p className="mt-3 text-right text-xs text-amber-600 dark:text-amber-400">{saveError}</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
