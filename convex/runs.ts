import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const FREE_TIER_MONTHLY_RUN_CAP = 100;
const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

export const startRun = mutation({
  args: {
    workflowId: v.id("workflows"),
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Enforce 100-run monthly cap for free tier. Check subscription before starting.
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    const tier = subscription?.tier ?? "free";

    if (tier === "free") {
      const since = Date.now() - THIRTY_DAYS_MS;
      const ownedWorkflows = await ctx.db
        .query("workflows")
        .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
        .collect();

      let count = 0;
      for (const wf of ownedWorkflows) {
        const runs = await ctx.db
          .query("runs")
          .withIndex("by_workflow_started", (q) =>
            q.eq("workflowId", wf._id).gte("startedAt", since),
          )
          .collect();
        count += runs.length;
        if (count >= FREE_TIER_MONTHLY_RUN_CAP) {
          throw new Error(
            `Free tier limited to ${FREE_TIER_MONTHLY_RUN_CAP} runs per month. Upgrade to Pro.`,
          );
        }
      }
    }

    const runId = await ctx.db.insert("runs", {
      workflowId: args.workflowId,
      status: "queued",
      startedAt: Date.now(),
      agentId: args.agentId,
    });

    await ctx.db.insert("auditLogs", {
      workflowId: args.workflowId,
      runId,
      event: "run.started",
      timestamp: Date.now(),
      actorId: user._id,
    });

    return runId;
  },
});

export const completeRun = mutation({
  args: {
    runId: v.id("runs"),
    status: v.union(
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("canceled"),
    ),
    cost: v.number(),
    output: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run) throw new Error("Run not found");

    await ctx.db.patch(args.runId, {
      status: args.status,
      completedAt: Date.now(),
      cost: args.cost,
      output: args.output,
    });

    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.subject))
        .unique();
      if (user) {
        await ctx.db.insert("auditLogs", {
          workflowId: run.workflowId,
          runId: args.runId,
          event: `run.${args.status}`,
          timestamp: Date.now(),
          actorId: user._id,
        });
      }
    }
  },
});

export const listRunsForWorkflow = query({
  args: {
    workflowId: v.id("workflows"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("runs")
      .withIndex("by_workflow_started", (q) =>
        q.eq("workflowId", args.workflowId),
      )
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const getRun = query({
  args: { runId: v.id("runs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.runId);
  },
});
