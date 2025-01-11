import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSectionProps {
  label: string;
  hint: string;
  children: ReactNode;
  onNew?: () => void;
}

export const WorkspaceSection = ({
  label,
  hint,
  children,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center justify-between px-3.5 group">
        <div className="flex items-center justify-start">
          <Button
            className="p-0.5 text-sm text-slate-200 shrink-0 size-6"
            variant="transparent"
            onClick={toggle}
          >
            <FaCaretDown
              className={cn("size-4 transition-transform", on && "-rotate-90")}
            />
          </Button>
          <Button
            className="group px-1.5 text-sm text-slate-200 h-[28px] flex items-center justify-center overflow-hidden"
            variant="transparent"
            size="sm"
          >
            <span className="truncate">{label}</span>
          </Button>
        </div>
        {onNew && (
          <Hint
            label={hint}
            side="top"
            align="center"
            asChild
          >
            <Button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-sm text-slate-200 size-6 shrink-0"
              variant="transparent"
              size="iconSm"
              onClick={onNew}
            >
              <Plus className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
