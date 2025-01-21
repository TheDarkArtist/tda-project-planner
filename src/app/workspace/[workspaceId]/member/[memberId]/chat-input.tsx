import { useCreateMessage } from "@/features/messages/api/use-create-messages";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  conversationId: Id<"conversations">;
  placeholder: string;
}

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

export const ChatInput = ({ conversationId, placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl(null, { throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      // Kinda dirty solution but
      // I could use it this way or otherwise i'd have to use and imageElementRef
      setEditorKey((prevKey) => prevKey + 1);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};
