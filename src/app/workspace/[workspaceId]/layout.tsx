"use client";

import { ReactNode } from "react";
import { Toolbar } from "./toolbar";
import Sidebar from "./sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { Profile } from "@/features/members/components/profile";

interface WorkspaceIdLayoutProps {
  children: ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, profileMemberId, onCloseMessage } = usePanel();
  const showPannel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="tda-pp-workspace-layout"
        >
          <ResizablePanel
            className="bg-slate-900"
            defaultSize={20}
            minSize={11}
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={20}
            defaultSize={80}
          >
            {children}
          </ResizablePanel>
          {showPannel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                minSize={20}
                defaultSize={28}
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onCloseMessage}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<"members">}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="size-5 animate-spin text-slate-600" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
