import { NextResponse } from "next/server";
import { getActiveMerchantId } from "@/lib/demo-auth/merchant-session";
import { getMerchantDashboardData } from "@/lib/merchant/dashboard-data";

export async function GET() {
  const merchantId = await getActiveMerchantId();
  if (!merchantId) {
    return NextResponse.json({ error: "Bạn cần đăng nhập merchant trước." }, { status: 401 });
  }

  const data = await getMerchantDashboardData(merchantId);
  return NextResponse.json(data);
}
