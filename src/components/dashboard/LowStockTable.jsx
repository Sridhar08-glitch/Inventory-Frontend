import React from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LowStockTable({ products = [] }) {
  const lowStock = products
    .filter((p) => p.status === "active" && p.stock_quantity <= (p.min_stock_alert || 10))
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 8);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <h3 className="font-semibold">Low Stock Alerts</h3>
        {lowStock.length > 0 && (
          <Badge variant="secondary" className="ml-auto text-xs">{lowStock.length}</Badge>
        )}
      </div>
      {lowStock.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">All stocks are healthy</p>
      ) : (
        <div className="space-y-2.5">
          {lowStock.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-destructive">{p.stock_quantity}</p>
                <p className="text-xs text-muted-foreground">min: {p.min_stock_alert || 10}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}