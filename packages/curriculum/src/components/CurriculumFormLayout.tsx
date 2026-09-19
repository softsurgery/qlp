import React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PanelRightClose, PanelRightOpen, ArrowUp } from "lucide-react";
import { Button, cn, useSheet, useMediaQuery } from "@qlp/ui";
import { useRTL } from "@qlp/ui/hooks/useRTL";

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
  const { t: tUI } = useTranslation("ui");
  const isRTL = useRTL();
  const [searchParams] = useSearchParams();
  const isEmbed =
    searchParams.get("embed") === "true" || searchParams.get("embed") === "1";

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(true);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const isMobile = useMediaQuery("(max-width: 1366px)");

  const sidebarContent = <div className="flex flex-col gap-4">{sidebar}</div>;

  const { SheetFragment, openSheet, closeSheet, isOpen } = useSheet({
    title: <span className="sr-only">{tUI("sidebar.sidebar", "Sidebar")}</span>,
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

  React.useEffect(() => {
    const scrollContainer = document.getElementById("main-layout") || window;

    const handleScroll = () => {
      const scrollTop =
        scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop;

      setShowScrollTop(scrollTop > 300);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = React.useCallback(() => {
    const scrollContainer = document.getElementById("main-layout");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

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
            aria-label={tUI("sidebar.toggle", "Toggle Sidebar")}
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
                  isDesktopSidebarOpen
                    ? tUI("sidebar.hide", "Hide Sidebar")
                    : tUI("sidebar.show", "Show Sidebar")
                }
              >
                {isDesktopSidebarOpen ? (
                  <PanelRightClose className="size-4" />
                ) : (
                  <PanelRightOpen className="size-4" />
                )}
                <span>
                  {isDesktopSidebarOpen
                    ? tUI("commands.hide", "Hide")
                    : tUI("commands.show", "Show")}
                </span>
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

      <div
        className={cn(
          "fixed bottom-4 sm:bottom-8 z-50 flex items-center gap-2 transition-all duration-300",
          isRTL ? "left-4 sm:left-8" : "right-4 sm:right-8",
          showScrollTop
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none",
        )}
      >
        {!isMobile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDesktopSidebarOpen((prev) => !prev)}
            className="gap-2 rounded-full shadow-lg h-10 px-4"
            aria-label={
              isDesktopSidebarOpen
                ? tUI("sidebar.hide", "Hide Sidebar")
                : tUI("sidebar.show", "Show Sidebar")
            }
          >
            {isDesktopSidebarOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
            <span className="hidden sm:inline">
              {isDesktopSidebarOpen
                ? tUI("commands.hide", "Hide")
                : tUI("commands.show", "Show")}
            </span>
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg h-10 w-10"
          onClick={scrollToTop}
          aria-label={tUI("scrollToTop", "Scroll to top")}
        >
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
};
