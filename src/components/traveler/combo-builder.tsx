"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { computeComboPrice } from "@/lib/pricing/combo-pricing";
import { formatVnd, serviceTypeMeta } from "@/lib/service-labels";
import { Loader2, PackagePlus } from "lucide-react";
import type { ServiceType } from "@prisma/client";

export type ComboBuilderItem = {
  id: string; // itineraryItemId
  dayNumber: number;
  startTime: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  merchantName: string;
  priceVnd: number;
};

export function ComboBuilder({
  itineraryId,
  items,
}: {
  itineraryId: string;
  items: ComboBuilderItem[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set(items.map((i) => i.id)));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItems = useMemo(() => items.filter((i) => selected.has(i.id)), [items, selected]);
  const price = useMemo(
    () => computeComboPrice(selectedItems.map((i) => ({ unitPriceVnd: i.priceVnd, quantity: 1 }))),
    [selectedItems]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreateCombo() {
    if (selectedItems.length === 0) {
      toast.error("Chọn ít nhất một dịch vụ để gộp combo.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/combo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itineraryId,
          itineraryItemIds: selectedItems.map((i) => i.id),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không thể tạo combo.");
      router.push(`/combo/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setIsSubmitting(false);
    }
  }

  const days = Array.from(new Set(items.map((i) => i.dayNumber))).sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-6 pb-28">
      {days.map((dayNumber) => (
        <section key={dayNumber} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Ngày {dayNumber}</h2>
          <div className="flex flex-col gap-2">
            {items
              .filter((i) => i.dayNumber === dayNumber)
              .map((item) => {
                const meta = serviceTypeMeta[item.serviceType];
                const Icon = meta.icon;
                const checked = selected.has(item.id);
                return (
                  <Card
                    key={item.id}
                    className={checked ? "border-primary/50" : undefined}
                    onClick={() => toggle(item.id)}
                  >
                    <CardContent className="flex cursor-pointer items-center gap-4 py-3">
                      <Checkbox checked={checked} onCheckedChange={() => toggle(item.id)} />
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${meta.color} 16%, transparent)`,
                          color: meta.color,
                        }}
                      >
                        <Icon className="size-4.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{item.serviceName}</span>
                          <Badge variant="outline" className="text-xs">
                            {meta.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.startTime} · {item.merchantName}
                        </p>
                      </div>
                      <div className="text-sm font-medium">{formatVnd(item.priceVnd)}</div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <p className="text-muted-foreground">
              {selectedItems.length} dịch vụ đã chọn
              {price.discountPct > 0 && (
                <span className="ml-2">
                  <Badge variant="secondary">Giảm {Math.round(price.discountPct * 100)}%</Badge>
                </span>
              )}
            </p>
            <p className="font-semibold">
              {price.discountVnd > 0 && (
                <span className="mr-2 text-muted-foreground line-through">{formatVnd(price.subtotalVnd)}</span>
              )}
              {formatVnd(price.totalVnd)}
            </p>
          </div>
          <Button size="lg" onClick={handleCreateCombo} disabled={isSubmitting || selectedItems.length === 0}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <PackagePlus className="size-4" />}
            Tạo combo
          </Button>
        </div>
      </div>
    </div>
  );
}
