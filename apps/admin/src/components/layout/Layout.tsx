import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@qlp/ui/components/sidebar";
import { useFooter, useIntro } from "@qlp/contexts";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
import { SiteHeader } from "@/components/layout/sidebar/SiteHeader";
import { AppProviders } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

function LayoutShell() {
  const { title, description } = useIntro();
  const { content } = useFooter();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-6">
            {(title || description) && (
              <div className="space-y-1">
                {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
            <div className={cn("flex min-h-0 flex-1 flex-col")}>
              <Outlet />
            </div>
          </div>
          {content}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Layout() {
  return (
    <AppProviders>
      <LayoutShell />
    </AppProviders>
  );
}
