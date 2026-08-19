import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreateOrderForm } from "@/components/traveler/create-order-form";
import { serviceTypeMeta, formatVnd } from "@/lib/service-labels";

export default async function ComboPage({ params }: PageProps<"/combo/[id]">) {
  const { id } = await params;

  const combo = await prisma.combo.findUnique({
    where: { id },
    include: {
      items: { include: { service: { include: { merchant: true } } } },
      itinerary: true,
    },
  });

  if (!combo) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{combo.title}</h1>
        <p className="text-muted-foreground">Xác nhận combo trước khi thanh toán.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chi tiết combo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {combo.items.map((item) => {
            const meta = serviceTypeMeta[item.service.type];
            return (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.service.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.service.merchant.name}</p>
                </div>
                <span className="text-sm font-medium">{formatVnd(item.unitPriceVnd * item.quantity)}</span>
              </div>
            );
          })}

          <Separator className="my-2" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Tạm tính</span>
            <span>{formatVnd(combo.subtotalVnd)}</span>
          </div>
          {combo.discountVnd > 0 && (
            <div className="flex items-center justify-between text-sm text-primary">
              <span>Ưu đãi combo</span>
              <span>-{formatVnd(combo.discountVnd)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Tổng cộng</span>
            <span>{formatVnd(combo.totalVnd)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin đặt chỗ</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateOrderForm comboId={combo.id} defaultName={combo.itinerary?.travelerName ?? undefined} />
        </CardContent>
      </Card>
    </div>
  );
}
