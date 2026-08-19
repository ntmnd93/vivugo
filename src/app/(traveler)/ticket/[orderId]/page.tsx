import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { renderTicketQrDataUrl } from "@/lib/qr/generate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { serviceTypeMeta, formatVnd } from "@/lib/service-labels";
import { CheckCircle2, Circle } from "lucide-react";

export default async function TicketPage({ params }: PageProps<"/ticket/[orderId]">) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { service: true, merchant: true } },
      ticket: { include: { redemptions: true } },
    },
  });

  if (!order) notFound();
  if (!order.ticket) redirect(`/checkout/${order.id}`);

  const qrDataUrl = await renderTicketQrDataUrl(order.ticket.qrPayload);
  const redeemedItemIds = new Set(order.ticket.redemptions.map((r) => r.orderItemId));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <Badge variant="secondary" className="mb-2">
          Vé điện tử · Smart E-Ticket
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Chuyến đi đã sẵn sàng!</h1>
        <p className="text-muted-foreground">
          Đưa mã QR này cho từng đối tác để check-in — không cần in nhiều vé.
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-6">
          <div className="rounded-2xl border border-border p-3">
            {/* Data URL image; next/image requires remote/static config for external URLs, plain img is simplest here. */}
            <Image src={qrDataUrl} alt="Mã QR vé điện tử" width={240} height={240} unoptimized />
          </div>
          <p className="font-mono text-xs text-muted-foreground">#{order.ticket.id.slice(0, 8).toUpperCase()}</p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">
            {order.travelerName ? `Vé của ${order.travelerName}` : "Chi tiết vé"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {order.items.map((item) => {
            const meta = serviceTypeMeta[item.service.type];
            const redeemed = redeemedItemIds.has(item.id);
            return (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {redeemed ? (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {meta.label} · {item.merchant.name}
                    </p>
                  </div>
                </div>
                <Badge variant={redeemed ? "default" : "outline"} className="text-xs">
                  {redeemed ? "Đã check-in" : "Chưa check-in"}
                </Badge>
              </div>
            );
          })}
          <Separator className="my-2" />
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Tổng đã thanh toán</span>
            <span>{formatVnd(order.totalVnd)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
