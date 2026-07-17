import Image from "next/image";

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({
  collapsed = false,
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo/nova-logo.png"
        alt="Nova"
        width={36}
        height={36}
        priority
        className="rounded-xl"
      />

      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight">
            Nova
          </span>

          <span className="text-xs text-zinc-500">
            AI Operating System
          </span>
        </div>
      )}
    </div>
  );
}