import { generateObject } from "ai";
import { prisma } from "@/lib/prisma";
import { itineraryModel } from "@/lib/ai/client";
import { buildServiceCatalog, type CatalogService } from "@/lib/ai/context-builder";
import {
  itineraryOutputSchema,
  type ItineraryOutput,
  type GenerateItineraryInput,
} from "@/lib/ai/itinerary-schema";

const companionLabel: Record<GenerateItineraryInput["companionType"], string> = {
  SOLO: "đi một mình",
  COUPLE: "đi cùng người yêu/vợ chồng",
  FAMILY: "đi cùng gia đình (có thể có trẻ nhỏ hoặc người lớn tuổi)",
  FRIENDS: "đi cùng nhóm bạn",
};

function buildSystemPrompt(catalog: CatalogService[]) {
  return `Bạn là trợ lý lập kế hoạch du lịch cho khu vực Đà Nẵng và Hội An, Việt Nam.

QUY TẮC BẮT BUỘC:
- Chỉ được chọn dịch vụ bằng đúng "id" có trong catalog bên dưới. Không được bịa ra id mới.
- Mỗi ngày nên có 2-4 điểm dừng (item), sắp xếp giờ hợp lý (ăn sáng/trưa/tối đúng khung giờ, tham quan ban ngày, hoạt động về đêm nếu phù hợp).
- Cân nhắc ngân sách tổng của khách, không vượt quá quá nhiều so với ngân sách đã cho.
- Ưu tiên dịch vụ có tags khớp với sở thích của khách.
- Với chuyến đi nhiều ngày, cân nhắc thêm dịch vụ vận chuyển (TRANSPORT) nếu hợp lý.
- Viết "rationale" và "summary" bằng tiếng Việt, ngắn gọn, tự nhiên.

CATALOG DỊCH VỤ (chỉ dùng các id này):
${JSON.stringify(catalog, null, 0)}`;
}

function buildUserPrompt(input: GenerateItineraryInput) {
  return `Lập lịch trình ${input.days} ngày tại Đà Nẵng - Hội An.
Ngân sách tổng: ${input.budgetVnd.toLocaleString("vi-VN")} VND.
Đối tượng: ${companionLabel[input.companionType]}.
Sở thích: ${input.interests.join(", ")}.`;
}

function collectServiceIds(output: ItineraryOutput): string[] {
  return output.days.flatMap((d) => d.items.map((i) => i.serviceId));
}

function cleanInvalidServiceIds(output: ItineraryOutput, validIds: Set<string>): ItineraryOutput {
  const days = output.days
    .map((day) => ({
      ...day,
      items: day.items.filter((item) => validIds.has(item.serviceId)),
    }))
    .filter((day) => day.items.length > 0);

  return { ...output, days };
}

async function callModel(input: GenerateItineraryInput, catalog: CatalogService[], extraNote?: string) {
  const { object } = await generateObject({
    model: itineraryModel,
    schema: itineraryOutputSchema,
    system: buildSystemPrompt(catalog) + (extraNote ? `\n\nLƯU Ý THÊM: ${extraNote}` : ""),
    prompt: buildUserPrompt(input),
  });
  return object;
}

export async function generateItinerary(input: GenerateItineraryInput): Promise<string> {
  const catalog = await buildServiceCatalog();
  if (catalog.length === 0) {
    throw new Error("Chưa có dữ liệu dịch vụ để lập lịch trình. Vui lòng chạy seed trước.");
  }
  const validIds = new Set(catalog.map((s) => s.id));

  let output = await callModel(input, catalog);
  let usedIds = collectServiceIds(output);
  const hasInvalid = usedIds.some((id) => !validIds.has(id));

  if (hasInvalid) {
    output = await callModel(
      input,
      catalog,
      "Lần trước bạn đã chọn một số id không tồn tại trong catalog. Hãy chỉ dùng chính xác các id được liệt kê."
    );
    usedIds = collectServiceIds(output);
  }

  const cleaned = cleanInvalidServiceIds(output, validIds);
  if (cleaned.days.length === 0) {
    throw new Error("AI không thể tạo lịch trình hợp lệ từ dữ liệu hiện có. Vui lòng thử lại.");
  }

  const destination = await prisma.destination.findFirst({ orderBy: { createdAt: "asc" } });
  if (!destination) {
    throw new Error("Chưa có destination nào trong hệ thống.");
  }

  const itinerary = await prisma.$transaction(async (tx) => {
    const created = await tx.itinerary.create({
      data: {
        travelerName: input.travelerName,
        budgetVnd: input.budgetVnd,
        days: input.days,
        companionType: input.companionType,
        interests: input.interests.join(","),
        destinationId: destination.id,
        status: "generated",
        summary: cleaned.summary,
        totalEstimatedCostVnd: cleaned.totalEstimatedCostVnd,
      },
    });

    await tx.itineraryItem.createMany({
      data: cleaned.days.flatMap((day) =>
        day.items.map((item) => ({
          itineraryId: created.id,
          serviceId: item.serviceId,
          dayNumber: day.dayNumber,
          startTime: item.startTime,
          order: item.order,
          notes: item.rationale,
        }))
      ),
    });

    return created;
  });

  return itinerary.id;
}
