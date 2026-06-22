import React, { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { salesApi, productsApi, stockMovementsApi } from "@/services/api";

export default function SaleFormDialog({ open, onOpenChange, products = [], onSaved }) {
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const addItem = () => setItems(prev => [...prev, { product_id: "", quantity: 1 }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const getProduct = (id) => products.find(p => p.id === id);

  const lineItems = items.map(item => {
    const prod = getProduct(item.product_id);
    const qty = parseInt(item.quantity) || 0;
    return {
      ...item,
      product_name: prod?.name || "",
      sku: prod?.sku || "",
      unit_price: parseFloat(prod?.selling_price) || 0,
      total: (parseFloat(prod?.selling_price) || 0) * qty,
    };
  });

  const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSave = async () => {
    setSaving(true);
    try {
      const orderNumber = "SO-" + Date.now().toString(36).toUpperCase();
      const validItems = lineItems.filter(i => i.product_id && i.quantity > 0);

      // Create sale order
      const saleOrder = await salesApi.create({
        order_number: orderNumber,
        items: validItems.map(({ product_id, product_name, sku, quantity, unit_price, total }) => ({
          product_id, 
          product_name, 
          sku, 
          quantity: parseInt(quantity), 
          unit_price, 
          total
        })),
        subtotal: Math.round(subtotal * 100) / 100,
        tax_amount: Math.round(tax * 100) / 100,
        total_amount: Math.round(total * 100) / 100,
        customer_name: customer.name,
        customer_email: customer.email,
        notes,
        payment_status: "pending",
        status: "confirmed",
      });

      // Note: Stock updates are handled automatically by Django backend
      // The SaleOrderViewSet.create() method already handles stock movements

      setItems([{ product_id: "", quantity: 1 }]);
      setCustomer({ name: "", email: "" });
      setNotes("");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create sale:", error);
      alert("Failed to create sale order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Sale Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer Name</Label>
              <Input value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Customer Email</Label>
              <Input type="email" value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Order Items</Label>
            {items.map((item, i) => {
              const prod = getProduct(item.product_id);
              return (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Select value={item.product_id} onValueChange={v => updateItem(i, "product_id", v)}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {products.filter(p => p.status === "active").map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.stock_quantity} in stock)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={e => updateItem(i, "quantity", e.target.value)}
                    className="w-20" 
                    placeholder="Qty" 
                  />
                  <div className="w-24 text-right text-sm font-medium">
                    ${((parseFloat(prod?.selling_price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                  </div>
                  {items.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => removeItem(i)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              );
            })}
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
            </Button>
          </div>

          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold border-t pt-2">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !lineItems.some(i => i.product_id)}>
            {saving ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}