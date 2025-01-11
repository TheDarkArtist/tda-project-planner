import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useNewJoinCode();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one.",
  );

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      {
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated");
        },
        onError: () => {
          toast.error("Failed to regenerate invite code");
        },
      },
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite pepole to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite pepole to your workspace, code is not
              case sensitive
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              className=""
              variant="ghost"
              size="sm"
              onClick={handleCopy}
            >
              Copy link
              <Copy className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={handleNewCode}
            >
              New code
              <RefreshCcw className="size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
