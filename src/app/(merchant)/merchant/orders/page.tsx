import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveMerchantId } from "@/lib/demo-auth/merchant-session";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/service-labels";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  PAID: { label: "Đã thanh toán", variant: "default" },
  PENDING: { label: "Chờ thanh toán", variant: "outline" },
  CANCELLED: { label: "Đã huỷ", variant: "secondary" },
};

export default async function MerchantOrdersPage() {
  const merchantId = await getActiveMerchantId();
  if (!merchantId) redirect("/merchant/login");

  const orderItems = await prisma.orderItem.findMany({
    where: { merchantId },
    include: { order: true, service: true },
    orderBy: { order: { createdAt: "desc" } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Đơn hàng</h1>
        <p className="text-muted-foreground">Các lượt đặt dịch vụ của bạn trên VivuGo.</p>
      </div>

      {orderItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Khách</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item) => {
                const status = statusLabel[item.order.status] ?? { label: item.order.status, variant: "outline" as const };
                return (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {item.order.createdAt.toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>{item.order.travelerName ?? "Ẩn danh"}</TableCell>
                    <TableCell>{item.service.name}</TableCell>
                    <TableCell className="text-right font-medium">{formatVnd(item.lineTotalVnd)}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
