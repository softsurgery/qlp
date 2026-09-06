import { BreadcrumbCommon } from "@qlp/components";
import { ModeToggle, Separator } from "@qlp/ui";
import { SidebarTrigger } from "@qlp/ui/components/sidebar";

export function SiteHeader() {
  return (
    <header className="flex h-[--header-height] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <BreadcrumbCommon />
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
