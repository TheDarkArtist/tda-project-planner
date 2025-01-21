import React from "react";
import { Button } from "./ui/button";
import {
  MessageSquareTextIcon,
  PencilIcon,
  SmileIcon,
  TrashIcon,
} from "lucide-react";
import Hint from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className=" group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button
            className=""
            variant="ghost"
            size="iconSm"
            disabled={isPending}
          >
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint
            label="Reply in a thread"
            asChild
          >
            <Button
              className=""
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint
              label="Edit message"
              asChild
            >
              <Button
                className=""
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <PencilIcon className="size-4" />
              </Button>
            </Hint>
            <Hint
              label="Delete message"
              asChild
            >
              <Button
                className=""
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleDelete}
              >
                <TrashIcon className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};
