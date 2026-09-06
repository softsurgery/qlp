import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@qlp/ui/components/sidebar";
import { LanguageSwitcher } from "@qlp/components";
import { NavMain } from "@/components/layout/sidebar/NavMain";
import { NavUser } from "@/components/layout/sidebar/NavUser";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/roles", icon: ShieldCheck, label: "Roles" },
  { to: "/tutors", icon: GraduationCap, label: "Tutor Verification" },
  { to: "/curriculum", icon: BookOpen, label: "Curriculum" },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">QLP Admin</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Platform management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-1 group-data-[collapsible=icon]:hidden">
          <LanguageSwitcher />
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
