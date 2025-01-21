import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday, isValid } from "date-fns";
import Hint from "./hint";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-messages";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-messages";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

const DATE_FORMATS = {
  TIME: "h:mm a",
  TIME_COMPACT: "h:mm",
  FULL_TIME: "h:mm:ss a",
  DATE: "MMM d, yyyy",
} as const;

const formatDate = (date: Date | number | undefined): string => {
  if (!date) return "";

  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return "Invalid date";

    if (isToday(dateObj)) {
      return `Today at ${format(dateObj, DATE_FORMATS.TIME)}`;
    }

    if (isYesterday(dateObj)) {
      return `Yesterday at ${format(dateObj, DATE_FORMATS.TIME)}`;
    }

    return `${format(dateObj, DATE_FORMATS.DATE)} at ${format(dateObj, DATE_FORMATS.TIME)}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt?: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onOpenProfile, onCloseMessage } =
    usePanel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This action can't be undone",
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isUpdatingMessage || isTogglingReaction;

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      },
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          if (parentMessageId === id) {
            onCloseMessage();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      },
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      },
    );
  };

  const avatarFallback = authorName.charAt(0).toUpperCase();
  const formattedTime = formatDate(createdAt);

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 py-1 px-5 hover:bg-slate-100 group relative",
            isEditing && "bg-lime-100/70 hover:bg-lime-100/70",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom ease-in-out duration-1000",
          )}
        >
          <div className="flex items-start gap-2">
            <Hint
              label={formattedTime}
              asChild
            >
              <button className="text-xs text-slate-600 border opacity-0 group-hover:opacity-100 ml-2 mt-1">
                {createdAt
                  ? format(new Date(createdAt), DATE_FORMATS.TIME_COMPACT)
                  : ""}
              </button>
            </Hint>
            {isEditing ? (
              <div className="size-full">
                <Editor
                  onSubmit={handleUpdate}
                  defaultValue={JSON.parse(body)}
                  disabled={isUpdatingMessage}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-slate-600">(edited)</span>
                ) : null}
                <Reactions
                  data={reactions}
                  onChange={handleReaction}
                />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-slate-100/60 group relative",
          isEditing && "bg-lime-100/70 hover:bg-lime-100/70",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom ease-in-out duration-1000",
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar className="rounded-md">
              <AvatarImage
                className="rounded-md"
                src={authorImage}
              />
              <AvatarFallback className="rounded-md bg-slate-600 text-slate-200 font-bold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="size-full">
              <Editor
                onSubmit={handleUpdate}
                defaultValue={JSON.parse(body)}
                disabled={isUpdatingMessage}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  className="font-bold hover:underline"
                  onClick={() => onOpenProfile(memberId)}
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint
                  label={formattedTime}
                  asChild
                >
                  <button className="text-xs text-slate-600 hover:underline">
                    {createdAt
                      ? format(new Date(createdAt), DATE_FORMATS.TIME)
                      : ""}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-slate-600 text-xs">(edited)</span>
              ) : null}
              <Reactions
                data={reactions}
                onChange={handleReaction}
              />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
