"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  FileStack,
  HardDrive,
  Layers,
  MessageSquare,
  ShieldCheck,
  UploadCloud,
  Zap,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Q93DCore } from "@/components/ui/q9-3d-core";
import { Card3D } from "@/components/ui/card-3d";
import { Q9InteractiveDemo } from "@/components/corporate/q9-interactive-demo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary transition-colors duration-300 overflow-x-hidden">
      {/* ── Subtle Ambient Backdrop ──────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-40 dark:opacity-60">
        <div className="absolute -top-48 right-1/4 h-[700px] w-[700px] rounded-full bg-blue-600/10 dark:bg-blue-500/15 blur-[160px]" />
        <div className="absolute top-1/2 -left-48 h-[650px] w-[650px] rounded-full bg-indigo-600/10 dark:bg-indigo-500/15 blur-[160px]" />
      </div>

      <AppHeader activePath="/" />

      <main className="relative z-10 flex-1">
        {/* ── HERO SECTION ────────────────────────────────────────────── */}
        <section className="relative px-4 pt-12 pb-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-7 text-right space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1.5 text-xs font-bold text-foreground/90 backdrop-blur-md shadow-2xs"
              >
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>منظومة RAG محلية لاستنطاق المستندات • Q9 Technologies</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18]"
              >
                استنطاق المستندات{" "}
                <span className="bg-gradient-to-l from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  بالذكاء الاصطناعي المحلي
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl"
              >
                محرك بحث واسترجاع دلالي متقدم لاستخراج المعلومات وتوثيقها بدقة قطعية برقم الصفحة والفقرة، مع معالجة محلية 100% On-Premises تحافظ على خصوصية بياناتك بالكامل.
              </motion.p>

              {/* Direct Actions */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="h-12 px-7 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20 transition-all gap-2 cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span>ابدأ المحادثة</span>
                    <ArrowLeft className="size-4 mr-1" />
                  </Button>
                </Link>

                <Link href="/documents">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 text-sm font-bold rounded-xl border-border/80 hover:bg-muted text-foreground transition-all gap-2 cursor-pointer"
                  >
                    <FileStack className="size-4 text-primary" />
                    <span>إدارة المستندات</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap items-center gap-5 text-xs font-semibold text-muted-foreground pt-4 border-t border-border/60"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  معالجة محلية On-Premises
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-blue-500" />
                  توثيق قطعي برقم الصفحة
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-cyan-500" />
                  يدعم PDF و Word و TXT
                </span>
              </motion.div>
            </div>

            {/* Glowing 3D Quantum Entity */}
            <div className="lg:col-span-5 flex items-center justify-center relative min-h-[420px]">
              <Q93DCore size={440} className="w-full" />
            </div>
          </div>

          {/* ── Key Metrics Strip ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-5 text-center transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                  100%
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  معالجة محلية
                </p>
                <p className="text-[10px] text-muted-foreground">
                  بياناتك لا تغادر جهازك
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-5 text-center transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
                  0%
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  تكهن أو هلوسة
                </p>
                <p className="text-[10px] text-muted-foreground">
                  إجابات موثقة بالأدلة المرجعية
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-5 text-center transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-blue-500 font-mono">
                  0.13s
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  استجابة سريعة
                </p>
                <p className="text-[10px] text-muted-foreground">
                  بحث متجهي دلالي فوري
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-5 text-center transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-cyan-500 font-mono">
                  Multi-Format
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  تعدد الصيغ
                </p>
                <p className="text-[10px] text-muted-foreground">
                  PDF, DOCX, TXT, MD
                </p>
              </div>
            </Card3D>
          </motion.div>
        </section>

        {/* ── LIVE INTERACTIVE PRODUCT CONSOLE ─────────────────────────── */}
        <section id="demo" className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              تجربة حية لمحرك الاسترجاع الدلالي
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              اختر أحد نماذج المستندات أدناه لمشاهدة استخراج الإجابة وتوثيقها بدقة برقم الصفحة.
            </p>
          </div>

          <Q9InteractiveDemo />
        </section>

        {/* ── CORE PILLARS ────────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Layers className="size-3.5" />
              <span>المعايير التقنية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              بنية قوية لاسترجاع المعرفة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D>
              <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-2xs hover:border-primary/60 transition-all space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  السيادة والخصوصية التامة
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تشغيل معزول محلياً داخل جهازك أو شبكتك الخاصة دون إرسال أي نصوص أو ملفات إلى خوادم خارجية.
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-2xs hover:border-primary/60 transition-all space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileCheck2 className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  التوثيق الدقيق وسلسلة الأدلة
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  كل إجابة مستخلصة تكون مقرونة بنص الفقرة الأصلية ورقم الصفحة لمنع الهلوسة وضمان موثوقية المعلومة.
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-2xs hover:border-primary/60 transition-all space-y-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Zap className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  فهرسة وبحث متجهي سريع
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تقسيم ذكي للنصوص وحفظ التضمينات المتجهية في Qdrant للوصول إلى أي معلومة في أجزاء من الثانية.
                </p>
              </div>
            </Card3D>
          </div>
        </section>

        {/* ── 3 SIMPLE STEPS ──────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              طريقة الاستخدام
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              3 خطوات للبدء في استنطاق مستنداتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border/80 bg-card p-6 text-right space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UploadCloud className="size-5" />
                </div>
                <span className="font-mono text-2xl font-black text-muted-foreground/30">01</span>
              </div>
              <h3 className="text-base font-bold text-foreground">رفع المستندات</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ارفع ملفاتك بصيغ PDF أو DOCX أو TXT من واجهة إدارة المستندات.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 text-right space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HardDrive className="size-5" />
                </div>
                <span className="font-mono text-2xl font-black text-muted-foreground/30">02</span>
              </div>
              <h3 className="text-base font-bold text-foreground">المعالجة والفهرسة</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                يقوم النظام بتقسيم الملف وتوليد المتجهات الدلالية وتخزينها محلياً.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 text-right space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="size-5" />
                </div>
                <span className="font-mono text-2xl font-black text-muted-foreground/30">03</span>
              </div>
              <h3 className="text-base font-bold text-foreground">طرح الأسئلة</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                اطرح استفساراتك واستلم الإجابات موثقة برقم الصفحة والفقرة.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/chat">
              <Button
                size="lg"
                className="h-11 px-7 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md gap-2 cursor-pointer"
              >
                <MessageSquare className="size-4" />
                <span>الدخول إلى المحادثة</span>
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Minimal Clean Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border/70 py-8 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground bg-card/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-foreground">
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-mono text-xs font-black">
              Q9
            </div>
            <span>Q9 AI Studio • منصة استنطاق المستندات</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/chat" className="hover:text-foreground transition-colors">
              المحادثة
            </Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              لوحة القيادة
            </Link>
            <span>•</span>
            <Link href="/documents" className="hover:text-foreground transition-colors">
              المستندات
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
