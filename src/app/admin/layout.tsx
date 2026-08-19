import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/logo-mark";
import { LayoutDashboard, Users, Radar } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/coming-soon/affiliate", label: "Affiliate", icon: Users },
  { href: "/coming-soon/remarketing", label: "CDP & Remarketing", icon: Radar },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <LogoMark className="h-12 w-auto" />
            </Link>
            <Badge variant="secondary">Chế độ demo</Badge>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
