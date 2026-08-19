import Link from "next/link";
import { getActiveMerchant } from "@/lib/demo-auth/merchant-session";
import { Badge } from "@/components/ui/badge";
import { serviceTypeMeta } from "@/lib/service-labels";
import { ClipboardList, QrCode, LineChart, RefreshCw } from "lucide-react";

const navItems = [
  { href: "/merchant/orders", label: "Đơn hàng", icon: ClipboardList },
  { href: "/merchant/scan", label: "Quét QR", icon: QrCode },
  { href: "/merchant/dashboard", label: "Doanh thu", icon: LineChart },
];

export default async function MerchantLayout({ children }: { children: React.ReactNode }) {
  const merchant = await getActiveMerchant();

  if (!merchant) {
    return <div className="flex min-h-full flex-col">{children}</div>;
  }

  const meta = serviceTypeMeta[merchant.type];

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span
                className="flex size-8 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                style={{ backgroundImage: "var(--brand-gradient)" }}
              >
                V
              </span>
              <span>VivuGo Merchant</span>
            </Link>
            <Badge variant="secondary" className="gap-1">
              {merchant.name}
              <span className="text-muted-foreground">· {meta.label}</span>
            </Badge>
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
            <Link
              href="/merchant/login"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <RefreshCw className="size-4" />
              Đổi merchant
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
