import { db } from "@/lib/database";
import { type EmailResponse, sendOrderStatusEmail } from "@/lib/email";
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

    const { orderId, status, message, trackingNumber } = await request.json();

    // Validate required fields
    if (!orderId || !status || !message) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, status, message" },
        { status: 400 },
      );
    }

    // Create order data for email (in a real app, you'd fetch this from the database)
    const orderEmailData = {
      orderId,
      customerName: "Customer", // This would come from database
      customerEmail: "customer@example.com", // This would come from database
      status,
      message,
      trackingNumber,
      items: [
        {
          productName: "Sample Product",
          quantity: 1,
          price: 299,
          total: 299,
        },
      ],
      subtotal: 299,
      tax: 23.92,
      shipping: 0,
      total: 322.92,
      shippingAddress: {
        address1: "123 Main St",
        city: "Sample City",
        state: "CA",
        zipCode: "12345",
        country: "United States",
      },
    };

    // Send the order status email
    const result: EmailResponse = await sendOrderStatusEmail(orderEmailData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Order status email sent successfully",
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
    console.error("Error in order status email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
