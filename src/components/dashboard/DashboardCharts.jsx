import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const COLORS = [
  "hsl(245, 58%, 51%)", "hsl(200, 80%, 50%)", "hsl(160, 60%, 45%)",
  "hsl(35, 92%, 55%)", "hsl(0, 72%, 51%)", "hsl(280, 60%, 55%)"
];

export function SalesLineChart({ sales = [] }) {
  const data = React.useMemo(() => {
    const last30 = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(5, 10);
      last30[key] = 0;
    }
    sales.forEach((s) => {
      if (s.created_date) {
        const key = new Date(s.created_date).toISOString().slice(5, 10);
        if (last30[key] !== undefined) last30[key] += s.total_amount || 0;
      }
    });
    return Object.entries(last30).map(([date, revenue]) => ({ date, revenue: Math.round(revenue) }));
  }, [sales]);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold mb-4">Revenue Trend (30 Days)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
          <YAxis className="text-xs" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(245, 58%, 51%)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ products = [] }) {
  const data = React.useMemo(() => {
    const cats = {};
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [products]);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold mb-4">Category Distribution</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No data</p>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto font-medium text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TopProductsChart({ sales = [] }) {
  const data = React.useMemo(() => {
    const prod = {};
    sales.forEach((s) => {
      s.items?.forEach((item) => {
        const name = item.product_name || "Unknown";
        prod[name] = (prod[name] || 0) + (item.total || 0);
      });
    });
    return Object.entries(prod)
      .map(([name, revenue]) => ({ name: name.slice(0, 15), revenue: Math.round(revenue) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [sales]);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold mb-4">Top Products by Revenue</h3>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No sales data</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="revenue" fill="hsl(200, 80%, 50%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}