import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="VivuGo"
      width={824}
      height={720}
      priority
      className={className ?? "h-12 w-auto"}
    />
  );
}
