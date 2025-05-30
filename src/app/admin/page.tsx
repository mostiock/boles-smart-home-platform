"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/data/products";
import {
  AlertTriangle,
  DollarSign,
  Edit,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalUsers: number;
    totalAdmins: number;
    productsByCategory: Record<string, number>;
    lowStockProducts: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statistics = {
          totalProducts: products.length,
          totalUsers: 42,
          totalAdmins: 2,
          productsByCategory: {
            "control-panels": products.filter(
              (p) => p.category === "control-panels",
            ).length,
            "smart-lighting": products.filter(
              (p) => p.category === "smart-lighting",
            ).length,
            "security-cameras": products.filter(
              (p) => p.category === "security-cameras",
            ).length,
            "smart-speakers": products.filter(
              (p) => p.category === "smart-speakers",
            ).length,
            "smart-locks": products.filter((p) => p.category === "smart-locks")
              .length,
            "sensors-detectors": products.filter(
              (p) => p.category === "sensors-detectors",
            ).length,
          },
          lowStockProducts: products.filter((p) => (p.stockCount || 0) < 10)
            .length,
        };
        setStats(statistics);
      } catch (error) {
        console.error("Error loading statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`skeleton-admin-card-${i}-${Date.now()}`}
                className="h-32 bg-gray-200 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Orders Today",
      value: "28",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: "$12,400",
      change: "+15%",
      icon: DollarSign,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back to BOLES Admin Panel</p>
        </div>
        <Button className="bg-[#43abc3] hover:bg-[#3a9bb5]">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-50"
                  >
                    {stat.change}
                  </Badge>
                  <span>from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats &&
                Object.entries(stats.productsByCategory).map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-[#43abc3] rounded-full" />
                        <span className="capitalize text-sm font-medium">
                          {category.replace("-", " ")}
                        </span>
                      </div>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ),
                )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Package className="h-4 w-4 text-blue-600" />
                <span>New product added: Smart Doorbell Pro</span>
                <Badge variant="secondary">2m ago</Badge>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Users className="h-4 w-4 text-green-600" />
                <span>New user registered: john@example.com</span>
                <Badge variant="secondary">5m ago</Badge>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <ShoppingCart className="h-4 w-4 text-purple-600" />
                <span>Order #1234 completed</span>
                <Badge variant="secondary">10m ago</Badge>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span>Low stock alert: Motion Sensor</span>
                <Badge variant="secondary">15m ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Eye className="h-6 w-6" />
              <span>View Orders</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Edit className="h-6 w-6" />
              <span>Edit Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {stats && stats.lowStockProducts > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">
              {stats.lowStockProducts} products have low stock levels and need
              restocking.
            </p>
            <Button
              variant="outline"
              className="mt-3 border-orange-300 text-orange-700"
            >
              View Low Stock Items
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
