"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  Mail,
  Send,
  Settings,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function EmailManagement() {
  const [testEmail, setTestEmail] = useState("");
  const [emailType, setEmailType] = useState("welcome");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const emailTypes = [
    {
      value: "welcome",
      label: "Welcome Email",
      description: "Send welcome email to new users",
      icon: UserPlus,
    },
    {
      value: "order-confirmation",
      label: "Order Confirmation",
      description: "Test order confirmation email",
      icon: ShoppingBag,
    },
    {
      value: "role-change",
      label: "Role Change",
      description: "Notify user of role change",
      icon: Users,
    },
    {
      value: "order-status",
      label: "Order Status Update",
      description: "Send order status update",
      icon: CheckCircle,
    },
  ];

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      let endpoint = "";
      let emailData = {};

      switch (emailType) {
        case "welcome":
          endpoint = "/api/emails/welcome";
          emailData = {
            userName: "Test User",
            userEmail: testEmail,
            actionType: "welcome",
          };
          break;

        case "order-confirmation":
          endpoint = "/api/emails/order-confirmation";
          emailData = {
            orderId: `TEST-${Date.now()}`,
            customerName: "Test Customer",
            customerEmail: testEmail,
            items: [
              {
                productName: "MixPad Mini Super Smart Panel",
                quantity: 1,
                price: 299,
                total: 299,
              },
              {
                productName: "BOLES Smart Light Bulb",
                quantity: 2,
                price: 45,
                total: 90,
              },
            ],
            subtotal: 389,
            tax: 31.12,
            shipping: 0,
            total: 420.12,
            shippingAddress: {
              address1: "123 Smart Home Ave",
              city: "Tech City",
              state: "CA",
              zipCode: "94105",
              country: "United States",
            },
            estimatedDelivery: "2024-02-15",
            trackingNumber: "BOLES123456789",
          };
          break;

        case "role-change":
          endpoint = "/api/emails/role-change";
          emailData = {
            userName: "Test User",
            userEmail: testEmail,
            newRole: "admin",
          };
          break;

        case "order-status":
          endpoint = "/api/emails/order-status";
          emailData = {
            orderId: `TEST-${Date.now()}`,
            status: "shipped",
            message:
              customMessage || "Your order has been shipped and is on its way!",
            trackingNumber: "BOLES987654321",
          };
          break;

        default:
          throw new Error("Invalid email type");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: `Test ${emailTypes.find((t) => t.value === emailType)?.label} sent to ${testEmail}`,
        });
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description:
          "Failed to send test email. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const emailStats = [
    {
      title: "Emails Sent Today",
      value: "24",
      change: "+12%",
      icon: Mail,
      color: "text-blue-600",
    },
    {
      title: "Welcome Emails",
      value: "8",
      change: "+25%",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      title: "Order Confirmations",
      value: "12",
      change: "+8%",
      icon: ShoppingBag,
      color: "text-purple-600",
    },
    {
      title: "Status Updates",
      value: "4",
      change: "+50%",
      icon: CheckCircle,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600">Manage and test email notifications</p>
        </div>
        <Button className="bg-[#43abc3] hover:bg-[#3a9bb5]">
          <Settings className="h-4 w-4 mr-2" />
          Email Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {emailStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="mt-2">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    from yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Test Email Sender */}
        <Card>
          <CardHeader>
            <CardTitle>Test Email System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-type">Email Type</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="test-email">Test Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            {emailType === "order-status" && (
              <div>
                <Label htmlFor="custom-message">Custom Message</Label>
                <Textarea
                  id="custom-message"
                  placeholder="Enter custom status message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <Button
              onClick={handleSendTestEmail}
              disabled={sending || !testEmail}
              className="w-full bg-[#43abc3] hover:bg-[#3a9bb5]"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Provider:</span>
                <span className="ml-2 text-gray-900">Resend</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">From Email:</span>
                <span className="ml-2 text-gray-900">
                  orders@bolesenterprise.io
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <span className="ml-2 text-green-600">✓ Connected</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Templates:</span>
                <span className="ml-2 text-gray-900">4 Active</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Available Templates
              </h4>
              <div className="space-y-2">
                {emailTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Icon className="h-4 w-4 text-[#43abc3]" />
                      <span className="font-medium">{type.label}</span>
                      <span className="text-gray-500">
                        • {type.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Templates Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {emailTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.value}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="h-6 w-6 text-[#43abc3]" />
                    <h4 className="font-medium">{type.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {type.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Preview Template
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
