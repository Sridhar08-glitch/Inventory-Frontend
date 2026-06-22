import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { stockMovementsApi, productsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Plus, Activity } from "lucide-react";
import { format } from "date-fns";

const typeConfig = {
  in: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  out: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  adjustment: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

export default function StockMovements() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ product_id: "", type: "in", quantity: "", reason: "" });
  const [typeFilter, setTypeFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  const { data: movements = [], isLoading } = useQuery({
    queryKey: ["movements"],
    queryFn: () => stockMovementsApi.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const filtered = typeFilter === "all" ? movements : movements.filter(m => m.type === typeFilter);

  const handleSave = async () => {
    setSaving(true);
    try {
      const prod = products.find(p => p.id === form.product_id);
      if (!prod) {
        alert("Please select a product");
        return;
      }

      const qty = parseInt(form.quantity) || 0;
      
      await stockMovementsApi.create({
        product_id: prod.id,
        product_name: prod.name,
        product_sku: prod.sku,
        type: form.type,
        quantity: qty,
        reason: form.reason,
      });

      setForm({ product_id: "", type: "in", quantity: "", reason: "" });
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create movement:", error);
      alert("Failed to create stock movement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Movements</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} records</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Movement
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="hidden md:table-cell">Before → After</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
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
                  <Activity className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground">No stock movements</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{m.product_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{m.product_sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeConfig[m.type]?.color || ""}>
                      {m.type === "in" ? "In" : m.type === "out" ? "Out" : "Adj"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{m.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {m.stock_before ?? "—"} → {m.stock_after ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{m.reason || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {m.created_date ? format(new Date(m.created_date), "MMM d, HH:mm") : ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Stock Movement</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Product *</Label>
              <Select value={form.product_id} onValueChange={v => setForm(f => ({ ...f, product_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment (Set to value)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity *</Label>
              <Input type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.product_id || !form.quantity}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}