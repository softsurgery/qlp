import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveSupportedLng } from "@qlp/components/i18n";
import { SidebarInset, SidebarProvider } from "@qlp/ui/components/sidebar";
import { useFooter, useIntro, useUI } from "@qlp/contexts";
import { AppSidebar } from "@/components/layout/sidebar/AppSidebar";
import { SiteHeader } from "@/components/layout/sidebar/SiteHeader";
import { AppProviders } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";

function LayoutShell() {
  const { title, description } = useIntro();
  const { content } = useFooter();
  const { enableMainOverflow } = useUI();
  const { i18n } = useTranslation();

  return (
    <SidebarProvider
      className="h-svh overflow-hidden"
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        side={resolveSupportedLng(i18n.language) === "ar" ? "right" : "left"}
      />
      <SidebarInset className="min-h-0 overflow-hidden">
        <SiteHeader />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-6",
              enableMainOverflow ? "overflow-auto" : "overflow-hidden",
            )}
          >
            {(title || description) && (
              <div className="shrink-0 space-y-1">
                {title && <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
            <div
              className={cn(
                "flex flex-col",
                enableMainOverflow
                  ? "overflow-visible"
                  : "min-h-0 flex-1 overflow-hidden",
              )}
            >
              <Outlet />
            </div>
          </div>
          {content ? <div className="shrink-0">{content}</div> : null}
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
