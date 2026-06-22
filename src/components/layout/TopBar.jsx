import React, { useState } from "react";
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopBar({ onMenuClick, lowStockCount }) {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-lg border-b border-border flex items-center gap-4 px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, SKUs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-accent/50 border-0 focus-visible:ring-1"
          />
        </div>
      </form>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
              <Bell className="h-4 w-4" />
              {lowStockCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                  {lowStockCount > 9 ? "9+" : lowStockCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="px-3 py-2 border-b">
              <p className="font-semibold text-sm">Notifications</p>
            </div>
            {lowStockCount > 0 ? (
              <DropdownMenuItem onClick={() => navigate("/products?filter=low_stock")}>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Low Stock Alert</span>
                  <span className="text-xs text-muted-foreground">{lowStockCount} products below minimum stock</span>
                </div>
              </DropdownMenuItem>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-primary/10">
              <span className="text-sm font-semibold text-primary">
                {user?.first_name?.[0] || user?.username?.[0] || "U"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2 border-b">
              <p className="font-medium text-sm">
                {user?.first_name 
                  ? `${user.first_name} ${user.last_name || ''}` 
                  : user?.username || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}