import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PayButton } from "@/components/traveler/pay-button";
import { serviceTypeMeta, formatVnd } from "@/lib/service-labels";

export default async function CheckoutPage({ params }: PageProps<"/checkout/[orderId]">) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { service: true, merchant: true } } },
  });

  if (!order) notFound();
  if (order.status === "PAID") redirect(`/ticket/${order.id}`);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Xác nhận thanh toán</h1>
        <p className="text-muted-foreground">
          Đây là bản demo — không có giao dịch ngân hàng thật nào được thực hiện.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {order.items.map((item) => {
            const meta = serviceTypeMeta[item.service.type];
            return (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>
                  {item.service.name}{" "}
                  <span className="text-muted-foreground">
                    ({meta.label} · {item.merchant.name})
                  </span>
                </span>
                <span className="font-medium">{formatVnd(item.lineTotalVnd)}</span>
              </div>
            );
          })}
          <Separator className="my-2" />
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Tổng thanh toán</span>
            <span>{formatVnd(order.totalVnd)}</span>
          </div>
        </CardContent>
      </Card>

      <PayButton orderId={order.id} />
    </div>
  );
}
