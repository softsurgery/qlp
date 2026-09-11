import React from "react";
import { useSearchParams } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
} from "@qlp/ui";
import { useMediaQuery } from "@qlp/hooks";

interface CurriculumFormLayoutProps {
  className?: string;
  isMobile?: boolean;
  main: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarTitle?: string;
  sidebarDescription?: string;
}

export const CurriculumFormLayout = ({
  className,
  isMobile: isMobileProp,
  main,
  sidebar,
  sidebarTitle = "Actions",
  sidebarDescription,
}: CurriculumFormLayoutProps) => {
  const [searchParams] = useSearchParams();
  const isEmbed =
    searchParams.get("embed") === "true" || searchParams.get("embed") === "1";
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const fallbackIsMobile = useMediaQuery("(max-width: 1024px)");
  const isMobile = isMobileProp !== undefined ? isMobileProp : fallbackIsMobile;

  const sidebarContent = <div className="flex flex-col gap-4">{sidebar}</div>;

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
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                aria-label={sidebarTitle}
              >
                <Menu className="size-4" />
                <span>{sidebarTitle}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col overflow-y-auto p-4 sm:max-w-md sm:p-6"
            >
              <SheetHeader className="text-left">
                <SheetTitle>{sidebarTitle}</SheetTitle>
                {sidebarDescription && (
                  <SheetDescription>{sidebarDescription}</SheetDescription>
                )}
              </SheetHeader>
              <div className="mt-4">{sidebarContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <div
        className={cn(
          "flex items-start gap-2 sm:gap-4",
          isMobile ? "flex-col" : "flex-col lg:flex-row",
        )}
      >
        <div className="min-w-0 flex-1 w-full rounded-lg border p-4 sm:p-6 bg-card">
          {main}
        </div>
        {!isMobile && (
          <aside className="sticky top-4 flex w-full shrink-0 flex-col self-start rounded-lg border bg-card lg:w-[300px] xl:w-[450px] max-h-[calc(100dvh-5rem)] lg:max-h-[calc(100dvh-7rem)]">
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain p-4 sm:p-6 pb-8">
              {sidebarContent}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
