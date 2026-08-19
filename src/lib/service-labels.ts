import { Bed, MapPinned, UtensilsCrossed, Bus } from "lucide-react";
import type { ServiceType } from "@prisma/client";

export const serviceTypeMeta: Record<ServiceType, { label: string; icon: typeof Bed }> = {
  HOTEL: { label: "Khách sạn", icon: Bed },
  TOUR: { label: "Tour/Điểm tham quan", icon: MapPinned },
  RESTAURANT: { label: "Nhà hàng", icon: UtensilsCrossed },
  TRANSPORT: { label: "Di chuyển", icon: Bus },
};

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " ₫";
}
