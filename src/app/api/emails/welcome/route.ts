import {
  type EmailResponse,
  type UserEmailData,
  sendWelcomeEmail,
} from "@/lib/email";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData: UserEmailData = await request.json();

    // Validate required fields
    if (!userData.userName || !userData.userEmail) {
      return NextResponse.json(
        { error: "Missing required fields: userName, userEmail" },
        { status: 400 },
      );
    }

    // Send the welcome email
    const result: EmailResponse = await sendWelcomeEmail(userData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Welcome email sent successfully",
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
    console.error("Error in welcome email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
