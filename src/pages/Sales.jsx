import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { salesApi, productsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, ShoppingCart, Eye } from "lucide-react";
import { format } from "date-fns";
import SaleFormDialog from "../components/sales/SaleFormDialog";
import SaleDetailDialog from "../components/sales/SaleDetailDialog";

const paymentColors = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  partial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  refunded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function Sales() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: () => salesApi.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const filtered = statusFilter === "all" ? sales : sales.filter(s => s.payment_status === statusFilter);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["sales"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["movements-recent"] });
  };

  const updatePayment = async (id, status) => {
    try {
      await salesApi.update(id, { payment_status: status });
      refresh();
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("Failed to update payment status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Sale
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead className="hidden md:table-cell">Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><div className="h-10 bg-muted animate-pulse rounded" /></TableCell></TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">No sales orders</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(s => (
                <TableRow key={s.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-mono text-sm font-medium">{s.order_number}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{s.customer_name || "—"}</TableCell>
                  <TableCell className="font-semibold text-sm">${(parseFloat(s.total_amount) || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={paymentColors[s.payment_status] || ""}>
                      {s.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {s.created_date ? format(new Date(s.created_date), "MMM d, yyyy") : ""}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetailOrder(s)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updatePayment(s.id, "paid")}>Mark as Paid</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updatePayment(s.id, "refunded")}>Mark as Refunded</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SaleFormDialog open={formOpen} onOpenChange={setFormOpen} products={products} onSaved={refresh} />
      <SaleDetailDialog order={detailOrder} onClose={() => setDetailOrder(null)} />
    </div>
  );
}