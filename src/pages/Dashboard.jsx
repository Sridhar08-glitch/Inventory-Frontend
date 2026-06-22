import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, salesApi, stockMovementsApi } from "@/services/api";
import { Package, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import LowStockTable from "../components/dashboard/LowStockTable";
import { SalesLineChart, CategoryPieChart, TopProductsChart } from "../components/dashboard/DashboardCharts";

export default function Dashboard() {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productsApi.list();
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await salesApi.list();
      return Array.isArray(response) ? response : [];
    },
  });

  const { data: movements = [], isLoading: movementsLoading } = useQuery({
    queryKey: ["movements-recent"],
    queryFn: async () => {
      const response = await stockMovementsApi.list({ limit: 20 });
      return Array.isArray(response) ? response : [];
    },
  });

  if (productsLoading || salesLoading || movementsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalProducts = products?.length || 0;
  const totalRevenue = Array.isArray(sales) && sales.length > 0
    ? sales.reduce((s, o) => s + (parseFloat(o?.total_amount) || 0), 0)
    : 0;
  const inventoryValue = Array.isArray(products) && products.length > 0
    ? products.reduce((s, p) => s + (parseFloat(p?.purchase_price) || 0) * (p?.stock_quantity || 0), 0)
    : 0;
  const lowStock = Array.isArray(products) && products.length > 0
    ? products.filter(p => p?.status === "active" && p?.stock_quantity <= (p?.min_stock_alert || 10)).length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your inventory and sales</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={totalProducts} icon={Package} subtitle="Active inventory items" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} subtitle="From all sales" />
        <StatCard title="Inventory Value" value={`$${inventoryValue.toLocaleString()}`} icon={TrendingUp} subtitle="At purchase cost" />
        <StatCard title="Low Stock" value={lowStock} icon={AlertTriangle} subtitle="Need restocking" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesLineChart sales={Array.isArray(sales) ? sales : []} />
        <CategoryPieChart products={Array.isArray(products) ? products : []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopProductsChart sales={Array.isArray(sales) ? sales : []} />
        <LowStockTable products={Array.isArray(products) ? products : []} />
        <RecentActivity movements={Array.isArray(movements) ? movements : []} />
      </div>
    </div>
  );
}
