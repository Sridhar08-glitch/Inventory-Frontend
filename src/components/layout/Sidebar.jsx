import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard, Package, FolderOpen, Truck, ShoppingCart,
  BarChart3, Settings, X, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { name: "Products", icon: Package, page: "Products" },
  { name: "Categories", icon: FolderOpen, page: "Categories" },
  { name: "Suppliers", icon: Truck, page: "Suppliers" },
  { name: "Sales", icon: ShoppingCart, page: "Sales" },
  { name: "Analytics", icon: BarChart3, page: "Analytics" },
  { name: "Stock Movements", icon: Activity, page: "StockMovements" },
  { name: "Settings", icon: Settings, page: "Settings" },
];

export default function Sidebar({ currentPage, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">InvenPro</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="rounded-lg bg-accent/50 p-3">
            <p className="text-xs text-muted-foreground font-medium">Inventory System</p>
            <p className="text-xs text-muted-foreground mt-0.5">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}