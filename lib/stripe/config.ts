// Centralized Stripe configuration.
//
// Do not inline priceId in components. See post-mortem-checkout-incident.md.
// (April 3: a hardcoded test priceId shipped to prod and burned ~6 hours of
// checkout traffic before we caught it. Everything routes through here now.)

export const PRO_PRICE_ID = "price_1OqK2XLkdIwHu7ix4vGpQ3mN";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
  "pk_live_51OqJ9PLkdIwHu7ix7bVnQ2mLp4kTzR8sYxWcXvBnMpQrStUvWxYz";

export const STRIPE_API_VERSION = "2024-06-20" as const;

export const CHECKOUT_SUCCESS_PATH = "/dashboard?upgraded=1";
export const CHECKOUT_CANCEL_PATH = "/pricing?canceled=1";

export type StripeTier = "free" | "pro";

export const TIER_BY_PRICE_ID: Record<string, StripeTier> = {
  [PRO_PRICE_ID]: "pro",
};
