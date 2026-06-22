import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, salesApi } from "@/services/api";
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

const COLORS = [
  "hsl(245, 58%, 51%)", "hsl(200, 80%, 50%)", "hsl(160, 60%, 45%)",
  "hsl(35, 92%, 55%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 55%)"
];

export default function Analytics() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: () => salesApi.list(),
  });

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);
    const totalCost = sales.reduce((s, o) => {
      return s + (o.items || []).reduce((is, item) => {
        const prod = products.find(p => p.id === item.product_id);
        return is + ((parseFloat(prod?.purchase_price) || 0) * (item.quantity || 0));
      }, 0);
    }, 0);
    const profit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

    return { totalRevenue, totalCost, profit, margin, orderCount: sales.length };
  }, [products, sales]);

  const monthlyRevenue = useMemo(() => {
    const months = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      months[key] = { revenue: 0, orders: 0 };
    }
    sales.forEach(s => {
      if (s.created_date) {
        const key = new Date(s.created_date).toISOString().slice(0, 7);
        if (months[key]) {
          months[key].revenue += parseFloat(s.total_amount) || 0;
          months[key].orders += 1;
        }
      }
    });
    return Object.entries(months).map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("en", { month: "short" }),
      revenue: Math.round(data.revenue),
      orders: data.orders,
    }));
  }, [sales]);

  const categoryRevenue = useMemo(() => {
    const cats = {};
    sales.forEach(s => {
      s.items?.forEach(item => {
        const prod = products.find(p => p.id === item.product_id);
        const cat = prod?.category || "Uncategorized";
        cats[cat] = (cats[cat] || 0) + (item.total || 0);
      });
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [products, sales]);

  const profitByProduct = useMemo(() => {
    const prods = {};
    sales.forEach(s => {
      s.items?.forEach(item => {
        const prod = products.find(p => p.id === item.product_id);
        const name = item.product_name || "Unknown";
        const revenue = item.total || 0;
        const cost = (parseFloat(prod?.purchase_price) || 0) * (item.quantity || 0);
        if (!prods[name]) prods[name] = { revenue: 0, cost: 0 };
        prods[name].revenue += revenue;
        prods[name].cost += cost;
      });
    });
    return Object.entries(prods)
      .map(([name, d]) => ({
        name: name.slice(0, 12),
        revenue: Math.round(d.revenue),
        profit: Math.round(d.revenue - d.cost),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [products, sales]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Revenue and profit analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Net Profit" value={`$${stats.profit.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Profit Margin" value={`${stats.margin}%`} icon={TrendingUp} />
        <StatCard title="Total Orders" value={stats.orderCount} icon={ShoppingCart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Monthly Revenue & Orders</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="hsl(245, 58%, 51%)" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Bar yAxisId="right" dataKey="orders" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Revenue by Category</h3>
          {categoryRevenue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No data</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={240}>
                <PieChart>
                  <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                    {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {categoryRevenue.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{item.name}</span>
                    <span className="ml-auto font-medium">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Product Revenue vs Profit</h3>
        {profitByProduct.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No sales data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitByProduct}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(245, 58%, 51%)" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="profit" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}