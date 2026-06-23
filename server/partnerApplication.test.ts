import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db helpers
vi.mock("./db", () => ({
  createPartnerApplication: vi.fn().mockResolvedValue(undefined),
  listPartnerApplications: vi.fn().mockResolvedValue([
    {
      id: 1,
      companyName: "Test Corp",
      contactName: "Alice",
      contactInfo: "alice@test.com",
      cooperationIntent: "技术合作",
      additionalNotes: null,
      createdAt: new Date("2025-01-01T00:00:00Z"),
    },
  ]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
}));

// Mock notifyOwner
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "owner-open-id",
      email: "owner@test.com",
      name: "Owner",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("partnerApplication.submit", () => {
  it("submits a valid application and returns success", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.partnerApplication.submit({
      companyName: "AI Corp",
      contactName: "Bob",
      contactInfo: "bob@aicorp.com",
      cooperationIntent: "技术合作",
      additionalNotes: "Looking forward to collaboration",
    });
    expect(result).toEqual({ success: true });
  });

  it("submits application without optional additionalNotes", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.partnerApplication.submit({
      companyName: "Startup X",
      contactName: "Carol",
      contactInfo: "+65 9123 4567",
      cooperationIntent: "市场推广",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("partnerApplication.list", () => {
  it("returns list for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const result = await caller.partnerApplication.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("companyName");
    expect(result[0]).toHaveProperty("cooperationIntent");
  });

  it("throws UNAUTHORIZED for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.partnerApplication.list()).rejects.toThrow();
  });

  it("throws FORBIDDEN for non-admin authenticated user", async () => {
    const ctx = createAuthCtx();
    ctx.user!.role = "user";
    const caller = appRouter.createCaller(ctx);
    await expect(caller.partnerApplication.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
