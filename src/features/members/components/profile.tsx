import {
  AlertTriangleIcon,
  ChevronDown,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure? You want to change this member's role?",
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure? You want to remove this member?",
  );
  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure? You want to leave this workspace?",
  );

  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    id: memberId,
  });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase();

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      },
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast.success("You've left the workspace");
          router.replace("/");
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      },
    );
  };

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) return;

    updateMember(
      {
        id: memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Role changed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change role");
        },
      },
    );
  };

  if (isMemberLoading || isLoadingCurrentMember) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-12 p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button
            variant="ghost"
            onClick={onClose}
            size="iconSm"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col h-full gap-y-2 items-center justify-center">
          <AlertTriangleIcon className="size-8 text-rose-500" />
          <p className="text-sm text-rose-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UpdateDialog />
      <RemoveDialog />
      <LeaveDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-12 p-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button
            variant="ghost"
            onClick={onClose}
            size="iconSm"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4 gap-y-4">
          <Avatar className="max-w-40 rounded-md max-h-40 size-full shrink-0">
            <AvatarImage src={member.user.image} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <p className="text-xl font-bold text-center">{member.user.name}</p>
          {currentMember?.role === "admin" && currentMember._id !== memberId ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="capitalize w-full"
                    variant="outline"
                  >
                    {member.role} <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    defaultValue={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                className="w-full"
                variant="outline"
                onClick={onRemove}
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== "admin" ? (
            <Button
              className="w-full"
              variant="outline"
              onClick={onLeave}
            >
              Leave
            </Button>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-slate-200 flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-slate-600">Email Address</p>
              <Link
                className="text-sm hover:underline text-cyan-600"
                href={`mailto:${member.user.email}`}
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
