import { cn } from "@/lib/utils";

interface AKBLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  compact?: boolean;
}

export function AKBLogo({
  className,
  markClassName,
  textClassName,
  compact = false,
}: AKBLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#cfe0f1] bg-white shadow-sm",
          markClassName,
        )}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true" className="h-7 w-7">
          <path
            d="M7 25.5 18.2 8.5h5.2l9.6 17h-5.7l-1.8-3.5H15.8l-2.1 3.5H7Z"
            fill="#0B4EDB"
          />
          <path d="M17.8 18.2h5.8L21 13.3l-3.2 4.9Z" fill="#37C5F3" />
          <path d="M10 29h20.8v3.2H10V29Z" fill="#0B84E5" />
        </svg>
      </div>
      {!compact && (
        <div className={cn("leading-none", textClassName)}>
          <p className="text-[20px] font-black tracking-normal text-[#0b2b53]">AKB</p>
          <p className="-mt-0.5 text-[10px] font-bold uppercase tracking-normal text-[#0b84e5]">
            Cargo
          </p>
        </div>
      )}
    </div>
  );
}
