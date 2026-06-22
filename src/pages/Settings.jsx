import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, User, Save } from "lucide-react";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [business, setBusiness] = useState({
    business_name: "",
    business_address: "",
    business_phone: "",
    business_email: "",
    tax_rate: "10",
    currency: "USD",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setBusiness({
        business_name: user.business_name || "",
        business_address: user.business_address || "",
        business_phone: user.business_phone || "",
        business_email: user.business_email || "",
        tax_rate: user.tax_rate || "10",
        currency: user.currency || "USD",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateUser(business);
      if (result.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your business information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {user?.first_name 
                  ? `${user.first_name} ${user.last_name || ''}` 
                  : user?.username || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" /> Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Business Name</Label>
              <Input 
                value={business.business_name} 
                onChange={e => setBusiness(b => ({ ...b, business_name: e.target.value }))} 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Business Email</Label>
              <Input 
                type="email" 
                value={business.business_email} 
                onChange={e => setBusiness(b => ({ ...b, business_email: e.target.value }))} 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input 
                value={business.business_phone} 
                onChange={e => setBusiness(b => ({ ...b, business_phone: e.target.value }))} 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input 
                value={business.currency} 
                onChange={e => setBusiness(b => ({ ...b, currency: e.target.value }))} 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tax Rate (%)</Label>
              <Input 
                type="number" 
                value={business.tax_rate} 
                onChange={e => setBusiness(b => ({ ...b, tax_rate: e.target.value }))} 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Business Address</Label>
            <Textarea 
              value={business.business_address} 
              onChange={e => setBusiness(b => ({ ...b, business_address: e.target.value }))} 
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="mt-2">
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}