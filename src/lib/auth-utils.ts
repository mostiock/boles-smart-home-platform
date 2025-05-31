import { auth } from "@clerk/nextjs/server";

/**
 * Get current user authentication status
 * Handles potential async nature of auth() function
 */
export async function getCurrentAuth() {
  try {
    // Try sync first, fallback to async if needed
    const authResult = auth();

    // Check if it's a promise
    if (authResult && typeof authResult.then === "function") {
      return await authResult;
    }

    return authResult;
  } catch (error) {
    console.error("Auth error:", error);
    return { userId: null, user: null };
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const { userId } = await getCurrentAuth();
  return !!userId;
}

/**
 * Get current user ID safely
 */
export async function getCurrentUserId() {
  const { userId } = await getCurrentAuth();
  return userId;
}
