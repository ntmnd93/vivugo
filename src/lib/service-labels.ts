import { Bed, MapPinned, UtensilsCrossed, Bus } from "lucide-react";
import type { ServiceType } from "@prisma/client";

export const serviceTypeMeta: Record<ServiceType, { label: string; icon: typeof Bed; color: string }> = {
  HOTEL: { label: "Khách sạn", icon: Bed, color: "var(--chart-1)" },
  TOUR: { label: "Tour/Điểm tham quan", icon: MapPinned, color: "var(--chart-2)" },
  RESTAURANT: { label: "Nhà hàng", icon: UtensilsCrossed, color: "var(--chart-3)" },
  TRANSPORT: { label: "Di chuyển", icon: Bus, color: "var(--chart-4)" },
};

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}
