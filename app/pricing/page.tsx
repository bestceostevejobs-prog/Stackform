"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { Check } from "@phosphor-icons/react";
import { api } from "@/convex/_generated/api";
import { PRO_PRICE_ID } from "@/lib/stripe/config";
import { UpgradeButton } from "@/components/UpgradeButton";

// TODO: update copy for team leads (see experiment-log.md exp_003)
export default function PricingPage() {
  const trackPricingPageView = useMutation(api.analytics.trackPricingPageView);

  useEffect(() => {
    trackPricingPageView({ source: "direct" });
  }, [trackPricingPageView]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-mono">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <header className="mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            // pricing
          </p>
          <h1 className="mt-3 text-3xl font-medium text-zinc-50">
            Start free. Scale with confidence.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-zinc-400">
            Choose the plan that fits your workflow today. Every pricing page
            view and upgrade click is tracked so your team can measure the full
            path from evaluation to activation.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <PlanCard
            name="Free"
            price="$0"
            cadence="forever"
            description="For solo developers kicking the tires."
            features={[
              "3 workflows",
              "100 runs per month",
              "7-day log retention",
              "Single user",
            ]}
            cta={
              <button
                type="button"
                disabled
                className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm text-zinc-500 ring-1 ring-inset ring-zinc-800"
              >
                Current plan
              </button>
            }
          />

          <PlanCard
            highlighted
            name="Pro"
            price="$49"
            cadence="per month"
            description="For teams running agents in production."
            features={[
              "Unlimited runs",
              "Unlimited workflows",
              "90-day log retention",
              "Team sharing",
              "Audit logs",
            ]}
            cta={<UpgradeButton priceId={PRO_PRICE_ID} />}
          />
        </section>

        <footer className="mt-16 text-xs text-zinc-600">
          Prices in USD. Cancel anytime. Annual billing available on request.
        </footer>
      </div>
    </main>
  );
}

type PlanCardProps = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: React.ReactNode;
  highlighted?: boolean;
};

function PlanCard({
  name,
  price,
  cadence,
  description,
  features,
  cta,
  highlighted,
}: PlanCardProps) {
  return (
    <div
      className={
        highlighted
          ? "bg-zinc-900 p-8 shadow-[0_0_0_1px_rgba(82,82,91,0.6)]"
          : "bg-zinc-950 p-8 shadow-[0_0_0_1px_rgba(39,39,42,1)]"
      }
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm uppercase tracking-widest text-zinc-400">
          {name}
        </h2>
        {highlighted ? (
          <span className="text-[10px] uppercase tracking-widest text-emerald-400">
            recommended
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-medium text-zinc-50">{price}</span>
        <span className="text-xs text-zinc-500">{cadence}</span>
      </div>

      <p className="mt-3 text-sm text-zinc-400">{description}</p>

      <ul className="mt-8 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-zinc-300">
            <Check
              size={14}
              weight="bold"
              className="mt-1 shrink-0 text-emerald-400"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10">{cta}</div>
    </div>
  );
}
