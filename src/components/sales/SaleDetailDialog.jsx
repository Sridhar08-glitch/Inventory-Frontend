import React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function SaleDetailDialog({ order, onClose }) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Order {order.order_number}</span>
            <Badge variant="secondary">{order.payment_status}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">{order.customer_name || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{order.created_date ? format(new Date(order.created_date), "MMM d, yyyy") : "—"}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Item</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Price</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{item.product_name}</td>
                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                    <td className="px-3 py-2 text-right">${(item.unit_price || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-medium">${(item.total || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1 text-sm border-t pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${(order.subtotal || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${(order.tax_amount || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span><span>${(order.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="text-sm">
              <p className="text-muted-foreground">Notes</p>
              <p>{order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}