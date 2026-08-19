import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { serviceTypeMeta, formatVnd } from "@/lib/service-labels";
import { companionOptions } from "@/lib/ai/itinerary-schema";
import { Clock, PackagePlus } from "lucide-react";

export default async function ItineraryPage({ params }: PageProps<"/itinerary/[id]">) {
  const { id } = await params;

  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: {
      items: {
        include: { service: { include: { merchant: true } } },
        orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
      },
    },
  });

  if (!itinerary) notFound();

  const days = Array.from(new Set(itinerary.items.map((i) => i.dayNumber))).sort((a, b) => a - b);
  const companionLabel =
    companionOptions.find((c) => c.value === itinerary.companionType)?.label ?? itinerary.companionType;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{itinerary.days} ngày</Badge>
          <Badge variant="secondary">{companionLabel}</Badge>
          <Badge variant="secondary">Ngân sách {formatVnd(itinerary.budgetVnd)}</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {itinerary.travelerName ? `Lịch trình của ${itinerary.travelerName}` : "Lịch trình của bạn"}
        </h1>
        {itinerary.summary && <p className="text-muted-foreground">{itinerary.summary}</p>}
        {itinerary.totalEstimatedCostVnd != null && (
          <p className="text-sm font-medium">
            Chi phí ước tính: <span className="text-primary">{formatVnd(itinerary.totalEstimatedCostVnd)}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {days.map((dayNumber) => {
          const items = itinerary.items.filter((i) => i.dayNumber === dayNumber);
          return (
            <section key={dayNumber} className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Ngày {dayNumber}</h2>
              <div className="flex flex-col gap-3">
                {items.map((item) => {
                  const meta = serviceTypeMeta[item.service.type];
                  const Icon = meta.icon;
                  return (
                    <Card
                      key={item.id}
                      className="border-l-4 transition-shadow hover:shadow-sm"
                      style={{ borderLeftColor: meta.color }}
                    >
                      <CardContent className="flex items-start gap-4 py-4">
                        <div className="flex flex-col items-center gap-1 pt-1 text-xs text-muted-foreground">
                          <Clock className="size-3.5" />
                          {item.startTime}
                        </div>
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `color-mix(in oklch, ${meta.color} 16%, transparent)`,
                            color: meta.color,
                          }}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{item.service.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {meta.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.service.merchant.name}</p>
                          {item.notes && <p className="mt-1 text-sm">{item.notes}</p>}
                        </div>
                        <div className="text-right text-sm font-medium">{formatVnd(item.service.priceVnd)}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div
        className="flex flex-col items-start gap-4 rounded-2xl px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      >
        <div>
          <p className="font-semibold">Ưng ý với lịch trình này?</p>
          <p className="text-sm text-white/80">Gộp combo để nhận giá ưu đãi hơn đặt lẻ.</p>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-white text-[oklch(0.5_0.16_35)] shadow-lg shadow-black/10 hover:bg-white/90"
        >
          <Link href={`/combo/new?itineraryId=${itinerary.id}`}>
            <PackagePlus className="size-4" />
            Chọn dịch vụ để gộp combo ưu đãi
          </Link>
        </Button>
      </div>
    </div>
  );
}
