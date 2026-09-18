import React from "react";
import { useSearchParams } from "react-router-dom";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button, cn, useSheet, useMediaQuery } from "@qlp/ui";

interface CurriculumFormLayoutProps {
  className?: string;
  main: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarDescription?: string;
}

export const CurriculumFormLayout = ({
  className,
  main,
  sidebar,
  sidebarDescription,
}: CurriculumFormLayoutProps) => {
  const [searchParams] = useSearchParams();
  const isEmbed =
    searchParams.get("embed") === "true" || searchParams.get("embed") === "1";

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(true);

  const isMobile = useMediaQuery("(max-width: 1366px)");

  const sidebarContent = <div className="flex flex-col gap-4">{sidebar}</div>;

  const { SheetFragment, openSheet, closeSheet, isOpen } = useSheet({
    title: <span className="sr-only">Sidebar</span>,
    description: sidebarDescription,
    children: <div className="flex flex-col gap-4">{sidebar}</div>,
    className: "w-full sm:max-w-md p-4 sm:p-6",
    headerClassName: "text-start",
  });

  React.useEffect(() => {
    if (!isMobile && isOpen) {
      closeSheet();
    }
  }, [isMobile, isOpen, closeSheet]);

  if (isEmbed) {
    return (
      <div className={cn("py-2 w-full", className)}>
        <div className="min-w-0 flex-1 rounded-lg border p-4 sm:p-6 bg-card">
          {main}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-2 sm:py-4 w-full container", className)}>
      {isMobile && (
        <div className="mb-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={openSheet}
            aria-label="Toggle Sidebar"
          >
            {isDesktopSidebarOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
          </Button>
        </div>
      )}

      <div
        className={cn(
          "flex items-start gap-2 sm:gap-4 transition-all duration-300",
          isMobile ? "flex-col" : "flex-col lg:flex-row",
        )}
      >
        <div className="min-w-0 flex-1 w-full flex flex-col gap-2">
          {!isMobile && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDesktopSidebarOpen((prev) => !prev)}
                className="gap-2"
                aria-label={
                  isDesktopSidebarOpen ? "Hide Sidebar" : "Show Sidebar"
                }
              >
                {isDesktopSidebarOpen ? (
                  <PanelRightClose className="size-4" />
                ) : (
                  <PanelRightOpen className="size-4" />
                )}
                <span>{isDesktopSidebarOpen ? "Hide" : "Show"}</span>
              </Button>
            </div>
          )}
          <div className="rounded-lg border p-4 sm:p-6 bg-card w-full">
            {main}
          </div>
        </div>
        {!isMobile && isDesktopSidebarOpen && (
          <aside className="sticky top-4 flex w-full shrink-0 flex-col self-start rounded-lg border bg-card lg:w-[300px] xl:w-[450px] max-h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-7rem)] animate-in slide-in-from-right-8 fade-in-20 duration-300">
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain p-4 sm:p-6 pb-8">
              {sidebarContent}
            </div>
          </aside>
        )}
      </div>

      {SheetFragment}
    </div>
  );
};
