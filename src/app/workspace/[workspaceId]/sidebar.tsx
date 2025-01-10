import UserButton from "@/features/auth/componenets/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import {
  BellIcon,
  Home,
  MessageSquareIcon,
  MoreHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-16 h-full bg-gray-800 flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton
        icon={MessageSquareIcon}
        label="DMs"
      />
      <SidebarButton
        icon={BellIcon}
        label="Activity"
      />
      <SidebarButton
        icon={MoreHorizontal}
        label="More"
      />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </div>
  );
}

export default Sidebar;
