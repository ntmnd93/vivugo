"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

export function PayButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  async function handlePay() {
    setIsPaying(true);
    try {
      const res = await fetch(`/api/payments/${orderId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Thanh toán thất bại.");
      router.push(`/ticket/${orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setIsPaying(false);
    }
  }

  return (
    <Button size="lg" className="w-full" onClick={handlePay} disabled={isPaying}>
      {isPaying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
      Thanh toán ngay (Demo)
    </Button>
  );
}
