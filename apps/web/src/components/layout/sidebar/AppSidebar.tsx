import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  User,
  Trophy,
  LayoutDashboard,
  Baby,
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
import { hasRole } from "../../../lib/api";
import { useAuthUser } from "../../../hooks/useAuth";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { data: user } = useAuthUser();

  const items = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/curriculum", icon: BookOpen, label: t("nav.curriculum") },
    { to: "/tutors", icon: Users, label: t("nav.tutors") },
    { to: "/bookings", icon: Calendar, label: t("nav.bookings") },
    { to: "/chat", icon: MessageCircle, label: t("nav.chat") },
    { to: "/achievements", icon: Trophy, label: t("nav.achievements") },
    { to: "/profile", icon: User, label: t("nav.profile") },
  ];

  if (hasRole(user, "parent")) {
    items.push({ to: "/children", icon: Baby, label: t("nav.children") });
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{t("appName")}</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {t("tagline")}
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
