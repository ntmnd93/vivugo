import { createHmac, randomUUID } from "crypto";
import { PrismaClient, ServiceType, LedgerPartyType, type Service } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Mirrors src/lib/pricing/combo-pricing.ts — kept inline since this script runs
// standalone via `prisma db seed`, outside the Next.js path-alias resolution.
function discountPctForItemCount(itemCount: number): number {
  if (itemCount >= 4) return 0.15;
  if (itemCount === 3) return 0.12;
  if (itemCount === 2) return 0.07;
  return 0;
}

function signTicket(ticketId: string): string {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) throw new Error("TICKET_SIGNING_SECRET chưa được cấu hình.");
  return createHmac("sha256", secret).update(ticketId).digest("hex").slice(0, 32);
}

/** Seeds a fully paid order (combo + order + ledger split + issued ticket) so every merchant's demo login shows real history without needing a live run first. */
async function seedPaidOrder(
  travelerName: string,
  services: Service[],
  splitPct: { merchantPct: number; logisticsPct: number; platformPct: number }
) {
  const subtotalVnd = services.reduce((sum, s) => sum + s.priceVnd, 0);
  const discountPct = discountPctForItemCount(services.length);
  const discountVnd = Math.round(subtotalVnd * discountPct);
  const totalVnd = subtotalVnd - discountVnd;

  const combo = await prisma.combo.create({
    data: {
      title: `Combo ${services.length} dịch vụ`,
      subtotalVnd,
      discountVnd,
      totalVnd,
      items: { create: services.map((s) => ({ serviceId: s.id, unitPriceVnd: s.priceVnd, quantity: 1 })) },
    },
  });

  const lineTotals = services.map((s) => Math.round((s.priceVnd / subtotalVnd) * totalVnd));
  const roundingRemainder = totalVnd - lineTotals.reduce((sum, a) => sum + a, 0);
  if (lineTotals.length > 0) lineTotals[lineTotals.length - 1] += roundingRemainder;

  const order = await prisma.order.create({
    data: {
      comboId: combo.id,
      status: "PAID",
      totalVnd,
      travelerName,
      paidAt: new Date(),
      items: {
        create: services.map((s, i) => ({
          serviceId: s.id,
          merchantId: s.merchantId,
          unitPriceVnd: s.priceVnd,
          quantity: 1,
          lineTotalVnd: lineTotals[i],
        })),
      },
    },
    include: { items: true },
  });

  for (const item of order.items) {
    const merchantAmt = Math.round((item.lineTotalVnd * splitPct.merchantPct) / 100);
    const logisticsAmt = Math.round((item.lineTotalVnd * splitPct.logisticsPct) / 100);
    const platformAmt = item.lineTotalVnd - merchantAmt - logisticsAmt;

    await prisma.ledgerEntry.createMany({
      data: [
        {
          orderId: order.id,
          orderItemId: item.id,
          partyType: LedgerPartyType.MERCHANT,
          merchantId: item.merchantId,
          amountVnd: merchantAmt,
          percentApplied: splitPct.merchantPct,
        },
        {
          orderId: order.id,
          orderItemId: item.id,
          partyType: LedgerPartyType.LOGISTICS,
          amountVnd: logisticsAmt,
          percentApplied: splitPct.logisticsPct,
        },
        {
          orderId: order.id,
          orderItemId: item.id,
          partyType: LedgerPartyType.PLATFORM,
          amountVnd: platformAmt,
          percentApplied: splitPct.platformPct,
        },
      ],
    });
  }

  const ticketId = randomUUID();
  await prisma.ticket.create({
    data: { id: ticketId, orderId: order.id, qrPayload: `t1.${ticketId}.${signTicket(ticketId)}` },
  });

  return order;
}

