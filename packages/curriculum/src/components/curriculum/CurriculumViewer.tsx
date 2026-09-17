import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Info, Loader2, Menu, Pencil } from "lucide-react";
import {
  useApp,
  useBreadcrumb,
  useUI,
  type BreadcrumbRoute,
} from "@qlp/contexts";
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
import { useCurriculumLessonMaterials } from "../../hooks/useCurriculumLessonMaterials";
import { useCurriculumModules } from "../../hooks/useCurriculumModules";
import { CourseAside } from "./viewer/aside/CourseAside";
import { CourseContent } from "./viewer/content/CourseContent";
import { CourseNav } from "./viewer/nav/CourseNav";
import {
  findCourseItem,
  latestById,
  moduleItemId,
  openAccordionIdForItem,
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
  const { pathname } = useLocation();
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

  const requestedItemId = searchParams.get("item") || undefined;
  const parentLessonId = searchParams.get("lesson") || undefined;
  const selectedItemId =
    requestedItemId &&
    outlineItemExists(modules, requestedItemId, parentLessonId)
      ? requestedItemId
      : undefined;
  const selectedItem = findCourseItem(modules, selectedItemId, parentLessonId);
  const openAccordionId = openAccordionIdForItem(selectedItem);

  const { materials, isMaterialsPending } = useCurriculumLessonMaterials({
    lessonId:
      selectedItem?.kind === "lesson" || selectedItem?.kind === "material"
        ? selectedItem.lesson.id
        : undefined,
    enabled:
      selectedItem?.kind === "lesson" || selectedItem?.kind === "material",
  });

  const selectedModule =
    selectedItem?.kind === "module" ? selectedItem.module : undefined;
  const selectedLesson =
    selectedItem?.kind === "lesson"
      ? { ...selectedItem.lesson, materials }
      : undefined;
  const selectedMaterial =
    selectedItem?.kind === "material"
      ? materials.find((item) => item.id === selectedItem.materialId) ||
        selectedItem.material
      : undefined;
  const selectedExam =
    selectedItem?.kind === "exam" ? selectedItem.exam : undefined;

  const itemHref = React.useCallback(
    (itemId?: string, lessonId?: string) => {
      const next = new URLSearchParams(searchParams);
      next.delete("module");
      if (itemId) next.set("item", itemId);
      else next.delete("item");
      if (lessonId) next.set("lesson", lessonId);
      else next.delete("lesson");
      const query = next.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  const viewerCrumbs = React.useMemo((): BreadcrumbRoute[] => {
    if (!curriculum) return [];
    const crumbs: BreadcrumbRoute[] = [
      { title: curriculum.title, href: itemHref() },
    ];
    if (!selectedItem) return crumbs;
    crumbs.push({
      title: selectedItem.module.title,
      href: itemHref(moduleItemId(selectedItem.module.id)),
    });
    if (selectedItem.kind === "lesson" || selectedItem.kind === "material") {
      crumbs.push({
        title: selectedItem.lesson.title,
        href: itemHref(`lesson:${selectedItem.lesson.id}`),
      });
    }
    if (selectedItem.kind === "material") {
      crumbs.push({
        title: selectedMaterial?.title || selectedItem.material?.title || "",
      });
    }
    if (selectedItem.kind === "exam") {
      crumbs.push({ title: selectedItem.exam.title });
    }
    return crumbs.filter((crumb) => crumb.title);
  }, [curriculum, itemHref, selectedItem, selectedMaterial]);

  React.useEffect(() => {
    setShowSidebar?.(false);
    return () => {
      clearShowSidebar?.();
    };
  }, [clearShowSidebar, setShowSidebar]);

  React.useEffect(() => {
    if (!setRoutes || !curriculum) return;
    const routes: BreadcrumbRoute[] = [
      { title: t("title"), href: "/curriculum" },
      ...viewerCrumbs,
    ];
    setRoutes(routes);
    return () => {
      clearRoutes?.();
    };
  }, [clearRoutes, curriculum, setRoutes, t, viewerCrumbs]);

  const selectItem = React.useCallback(
    (itemId?: string, lessonId?: string, closeNav = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (itemId) next.set("item", itemId);
          else next.delete("item");
          next.delete("module");
          if (lessonId) next.set("lesson", lessonId);
          else next.delete("lesson");
          return next;
        },
        { replace: true },
      );
      if (closeNav) setNavOpen(false);
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
      selectedItemId={selectedItemId}
      openAccordionId={openAccordionId}
      onSelectItem={selectItem}
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
            ) : (
              <CourseContent
                curriculumTitle={curriculum.title}
                modules={modules}
                module={selectedModule}
                lesson={selectedLesson}
                material={selectedMaterial}
                exam={selectedExam}
                isMaterialsPending={
                  (selectedItem?.kind === "lesson" ||
                    selectedItem?.kind === "material") &&
                  isMaterialsPending
                }
                revealAnswers={revealAnswers}
                onSelectItem={selectItem}
              />
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
