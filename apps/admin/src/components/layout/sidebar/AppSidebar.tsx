import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("user-management");

  const items = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    {
      icon: Users,
      label: t("userManagement.nav.title"),
      items: [
        {
          to: "/user-management/users",
          icon: User,
          label: t("userManagement.nav.users"),
        },
        {
          to: "/user-management/roles",
          icon: ShieldCheck,
          label: t("userManagement.nav.roles"),
        },
      ],
    },
    { to: "/tutors", icon: GraduationCap, label: "Tutor Verification" },
    { to: "/curriculum", icon: BookOpen, label: "Curriculum" },
  ];

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
