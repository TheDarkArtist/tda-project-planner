import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
      <Button
        className={cn(
          "size-9 p-2 group-hover:bg-gray-700",
          isActive && "bg-gray-700/80",
        )}
        variant="transparent"
      >
        <Icon className="size-5 text-white transition-all" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-white/80">
        {label}
      </span>
    </div>
  );
};
