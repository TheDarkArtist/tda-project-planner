import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-slate-400 hover:bg-gray-700/80 text-slate-800 text-xl font-semibold">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin hover:shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64"
      >
        <DropdownMenuItem
          className="cursor-pointer flex-col gap-0 justify-start items-start capitalize"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          {workspace?.name}
          <span className="text-xs text-gray-600">Active workspace</span>
        </DropdownMenuItem>
        <Separator className="my-1" />
        {workspacesLoading && <Loader className="size-5 mx-auto my-2 animate-spin" />}
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            className="cursor-pointer capitalize"
            key={workspace._id}
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="cursor-pointer bg-slate-600 py-1.5 px-3 rounded-md text-slate-200 flex-col justify-start items-start capitalize">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <Separator className="my-1" />
        <DropdownMenuItem
          className="flex items-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2 p-1 rounded-md bg-slate-200">
            <Plus className="size-6 text-gray-600" />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
