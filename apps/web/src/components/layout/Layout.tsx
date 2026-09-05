import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarInset, SidebarProvider } from "@qlp/ui/components/sidebar";
import { AppSidebar } from "./sidebar/AppSidebar";
import { SiteHeader } from "./sidebar/SiteHeader";

export default function Layout() {
  const { i18n } = useTranslation();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        side={i18n.language === "ar" ? "right" : "left"}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
