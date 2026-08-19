import Image from "next/image";
import { stockPhotos } from "@/lib/stock-photos";

const destinations = [
  {
    photo: stockPhotos.danangBeach,
    name: "Đà Nẵng",
    tagline: "Biển xanh, núi đá cẩm thạch và Bà Nà Hills",
    description: "Bãi biển Mỹ Khê, Ngũ Hành Sơn, Bà Nà Hills — nghỉ dưỡng và khám phá trong cùng một chuyến đi.",
  },
  {
    photo: stockPhotos.hoiAnLanterns,
    name: "Hội An",
    tagline: "Phố cổ lung linh ánh đèn lồng bên sông Hoài",
    description: "Di sản UNESCO với kiến trúc cổ, ẩm thực đặc sản và những đêm hoa đăng khó quên.",
  },
];

export function DestinationShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Điểm đến của chuyến đi</h2>
        <p className="mt-3 text-muted-foreground">
          VivuGo đang phục vụ khu vực Đà Nẵng - Hội An, ghép nối lịch trình liền mạch giữa hai thành phố.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {destinations.map((d) => (
          <div
            key={d.name}
            className="group relative h-72 overflow-hidden rounded-3xl shadow-sm transition-shadow hover:shadow-lg"
          >
            <Image
              src={d.photo.url}
              alt={d.photo.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-xl font-semibold">{d.name}</h3>
              <p className="mt-1 text-sm font-medium text-white/90">{d.tagline}</p>
              <p className="mt-1 text-sm text-white/75">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
