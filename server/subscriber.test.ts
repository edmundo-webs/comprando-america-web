import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("News Subscribers", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testName = "Test Subscriber";
  const testCategories = ["visas-migracion", "economia-finanzas"];

  it("should create a news subscriber", async () => {
    const result = await db.createNewsSubscriber(testEmail, testName, testCategories);
    expect(result).toBeDefined();
  });

  it("should get a news subscriber by email", async () => {
    const subscriber = await db.getNewsSubscriber(testEmail);
    expect(subscriber).toBeDefined();
    expect(subscriber?.email).toBe(testEmail);
    expect(subscriber?.name).toBe(testName);
    expect(JSON.parse(subscriber?.categories || "[]")).toEqual(testCategories);
    expect(subscriber?.isVerified).toBe("false");
    expect(subscriber?.isActive).toBe("true");
  });

  it("should verify a news subscriber", async () => {
    const subscriber = await db.getNewsSubscriber(testEmail);
    expect(subscriber).toBeDefined();
    
    if (subscriber?.verificationToken) {
      const verified = await db.verifyNewsSubscriber(subscriber.verificationToken);
      expect(verified).toBeDefined();
      expect(verified?.isVerified).toBe("true");
      expect(verified?.verificationToken).toBeNull();
    }
  });

  it("should update subscriber categories", async () => {
    const newCategories = ["bienes-raices", "inversiones"];
    await db.updateSubscriberCategories(testEmail, newCategories);
    
    const subscriber = await db.getNewsSubscriber(testEmail);
    expect(JSON.parse(subscriber?.categories || "[]")).toEqual(newCategories);
  });

  it("should get verified subscribers by category", async () => {
    const subscribers = await db.getVerifiedSubscribersByCategory("bienes-raices");
    expect(Array.isArray(subscribers)).toBe(true);
  });

  it("should unsubscribe a news subscriber", async () => {
    const subscriber = await db.getNewsSubscriber(testEmail);
    expect(subscriber).toBeDefined();
    
    if (subscriber?.unsubscribeToken) {
      const unsubscribed = await db.unsubscribeNewsSubscriber(subscriber.unsubscribeToken);
      expect(unsubscribed).toBeDefined();
      expect(unsubscribed?.isActive).toBe("false");
    }
  });
});
