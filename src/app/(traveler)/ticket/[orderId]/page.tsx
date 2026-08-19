import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { renderTicketQrDataUrl } from "@/lib/qr/generate";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { serviceTypeMeta, formatVnd } from "@/lib/service-labels";
import { CheckCircle2, Circle, Plane, Sparkles } from "lucide-react";

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
  const redeemedCount = order.items.filter((i) => redeemedItemIds.has(i.id)).length;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <Badge variant="secondary" className="mb-2 gap-1.5">
          <Sparkles className="size-3.5" />
          Smart E-Ticket
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Chuyến đi đã sẵn sàng!</h1>
        <p className="text-muted-foreground">
          Đưa mã QR này cho từng đối tác để check-in — không cần in nhiều vé.
        </p>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        <div
          className="relative px-6 pt-6 pb-9 text-white"
          style={{ backgroundImage: "var(--brand-gradient)" }}
        >
          <div
            aria-hidden
            className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-2xl"
          />
          <p className="text-xs font-medium tracking-widest text-white/70 uppercase">
            {order.travelerName ? `Vé của ${order.travelerName}` : "Vé điện tử VivuGo"}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold tracking-tight">ĐÀ NẴNG</p>
            </div>
            <div className="flex flex-1 flex-col items-center px-3">
              <Plane className="size-4 -rotate-0 text-white/80" />
              <div className="mt-1 w-full border-t-2 border-dashed border-white/40" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight">HỘI AN</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-xs text-white/75">
            <span>{order.items.length} dịch vụ đã đặt</span>
            <span>
              Đã check-in {redeemedCount}/{order.items.length}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute top-1/2 right-0 size-6 translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          <div className="mx-7 border-t-2 border-dashed border-border" />
        </div>

        <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-2">
          <div className="rounded-2xl border border-border p-3">
            <Image src={qrDataUrl} alt="Mã QR vé điện tử" width={220} height={220} unoptimized />
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            #{order.ticket.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="flex flex-col gap-3 px-6 py-6">
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
        </div>
      </div>
    </div>
  );
}
