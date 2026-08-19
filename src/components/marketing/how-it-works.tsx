import { ListChecks, Wand2, PackagePlus, QrCode } from "lucide-react";

const steps = [
  {
    icon: ListChecks,
    title: "1. Cho AI biết bạn muốn gì",
    description: "Ngân sách, số ngày, đi cùng ai và sở thích — chỉ mất chưa đến 1 phút.",
  },
  {
    icon: Wand2,
    title: "2. AI dựng lịch trình",
    description: "Sắp xếp điểm đến theo từng ngày, tối ưu khoảng cách và ngân sách của bạn.",
  },
  {
    icon: PackagePlus,
    title: "3. Gộp combo tiết kiệm",
    description: "Chọn khách sạn, tour, nhà hàng ưng ý — hệ thống tự tính giá ưu đãi khi mua combo.",
  },
  {
    icon: QrCode,
    title: "4. Một mã QR cho cả chuyến đi",
    description: "Thanh toán một lần, nhận vé điện tử QR duy nhất cho mọi dịch vụ đã đặt.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Cách hoạt động</h2>
        <p className="mt-3 text-muted-foreground">
          Từ ý tưởng đến vé trong tay — chỉ 4 bước.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div key={step.title} className="flex flex-col items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <step.icon className="size-5" />
            </div>
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
