import { db } from "@/lib/database";
import {
  type EmailResponse,
  type UserEmailData,
  sendRoleChangeEmail,
} from "@/lib/email";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const currentUser = await db.getUserByClerkId(userId);
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userName, userEmail, newRole } = await request.json();

    // Validate required fields
    if (!userName || !userEmail || !newRole) {
      return NextResponse.json(
        { error: "Missing required fields: userName, userEmail, newRole" },
        { status: 400 },
      );
    }

    const userData: UserEmailData = {
      userName,
      userEmail,
      actionType: "role_change",
      additionalData: { newRole },
    };

    // Send the role change email
    const result: EmailResponse = await sendRoleChangeEmail(userData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Role change notification email sent successfully",
        emailId: (result.data as { id?: string })?.id,
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: result.error,
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error in role change email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
