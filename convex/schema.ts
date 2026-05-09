import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workflows: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    description: v.string(),
    triggerType: v.union(
      v.literal("manual"),
      v.literal("schedule"),
      v.literal("webhook"),
    ),
    agentIds: v.array(v.id("agents")),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_created", ["ownerId", "createdAt"]),

  runs: defineTable({
    workflowId: v.id("workflows"),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("canceled"),
    ),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    cost: v.optional(v.number()),
    output: v.optional(v.string()),
    agentId: v.id("agents"),
  })
    .index("by_workflow", ["workflowId"])
    .index("by_workflow_started", ["workflowId", "startedAt"])
    .index("by_status", ["status"]),

  agents: defineTable({
    name: v.string(),
    specialty: v.string(),
    costPerRun: v.number(),
    reputationScore: v.number(),
  }).index("by_specialty", ["specialty"]),

  teams: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    memberIds: v.array(v.id("users")),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  auditLogs: defineTable({
    workflowId: v.optional(v.id("workflows")),
    runId: v.optional(v.id("runs")),
    event: v.string(),
    timestamp: v.number(),
    actorId: v.id("users"),
  })
    .index("by_workflow", ["workflowId", "timestamp"])
    .index("by_actor", ["actorId", "timestamp"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    tier: v.union(v.literal("free"), v.literal("pro")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  analyticsEvents: defineTable({
    name: v.string(),
    userId: v.optional(v.id("users")),
    properties: v.any(),
    timestamp: v.number(),
  })
    .index("by_name_timestamp", ["name", "timestamp"])
    .index("by_user_timestamp", ["userId", "timestamp"]),
});
