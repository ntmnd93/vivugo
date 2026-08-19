"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/service-labels";
import { Wallet, Landmark, Truck, ShoppingBag } from "lucide-react";
import type { MerchantDashboardData } from "@/lib/merchant/dashboard-data";

const POLL_INTERVAL_MS = 8000;

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommissionDashboard({ initialData }: { initialData: MerchantDashboardData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/merchant/dashboard");
        if (res.ok) setData(await res.json());
      } catch {
        // Silent — next poll will retry. This is a demo dashboard, not a critical alert path.
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Tổng doanh số (GMV)" value={formatVnd(data.totalSalesVnd)} />
        <StatCard icon={Wallet} label="Bạn nhận được" value={formatVnd(data.merchantShareVnd)} />
        <StatCard icon={Landmark} label="Hoa hồng sàn giữ lại" value={formatVnd(data.platformShareVnd)} />
        <StatCard icon={Truck} label="Phí vận chuyển/logistics" value={formatVnd(data.logisticsShareVnd)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chia hoa hồng theo từng đơn</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có đơn hàng đã thanh toán nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Khách</TableHead>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead className="text-right">Tổng</TableHead>
                    <TableHead className="text-right">Bạn nhận ({data.splitPct.merchantPct}%)</TableHead>
                    <TableHead className="text-right">Sàn giữ ({data.splitPct.platformPct}%)</TableHead>
                    <TableHead className="text-right">Logistics ({data.splitPct.logisticsPct}%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {order.paidAt ? new Date(order.paidAt).toLocaleDateString("vi-VN") : "—"}
                      </TableCell>
                      <TableCell>{order.travelerName ?? "Ẩn danh"}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-sm" title={order.items.join(", ")}>
                        {order.items.join(", ")}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatVnd(order.totalVnd)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{formatVnd(order.merchantShareVnd)}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatVnd(order.platformShareVnd)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatVnd(order.logisticsShareVnd)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
