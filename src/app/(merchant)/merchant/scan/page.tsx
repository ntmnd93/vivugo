import { redirect } from "next/navigation";
import { getActiveMerchantId } from "@/lib/demo-auth/merchant-session";
import { QrScanner } from "@/components/merchant/qr-scanner";

export default async function MerchantScanPage() {
  const merchantId = await getActiveMerchantId();
  if (!merchantId) redirect("/merchant/login");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quét mã QR</h1>
        <p className="text-muted-foreground">Đưa camera vào mã QR trên vé điện tử của khách để check-in.</p>
      </div>
      <QrScanner />
    </div>
  );
}
