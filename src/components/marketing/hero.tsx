import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, MapPin, Ticket, Bot } from "lucide-react";

const stats = [
  { icon: MapPin, label: "Đà Nẵng · Hội An" },
  { icon: Bot, label: "AI lập lịch trình thật" },
  { icon: Ticket, label: "1 mã QR cho cả chuyến đi" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      />
      <div
        aria-hidden
        className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-white/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-16 -z-10 size-80 rounded-full bg-brand-teal/30 blur-3xl"
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-20 pb-24 text-center sm:pt-28 sm:pb-32">
        <Badge className="gap-1.5 rounded-full border-white/30 bg-white/15 px-3 py-1 text-white backdrop-blur">
          <Sparkles className="size-3.5" />
          Lập lịch trình bằng AI trong 30 giây
        </Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Chuyến đi trong mơ của bạn,
          <br className="hidden sm:block" /> do AI thiết kế riêng
        </h1>
        <p className="max-w-xl text-balance text-lg text-white/85">
          Nhập ngân sách, số ngày và sở thích — VivuGo tự động dựng lịch trình theo từng
          khung giờ, gộp combo ưu đãi và gói gọn mọi vé, phòng vào một mã QR duy nhất.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="bg-white text-[oklch(0.5_0.16_35)] shadow-lg shadow-black/10 hover:bg-white/90"
          >
            <Link href="/plan">
              Lập lịch trình miễn phí
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          >
            <Link href="#how-it-works">Xem cách hoạt động</Link>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-sm text-white/80">
              <s.icon className="size-4" />
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 1440 60"
        className="absolute inset-x-0 bottom-0 -z-10 h-10 w-full text-background sm:h-14"
        preserveAspectRatio="none"
      >
        <path fill="currentColor" d="M0,32 C360,64 1080,0 1440,32 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}
