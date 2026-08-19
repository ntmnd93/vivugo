import { redirect } from "next/navigation";
import { getActiveMerchantId } from "@/lib/demo-auth/merchant-session";
import { getMerchantDashboardData } from "@/lib/merchant/dashboard-data";
import { CommissionDashboard } from "@/components/merchant/commission-dashboard";
import { ComingSoonGrid } from "@/components/coming-soon-grid";

export default async function MerchantDashboardPage() {
  const merchantId = await getActiveMerchantId();
  if (!merchantId) redirect("/merchant/login");

  const data = await getMerchantDashboardData(merchantId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Doanh thu &amp; hoa hồng</h1>
        <p className="text-muted-foreground">
          Minh bạch từng đồng — hệ thống tự động chia hoa hồng ngay khi khách thanh toán.
        </p>
      </div>
      <CommissionDashboard initialData={data} />
      <ComingSoonGrid
        title="Công cụ khác cho doanh nghiệp"
        slugs={["yield-pricing", "cross-sell", "payout"]}
      />
    </div>
  );
}
