"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrencyContext } from "@/contexts/CurrencyContext";
import { db } from "@/lib/database";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Filter,
  Package,
  PieChart,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Analytics types
interface DailyRevenue {
  date: string;
  amount: number;
}

interface DailyOrders {
  date: string;
  count: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

interface CategorySales {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

interface TopPage {
  page: string;
  views: number;
  conversions: number;
}

interface BarChartData {
  date: string;
  amount?: number;
  count?: number;
}

interface CategoryChartData {
  category: string;
  sales: number;
  percentage: number;
}

// Mock analytics data - in real app this would come from analytics service
const mockAnalytics = {
  revenue: {
    current: 45280,
    previous: 38940,
    growth: 16.3,
    daily: [
      { date: "2024-01-15", amount: 1240 },
      { date: "2024-01-16", amount: 1580 },
      { date: "2024-01-17", amount: 890 },
      { date: "2024-01-18", amount: 2100 },
      { date: "2024-01-19", amount: 1760 },
      { date: "2024-01-20", amount: 1450 },
      { date: "2024-01-21", amount: 1890 },
    ],
  },
  orders: {
    current: 156,
    previous: 132,
    growth: 18.2,
    daily: [
      { date: "2024-01-15", count: 12 },
      { date: "2024-01-16", count: 18 },
      { date: "2024-01-17", count: 8 },
      { date: "2024-01-18", count: 25 },
      { date: "2024-01-19", count: 21 },
      { date: "2024-01-20", count: 16 },
      { date: "2024-01-21", count: 23 },
    ],
  },
  customers: {
    current: 1284,
    previous: 1156,
    growth: 11.1,
    new: 48,
    returning: 108,
  },
  products: {
    topSelling: [
      {
        id: "mixpad-mini",
        name: "MixPad Mini Super Smart Panel",
        sales: 45,
        revenue: 13455,
      },
      {
        id: "outdoor-security-cam",
        name: "BOLES Outdoor Security Camera",
        sales: 38,
        revenue: 9462,
      },
      {
        id: "smart-led-strip",
        name: "BOLES RGB Smart LED Strip",
        sales: 52,
        revenue: 4108,
      },
      {
        id: "voice-assistant-hub",
        name: "BOLES Voice Assistant Hub",
        sales: 29,
        revenue: 5191,
      },
      {
        id: "keypad-smart-lock",
        name: "Smart Keypad Door Lock",
        sales: 22,
        revenue: 6138,
      },
    ],
    categories: [
      {
        category: "Control Panels",
        sales: 78,
        revenue: 24560,
        percentage: 32.1,
      },
      {
        category: "Security Cameras",
        sales: 65,
        revenue: 16120,
        percentage: 21.1,
      },
      {
        category: "Smart Lighting",
        sales: 89,
        revenue: 7890,
        percentage: 10.3,
      },
      {
        category: "Smart Speakers",
        sales: 43,
        revenue: 8640,
        percentage: 11.3,
      },
      { category: "Smart Locks", sales: 34, revenue: 9450, percentage: 12.4 },
      {
        category: "Sensors & Detectors",
        sales: 67,
        revenue: 9680,
        percentage: 12.8,
      },
    ],
  },
  traffic: {
    pageViews: 25640,
    uniqueVisitors: 8920,
    bounceRate: 32.4,
    avgSessionDuration: "4:32",
    topPages: [
      { page: "/products/mixpad-mini", views: 2450, conversions: 45 },
      { page: "/categories/control-panels", views: 1890, conversions: 23 },
      { page: "/products/outdoor-security-cam", views: 1750, conversions: 38 },
      { page: "/categories/smart-lighting", views: 1620, conversions: 19 },
      { page: "/products/voice-assistant-hub", views: 1340, conversions: 29 },
    ],
  },
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(false);
  const { formatNaira, convertToNaira } = useCurrencyContext();

  const formatPrice = (price: number) => formatNaira(convertToNaira(price));

  const formatGrowth = (growth: number) => {
    const isPositive = growth > 0;
    return (
      <span
        className={`flex items-center space-x-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>
          {isPositive ? "+" : ""}
          {growth.toFixed(1)}%
        </span>
      </span>
    );
  };

  // Simple bar chart component
  const BarChart = ({
    data,
    height = 200,
  }: { data: BarChartData[]; height?: number }) => {
    const maxValue = Math.max(...data.map((d) => d.amount || d.count || 0));

    return (
      <div
        className="flex items-end justify-between space-x-2"
        style={{ height }}
      >
        {data.map((item) => (
          <div
            key={item.date}
            className="flex flex-col items-center space-y-2 flex-1"
          >
            <div
              className="bg-[#43abc3] rounded-t-sm w-full min-h-[4px]"
              style={{
                height: `${((item.amount || item.count || 0) / maxValue) * (height - 40)}px`,
              }}
            />
            <span className="text-xs text-gray-500 text-center">
              {new Date(item.date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Simple pie chart component (showing as bars for simplicity)
  const CategoryChart = ({ data }: { data: CategoryChartData[] }) => {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.category}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div
                className="w-3 h-3 rounded-full bg-[#43abc3]"
                style={{
                  backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                }}
              />
              <span className="text-sm font-medium">{item.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{item.sales} sales</span>
              <Badge variant="outline">{item.percentage}%</Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(mockAnalytics.revenue.current)}
                </p>
                <div className="mt-2">
                  {formatGrowth(mockAnalytics.revenue.growth)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAnalytics.orders.current}
                </p>
                <div className="mt-2">
                  {formatGrowth(mockAnalytics.orders.growth)}
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAnalytics.customers.current}
                </p>
                <div className="mt-2">
                  {formatGrowth(mockAnalytics.customers.growth)}
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockAnalytics.traffic.pageViews.toLocaleString()}
                </p>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">
                    {mockAnalytics.traffic.uniqueVisitors.toLocaleString()}{" "}
                    unique
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Daily Revenue</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={mockAnalytics.revenue.daily} />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Average daily revenue:{" "}
                    {formatPrice(mockAnalytics.revenue.current / 7)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Daily Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={mockAnalytics.orders.daily} />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Average daily orders:{" "}
                    {Math.round(mockAnalytics.orders.current / 7)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(mockAnalytics.revenue.current)}
                  </p>
                  <p className="text-sm text-gray-600">This Period</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(mockAnalytics.revenue.previous)}
                  </p>
                  <p className="text-sm text-gray-600">Previous Period</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#43abc3]">
                    {formatGrowth(mockAnalytics.revenue.growth)}
                  </div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.products.topSelling.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className="w-6 h-6 flex items-center justify-center p-0">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Sales by Category</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart data={mockAnalytics.products.categories} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#43abc3]">
                    {mockAnalytics.customers.new}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">New Customers</p>
                  <p className="text-xs text-gray-500 mt-1">This period</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {mockAnalytics.customers.returning}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Returning Customers
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This period</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {(
                      (mockAnalytics.customers.returning /
                        (mockAnalytics.customers.new +
                          mockAnalytics.customers.returning)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Retention Rate</p>
                  <p className="text-xs text-gray-500 mt-1">Customer loyalty</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {mockAnalytics.customers.current} Total Customers
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      +{mockAnalytics.customers.growth.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {mockAnalytics.traffic.pageViews.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Page Views</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {mockAnalytics.traffic.uniqueVisitors.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Unique Visitors</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {mockAnalytics.traffic.bounceRate}%
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Bounce Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {mockAnalytics.traffic.avgSessionDuration}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Avg. Session</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAnalytics.traffic.topPages.map((page) => (
                  <div
                    key={page.page}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{page.page}</p>
                      <p className="text-xs text-gray-500">
                        {page.views.toLocaleString()} views
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {page.conversions} conversions
                      </p>
                      <p className="text-xs text-gray-500">
                        {((page.conversions / page.views) * 100).toFixed(1)}%
                        rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
