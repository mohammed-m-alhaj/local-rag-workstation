"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertCircle,
  Bot,
  Check,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Layers,
  Loader2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Square,
  Trash2,
  User,
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
import { useApp } from "@/lib/context/app-context";
import { suggestedQuestions, type ChatMessage, type QuerySource, type Document } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export function ChatInterface() {
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

  // Citation Modal State
  const [activeSource, setActiveSource] = useState<QuerySource | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

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
      const data = await getConversation(convId);
      setActiveConversationId(data.id);
      const converted: ChatMessage[] = data.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      }));
      setMessages(converted);
    } catch (err) {
      toast.error("فشل في تحميل المحادثة");
    } finally {
      setLoadingHistory(false);
    }
  };

  // Delete a conversation
  const handleDeleteChat = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversationId === convId) {
        startNewChat();
      }
      toast.success("تم حذف المحادثة بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء حذف المحادثة");
    }
  };

  // Copy message text
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("تم النسخ إلى الحافظة");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export current conversation to Markdown
  const exportChat = () => {
    if (messages.length === 0) {
      toast.error("لا توجد رسائل لتصديرها");
      return;
    }

    const dateStr = new Date().toLocaleString("ar-EG");
    let markdown = `# تقرير محادثة Q9 AI Studio\n\n`;
    markdown += `- **تاريخ التصدير:** ${dateStr}\n`;
    markdown += `- **معرف الجلسة:** ${activeConversationId ?? "جلسة جديدة"}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((msg) => {
      const roleLabel = msg.role === "user" ? "👤 السؤال (المستخدم)" : "🤖 إجابة Q9 AI";
      markdown += `### ${roleLabel}\n\n${msg.content}\n\n`;
      if (msg.sources && msg.sources.length > 0) {
        markdown += `**المصادر المستند إليها:**\n`;
        msg.sources.forEach((s) => {
          markdown += `- 📄 ${s.documentName ?? "مستند"} (صفحة ${s.page ?? "-"}) - مطابقة: ${Math.round((s.score ?? 0) * 100)}%\n`;
          if (s.chunkText) {
            markdown += `  > ${s.chunkText.replace(/\n/g, " ")}\n`;
          }
        });
        markdown += `\n`;
      }
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Q9-AI-Chat-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("تم تحميل ملف تقرير المحادثة بتنسيق Markdown");
  };

  // Main query sender
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

  const stopGeneration = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-background">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-15"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Left/Start Sidebar (ChatGPT / Claude Style) ────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col border-r border-border/60 bg-muted/20 transition-all duration-300 ease-in-out shrink-0 z-20",
          isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none",
          "max-md:fixed max-md:top-16 max-md:bottom-0 max-md:right-0 max-md:w-80 max-md:bg-background/95 max-md:backdrop-blur-2xl max-md:shadow-2xl"
        )}
      >
        {/* Sidebar Header & New Chat */}
        <div className="p-4 border-b border-border/60 space-y-3">
          <Button
            onClick={startNewChat}
            className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm font-medium h-10"
          >
            <Plus className="size-4" />
            <span>محادثة جديدة</span>
          </Button>

          {/* Search History */}
          <div className="relative">
            <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="بحث في المحادثات..."
              className="pr-9 h-9 text-xs bg-background/60 border-border/80"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            سجل المحادثات
          </div>
          {filteredConversations.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              لا توجد محادثات سابقة
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => loadChat(conv.id)}
                  className={cn(
                    "group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-medium border border-primary/20"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <MessageSquare className="size-3.5 shrink-0 opacity-70" />
                    <span className="truncate text-right" title={conv.title}>
                      {conv.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-opacity shrink-0 mr-1"
                    onClick={(e) => handleDeleteChat(conv.id, e)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Knowledge Base Scope & Status Footer */}
        <div className="p-3 border-t border-border/60 bg-muted/40 space-y-2.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Layers className="size-3 text-primary" /> نطاق المعرفة:
              </span>
              <span className="text-[10px] text-primary font-bold">
                {documents.length} مستند مفهرس
              </span>
            </div>
            <select
              value={selectedDocId ?? ""}
              onChange={(e) => setSelectedDocId(e.target.value || null)}
              className="w-full text-xs rounded-md border border-border/80 bg-background px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">جميع المستندات (قاعدة المعرفة كاملة)</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md border border-border/60 bg-background/50 p-2 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                المحرك العصبي
              </span>
              <span className="font-mono text-[10px] text-foreground font-semibold">Qwen 3.5 4B</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Zap className="size-3 text-amber-500" />
                الذاكرة المخبأة (Cache)
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">فائقة 0.02s</span>
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
                  className="h-8 text-xs gap-1.5 border-border/80 hover:bg-muted"
                >
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">تصدير المحادثة</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewChat}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  مسح
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 space-y-6">
          {messages.length === 0 ? (
            /* Welcome Hero & Suggestions */
            <div className="flex min-h-full flex-col items-center justify-center max-w-2xl mx-auto text-center px-4 py-12 animate-in fade-in duration-500">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-500/20 mb-6">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-background">
                  <Sparkles className="size-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                مساعد المعرفة الذكي | Q9 AI Studio
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
                استنطاق فوري فائق السرعة عبر الذكاء الاصطناعي وقاعدة المتجهات، مع توثيق دقيق لكل فقرة ومصدر بالصفحة.
              </p>

              {/* Suggestions Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-right">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuery(q)}
                    disabled={isStreaming}
                    className="flex flex-col justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/50 hover:border-primary/50 transition-all text-right group shadow-xs hover:shadow-sm"
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 hover:text-foreground"
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
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
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
                              className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1.5 text-xs font-medium hover:border-primary/60 hover:bg-primary/5 transition-all shadow-2xs group text-right"
                            >
                              <span className="text-muted-foreground group-hover:text-primary">📄</span>
                              <span className="truncate max-w-[160px] text-foreground">
                                {source.documentName ?? "مستند"}
                              </span>
                              {source.page && (
                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
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
        </div>

        {/* Bottom Floating Input Dock */}
        <div className="p-4 bg-gradient-to-t from-background via-background to-transparent pt-6">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuery(input);
              }}
              className="relative flex items-center rounded-2xl border border-border/80 bg-background/90 backdrop-blur-xl shadow-md focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2"
            >
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل أي سؤال حول مستنداتك... (Enter للإرسال)"
                className="min-h-[44px] max-h-32 border-0 bg-transparent focus-visible:ring-0 resize-none py-2.5 px-3 text-sm"
                rows={1}
                disabled={isStreaming}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendQuery(input);
                  }
                }}
              />

              <div className="flex items-center gap-1.5 pl-1">
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={stopGeneration}
                    className="size-9 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                    title="إيقاف التوليد"
                  >
                    <Square className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="size-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
                    title="إرسال"
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
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 border border-border/60 text-xs">
                <div>
                  <span className="text-muted-foreground">اسم المستند: </span>
                  <span className="font-semibold text-foreground">
                    {activeSource.documentName ?? "غير محدد"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {activeSource.page && (
                    <span className="bg-background px-2 py-0.5 rounded border border-border/80 font-medium">
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
                  className="text-xs"
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
                  className="text-xs"
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
