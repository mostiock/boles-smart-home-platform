"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}
import { Save, Shield, User as UserIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<User>) => void;
}

export function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
}: UserEditModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof User, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Check if role changed and send notification email
      const roleChanged = formData.role && formData.role !== user.role;

      onSave(user.id, formData);

      // Send role change notification email
      if (roleChanged) {
        try {
          const response = await fetch("/api/emails/role-change", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: `${formData.firstName || user.firstName} ${formData.lastName || user.lastName}`,
              userEmail: formData.email || user.email,
              newRole: formData.role,
            }),
          });

          if (response.ok) {
            console.log("Role change notification email sent");
          } else {
            console.error("Failed to send role change notification email");
          }
        } catch (emailError) {
          console.error("Error sending role change email:", emailError);
          // Don't fail the save operation if email fails
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const getUserInitials = (user: User) => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
              />
              <AvatarFallback className="bg-[#43abc3] text-white">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <span>
                Edit User: {user.firstName} {user.lastName}
              </span>
              <div className="text-sm text-gray-500 font-normal">
                {user.email}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="ml-2 text-gray-900">{user.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Current Role:</span>
                <Badge
                  variant={user.role === "admin" ? "destructive" : "secondary"}
                  className="ml-2"
                >
                  {user.role === "admin" ? "Administrator" : "User"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="role">User Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Regular User</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.role === "admin"
                ? "Administrators have full access to the admin panel and can manage all users and products."
                : "Regular users can shop, manage their account, and place orders."}
            </p>
          </div>

          {/* Role Change Warning */}
          {formData.role !== user.role && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 rounded-full p-1">
                  <Shield className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-amber-800">
                    Role Change Warning
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {formData.role === "admin"
                      ? "This user will gain administrator privileges and access to the admin panel."
                      : "This user will lose administrator privileges and access to the admin panel."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* System User Warning */}
          {user.email === "admin@boles.com" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 rounded-full p-1">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    System Administrator
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This is the system administrator account. Changing the role
                    is not recommended.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#43abc3] hover:bg-[#3a9bb5]"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
