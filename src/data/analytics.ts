import { supabase } from "@/integrations/supabase/client";

export type AnalyticsData = {
  totalRevenue: number;
  totalOrders: number;
  topItems: { name: string; sold: number; revenue: number }[];
  revenueTrend: { date: string; revenue: number }[];
  revenueByBranch: { branch: string; revenue: number }[];
  repeatCustomers: number;
  busiestHours: { hour: string; count: number }[];
};

export async function fetchAnalytics(): Promise<AnalyticsData> {
  // Fetch all orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*");
  if (error) throw error;

  if (!orders || orders.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      topItems: [],
      revenueTrend: [],
      revenueByBranch: [],
      repeatCustomers: 0,
      busiestHours: [],
    };
  }

  // Total revenue and orders
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;

  // Top items
  const itemMap: Record<string, { name: string; sold: number; revenue: number }> = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item: any) => {
      if (!itemMap[item.id]) {
        itemMap[item.id] = { name: item.name, sold: 0, revenue: 0 };
      }
      itemMap[item.id].sold += item.quantity;
      itemMap[item.id].revenue += item.price * item.quantity;
    });
  });
  const topItems = Object.values(itemMap)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // Revenue trend (last 7 days)
  const now = new Date();
  const revenueTrend: { date: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayRevenue = orders
      .filter((o) => o.created_at && o.created_at.slice(0, 10) === dateStr)
      .reduce((sum, o) => sum + (o.total || 0), 0);
    revenueTrend.push({ date: dateStr, revenue: dayRevenue });
  }

  // Revenue by branch
  const branchMap: Record<string, number> = {};
  orders.forEach((o) => {
    const branch = o.location || "Unknown";
    branchMap[branch] = (branchMap[branch] || 0) + (o.total || 0);
  });
  const revenueByBranch = Object.entries(branchMap).map(([branch, revenue]) => ({ branch, revenue }));

  // Repeat customers (by phone or customer name)
  const customerMap: Record<string, number> = {};
  orders.forEach((o) => {
    const key = o.phone || o.customer || "";
    if (key) customerMap[key] = (customerMap[key] || 0) + 1;
  });
  const repeatCustomers = Object.values(customerMap).filter((c) => c > 1).length;

  // Busiest hours
  const hourMap: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.created_at) {
      const hour = new Date(o.created_at).getHours();
      const label = `${hour.toString().padStart(2, "0")}:00`;
      hourMap[label] = (hourMap[label] || 0) + 1;
    }
  });
  const busiestHours = Object.entries(hourMap)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    topItems,
    revenueTrend,
    revenueByBranch,
    repeatCustomers,
    busiestHours,
  };
}