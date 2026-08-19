import {
  MapPin,
  Wallet,
  TrendingUp,
  Handshake,
  Banknote,
  Users,
  Radar,
  type LucideIcon,
} from "lucide-react";

export type ComingSoonFeature = {
  slug: string;
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  backHref: string;
  backLabel: string;
};

export const comingSoonFeatures: Record<string, ComingSoonFeature> = {
  "location-offers": {
    slug: "location-offers",
    title: "Ưu đãi theo vị trí",
    category: "Trải nghiệm du khách",
    description:
      "Đẩy thông báo ưu đãi realtime khi du khách đi ngang hoặc đến gần một nhà hàng, điểm vui chơi đối tác — biến mỗi bước chân thành cơ hội bán hàng cho merchant.",
    icon: MapPin,
    backHref: "/plan",
    backLabel: "Quay lại lập lịch trình",
  },
  "apple-wallet": {
    slug: "apple-wallet",
    title: "Thêm vé vào Apple Wallet",
    category: "Trải nghiệm du khách",
    description:
      "Đồng bộ vé điện tử VivuGo thẳng vào Apple Wallet — không cần mở app, chỉ cần đưa điện thoại lên máy quét.",
    icon: Wallet,
    backHref: "/plan",
    backLabel: "Quay lại lập lịch trình",
  },
  "google-wallet": {
    slug: "google-wallet",
    title: "Thêm vé vào Google Wallet",
    category: "Trải nghiệm du khách",
    description:
      "Đồng bộ vé điện tử VivuGo thẳng vào Google Wallet — không cần mở app, chỉ cần đưa điện thoại lên máy quét.",
    icon: Wallet,
    backHref: "/plan",
    backLabel: "Quay lại lập lịch trình",
  },
  "yield-pricing": {
    slug: "yield-pricing",
    title: "Định giá linh hoạt (Yield Pricing)",
    category: "Công cụ cho doanh nghiệp",
    description:
      "Gợi ý và tự động điều chỉnh giá phòng, giá vé theo thuật toán cung - cầu: giảm giá giờ thấp điểm, tăng giá cuối tuần/lễ — tối ưu doanh thu cho từng merchant.",
    icon: TrendingUp,
    backHref: "/merchant/dashboard",
    backLabel: "Quay lại Doanh thu",
  },
  "cross-sell": {
    slug: "cross-sell",
    title: "Bán chéo & Liên kết đối tác",
    category: "Công cụ cho doanh nghiệp",
    description:
      "Khách sạn tự kết nối với quán ăn, điểm vui chơi lân cận để bán voucher chéo cho nhau, chia hoa hồng tự động ngay trên sàn.",
    icon: Handshake,
    backHref: "/merchant/dashboard",
    backLabel: "Quay lại Doanh thu",
  },
  payout: {
    slug: "payout",
    title: "Rút tiền tự động",
    category: "Công cụ cho doanh nghiệp",
    description:
      "Đối soát doanh thu, phí hoa hồng minh bạch theo từng giao dịch, rút tiền về tài khoản ngân hàng theo lịch linh hoạt — không cần chờ đối soát thủ công.",
    icon: Banknote,
    backHref: "/merchant/dashboard",
    backLabel: "Quay lại Doanh thu",
  },
  affiliate: {
    slug: "affiliate",
    title: "Affiliate & Referral",
    category: "Tăng trưởng",
    description:
      "Travel blogger, TikToker, hướng dẫn viên tạo link giới thiệu tour/vé/khách sạn để nhận hoa hồng — kênh kéo người dùng chi phí thấp cho VivuGo.",
    icon: Users,
    backHref: "/admin",
    backLabel: "Quay lại Admin",
  },
  remarketing: {
    slug: "remarketing",
    title: "Customer Data Platform & Remarketing",
    category: "Tăng trưởng",
    description:
      "Thu thập hành vi du khách để chạy chiến dịch remarketing tự động (email/push) nhắc lại đúng lúc mùa du lịch cao điểm sắp đến.",
    icon: Radar,
    backHref: "/admin",
    backLabel: "Quay lại Admin",
  },
};
