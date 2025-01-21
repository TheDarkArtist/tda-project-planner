"use client";

import { useCreateOrGetConversations } from "@/features/conversations/api/use-create-or-get-conversations.ts";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { data, mutate, isPending } = useCreateOrGetConversations();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onError() {
          toast.error("Failed to get or create a conversations");
        },
      },
    );
  }, [memberId, mutate, workspaceId]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col gap-2 items-center justify-center">
        <AlertTriangle className="size-10 text-rose-600 animate-pulse" />
        <span className="text-sm text-rose-600">Conversations not found</span>
      </div>
    );
  }

  return <Conversation id={data} />;
};

export default MemberIdPage;
