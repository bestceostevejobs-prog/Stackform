"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ArrowRight } from "@phosphor-icons/react";
import { api } from "@/convex/_generated/api";
import {
  CHECKOUT_CANCEL_PATH,
  CHECKOUT_SUCCESS_PATH,
  PRO_PRICE_ID,
} from "@/lib/stripe/config";

// Always pass priceId from lib/stripe/config.ts. Do not inline. See post-mortem.

type UpgradeButtonProps = {
  priceId?: string;
  label?: string;
};

export function UpgradeButton({
  priceId = PRO_PRICE_ID,
  label = "Upgrade to Pro",
}: UpgradeButtonProps) {
  const [pending, setPending] = useState(false);
  const trackUpgradeCtaClick = useMutation(api.analytics.trackUpgradeCtaClick);

  async function handleUpgrade() {
    if (pending) return;
    setPending(true);
    try {
      await trackUpgradeCtaClick({ currentTier: "free" });

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successPath: CHECKOUT_SUCCESS_PATH,
          cancelPath: CHECKOUT_CANCEL_PATH,
        }),
      });

      if (!res.ok) throw new Error("Checkout session failed");
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Redirecting…" : label}
      {pending ? null : <ArrowRight size={14} weight="bold" />}
    </button>
  );
}
