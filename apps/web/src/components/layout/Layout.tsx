import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveSupportedLng } from "@qlp/components/i18n";
import { SidebarInset, SidebarProvider } from "@qlp/ui/components/sidebar";
import { useUI } from "@qlp/contexts";
import { AppSidebar } from "./sidebar/AppSidebar";
import { SiteHeader } from "./sidebar/SiteHeader";
import { cn } from "@qlp/ui";

export default function Layout() {
  const { i18n } = useTranslation();
  const { enableMainOverflow } = useUI();

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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
