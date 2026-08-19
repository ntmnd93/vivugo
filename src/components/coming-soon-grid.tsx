import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { comingSoonFeatures } from "@/lib/coming-soon-features";
import { ArrowUpRight } from "lucide-react";

export function ComingSoonGrid({ slugs, title }: { slugs: string[]; title?: string }) {
  const features = slugs.map((slug) => comingSoonFeatures[slug]).filter(Boolean);

  if (features.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {title && <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {features.map((f) => (
          <Link key={f.slug} href={`/coming-soon/${f.slug}`} className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-4.5" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-sm font-medium">{f.title}</p>
                <Badge variant="outline" className="w-fit text-[10px]">
                  Sắp ra mắt
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
