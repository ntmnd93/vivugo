import Image from "next/image";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-icon.png"
      alt="VivuGo"
      width={805}
      height={453}
      priority
      className={className ?? "h-8 w-auto"}
    />
  );
}
