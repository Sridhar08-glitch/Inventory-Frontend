import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productsApi, uploadApi } from "@/services/api";
import { Upload } from "lucide-react";

function generateSKU() {
  return "SKU-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export default function ProductFormDialog({ open, onOpenChange, product, categories = [], suppliers = [], onSaved }) {
  const [form, setForm] = useState({
    name: "", sku: generateSKU(), category: "", supplier: "",
    purchase_price: "", selling_price: "", stock_quantity: 0,
    min_stock_alert: 10, barcode: "", expiry_date: "", status: "active", warehouse: "", image_url: ""
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        supplier: product.supplier || "",
        purchase_price: product.purchase_price || "",
        selling_price: product.selling_price || "",
        stock_quantity: product.stock_quantity || 0,
        min_stock_alert: product.min_stock_alert || 10,
        barcode: product.barcode || "",
        expiry_date: product.expiry_date || "",
        status: product.status || "active",
        warehouse: product.warehouse || "",
        image_url: product.image_url || "",
      });
    } else {
      setForm(f => ({ ...f, sku: generateSKU() }));
    }
  }, [product, open]);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const response = await uploadApi.uploadFile(file);
      handleChange("image_url", response.file_url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      purchase_price: parseFloat(form.purchase_price) || 0,
      selling_price: parseFloat(form.selling_price) || 0,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      min_stock_alert: parseInt(form.min_stock_alert) || 10,
    };
    
    try {
      if (product) {
        await productsApi.update(product.id, data);
      } else {
        await productsApi.create(data);
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="space-y-1.5">
            <Label>Product Name *</Label>
            <Input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Product name" />
          </div>
          <div className="space-y-1.5">
            <Label>SKU *</Label>
            <Input value={form.sku} onChange={e => handleChange("sku", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => handleChange("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Supplier</Label>
            <Select value={form.supplier} onValueChange={v => handleChange("supplier", v)}>
              <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Purchase Price</Label>
            <Input type="number" step="0.01" value={form.purchase_price} onChange={e => handleChange("purchase_price", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Selling Price</Label>
            <Input type="number" step="0.01" value={form.selling_price} onChange={e => handleChange("selling_price", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Stock Quantity</Label>
            <Input type="number" value={form.stock_quantity} onChange={e => handleChange("stock_quantity", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Min Stock Alert</Label>
            <Input type="number" value={form.min_stock_alert} onChange={e => handleChange("min_stock_alert", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Barcode</Label>
            <Input value={form.barcode} onChange={e => handleChange("barcode", e.target.value)} placeholder="Optional" />
          </div>
          <div className="space-y-1.5">
            <Label>Expiry Date</Label>
            <Input type="date" value={form.expiry_date} onChange={e => handleChange("expiry_date", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => handleChange("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Warehouse</Label>
            <Input value={form.warehouse} onChange={e => handleChange("warehouse", e.target.value)} placeholder="Optional" />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Product Image</Label>
            <div className="flex items-center gap-3">
              {form.image_url && (
                <img src={form.image_url} alt="" className="h-16 w-16 rounded-lg object-cover border" />
              )}
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:bg-accent transition-colors">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Upload Image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.name || !form.sku}>
            {saving ? "Saving..." : product ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}