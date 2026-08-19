import { z } from "zod";

export const interestOptions = [
  { value: "food", label: "Ẩm thực" },
  { value: "adventure", label: "Mạo hiểm" },
  { value: "relaxation", label: "Nghỉ dưỡng" },
  { value: "culture", label: "Văn hóa" },
] as const;

export const companionOptions = [
  { value: "SOLO", label: "Độc hành" },
  { value: "COUPLE", label: "Cặp đôi" },
  { value: "FAMILY", label: "Gia đình" },
  { value: "FRIENDS", label: "Nhóm bạn" },
] as const;

export const generateItineraryInputSchema = z.object({
  budgetVnd: z.number().int().min(500_000).max(200_000_000),
  days: z.number().int().min(1).max(5),
  companionType: z.enum(["SOLO", "COUPLE", "FAMILY", "FRIENDS"]),
  interests: z.array(z.enum(["food", "adventure", "relaxation", "culture"])).min(1),
  travelerName: z.string().trim().max(80).optional(),
});

export type GenerateItineraryInput = z.infer<typeof generateItineraryInputSchema>;

export const itineraryItemOutputSchema = z.object({
  serviceId: z.string().describe("Phải trùng khớp chính xác với một id trong catalog được cung cấp."),
  startTime: z.string().describe('Giờ bắt đầu dạng "HH:MM", 24 giờ.'),
  order: z.number().int().min(0).describe("Thứ tự trong ngày, bắt đầu từ 0."),
  rationale: z.string().describe("Lý do ngắn gọn (1 câu) tại sao chọn dịch vụ này, viết bằng tiếng Việt."),
});

export const itineraryDayOutputSchema = z.object({
  dayNumber: z.number().int().min(1),
  items: z.array(itineraryItemOutputSchema).min(1).max(7),
});

export const itineraryOutputSchema = z.object({
  days: z.array(itineraryDayOutputSchema),
  totalEstimatedCostVnd: z.number().int().min(0),
  summary: z.string().describe("Tóm tắt 2-3 câu về phong cách chuyến đi, viết bằng tiếng Việt."),
});

export type ItineraryOutput = z.infer<typeof itineraryOutputSchema>;
