import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const FREE_TIER_WORKFLOW_CAP = 3;

export const createWorkflow = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    triggerType: v.union(
      v.literal("manual"),
      v.literal("schedule"),
      v.literal("webhook"),
    ),
    agentIds: v.array(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Enforce 3-workflow cap for free tier users before creating.
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    const tier = subscription?.tier ?? "free";

    if (tier === "free") {
      const existing = await ctx.db
        .query("workflows")
        .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
        .collect();
      if (existing.length >= FREE_TIER_WORKFLOW_CAP) {
        throw new Error(
          `Free tier limited to ${FREE_TIER_WORKFLOW_CAP} workflows. Upgrade to Pro.`,
        );
      }
    }

    const workflowId = await ctx.db.insert("workflows", {
      name: args.name,
      ownerId: user._id,
      description: args.description,
      triggerType: args.triggerType,
      agentIds: args.agentIds,
      createdAt: Date.now(),
    });

    await ctx.db.insert("auditLogs", {
      workflowId,
      event: "workflow.created",
      timestamp: Date.now(),
      actorId: user._id,
    });

    return workflowId;
  },
});

export const getWorkflow = query({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workflowId);
  },
});

export const listWorkflows = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query("workflows")
      .withIndex("by_owner_created", (q) => q.eq("ownerId", user._id))
      .order("desc")
      .collect();
  },
});

export const deleteWorkflow = mutation({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");
    if (workflow.ownerId !== user._id) throw new Error("Forbidden");

    await ctx.db.delete(args.workflowId);

    await ctx.db.insert("auditLogs", {
      workflowId: args.workflowId,
      event: "workflow.deleted",
      timestamp: Date.now(),
      actorId: user._id,
    });
  },
});