async function main() {
  console.log("Seeding Đà Nẵng - Hội An placeholder dataset...");

  await prisma.ticketRedemption.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.comboItem.deleteMany();
  await prisma.combo.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.service.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.splitConfig.deleteMany();

  const danang = await prisma.destination.create({
    data: {
      name: "Đà Nẵng",
      region: "Miền Trung",
      description: "Thành phố biển năng động với núi Ngũ Hành Sơn, Bà Nà Hills và bãi biển Mỹ Khê.",
    },
  });

  const hoiAn = await prisma.destination.create({
    data: {
      name: "Hội An",
      region: "Miền Trung",
      description: "Phố cổ di sản UNESCO với đèn lồng, sông Hoài và ẩm thực đặc sản.",
    },
  });

  const danangBeachResort = await prisma.merchant.create({
    data: { name: "Danang Beach Resort", type: ServiceType.HOTEL, destinationId: danang.id, slug: "danang-beach-resort", contactName: "Nguyễn Thị Hoa" },
  });
  const hoiAnAncientHouseHotel = await prisma.merchant.create({
    data: { name: "Hoi An Ancient House Hotel", type: ServiceType.HOTEL, destinationId: hoiAn.id, slug: "hoi-an-ancient-house-hotel", contactName: "Trần Văn Long" },
  });
  const marbleMountainsTourCo = await prisma.merchant.create({
    data: { name: "Marble Mountains Tour Co.", type: ServiceType.TOUR, destinationId: danang.id, slug: "marble-mountains-tour", contactName: "Lê Minh Tuấn" },
  });
  const hoiAnLanternNightTour = await prisma.merchant.create({
    data: { name: "Hoi An Lantern Night Tour", type: ServiceType.TOUR, destinationId: hoiAn.id, slug: "hoi-an-lantern-tour", contactName: "Phạm Thị Mai" },
  });
  const madameLanRestaurant = await prisma.merchant.create({
    data: { name: "Madame Lan Restaurant", type: ServiceType.RESTAURANT, destinationId: danang.id, slug: "madame-lan-restaurant", contactName: "Đặng Thị Lan" },
  });
  const morningGloryRestaurant = await prisma.merchant.create({
    data: { name: "Morning Glory Restaurant", type: ServiceType.RESTAURANT, destinationId: hoiAn.id, slug: "morning-glory-restaurant", contactName: "Trịnh Diệu Thảo" },
  });
  const danangHoiAnShuttle = await prisma.merchant.create({
    data: { name: "Danang-Hoi An Shuttle", type: ServiceType.TRANSPORT, destinationId: danang.id, slug: "danang-hoian-shuttle", contactName: "Võ Anh Dũng" },
  });

  await prisma.service.createMany({
    data: [
      // Hotels
      { merchantId: danangBeachResort.id, destinationId: danang.id, type: ServiceType.HOTEL, name: "Phòng Deluxe Hướng Biển", description: "Phòng cao cấp view biển Mỹ Khê, hồ bơi vô cực.", priceVnd: 2_200_000, imageUrl: null, tags: "relaxation", addressOrArea: "Bãi biển Mỹ Khê, Đà Nẵng" },
      { merchantId: danangBeachResort.id, destinationId: danang.id, type: ServiceType.HOTEL, name: "Phòng Superior Tiết Kiệm", description: "Phòng tiêu chuẩn, phù hợp ngân sách vừa phải.", priceVnd: 950_000, imageUrl: null, tags: "relaxation", addressOrArea: "Bãi biển Mỹ Khê, Đà Nẵng" },
      { merchantId: hoiAnAncientHouseHotel.id, destinationId: hoiAn.id, type: ServiceType.HOTEL, name: "Phòng Vintage Phố Cổ", description: "Kiến trúc nhà cổ truyền thống, đi bộ ra phố đèn lồng 5 phút.", priceVnd: 1_350_000, imageUrl: null, tags: "culture,relaxation", addressOrArea: "Phố cổ Hội An" },

      // Tours
      { merchantId: marbleMountainsTourCo.id, destinationId: danang.id, type: ServiceType.TOUR, name: "Tour Ngũ Hành Sơn nửa ngày", description: "Khám phá hang động, chùa cổ trên núi đá cẩm thạch.", priceVnd: 350_000, durationMinutes: 240, imageUrl: null, tags: "culture,adventure", addressOrArea: "Ngũ Hành Sơn, Đà Nẵng" },
      { merchantId: marbleMountainsTourCo.id, destinationId: danang.id, type: ServiceType.TOUR, name: "Tour Bà Nà Hills trọn gói", description: "Cáp treo, Cầu Vàng, làng Pháp và công viên giải trí.", priceVnd: 850_000, durationMinutes: 480, imageUrl: null, tags: "adventure,relaxation", addressOrArea: "Bà Nà Hills, Đà Nẵng" },
      { merchantId: marbleMountainsTourCo.id, destinationId: danang.id, type: ServiceType.TOUR, name: "Vé tham quan Bảo tàng Chăm", description: "Bộ sưu tập điêu khắc Chăm lớn nhất Việt Nam.", priceVnd: 60_000, durationMinutes: 90, imageUrl: null, tags: "culture", addressOrArea: "Trung tâm Đà Nẵng" },
      { merchantId: hoiAnLanternNightTour.id, destinationId: hoiAn.id, type: ServiceType.TOUR, name: "Tour thả đèn hoa đăng sông Hoài", description: "Thuyền hoa đăng buổi tối trên sông Hoài, ngắm phố lồng đèn.", priceVnd: 250_000, durationMinutes: 120, imageUrl: null, tags: "culture,relaxation", addressOrArea: "Sông Hoài, Hội An" },
      { merchantId: hoiAnLanternNightTour.id, destinationId: hoiAn.id, type: ServiceType.TOUR, name: "Tour phố cổ Hội An đi bộ", description: "Hướng dẫn viên dẫn tham quan Chùa Cầu, nhà cổ, hội quán.", priceVnd: 200_000, durationMinutes: 150, imageUrl: null, tags: "culture", addressOrArea: "Phố cổ Hội An" },

      // Restaurants
      { merchantId: madameLanRestaurant.id, destinationId: danang.id, type: ServiceType.RESTAURANT, name: "Set ăn hải sản Đà Nẵng", description: "Hải sản tươi sống, đặc sản miền biển.", priceVnd: 450_000, imageUrl: null, tags: "food", addressOrArea: "Trung tâm Đà Nẵng" },
      { merchantId: madameLanRestaurant.id, destinationId: danang.id, type: ServiceType.RESTAURANT, name: "Set ăn gia đình", description: "Thực đơn đa dạng phù hợp cả gia đình có trẻ nhỏ.", priceVnd: 300_000, imageUrl: null, tags: "food", addressOrArea: "Trung tâm Đà Nẵng" },
      { merchantId: morningGloryRestaurant.id, destinationId: hoiAn.id, type: ServiceType.RESTAURANT, name: "Set đặc sản Cao Lầu & Mì Quảng", description: "Món ăn truyền thống Hội An trong không gian nhà cổ.", priceVnd: 220_000, imageUrl: null, tags: "food,culture", addressOrArea: "Phố cổ Hội An" },
      { merchantId: morningGloryRestaurant.id, destinationId: hoiAn.id, type: ServiceType.RESTAURANT, name: "Set ăn fine-dining Hội An", description: "Trải nghiệm ẩm thực cao cấp, không gian lãng mạn.", priceVnd: 500_000, imageUrl: null, tags: "food,relaxation", addressOrArea: "Phố cổ Hội An" },

      // Transport
      { merchantId: danangHoiAnShuttle.id, destinationId: danang.id, type: ServiceType.TRANSPORT, name: "Xe đưa đón riêng Đà Nẵng - Hội An", description: "Xe riêng có tài xế, đón tận nơi.", priceVnd: 350_000, imageUrl: null, tags: "relaxation", addressOrArea: "Đà Nẵng - Hội An" },
      { merchantId: danangHoiAnShuttle.id, destinationId: danang.id, type: ServiceType.TRANSPORT, name: "Thuê xe máy tự lái", description: "Xe máy tự lái theo ngày, phù hợp khách thích tự do khám phá.", priceVnd: 150_000, imageUrl: null, tags: "adventure", addressOrArea: "Đà Nẵng" },
    ],
  });

  const splitConfig = await prisma.splitConfig.create({
    data: {
      name: "default",
      merchantPct: Number(process.env.SPLIT_MERCHANT_PCT ?? 85),
      logisticsPct: Number(process.env.SPLIT_LOGISTICS_PCT ?? 10),
      platformPct: Number(process.env.SPLIT_PLATFORM_PCT ?? 5),
      isActive: true,
    },
  });

  // Pre-seed a couple of already-paid orders spanning most merchants, so every
  // demo login shows real revenue/commission history without a live run first.
  const allServices = await prisma.service.findMany();
  const byName = (name: string) => {
    const service = allServices.find((s) => s.name === name);
    if (!service) throw new Error(`Seed service not found: ${name}`);
    return service;
  };
  const splitPct = {
    merchantPct: splitConfig.merchantPct,
    logisticsPct: splitConfig.logisticsPct,
    platformPct: splitConfig.platformPct,
  };

  await seedPaidOrder(
    "Gia đình chị Hương",
    [
      byName("Phòng Deluxe Hướng Biển"),
      byName("Tour Bà Nà Hills trọn gói"),
      byName("Xe đưa đón riêng Đà Nẵng - Hội An"),
      byName("Phòng Vintage Phố Cổ"),
      byName("Tour thả đèn hoa đăng sông Hoài"),
    ],
    splitPct
  );

  await seedPaidOrder("Anh Khoa & bạn gái", [byName("Set ăn hải sản Đà Nẵng"), byName("Vé tham quan Bảo tàng Chăm")], splitPct);

  const serviceCount = await prisma.service.count();
  console.log(`Seed complete: 2 destinations, 7 merchants, ${serviceCount} services, 1 split config, 2 sample paid orders.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
