"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  FileSpreadsheet,
  FileText,
  FileType,
  Loader2,
  MessageSquare,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteDocument } from "@/lib/api/documents";
import { useApp } from "@/lib/context/app-context";
import { useDocuments } from "@/lib/hooks/use-documents";
import type { DocumentStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatRelativeTime } from "@/lib/utils";

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Markdown: FileType,
  Spreadsheet: FileSpreadsheet,
  Document: FileText,
  Text: FileType,
};

const statusConfig: Record<
  DocumentStatus,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  indexed: { label: "مفهرس وجاهز", variant: "success" },
  processing: { label: "جاري الفهرسة", variant: "warning" },
  failed: { label: "فشل التحليل", variant: "destructive" },
  already_exists: { label: "مفهرس مسبقاً", variant: "success" },
};

export function DocumentsList() {
  const { refresh } = useApp();
  const { documents, loading, error, refetch } = useDocuments({
    pollProcessing: true,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      toast.success(`تم حذف "${name}" بنجاح`);
      refresh();
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل في حذف المستند");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold">
              كافة المستندات في قاعدة المعرفة ({documents.length})
            </CardTitle>
            <CardDescription className="text-xs">
              إدارة الملفات المرفوعة، مراقبة عدد المقاطع المعرفية، وحذف المستندات
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في أسماء الملفات..."
              className="pr-9 h-9 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {error ? (
          <div className="flex items-center gap-3 px-6 py-8 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : loading ? (
          <div className="space-y-4 px-6 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <p className="px-6 py-12 text-center text-xs text-muted-foreground">
            {search ? "لا توجد ملفات مطابقة لبحثك" : "لا توجد مستندات بعد. قم برفع مستند جديد من لوحة القيادة."}
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {filteredDocs.map((doc, index) => {
              const Icon = typeIcons[doc.type] ?? FileText;
              const status = statusConfig[doc.status];

              return (
                <motion.li
                  key={doc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted border border-border/60 text-muted-foreground">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground" title={doc.name}>
                        {doc.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-mono">{doc.type}</span>
                        <span>•</span>
                        <span>{formatBytes(doc.size)}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">{doc.chunks} مقطع معرفي</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatRelativeTime(doc.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={status.variant} className="text-[11px]">
                      {status.label}
                    </Badge>

                    <Link href="/chat">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-colors"
                        title="استجواب هذا المستند في المحادثة"
                      >
                        <MessageSquare className="size-3.5" />
                        <span className="hidden sm:inline">استجواب</span>
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      disabled={deletingId === doc.id}
                      onClick={() => handleDelete(doc.id, doc.name)}
                      title="حذف المستند"
                    >
                      {deletingId === doc.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
