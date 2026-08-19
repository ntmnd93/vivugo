import { DanangIllustration, HoiAnIllustration } from "./destination-illustrations";

const destinations = [
  {
    Illustration: DanangIllustration,
    name: "Đà Nẵng",
    tagline: "Biển xanh, núi đá cẩm thạch và cây cầu Rồng",
    description: "Bãi biển Mỹ Khê, Ngũ Hành Sơn, Bà Nà Hills — nghỉ dưỡng và khám phá trong cùng một chuyến đi.",
  },
  {
    Illustration: HoiAnIllustration,
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
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="overflow-hidden">
              <d.Illustration className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{d.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{d.tagline}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
