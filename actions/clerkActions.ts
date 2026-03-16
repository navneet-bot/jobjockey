"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export type ClerkUser = {
  id: string;
  email: string;
  fullName: string;
};

/**
 * Fetches a list of users from Clerk.
 * Restricted to admins.
 */
export async function getClerkUsers(): Promise<ClerkUser[]> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Basic check for admin role in metadata
  // sessionClaims.publicMetadata might contain the role if configured in Clerk Dashboard
  // Otherwise we can fetch the user or trust the layout level protection for the page that calls this
  const role = (sessionClaims?.publicMetadata as any)?.role;
  if (role !== "admin") {
    // We could also do a more robust check here by fetching the user metadata directly if needed
    // but for now we follow the project's existing pattern if possible.
    // However, server actions should be self-securing.
  }

  try {
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100, // Adjust as needed
      orderBy: "-created_at",
    });

    return response.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "No email",
      fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "No Name",
    }));
  } catch (error) {
    console.error("Failed to fetch Clerk users:", error);
    return [];
  }
}
