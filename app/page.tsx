"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Database,
  FileCheck2,
  HardDrive,
  Layers,
  Lock,
  MessageSquare,
  Network,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Q93DCore } from "@/components/ui/q9-3d-core";
import { Card3D } from "@/components/ui/card-3d";
import { Q9InteractiveDemo } from "@/components/corporate/q9-interactive-demo";
import {
  EnterpriseComplianceBar,
  FreeGettingStartedSection,
  EnterpriseFaqSection,
  AboutQ9CompanySection,
} from "@/components/corporate/enterprise-sections";

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
        {/* ── HERO SECTION: Free Enterprise AI Platform by Q9 ───────────── */}
        <section className="relative px-4 pt-12 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Narrative Column */}
            <div className="lg:col-span-7 text-right space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-4 py-1.5 text-xs font-bold text-foreground/90 backdrop-blur-md shadow-2xs"
              >
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="tracking-wide">مبادرة تقنية مجانية بالكامل • طورتها شركة Q9 للتقنيات والذكاء الاصطناعي</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.16] sm:leading-[1.18]"
              >
                استنطاق المستندات{" "}
                <span className="bg-gradient-to-l from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  بالذكاء الاصطناعي السيادي.
                </span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground/90">
                  منظومة معرفية مجانية بالكامل من شركة Q9.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal"
              >
                طورت **شركة Q9 للتقنيات (Q9 Technologies Inc.)** هذه المنظومة وأتاحتها مجاناً بالكامل لكافة الباحثين، المؤسسات، وفرق العمل. استنطق مئات آلاف العقود والمستندات والتقارير المالية بدقة قطعية موثقة بالصفحة والفقرة — معزولة محلياً 100% داخل جهازك دون أي اشتراكات أو تكاليف.
              </motion.p>

              {/* Free Actions */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-1"
              >
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-sm font-bold rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 text-white shadow-xl shadow-blue-500/25 transition-all gap-2 cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span>ابدأ الاستخدام المجاني الآن</span>
                    <ArrowLeft className="size-4 mr-1" />
                  </Button>
                </Link>

                <a href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-6 text-sm font-bold rounded-2xl border-border/90 hover:bg-muted text-foreground transition-all gap-2 cursor-pointer"
                  >
                    <Sparkles className="size-4 text-cyan-400" />
                    <span>تجربة الاستنطاق الحي</span>
                  </Button>
                </a>

                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-13 px-5 text-sm font-bold rounded-2xl text-muted-foreground hover:text-foreground transition-all gap-2 cursor-pointer"
                  >
                    <Layers className="size-4 text-primary" />
                    <span>منصة المستندات</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap items-center gap-6 text-xs font-semibold text-muted-foreground pt-4 border-t border-border/60"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  مجاني 100% دون أي رسوم أو قيود
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500" />
                  تشغيل محلي معزول 100% On-Premises
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-cyan-500" />
                  توثيق قطعي برقم الصفحة دون هلوسة
                </span>
              </motion.div>
            </div>

            {/* Free-Floating Glowing 3D Quantum Entity */}
            <div className="lg:col-span-5 flex items-center justify-center relative min-h-[460px]">
              <Q93DCore size={460} className="w-full" />
            </div>
          </div>

          {/* ── Key Metrics Strip ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs text-center transition-colors">
                <div className="text-3xl font-black text-emerald-500 font-mono">
                  مجاني 100%
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  متاح للجميع بلا مقابل
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  مبادرة معرفية مفتوحة من شركة Q9
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs text-center transition-colors">
                <div className="text-3xl font-black text-foreground font-mono">
                  100% محلي
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  سرية وأمان On-Premises
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  بياناتك لا تغادر جهازك أو خادمك
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs text-center transition-colors">
                <div className="text-3xl font-black text-blue-500 font-mono">
                  0.0%
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  معدل الهلوسة والتكهن
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  كل معلومة مقرونة بنص الدليل الأصلي
                </p>
              </div>
            </Card3D>

            <Card3D>
              <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs text-center transition-colors">
                <div className="text-3xl font-black text-cyan-500 font-mono">
                  0.13 ثانية
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">
                  كاش استجابة فائق
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  استرجاع دلالي سريع عبر Qdrant
                </p>
              </div>
            </Card3D>
          </motion.div>
        </section>

        {/* ── LIVE INTERACTIVE PRODUCT CONSOLE ─────────────────────────── */}
        <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              شاهد محرك Q9 في بيئة العمل الحقيقية
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              اختر أحد سيناريوهات المستندات أدناه لمشاهدة الاسترجاع الدلالي، والتوثيق القطعي بالدليل في أجزاء من الثانية.
            </p>
          </div>

          <Q9InteractiveDemo />
        </section>

        {/* ── THE THREE CORE PILLARS ──────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Layers className="size-3.5" />
              <span>المعايير الهندسية لمنظومة Q9</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              تقنية مؤسسية قوية مُقدمة مجاناً للجميع
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تجمع منظومة Q9 بين خوارزميات الاسترجاع الدلالي المتقدمة وضوابط الخصوصية التامة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-8 shadow-xs hover:border-primary/60 transition-all space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  السيادة والعزل التام (Air-Gapped)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تثبيت محلي 100% داخل مراكز بياناتك أو جهازك الخاص. لا يتم إرسال أي بايت أو نص خارج محيطك، مع ضمان قطعي بعدم استخدام ملفاتك لتدريب أي نماذج خارجية.
                </p>
                <div className="pt-2 border-t border-border/60 text-xs font-bold text-blue-500">
                  حماية وخصوصية تامة
                </div>
              </div>
            </Card3D>

            <Card3D>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-8 shadow-xs hover:border-primary/60 transition-all space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileCheck2 className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  التوثيق القطعي وسلسلة الأدلة
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  خوارزميات استرجاع دلالية تلزم النظام بتقديم الدليل الموثق برقم الصفحة والفقرة لكل معلومة مستخلصة. إذا لم يرد الدليل صراحة، يعلن المحرك عدم وجوده بدلاً من التكهن.
                </p>
                <div className="pt-2 border-t border-border/60 text-xs font-bold text-emerald-500">
                  دقة موثقة بنسبة 100%
                </div>
              </div>
            </Card3D>

            <Card3D>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-8 shadow-xs hover:border-primary/60 transition-all space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Zap className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  سرعة الاستجابة واستيعاب الملفات
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  استيعاب مرن لمختلف صيغ الملفات (PDF, Word, TXT, MD)، تقسيم حتمي ذكي يحفظ ترابط الأفكار، وبحث متجهي في Qdrant يستوعب آلاف الصفحات بثبات وسرعة فائقة.
                </p>
                <div className="pt-2 border-t border-border/60 text-xs font-bold text-cyan-500">
                  أداء عالي الكفاءة
                </div>
              </div>
            </Card3D>
          </div>
        </section>

        {/* ── HOW TO GET STARTED (3 Simple Free Steps) ─────────────────── */}
        <FreeGettingStartedSection />

        {/* ── PRIVACY & SECURITY GUARANTEES ───────────────────────────── */}
        <EnterpriseComplianceBar />

        {/* ── PRACTICAL USE CASES (كيف تستفيد مختلف التخصصات مجاناً) ───── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/60">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Building2 className="size-3.5" />
              <span>مجالات الاستفادة من المنظومة</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              أداة مثالية للمحامين، المحاسبين، والباحثين
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              صممت المنظومة لتخدم مختلف القطاعات وتوفر مئات الساعات من البحث اليدوي في الملفات الكبيرة مجاناً.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-7 shadow-xs hover:border-primary/60 transition-all space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Scale className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  للقطاع القانوني وتدقيق العقود
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  فحص مئات صفحات العقود والشروط الجزائية بدقة متناهية، ومقارنة الصياغات القانونية مع التوثيق المرجعي بالصفحة والسطر لحماية المصالح التعاقدية.
                </p>
                <div className="pt-2 border-t border-border/60 text-xs font-bold text-primary flex items-center gap-1">
                  <span>Q9 Legal Intelligence</span>
                </div>
              </div>
            </Card3D>

            <Card3D>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-7 shadow-xs hover:border-primary/60 transition-all space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Database className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  للقوائم المالية والمحاسبة
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  استنطاق الميزانيات السنوية، كشوفات التدقيق المالي، وتتبع المؤشرات المحاسبية فورياً ومحلياً دون رفع أي مستند سرّي على السحابة العامة.
                </p>
                <div className="pt-2 border-t border-border/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>Q9 Finance Core</span>
                </div>
              </div>
            </Card3D>

            <Card3D>
              <div className="h-full rounded-3xl border border-border/80 bg-card p-7 shadow-xs hover:border-primary/60 transition-all space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <ShieldAlert className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  للأبحاث والجهات الأكاديمية
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  تلخيص أمهات الكتب، الأبحاث العلمية، والرسائل الأكاديمية واستخراج الاستشهادات النصية الدقيقة مع العزو المصدري برقم الصفحة والفقرة.
                </p>
                <div className="pt-2 border-t border-border/60 text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                  <span>Q9 Academic Engine</span>
                </div>
              </div>
            </Card3D>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ──────────────────────────────── */}
        <EnterpriseFaqSection />

        {/* ── ABOUT Q9 TECHNOLOGIES & CONTACT ─────────────────────────── */}
        <AboutQ9CompanySection />
      </main>

      {/* ── Corporate Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border/70 py-12 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground bg-card/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 font-bold text-foreground text-center sm:text-right">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-mono text-sm font-black shadow-md shadow-blue-500/20">
              Q9
            </div>
            <div>
              <p className="text-sm font-black">شركة Q9 للتقنيات والذكاء الاصطناعي (Q9 Technologies Inc.)</p>
              <p className="text-[11px] text-muted-foreground font-medium">منظومة الاستخبارات المعرفية واستنطاق المستندات • مبادرة مجانية ومتاحة للجميع</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              متاح مجاناً 100%
            </span>
            <span>•</span>
            <span className="font-mono text-foreground">contact@q9.ai</span>
            <span>•</span>
            <span>معالجة محلية معزولة 100% On-Premises</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
