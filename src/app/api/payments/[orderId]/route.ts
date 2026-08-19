import { NextRequest, NextResponse } from "next/server";
import { applyPayment } from "@/lib/ledger/apply-payment";

export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  try {
    const order = await applyPayment(orderId);
    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("[payments] failed:", err);
    const message = err instanceof Error ? err.message : "Thanh toán thất bại.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
