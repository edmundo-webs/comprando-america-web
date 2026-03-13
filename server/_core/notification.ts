import { TRPCError } from "@trpc/server";

export type NotificationPayload = {
  title: string;
  content: string;
};

/**
 * Stub notification function.
 * Replace with your own notification service (email, Slack, etc.) as needed.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  if (!payload.title?.trim() || !payload.content?.trim()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title and content are required.",
    });
  }

  console.log("[Notification] Owner notification:", payload.title);
  return true;
}
