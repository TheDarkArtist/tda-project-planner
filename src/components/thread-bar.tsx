import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

export const ThreadBar = ({
  count,
  image,
  name = "Member",
  timestamp,
  onClick,
}: ThreadBarProps) => {
  if (!count || !timestamp) return null;

  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <button
      className="p-0.5 rounded-md hover:bg-white border border-transparent hover:border-slate-300 flex items-center justify-start group/thread-bar transition max-w-[600px]"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="rounded-md size-6 shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-slate-600 truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-slate-600 text-xs truncate hover:underline group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-slate-600 ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};
