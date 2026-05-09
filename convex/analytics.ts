import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Analytics events. All product analytics goes through these mutations so we
// have one place to change schema, sampling, or downstream sinks.
//
// Add experiment_variant as a property when running pricing experiments. Do
// not add a new schema for this.

export const trackPricingPageView = mutation({
  args: {
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getOptionalUserId(ctx);
    await ctx.db.insert("analyticsEvents", {
      name: "pricing_page_view",
      userId: userId ?? undefined,
      properties: {
        source: args.source ?? "unknown",
      },
      timestamp: Date.now(),
    });
  },
});

export const trackUpgradeCtaClick = mutation({
  args: {
    currentTier: v.union(v.literal("free"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const userId = await getOptionalUserId(ctx);
    await ctx.db.insert("analyticsEvents", {
      name: "upgrade_cta_click",
      userId: userId ?? undefined,
      properties: {
        currentTier: args.currentTier,
      },
      timestamp: Date.now(),
    });
  },
});

export const trackUpgradeCompleted = mutation({
  args: {
    newTier: v.union(v.literal("free"), v.literal("pro")),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getOptionalUserId(ctx);
    await ctx.db.insert("analyticsEvents", {
      name: "upgrade_completed",
      userId: userId ?? undefined,
      properties: {
        newTier: args.newTier,
        amount: args.amount,
      },
      timestamp: Date.now(),
    });
  },
});

async function getOptionalUserId(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
  db: {
    query: (table: "users") => {
      withIndex: (
        index: "by_email",
        builder: (q: {
          eq: (field: "email", value: string) => unknown;
        }) => unknown,
      ) => { unique: () => Promise<{ _id: string } | null> };
    };
  };
}): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", identity.subject))
    .unique();
  return user?._id ?? null;
}
