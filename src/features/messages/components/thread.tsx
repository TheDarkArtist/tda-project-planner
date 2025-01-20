import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangleIcon, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import { Message } from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    id: messageId,
  });

  if (isMessageLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-12 px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button
            variant="ghost"
            onClick={onClose}
            size="iconSm"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col h-full items-center justify-center">
          <AlertTriangleIcon className="size-8 text-rose-500" />
          <p className="text-sm text-rose-600">Message not found</p>
        </div>
        ;
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-12 pl-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button
          variant="ghost"
          onClick={onClose}
          size="iconSm"
        >
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <Message
        id={message._id}
        memberId={message.memberId}
        authorImage={message.user.image}
        authorName={message.user.name}
        isAuthor={message.memberId === currentMember?._id}
        body={message.body}
        createdAt={message._creationTime}
        updatedAt={message.updatedAt}
        reactions={message.reactions}
        isEditing={editingId === message._id}
        setEditingId={setEditingId}
        hideThreadButton
      />
    </div>
  );
};
