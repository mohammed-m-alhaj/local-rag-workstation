import { AppHeader } from "@/components/layout/app-header";
import { cn } from "@/lib/utils";

export function AppShell({
  activePath,
  children,
  fullBleed = false,
}: {
  activePath: string;
  children: React.ReactNode;
  fullBleed?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <AppHeader activePath={activePath} />

      <main
        className={cn(
          "relative flex-1",
          fullBleed
            ? "h-[calc(100vh-4rem)] w-full overflow-hidden"
            : "mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8"
        )}
      >
        {children}
      </main>
    </div>
  );
}
