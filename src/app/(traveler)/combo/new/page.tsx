import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ComboBuilder, type ComboBuilderItem } from "@/components/traveler/combo-builder";

export default async function ComboNewPage({ searchParams }: PageProps<"/combo/new">) {
  const { itineraryId } = await searchParams;

  if (!itineraryId || Array.isArray(itineraryId)) notFound();

  const itinerary = await prisma.itinerary.findUnique({
    where: { id: itineraryId },
    include: {
      items: {
        include: { service: { include: { merchant: true } } },
        orderBy: [{ dayNumber: "asc" }, { order: "asc" }],
      },
    },
  });

  if (!itinerary) notFound();

  const items: ComboBuilderItem[] = itinerary.items.map((i) => ({
    id: i.id,
    dayNumber: i.dayNumber,
    startTime: i.startTime,
    serviceId: i.serviceId,
    serviceName: i.service.name,
    serviceType: i.service.type,
    merchantName: i.service.merchant.name,
    priceVnd: i.service.priceVnd,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chọn dịch vụ để gộp combo</h1>
        <p className="text-muted-foreground">
          Càng gộp nhiều dịch vụ, giá càng ưu đãi so với đặt lẻ từng phần.
        </p>
      </div>
      <ComboBuilder itineraryId={itinerary.id} items={items} />
    </div>
  );
}
