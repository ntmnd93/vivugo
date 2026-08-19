import { NextRequest, NextResponse } from "next/server";
import { generateItineraryInputSchema } from "@/lib/ai/itinerary-schema";
import { generateItinerary } from "@/lib/ai/generate-itinerary";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ." }, { status: 400 });
  }

  const parsed = generateItineraryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Thông tin nhập chưa hợp lệ.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const id = await generateItinerary(parsed.data);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("[itinerary/generate] failed:", err);
    const message = err instanceof Error ? err.message : "Không thể tạo lịch trình. Vui lòng thử lại.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
