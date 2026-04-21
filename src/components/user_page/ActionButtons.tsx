import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionItemData {
  id: string;
  icon: React.ReactNode;
  bgIcon?: React.ReactNode;
  label: string;
  desc: string;
  badge: string;
  actionLabel: string;
  theme: "blue" | "cyan" | "green" | "red" | "slate" | "amber" | "emerald" | "sky" | "rose" | "violet";
  priority?: "primary" | "secondary";
}

const THEME_CLASSES: Record<ActionItemData["theme"], {
  card: string;
  icon: string;
  badge: string;
}> = {
  blue: {
    card: "border-[#c7dcf3] bg-white hover:border-[#0b84e5] hover:bg-[#fbfdff]",
    icon: "bg-[#eef6ff] text-[#0b4edb]",
    badge: "bg-[#eef6ff] text-[#0b4edb] border-[#c7dcf3]",
  },
  cyan: {
    card: "border-[#c9edf8] bg-white hover:border-[#37c5f3] hover:bg-[#fbfdff]",
    icon: "bg-[#eafaff] text-[#0784a6]",
    badge: "bg-[#eafaff] text-[#0784a6] border-[#bdebf7]",
  },
  green: {
    card: "border-[#cfe0f1] bg-white hover:border-[#0b84e5] hover:bg-[#fbfdff]",
    icon: "bg-[#eef7ff] text-[#0b4edb]",
    badge: "bg-[#eef7ff] text-[#0b4edb] border-[#cfe0f1]",
  },
  red: {
    card: "border-[#f1d2d2] bg-white hover:border-[#d95c5c]",
    icon: "bg-[#fff1f1] text-[#c44747]",
    badge: "bg-[#fff1f1] text-[#c44747] border-[#f0cccc]",
  },
  slate: {
    card: "border-[#dbe8f4] bg-white hover:border-[#0b84e5] hover:bg-[#fbfdff]",
    icon: "bg-[#f2f7fc] text-[#0b2b53]",
    badge: "bg-[#f2f7fc] text-[#0b2b53] border-[#dbe8f4]",
  },
  amber: {
    card: "border-[#dbe8f4] bg-white hover:border-[#0b84e5]",
    icon: "bg-[#eef6ff] text-[#0b4edb]",
    badge: "bg-[#eef6ff] text-[#0b4edb] border-[#c7dcf3]",
  },
  emerald: {
    card: "border-[#cfeadf] bg-white hover:border-[#22a06b]",
    icon: "bg-[#effbf5] text-[#15835b]",
    badge: "bg-[#effbf5] text-[#15835b] border-[#ccebdc]",
  },
  sky: {
    card: "border-[#c9edf8] bg-white hover:border-[#37c5f3]",
    icon: "bg-[#eafaff] text-[#0784a6]",
    badge: "bg-[#eafaff] text-[#0784a6] border-[#bdebf7]",
  },
  rose: {
    card: "border-[#f1d2d2] bg-white hover:border-[#d95c5c]",
    icon: "bg-[#fff1f1] text-[#c44747]",
    badge: "bg-[#fff1f1] text-[#c44747] border-[#f0cccc]",
  },
  violet: {
    card: "border-[#dbe8f4] bg-white hover:border-[#0b84e5]",
    icon: "bg-[#eef6ff] text-[#0b4edb]",
    badge: "bg-[#eef6ff] text-[#0b4edb] border-[#c7dcf3]",
  },
};

const ACTION_LAYOUTS: Record<string, string> = {
  request: "min-h-[118px]",
  report: "min-h-[118px]",
  payment: "min-h-[118px]",
  china: "min-h-[118px]",
};

export const ActionButton = memo(({
  item,
  onClick,
}: {
  item: ActionItemData;
  onClick?: () => void;
}) => {
  const theme = THEME_CLASSES[item.theme];
  const isPrimary = item.priority !== "secondary";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full min-w-0 flex-col justify-between overflow-hidden rounded-lg border p-3 text-left",
        "shadow-[0_8px_18px_rgba(15,47,87,0.035)] transition-all duration-200 active:scale-[0.98]",
        theme.card,
        isPrimary ? ACTION_LAYOUTS[item.id] ?? "min-h-[118px]" : "min-h-[70px] flex-row items-center gap-3",
      )}
    >
      {item.bgIcon && (
        <div className="pointer-events-none absolute -bottom-5 -right-4 text-[#0b84e5]/[0.025] transition-transform duration-300 group-hover:scale-105 dark:text-[#9ab0c5]/[0.08]">
          {item.bgIcon}
        </div>
      )}

      <div className={cn("relative z-10 flex min-w-0", isPrimary ? "items-start justify-between" : "items-center")}>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e5edf6]/80 dark:border-[#25374b]", theme.icon)}>
          {item.icon}
        </span>
        {isPrimary && (
          <span className={cn("rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase leading-4", theme.badge)}>
            {item.badge}
          </span>
        )}
      </div>

      <div className={cn("relative z-10 min-w-0", isPrimary ? "mt-4" : "flex flex-1 items-center justify-between gap-3")}>
        <div className="min-w-0">
          <h3 className={cn("font-semibold leading-snug text-[#07182f]", isPrimary ? "text-sm" : "text-sm truncate")}>
            {item.label}
          </h3>
          <p className={cn("mt-1 text-xs font-medium leading-snug text-[#63758a]", isPrimary ? "line-clamp-2" : "line-clamp-1")}>
            {item.desc}
          </p>
        </div>

        <span
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#334a62] transition-colors group-hover:text-[#0b4edb] dark:text-[#9ab0c5] dark:group-hover:text-[#e6edf7]",
            !isPrimary && "mt-0 shrink-0",
          )}
        >
          {isPrimary && item.actionLabel}
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
});

ActionButton.displayName = "ActionButton";
export type { ActionItemData };
