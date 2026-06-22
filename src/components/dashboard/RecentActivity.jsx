import React from "react";
import { ArrowDownLeft, ArrowUpRight, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const typeConfig = {
  in: { icon: ArrowDownLeft, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", label: "Stock In" },
  out: { icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", label: "Stock Out" },
  adjustment: { icon: Minus, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", label: "Adjustment" },
};

export default function RecentActivity({ movements = [] }) {
  if (!movements.length) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {movements.slice(0, 8).map((m) => {
          const config = typeConfig[m.type] || typeConfig.adjustment;
          const Icon = config.icon;
          return (
            <div key={m.id} className="flex items-center gap-3">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0", config.bg)}>
                <Icon className={cn("h-3.5 w-3.5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.product_name || "Product"}</p>
                <p className="text-xs text-muted-foreground">
                  {config.label} · {m.quantity} units
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {m.created_date ? format(new Date(m.created_date), "MMM d") : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}