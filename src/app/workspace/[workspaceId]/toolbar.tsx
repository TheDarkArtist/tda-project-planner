import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <nav className="bg-slate-800 border-b border-gray-700 flex items-center justify-between h-10 p-1.5">
      <div className="flex-1" />
      <div className="min-w-72 max-w-screen-sm grow-[2] shrink">
        <Button
          className="bg-slate-700 hover:bg-slate-600 w-full justify-start h-7 px-2"
          size="sm"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button
          className=""
          variant="transparent"
          size="iconSm"
        >
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
