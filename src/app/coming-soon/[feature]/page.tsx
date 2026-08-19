import { notFound } from "next/navigation";
import Link from "next/link";
import { comingSoonFeatures } from "@/lib/coming-soon-features";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo-mark";
import { ArrowLeft, Construction } from "lucide-react";

export default async function ComingSoonPage({ params }: PageProps<"/coming-soon/[feature]">) {
  const { feature: slug } = await params;
  const feature = comingSoonFeatures[slug];

  if (!feature) notFound();

  const Icon = feature.icon;

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <LogoMark className="h-12 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div
            className="flex size-16 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{ backgroundImage: "var(--brand-gradient)" }}
          >
            <Icon className="size-7" />
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <Construction className="size-3.5" />
            {feature.category} · Đang phát triển
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">{feature.title}</h1>
          <p className="text-muted-foreground">{feature.description}</p>
          <p className="text-xs text-muted-foreground">
            Tính năng này nằm trong lộ trình phát triển tiếp theo của VivuGo, chưa có trong bản demo hiện tại.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link href={feature.backHref}>
              <ArrowLeft className="size-4" />
              {feature.backLabel}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
