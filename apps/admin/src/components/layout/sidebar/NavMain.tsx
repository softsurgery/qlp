import { useState } from "react";
import { NavLink, useLocation, useMatch } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@qlp/ui";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@qlp/ui/components/sidebar";

export type NavSubItem = {
  to: string;
  label: string;
  icon?: LucideIcon;
};

export type NavItem = {
  to?: string;
  label: string;
  icon: LucideIcon;
  items?: NavSubItem[];
};

function isPathActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function LeafNavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: LucideIcon;
}) {
  const match = useMatch({ path: to, end: to === "/" });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={!!match} tooltip={label}>
        <NavLink to={to} end={to === "/"}>
          <Icon />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SubNavItem({ to, label, icon: Icon }: NavSubItem) {
  const match = useMatch({ path: to, end: to === "/" });

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={!!match}>
        <NavLink to={to} end={to === "/"}>
          {Icon ? <Icon /> : null}
          <span>{label}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const { pathname } = useLocation();
  const { isMobile, state } = useSidebar();
  const children = item.items ?? [];
  const isChildActive = children.some((child) =>
    isPathActive(pathname, child.to),
  );
  const [open, setOpen] = useState(isChildActive);

  if (state === "collapsed" && !isMobile) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip={item.label}>
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-44 rounded-lg"
            side="right"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
            {children.map((child) => (
              <DropdownMenuItem key={child.to} asChild>
                <NavLink to={child.to}>{child.label}</NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      asChild
      open={isChildActive || open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.label}>
            <item.icon />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((child) => (
              <SubNavItem key={child.to} {...child} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) =>
            item.items?.length ? (
              <CollapsibleNavItem key={item.label} item={item} />
            ) : (
              <LeafNavItem
                key={item.to ?? item.label}
                to={item.to ?? "/"}
                label={item.label}
                icon={item.icon}
              />
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
