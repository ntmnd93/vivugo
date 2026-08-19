"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";

export function CreateOrderForm({ comboId, defaultName }: { comboId: string; defaultName?: string }) {
  const router = useRouter();
  const [travelerName, setTravelerName] = useState(defaultName ?? "");
  const [travelerContact, setTravelerContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comboId,
          travelerName: travelerName.trim() || undefined,
          travelerContact: travelerContact.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không thể tạo đơn hàng.");
      router.push(`/checkout/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="travelerName">Tên khách</Label>
        <Input
          id="travelerName"
          value={travelerName}
          onChange={(e) => setTravelerName(e.target.value)}
          placeholder="Ví dụ: Minh Anh"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="travelerContact">Số điện thoại hoặc email</Label>
        <Input
          id="travelerContact"
          value={travelerContact}
          onChange={(e) => setTravelerContact(e.target.value)}
          placeholder="0901 234 567"
        />
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
        Tiến hành thanh toán
      </Button>
    </form>
  );
}
