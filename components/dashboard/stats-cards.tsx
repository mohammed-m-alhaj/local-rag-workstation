"use client";

import { motion } from "framer-motion";
import { AlertCircle, FileText, HardDrive, Layers, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/lib/types";
import { formatBytes } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
  error?: string | null;
}

export function StatsCards({ stats, loading, error }: StatsCardsProps) {
  const storagePercent = stats.storageLimit
    ? Math.min(
        100,
        Math.round((stats.storageUsed / stats.storageLimit) * 100)
      )
    : 0;

  const statItems = [
    {
      key: "documents",
      label: "إجمالي المستندات المفهرسة",
      sublabel: "Total Documents",
      value: stats.totalDocuments.toLocaleString(),
      icon: FileText,
      accent: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600 dark:text-blue-400",
      badge: "جاهزة للاستعلام",
    },
    {
      key: "chunks",
      label: "المقاطع المعرفية (Chunks)",
      sublabel: "Knowledge Segments",
      value: stats.totalChunks.toLocaleString(),
      icon: Layers,
      accent: "from-violet-500/10 to-violet-600/5",
      iconColor: "text-violet-600 dark:text-violet-400",
      badge: "تضمين هجين عالي الدقة",
    },
    {
      key: "cache",
      label: "سرعة استجابة الكاش",
      sublabel: "Smart Query Cache",
      value: "0.13s",
      icon: Zap,
      accent: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-500 dark:text-amber-400",
      badge: "تسريع بنسبة 99.7%",
    },
  ];

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="size-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * index }}
        >
          <Card className="relative overflow-hidden border-border/70 bg-card shadow-xs hover:border-primary/40 transition-all">
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.accent}`}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-xs font-bold text-foreground">
                  {stat.label}
                </CardTitle>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {stat.sublabel}
                </p>
              </div>
              <div
                className={`flex size-9 items-center justify-center rounded-xl bg-background/80 shadow-2xs ${stat.iconColor}`}
              >
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
                    {stat.value}
                  </p>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {stat.badge}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Storage Usage Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card className="relative h-full overflow-hidden border-border/70 bg-card shadow-xs hover:border-primary/40 transition-all">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-xs font-bold text-foreground">
                استهلاك مساحة الذاكرة
              </CardTitle>
              <p className="text-[10px] text-muted-foreground font-medium">
                Storage Usage
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-background/80 shadow-2xs text-emerald-600 dark:text-emerald-400">
              <HardDrive className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-2.5 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
                    {storagePercent}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatBytes(stats.storageUsed)} من{" "}
                    {formatBytes(stats.storageLimit)}
                  </p>
                </div>
                <Progress value={storagePercent} className="h-2" />
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
