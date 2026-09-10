"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileStack,
  MessageSquare,
  Home,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context/app-context";

const navItems = [
  { label: "الرئيسية", href: "/", icon: Home },
  { label: "المحادثة", href: "/chat", icon: MessageSquare, isLive: true },
  { label: "لوحة القيادة", href: "/dashboard", icon: LayoutDashboard },
  { label: "المستندات", href: "/documents", icon: FileStack },
];

export function AppHeader({ activePath }: { activePath: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Monogram */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
            <span className="font-mono font-black text-base tracking-tighter">Q9</span>
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-cyan-400 border-2 border-background animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight bg-gradient-to-l from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              Q9 AI Studio
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
              Enterprise Knowledge Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? activePath === "/"
                : activePath === item.href || activePath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
                {item.isLive && (
                  <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse mr-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-2.5">
          {/* Neural Engine Status Pill */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Q9 Neural Core (متصل)</span>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="size-9 rounded-xl border-border/80 text-foreground hover:border-primary/50 transition-all cursor-pointer"
            title={theme === "dark" ? "التحويل إلى الوضع الفاتح (الأبيض الكامل)" : "التحويل إلى الوضع الداكن (الأسود الفاخر)"}
          >
            {theme === "dark" ? (
              <Sun className="size-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="size-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </Button>

          {/* Quick Chat Link */}
          <Link href="/chat" className="hidden sm:block">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm gap-1.5 cursor-pointer"
            >
              <MessageSquare className="size-3.5" />
              <span>المحادثة</span>
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-9 rounded-xl"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/60 bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? activePath === "/"
                : activePath === item.href || activePath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-bold transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </div>
                {item.isLive && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-500 font-bold">
                    مباشر
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
