import { getPlatformOverview } from "@/lib/admin/platform-overview";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ComingSoonGrid } from "@/components/coming-soon-grid";
import { formatVnd, serviceTypeMeta } from "@/lib/service-labels";
import { ShoppingBag, Landmark, Wallet, Truck, Store, Receipt } from "lucide-react";
import type { ServiceType } from "@prisma/client";

function StatCard({ icon: Icon, label, value }: { icon: typeof ShoppingBag; label: string; value: string }) {
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

export default async function AdminOverviewPage() {
  const overview = await getPlatformOverview();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tổng quan sàn</h1>
        <p className="text-muted-foreground">
          Nhìn toàn bộ giao dịch trên VivuGo — dữ liệu thật từ các đơn hàng đã thanh toán trong bản demo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={ShoppingBag} label="Tổng doanh số (GMV)" value={formatVnd(overview.totalGmvVnd)} />
        <StatCard icon={Landmark} label="Hoa hồng sàn thu được" value={formatVnd(overview.platformCommissionVnd)} />
        <StatCard icon={Wallet} label="Đã trả về cho merchant" value={formatVnd(overview.merchantPayoutVnd)} />
        <StatCard icon={Truck} label="Phí vận chuyển/logistics" value={formatVnd(overview.logisticsVnd)} />
        <StatCard icon={Receipt} label="Đơn hàng đã thanh toán" value={String(overview.paidOrderCount)} />
        <StatCard icon={Store} label="Merchant trên sàn" value={String(overview.merchantCount)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Merchant có doanh số cao nhất</CardTitle>
        </CardHeader>
        <CardContent>
          {overview.topMerchants.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có giao dịch nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Loại hình</TableHead>
                    <TableHead className="text-right">Số đơn</TableHead>
                    <TableHead className="text-right">GMV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overview.topMerchants.map((m) => (
                    <TableRow key={m.merchantId}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {serviceTypeMeta[m.type as ServiceType].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{m.orderCount}</TableCell>
                      <TableCell className="text-right font-medium">{formatVnd(m.gmvVnd)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ComingSoonGrid title="Công cụ tăng trưởng" slugs={["affiliate", "remarketing"]} />
    </div>
  );
}
