import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL =
  process.env.FROM_EMAIL || "BOLES Smart Home <orders@bolesenterprise.io>";
const COMPANY_NAME = "BOLES Smart Home";
const COMPANY_WEBSITE =
  process.env.NEXT_PUBLIC_APP_URL || "https://boles-smart-home.com";

// Types
export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    address1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface UserEmailData {
  userName: string;
  userEmail: string;
  actionType: "welcome" | "role_change" | "password_reset" | "account_update";
  additionalData?: Record<string, unknown>;
}

// Email Templates
const getOrderConfirmationTemplate = (data: OrderEmailData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ${COMPANY_NAME}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #112137 0%, #43abc3 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e5e5; border-top: none; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none; }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
        .total-row { font-weight: bold; font-size: 1.1em; }
        .button { display: inline-block; background: #43abc3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .logo { max-width: 150px; height: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase from ${COMPANY_NAME}</p>
        </div>

        <div class="content">
            <h2>Hi ${data.customerName},</h2>
            <p>Your order has been confirmed and we're preparing it for shipment. Here are your order details:</p>

            <div class="order-details">
                <h3>Order #${data.orderId}</h3>

                <h4>Items Ordered:</h4>
                ${data.items
                  .map(
                    (item) => `
                    <div class="item-row">
                        <span>${item.productName} × ${item.quantity}</span>
                        <span>$${item.total.toFixed(2)}</span>
                    </div>
                `,
                  )
                  .join("")}

                <div class="item-row">
                    <span>Subtotal:</span>
                    <span>$${data.subtotal.toFixed(2)}</span>
                </div>
                <div class="item-row">
                    <span>Tax:</span>
                    <span>$${data.tax.toFixed(2)}</span>
                </div>
                <div class="item-row">
                    <span>Shipping:</span>
                    <span>${data.shipping === 0 ? "FREE" : `${data.shipping.toFixed(2)}`}</span>
                </div>
                <div class="item-row total-row">
                    <span>Total:</span>
                    <span>$${data.total.toFixed(2)}</span>
                </div>
            </div>

            <h4>Shipping Address:</h4>
            <p>
                ${data.shippingAddress.address1}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
                ${data.shippingAddress.country}
            </p>

            ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ""}
            ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ""}

            <a href="${COMPANY_WEBSITE}/orders/${data.orderId}" class="button">Track Your Order</a>
        </div>

        <div class="footer">
            <p>Questions about your order? Reply to this email or contact our support team.</p>
            <p>${COMPANY_NAME} | Smart Home Solutions</p>
        </div>
    </div>
</body>
</html>
`;

const getWelcomeEmailTemplate = (data: UserEmailData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${COMPANY_NAME}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #112137 0%, #43abc3 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e5e5; border-top: none; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none; }
        .button { display: inline-block; background: #43abc3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .feature { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ${COMPANY_NAME}!</h1>
            <p>Your smart home journey starts here</p>
        </div>

        <div class="content">
            <h2>Hi ${data.userName},</h2>
            <p>Welcome to ${COMPANY_NAME}! We're excited to help you transform your home with cutting-edge smart technology.</p>

            <div class="features">
                <div class="feature">
                    <h4>🏠 Smart Lighting</h4>
                    <p>Control your lighting from anywhere</p>
                </div>
                <div class="feature">
                    <h4>🔒 Security Systems</h4>
                    <p>Keep your home safe and secure</p>
                </div>
                <div class="feature">
                    <h4>📱 Easy Control</h4>
                    <p>Manage everything from your phone</p>
                </div>
                <div class="feature">
                    <h4>🎵 Smart Audio</h4>
                    <p>Premium sound throughout your home</p>
                </div>
            </div>

            <p>Explore our complete range of smart home products and start building your connected home today!</p>

            <a href="${COMPANY_WEBSITE}" class="button">Start Shopping</a>
        </div>

        <div class="footer">
            <p>Need help getting started? Our support team is here to help!</p>
            <p>${COMPANY_NAME} | Smart Home Solutions</p>
        </div>
    </div>
</body>
</html>
`;

const getRoleChangeEmailTemplate = (data: UserEmailData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Update - ${COMPANY_NAME}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #112137 0%, #43abc3 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e5e5; border-top: none; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none; }
        .button { display: inline-block; background: #43abc3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .alert { background: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Updated</h1>
            <p>${COMPANY_NAME} Account Notification</p>
        </div>

        <div class="content">
            <h2>Hi ${data.userName},</h2>
            <p>Your account permissions have been updated.</p>

            <div class="alert">
                <p><strong>Role Update:</strong> Your account now has ${data.additionalData?.newRole === "admin" ? "administrator" : "user"} privileges.</p>
                ${
                  data.additionalData?.newRole === "admin"
                    ? "<p>You now have access to the admin dashboard and can manage products, users, and orders.</p>"
                    : "<p>Your account has been updated to standard user privileges.</p>"
                }
            </div>

            ${
              data.additionalData?.newRole === "admin"
                ? `<a href="${COMPANY_WEBSITE}/admin" class="button">Access Admin Dashboard</a>`
                : `<a href="${COMPANY_WEBSITE}" class="button">Continue Shopping</a>`
            }
        </div>

        <div class="footer">
            <p>If you have questions about this change, please contact our support team.</p>
            <p>${COMPANY_NAME} | Smart Home Solutions</p>
        </div>
    </div>
</body>
</html>
`;

// Email sending functions
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderId} - ${COMPANY_NAME}`,
      html: getOrderConfirmationTemplate(data),
    });

    console.log("Order confirmation email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error: error };
  }
}

export async function sendWelcomeEmail(data: UserEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: `Welcome to ${COMPANY_NAME} - Your Smart Home Journey Begins!`,
      html: getWelcomeEmailTemplate(data),
    });

    console.log("Welcome email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error };
  }
}

export async function sendRoleChangeEmail(data: UserEmailData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      subject: `Account Update - ${COMPANY_NAME}`,
      html: getRoleChangeEmailTemplate(data),
    });

    console.log("Role change email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending role change email:", error);
    return { success: false, error: error };
  }
}

export async function sendOrderStatusEmail(
  data: OrderEmailData & { status: string; message: string },
) {
  try {
    const statusMessages = {
      processing: "Your order is being prepared",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Update #${data.orderId} - ${statusMessages[data.status as keyof typeof statusMessages] || data.status}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Order Update - ${COMPANY_NAME}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #112137 0%, #43abc3 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e5e5; border-top: none; }
                .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none; }
                .button { display: inline-block; background: #43abc3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
                .status-update { background: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Update</h1>
                    <p>Order #${data.orderId}</p>
                </div>

                <div class="content">
                    <h2>Hi ${data.customerName},</h2>

                    <div class="status-update">
                        <h3>${statusMessages[data.status as keyof typeof statusMessages] || data.status}</h3>
                        <p>${data.message}</p>
                        ${data.trackingNumber ? `<p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>` : ""}
                    </div>

                    <a href="${COMPANY_WEBSITE}/orders/${data.orderId}" class="button">View Order Details</a>
                </div>

                <div class="footer">
                    <p>Questions? Reply to this email or contact our support team.</p>
                    <p>${COMPANY_NAME} | Smart Home Solutions</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log("Order status email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending order status email:", error);
    return { success: false, error: error };
  }
}

// Utility function to test email configuration
export async function testEmailConfiguration() {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: "test@example.com",
      subject: "Test Email Configuration",
      html: "<p>This is a test email to verify the configuration.</p>",
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error };
  }
}
