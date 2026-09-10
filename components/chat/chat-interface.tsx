"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertCircle,
  ArrowDown,
  Bot,
  Check,
  ChevronRight,
  Copy,
  Download,
  FileText,
  FileUp,
  Layers,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Square,
  Trash2,
  UploadCloud,
  User,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { streamQuery } from "@/lib/api/query";
import {
  listConversations,
  getConversation,
  deleteConversation,
  type ConversationSummary,
} from "@/lib/api/conversations";
import { getDocuments } from "@/lib/api/documents";
import { uploadDocuments } from "@/lib/api/upload";
import { useApp } from "@/lib/context/app-context";
import { suggestedQuestions, type ChatMessage, type QuerySource, type Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function ChatInterfaceInner() {
  const searchParams = useSearchParams();
  const { activeCollectionId } = useApp();

  // Core Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // History & Sidebar State
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Documents & Scope State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Direct Attachment State
  const [attaching, setAttaching] = useState(false);
  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to Bottom Floating Indicator
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Citation Modal State
  const [activeSource, setActiveSource] = useState<QuerySource | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Read URL query parameter "?doc=ID"
  useEffect(() => {
    const docId = searchParams.get("doc");
    if (docId) {
      setSelectedDocId(docId);
    }
  }, [searchParams]);

  // Load conversation history from backend
  const refreshConversations = useCallback(async () => {
    try {
      const data = await listConversations();
      setConversations(data);
    } catch {
      // Backend might be warming up
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshConversations();
    getDocuments()
      .then((res) => setDocuments(res.documents))
      .catch(() => {});
  }, [refreshConversations]);

  // Handle Scroll to toggle Floating Down Button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceFromBottom > 180);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  };

  // Scroll to bottom when streaming starts or new messages arrive
  useEffect(() => {
    if (!showScrollBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, showScrollBottom]);

  // Start a new clean chat session
  const startNewChat = () => {
    if (isStreaming) stopGeneration();
    setActiveConversationId(null);
    setMessages([]);
    setInput("");
    textareaRef.current?.focus();
  };

  // Switch to a previous conversation
  const loadChat = async (convId: string) => {
    if (isStreaming) return;
    setLoadingHistory(true);
    try {
      const detail = await getConversation(convId);
      setActiveConversationId(convId);
      setMessages(detail.messages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل في تحميل المحادثة");
    } finally {
      setLoadingHistory(false);
    }
  };

  // Delete a conversation
  const handleDeleteChat = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      toast.success("تم حذف المحادثة بنجاح");
      if (activeConversationId === convId) {
        startNewChat();
      }
      refreshConversations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل في حذف المحادثة");
    }
  };

  // Stop generation
  const stopGeneration = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsStreaming(false);
    toast.info("تم إيقاف التوليد");
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("تم نسخ النص إلى الحافظة");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Direct Attachment Handler
  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAttaching(true);
    setAttachmentProgress(0);

    try {
      const results = await uploadDocuments([file], {
        collectionId: activeCollectionId,
        onProgress: ({ progress }) => setAttachmentProgress(progress),
      });

      if (results[0]) {
        setSelectedDocId(results[0].id);
        toast.success(`تم إرفاق وفهرسة "${file.name}" وتعيينها كنطاق بحث`);
        const docsRes = await getDocuments();
        setDocuments(docsRes.documents);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل في إرفاق المستند");
    } finally {
      setAttaching(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Export chat transcript
  const exportChat = () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => `### ${m.role === "user" ? "السؤال" : "الإجابة"}:\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Q9_Chat_Export_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير نص المحادثة بصيغة Markdown");
  };

  // Send query via SSE
  const sendQuery = useCallback(
    async (queryText: string, retry = false) => {
      const text = queryText.trim();
      if (!text || isStreaming) return;

      setLastQuery(text);
      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: text,
      };

      const assistantId = createId();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      if (retry) {
        setMessages((prev) => {
          const next = [...prev];
          if (next[next.length - 1]?.role === "assistant") next.pop();
          return [...next, assistantMessage];
        });
      } else {
        setMessages((prev) => [...prev, userMessage, assistantMessage]);
      }

      setInput("");
      setIsStreaming(true);
      abortRef.current = new AbortController();

      try {
        await streamQuery({
          query: text,
          conversationId: activeConversationId,
          collectionId: activeCollectionId,
          signal: abortRef.current.signal,
          onToken: (token) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: msg.content + token }
                  : msg
              )
            );
          },
          onSources: (sources) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, sources } : msg
              )
            );
          },
          onDone: (returnedConvId) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, isStreaming: false } : msg
              )
            );
            if (returnedConvId) {
              setActiveConversationId(returnedConvId);
            }
            refreshConversations();
          },
          onError: (error) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      isStreaming: false,
                      error: error.message,
                      content: msg.content || "تعذر إتمام الإجابة حالياً.",
                    }
                  : msg
              )
            );
          },
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "فشل في جلب الاستجابة";
        toast.error(message);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, isStreaming: false, error: message }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [activeCollectionId, activeConversationId, isStreaming, refreshConversations]
  );

  const filteredConversations = conversations.filter((c) =>
    (c.title || "محادثة").toLowerCase().includes(historySearch.toLowerCase())
  );

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* ── Collapsible History & Scope Sidebar ────────────────────────── */}
      <aside
        className={cn(
          "border-l border-border/70 bg-card/60 backdrop-blur-md flex flex-col transition-all duration-300 z-20 shrink-0",
          isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-border/60 flex items-center justify-between gap-2">
          <Button
            size="sm"
            onClick={startNewChat}
            className="flex-1 text-xs font-bold gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs rounded-xl"
          >
            <Plus className="size-4" />
            <span>محادثة جديدة</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(false)}
            title="طي القائمة الجانبية"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        </div>

        {/* History Search Bar */}
        <div className="p-3 border-b border-border/40">
          <div className="relative">
            <Search className="absolute right-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="بحث في سجل المحادثات..."
              className="h-8 pr-8 text-xs bg-background/50 rounded-lg"
            />
          </div>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingHistory ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              {historySearch ? "لا توجد نتائج مطابقة" : "لا توجد محادثات سابقة"}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = activeConversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => loadChat(conv.id)}
                  className={cn(
                    "group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors text-right",
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-2xs border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare className="size-3.5 shrink-0" />
                    <span className="truncate">{conv.title || "محادثة استرجاع معرفي"}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteChat(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-all"
                    title="حذف المحادثة"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Knowledge Scope / Active Document Filter */}
        <div className="p-3 border-t border-border/60 bg-muted/20 space-y-2">
          <label className="text-[11px] font-bold text-foreground block">
            نطاق الاستجواب والمستندات:
          </label>
          <select
            value={selectedDocId ?? ""}
            onChange={(e) => setSelectedDocId(e.target.value || null)}
            className="w-full text-xs rounded-xl border border-border/80 bg-background px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">جميع المستندات (قاعدة المعرفة كاملة)</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                📄 {doc.name}
              </option>
            ))}
          </select>

          <div className="rounded-xl border border-border/60 bg-background/50 p-2 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                المحرك العصبي
              </span>
              <span className="font-mono text-[10px] text-foreground font-semibold">Qwen 2.5 (LM Studio)</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Zap className="size-3 text-amber-500" />
                محرك البحث
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Qdrant Vector DB</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Workspace ────────────────────────────────────────── */}
      <section className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        {/* Workspace Top Bar */}
        <div className="h-14 border-b border-border/60 px-4 flex items-center justify-between bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? "إخفاء القائمة الجانبية" : "إظهار القائمة الجانبية"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeftOpen className="size-4" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent font-mono">
                Q9 AI Studio
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline-block border-r border-border/80 pr-2 mr-2">
                {activeConversationId ? "جلسة استرجاع معرفي نشطة" : "محادثة جديدة"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChat}
                  className="h-8 text-xs gap-1.5 border-border/80 hover:bg-muted rounded-xl"
                >
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">تصدير المحادثة</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewChat}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground rounded-xl"
                >
                  مسح
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Message Feed Area */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 space-y-6 relative"
        >
          {messages.length === 0 ? (
            /* Welcome Hero & Smart Suggestions */
            <div className="flex min-h-full flex-col items-center justify-center max-w-2xl mx-auto text-center px-4 py-12 animate-in fade-in duration-500">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-blue-500/20 mb-6">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-background">
                  <Sparkles className="size-8 text-primary animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                استوديو استنطاق المستندات الذكي
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
                اطرح أي استفسار حول مستنداتك لتستلم إجابات موثقة بدقة قطعية بالصفحة والفقرة الأصلية.
              </p>

              {/* Suggestions or Upload Prompt */}
              {documents.length === 0 ? (
                <div className="mt-8 p-6 rounded-2xl border border-dashed border-primary/40 bg-card/60 max-w-md text-center space-y-3">
                  <UploadCloud className="size-8 text-primary mx-auto" />
                  <p className="text-xs font-bold text-foreground">قاعدة المعرفة فارغة حالياً</p>
                  <p className="text-[11px] text-muted-foreground">
                    قم بإرفاق أو رفع مستند أولاً لتتمكن من استنطاقه والبحث فيه.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs font-bold gap-1.5 rounded-xl"
                  >
                    <Paperclip className="size-3.5" />
                    <span>إرفاق مستند الآن</span>
                  </Button>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-right">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendQuery(q)}
                      disabled={isStreaming}
                      className="flex flex-col justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-right group shadow-xs hover:shadow-sm cursor-pointer"
                    >
                      <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-relaxed">
                        {q}
                      </span>
                      <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground opacity-60 group-hover:opacity-100">
                        <span>إرسال فوري</span>
                        <ChevronRight className="size-3 rotate-180" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Message Thread */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm mt-0.5">
                      <Sparkles className="size-4" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative group rounded-2xl px-5 py-4 text-sm leading-relaxed max-w-[85%]",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground shadow-sm rounded-br-xs"
                        : "bg-muted/60 border border-border/60 rounded-bl-xs text-foreground"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content || (message.isStreaming ? "▍" : "")}
                        </ReactMarkdown>

                        {message.isStreaming && (
                          <span className="inline-block animate-pulse text-primary font-bold">
                            ▍
                          </span>
                        )}

                        {/* Message Actions */}
                        {!message.isStreaming && message.content && (
                          <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 hover:text-foreground rounded-lg"
                                onClick={() => copyToClipboard(message.content, message.id)}
                              >
                                {copiedId === message.id ? (
                                  <>
                                    <Check className="size-3 text-emerald-500" />
                                    <span>تم النسخ</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-3" />
                                    <span>نسخ</span>
                                  </>
                                )}
                              </Button>

                              {lastQuery && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs gap-1 hover:text-foreground rounded-lg"
                                  onClick={() => sendQuery(lastQuery, true)}
                                  title="إعادة صياغة الإجابة"
                                >
                                  <RotateCcw className="size-3" />
                                  <span>إعادة المحاولة</span>
                                </Button>
                              )}
                            </div>
                            <span className="text-[10px] opacity-70">
                              {message.content.length} حرف
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}

                    {/* Error Box */}
                    {message.error && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{message.error}</span>
                        {lastQuery && !message.isStreaming && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs mr-auto hover:bg-destructive/20"
                            onClick={() => sendQuery(lastQuery, true)}
                          >
                            <RotateCcw className="size-3 ml-1" /> إعادة المحاولة
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Interactive Source Citations */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 border-t border-border/60 pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <FileText className="size-3.5 text-primary" />
                          <span>المصادر الموثقة ({message.sources.length})</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            • اضغط على المصدر لعرض الفقرة الأصلية
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveSource(source)}
                              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-2.5 py-1.5 text-xs font-medium hover:border-primary/60 hover:bg-primary/5 transition-all shadow-2xs group text-right cursor-pointer"
                            >
                              <span className="text-muted-foreground group-hover:text-primary">📄</span>
                              <span className="truncate max-w-[160px] text-foreground">
                                {source.documentName ?? "مستند"}
                              </span>
                              {source.page && (
                                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                  ص {source.page}
                                </span>
                              )}
                              {source.score && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                  {Math.round(source.score * 100)}%
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted border border-border/60 text-muted-foreground mt-0.5">
                      <User className="size-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToBottom}
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30 shadow-lg border-primary/40 bg-background/95 backdrop-blur-md text-xs gap-1.5 rounded-full px-4"
            >
              <ArrowDown className="size-3.5 text-primary" />
              <span>النزول للأسفل</span>
            </Button>
          )}
        </div>

        {/* Bottom Floating Input Dock */}
        <div className="p-4 bg-gradient-to-t from-background via-background to-transparent pt-4">
          <div className="max-w-3xl mx-auto">
            {/* Hidden Attachment Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.pptx,.xlsx,.csv,.txt,.md,.json"
              className="hidden"
              onChange={handleAttachFile}
            />

            {/* Active Document Scope Banner */}
            {selectedDoc && (
              <div className="flex items-center justify-between px-3.5 py-1.5 mb-2 rounded-xl bg-primary/10 border border-primary/20 text-xs animate-in fade-in">
                <span className="flex items-center gap-1.5 text-primary font-semibold truncate">
                  <FileText className="size-3.5 shrink-0" />
                  <span>نطاق الاستجواب محصور على:</span>
                  <span className="font-bold text-foreground truncate max-w-xs">{selectedDoc.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDocId(null)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mr-2 cursor-pointer font-medium"
                  title="إلغاء الحصر والبحث في كافة المستندات"
                >
                  <span>إلغاء الحصر</span>
                  <X className="size-3" />
                </button>
              </div>
            )}

            {/* Attaching Progress Pill */}
            {attaching && (
              <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-xl bg-muted border border-border text-xs">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                <span className="text-muted-foreground">جاري فهرسة المستند المرفق...</span>
                <span className="font-mono text-primary font-bold mr-auto">{attachmentProgress}%</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuery(input);
              }}
              className="relative flex items-center rounded-2xl border border-border/80 bg-background/90 backdrop-blur-xl shadow-md focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2"
            >
              {/* Attachment Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={attaching || isStreaming}
                onClick={() => fileInputRef.current?.click()}
                className="size-9 rounded-xl text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                title="إرفاق مستند جديد للاستجواب الفوري"
              >
                {attaching ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <Paperclip className="size-4" />
                )}
              </Button>

              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل أي سؤال حول مستنداتك... (Enter للإرسال)"
                className="min-h-[44px] max-h-32 border-0 bg-transparent focus-visible:ring-0 resize-none py-2.5 px-3 text-sm flex-1"
                rows={1}
                disabled={isStreaming}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendQuery(input);
                  }
                }}
              />

              <div className="flex items-center gap-1.5 pl-1 shrink-0">
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={stopGeneration}
                    className="size-9 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                    title="إيقاف التوليد"
                  >
                    <Square className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="size-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm cursor-pointer"
                    title="إرسال السؤال"
                  >
                    <Send className="size-4" />
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground px-2">
              <span>منظومة Q9 AI تستخرج الإجابات الموثقة من مستنداتك المحلية بأمان وسرية تامة.</span>
              <span className="hidden sm:inline">Enter للإرسال • Shift + Enter لسطر جديد</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Citation Inspection Dialog ──────────────────────── */}
      <Dialog
        open={Boolean(activeSource)}
        onOpenChange={(open) => !open && setActiveSource(null)}
      >
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-primary" />
              <span>معاينة الاقتباس الأصلي</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              الفقرة التي تم استرجاعها مباشرة من قاعدة بيانات المتجهات لتوثيق الإجابة
            </DialogDescription>
          </DialogHeader>

          {activeSource && (
            <div className="space-y-4 my-2 flex-1 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-muted/50 border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground">اسم المستند: </span>
                  <span className="font-semibold text-foreground">
                    {activeSource.documentName ?? "غير محدد"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {activeSource.page && (
                    <span className="bg-background px-2 py-0.5 rounded-lg border border-border/80 font-medium">
                      رقم الصفحة: {activeSource.page}
                    </span>
                  )}
                  {activeSource.score && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      تطابق: {Math.round(activeSource.score * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="relative rounded-xl border border-border/80 bg-background p-4 text-xs font-mono leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-72 overflow-y-auto">
                {activeSource.chunkText ?? "لا يوجد نص متاح."}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl"
                  onClick={() => {
                    if (activeSource.chunkText) {
                      navigator.clipboard.writeText(activeSource.chunkText);
                      toast.success("تم نسخ الفقرة المقتبسة");
                    }
                  }}
                >
                  <Copy className="size-3 ml-1" />
                  نسخ الفقرة
                </Button>
                <Button
                  size="sm"
                  className="text-xs rounded-xl"
                  onClick={() => setActiveSource(null)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ChatInterface() {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>}>
      <ChatInterfaceInner />
    </Suspense>
  );
}
