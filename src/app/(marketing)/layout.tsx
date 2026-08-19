import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
              V
            </span>
            <span>VivuGo</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/merchant/login">Dành cho doanh nghiệp</Link>
            </Button>
            <Button asChild>
              <Link href="/plan">Lập lịch trình ngay</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 sm:flex-row">
          <p>© {new Date().getFullYear()} VivuGo. Sàn du lịch thông minh — bản demo.</p>
          <p>Đà Nẵng · Hội An</p>
        </div>
      </footer>
    </div>
  );
}
