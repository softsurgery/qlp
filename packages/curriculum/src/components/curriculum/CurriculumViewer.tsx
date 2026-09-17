import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Info, Loader2, Menu, Pencil } from "lucide-react";
import { useApp, useBreadcrumb, useUI } from "@qlp/contexts";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  cn,
  useMediaQuery,
} from "@qlp/ui";
import { useCurriculum } from "../../hooks/useCurriculum";
import { useCurriculumModuleLessonMaterials } from "../../hooks/useCurriculumModuleLessonMaterials";
import { useCurriculumModules } from "../../hooks/useCurriculumModules";
import { CourseAside } from "./viewer/CourseAside";
import { CourseNav } from "./viewer/CourseNav";
import { ModuleOutline } from "./viewer/ModuleOutline";
import {
  firstOutlineItemId,
  latestById,
  outlineItemExists,
  sortByOrder,
} from "./viewer/utils";

interface CurriculumViewerProps {
  className?: string;
  curriculumId: string;
  version?: number;
  revealAnswers?: boolean;
}

export function CurriculumViewer({
  className,
  curriculumId,
  version,
  revealAnswers,
}: CurriculumViewerProps) {
  const { t, i18n } = useTranslation("curriculum");
  const { appType } = useApp();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setShowSidebar, clearShowSidebar } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const isNarrow = useMediaQuery("(max-width: 1279px)");
  const [navOpen, setNavOpen] = React.useState(false);
  const [asideOpen, setAsideOpen] = React.useState(false);

  const { curriculum, isCurriculumPending, isCurriculumError } = useCurriculum({
    id: curriculumId,
    version,
    join: "owner,createdBy",
  });

  const { modules: loadedModules, isModulesPending } = useCurriculumModules({
    id: curriculumId,
    join: "lessons,exams",
  });

  const modules = React.useMemo(
    () => sortByOrder(latestById(loadedModules)),
    [loadedModules],
  );

  const selectedModuleId = searchParams.get("module") || modules[0]?.id;
  const selectedModule =
    modules.find((module) => module.id === selectedModuleId) ?? modules[0];
  const selectedIndex = selectedModule
    ? modules.findIndex((module) => module.id === selectedModule.id)
    : -1;

  const { lessons, isLessonsPending, isMaterialsPending } =
    useCurriculumModuleLessonMaterials({
      moduleId: selectedModule?.id,
      enabled: !!selectedModule?.id,
    });

  const selectedModuleWithLessons = React.useMemo(() => {
    if (!selectedModule) return undefined;
    return {
      ...selectedModule,
      lessons: isLessonsPending ? selectedModule.lessons : lessons,
    };
  }, [isLessonsPending, lessons, selectedModule]);

  const [activeItemId, setActiveItemId] = React.useState<string | undefined>();

  React.useEffect(() => {
    setActiveItemId(firstOutlineItemId(selectedModuleWithLessons));
  }, [selectedModuleWithLessons?.id]);

  React.useEffect(() => {
    if (isLessonsPending || isMaterialsPending || !selectedModuleWithLessons) {
      return;
    }
    setActiveItemId((current) => {
      if (current && outlineItemExists(selectedModuleWithLessons, current)) {
        return current;
      }
      return firstOutlineItemId(selectedModuleWithLessons);
    });
  }, [
    isLessonsPending,
    isMaterialsPending,
    selectedModuleWithLessons,
  ]);

  React.useEffect(() => {
    setShowSidebar?.(false);
    return () => {
      clearShowSidebar?.();
    };
  }, [clearShowSidebar, setShowSidebar]);

  React.useEffect(() => {
    if (!setRoutes || !curriculum) return;
    setRoutes([
      { title: t("title"), href: "/curriculum" },
      { title: curriculum.title },
    ]);
    return () => {
      clearRoutes?.();
    };
  }, [clearRoutes, curriculum, setRoutes, t]);

  const selectModule = React.useCallback(
    (moduleId: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("module", moduleId);
          return next;
        },
        { replace: true },
      );
      setNavOpen(false);
    },
    [setSearchParams],
  );

  if (isCurriculumPending || isModulesPending) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 items-center justify-center",
          className,
        )}
      >
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <span className="sr-only">{t("viewer.loading")}</span>
      </div>
    );
  }

  if (isCurriculumError || !curriculum) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 items-center justify-center p-6",
          className,
        )}
      >
        <p className="text-destructive">{t("loadError")}</p>
      </div>
    );
  }

  const nav = (
    <CourseNav
      title={curriculum.title}
      description={curriculum.description}
      modules={modules}
      selectedModuleId={selectedModule?.id}
      onSelectModule={selectModule}
    />
  );

  const aside = <CourseAside curriculum={curriculum} modules={modules} />;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background",
        className,
      )}
    >
      {isCompact ? (
        <div className="flex items-center gap-2 border-b px-3 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setNavOpen(true)}
          >
            <Menu className="size-4" />
            {t("viewer.courseMaterial")}
          </Button>
          <div className="min-w-0 flex-1 truncate text-sm font-medium">
            {curriculum.title}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setAsideOpen(true)}
            aria-label={t("viewer.overview")}
          >
            <Info className="size-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {!isCompact ? (
          <aside className="flex w-64 shrink-0 flex-col border-e bg-muted/40 xl:w-80">
            {nav}
          </aside>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {!isCompact && isNarrow ? (
            <div className="flex justify-end border-b px-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAsideOpen(true)}
              >
                <Info className="size-4" />
                {t("viewer.overview")}
              </Button>
            </div>
          ) : null}

          <main className="min-w-0 flex-1 overflow-y-auto bg-background">
            {modules.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                <p className="font-medium">{t("viewer.noModules")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("viewer.noModulesHint")}
                </p>
                {appType ? (
                  <Button asChild className="mt-2">
                    <Link to={`/curriculum/${curriculumId}/edit`}>
                      <Pencil className="size-4" />
                      {t("edit")}
                    </Link>
                  </Button>
                ) : null}
              </div>
            ) : selectedModuleWithLessons ? (
              <ModuleOutline
                module={selectedModuleWithLessons}
                moduleIndex={Math.max(selectedIndex, 0)}
                revealAnswers={revealAnswers}
                activeItemId={activeItemId}
                onActiveItemChange={setActiveItemId}
              />
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">
                {t("viewer.selectModule")}
              </p>
            )}
          </main>
        </div>

        {!isNarrow ? (
          <aside className="flex w-96 shrink-0 flex-col border-s bg-muted/20">
            {aside}
          </aside>
        ) : null}
      </div>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side={i18n.dir() === "rtl" ? "right" : "left"}
          className="w-[50vw] p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t("viewer.courseMaterial")}</SheetTitle>
          </SheetHeader>
          {nav}
        </SheetContent>
      </Sheet>

      <Sheet open={asideOpen} onOpenChange={setAsideOpen}>
        <SheetContent className="w-[50vw]">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("viewer.overview")}</SheetTitle>
          </SheetHeader>
          {aside}
        </SheetContent>
      </Sheet>
    </div>
  );
}
