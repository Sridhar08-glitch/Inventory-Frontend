import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, productsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";

export default function Categories() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1" });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const openForm = (cat) => {
    if (cat) {
      setEditing(cat);
      setForm({ name: cat.name || "", description: cat.description || "", color: cat.color || "#6366f1" });
    } else {
      setEditing(null);
      setForm({ name: "", description: "", color: "#6366f1" });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form);
      } else {
        await categoriesApi.create(form);
      }
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesApi.delete(id);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category");
      }
    }
  };

  const getCount = (name) => products.filter(p => p.category === name).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <Button size="sm" onClick={() => openForm(null)}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-card border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No categories yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: (cat.color || "#6366f1") + "20" }}>
                      <FolderOpen className="h-5 w-5" style={{ color: cat.color || "#6366f1" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground">{getCount(cat.name)} products</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openForm(cat)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cat.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {cat.description && <p className="text-sm text-muted-foreground mt-3">{cat.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="h-9 w-9 rounded cursor-pointer" />
                <Input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-28" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}