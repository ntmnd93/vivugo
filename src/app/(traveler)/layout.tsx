import Link from "next/link";

export default function TravelerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span
              className="flex size-8 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
              style={{ backgroundImage: "var(--brand-gradient)" }}
            >
              V
            </span>
            <span>VivuGo</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
