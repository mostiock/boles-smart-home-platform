import {
  type EmailResponse,
  type OrderEmailData,
  sendOrderConfirmationEmail,
} from "@/lib/email";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData: OrderEmailData = await request.json();

    // Validate required fields
    if (
      !orderData.orderId ||
      !orderData.customerEmail ||
      !orderData.customerName
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: orderId, customerEmail, customerName",
        },
        { status: 400 },
      );
    }

    // Send the email
    const result: EmailResponse = await sendOrderConfirmationEmail(orderData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Order confirmation email sent successfully",
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
    console.error("Error in order confirmation email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
