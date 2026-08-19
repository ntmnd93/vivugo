import { prisma } from "@/lib/prisma";

export type CatalogService = {
  id: string;
  type: string;
  name: string;
  priceVnd: number;
  durationMinutes: number | null;
  tags: string;
  area: string | null;
};

/**
 * MVP has a single seeded region split across two Destination rows (Đà Nẵng, Hội An).
 * The itinerary form doesn't expose a destination picker yet, so we pull the whole
 * active catalog rather than filtering by a single destinationId.
 */
export async function buildServiceCatalog(): Promise<CatalogService[]> {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { type: "asc" },
  });

  return services.map((s) => ({
    id: s.id,
    type: s.type,
    name: s.name,
    priceVnd: s.priceVnd,
    durationMinutes: s.durationMinutes,
    tags: s.tags,
    area: s.addressOrArea,
  }));
}
