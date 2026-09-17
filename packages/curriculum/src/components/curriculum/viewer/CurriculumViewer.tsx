import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, PanelLeft, PanelRight, Pencil } from "lucide-react";
import {
  useApp,
  useBreadcrumb,
  useUI,
  type BreadcrumbRoute,
} from "@qlp/contexts";
import {
  Button,
  cn,
  useMediaQuery,
} from "@qlp/ui";
import {
  type ResponseCurriculumDto,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import { useCurriculum } from "../../../hooks/useCurriculum";
import { useCurriculumLessonMaterials } from "../../../hooks/useCurriculumLessonMaterials";
import { useCurriculumModules } from "../../../hooks/useCurriculumModules";
import { CourseAside } from "./aside/CourseAside";
import { CourseContent } from "./content/CourseContent";
import { useCourseAsideSheet } from "./modal/CourseAsideSheet";
import { useCourseNavSheet } from "./modal/CourseNavSheet";
import { CourseNav } from "./nav/CourseNav";
import {
  findCourseItem,
  latestById,
  moduleItemId,
  openAccordionIdForItem,
  outlineItemExists,
  sortByOrder,
} from "./utils";

interface CurriculumViewerProps {
  className?: string;
  curriculumId: string;
  version?: number;
  revealAnswers?: boolean;
}

export const CurriculumViewer = ({
  className,
  curriculumId,
  version,
  revealAnswers,
}: CurriculumViewerProps) => {
  const { t } = useTranslation("curriculum");
  const { setShowSidebar, clearShowSidebar } = useUI();

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

  React.useEffect(() => {
    setShowSidebar?.(false);
    return () => {
      clearShowSidebar?.();
    };
  }, [clearShowSidebar, setShowSidebar]);

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

  return (
    <CourseViewer
      className={className}
      curriculumId={curriculumId}
      curriculum={curriculum}
      modules={modules}
      revealAnswers={revealAnswers}
    />
  );
};

interface CourseViewerProps {
  className?: string;
  curriculumId: string;
  curriculum: ResponseCurriculumDto;
  modules: ResponseCurriculumModuleDto[];
  revealAnswers?: boolean;
}

const CourseViewer = ({
  className,
  curriculumId,
  curriculum,
  modules,
  revealAnswers,
}: CourseViewerProps) => {
  const { t } = useTranslation("curriculum");
  const { appType } = useApp();
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const isNarrow = useMediaQuery("(max-width: 1279px)");
  const [showNav, setShowNav] = React.useState(true);
  const [showAside, setShowAside] = React.useState(true);

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

  const selectItem = React.useCallback(
    (itemId?: string, lessonId?: string) => {
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
    },
    [setSearchParams],
  );

  const { courseNavSheet, openCourseNavSheet } = useCourseNavSheet({
    title: curriculum.title,
    description: curriculum.description,
    modules,
    selectedItemId,
    openAccordionId,
    onSelectItem: selectItem,
  });

  const { courseAsideSheet, openCourseAsideSheet } = useCourseAsideSheet({
    curriculum,
    modules,
  });

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
  }, [curriculum.title, itemHref, selectedItem, selectedMaterial]);

  React.useEffect(() => {
    if (!setRoutes) return;
    const routes: BreadcrumbRoute[] = [
      { title: t("title"), href: "/curriculum" },
      ...viewerCrumbs,
    ];
    setRoutes(routes);
    return () => {
      clearRoutes?.();
    };
  }, [clearRoutes, setRoutes, t, viewerCrumbs]);

  const showNavTrigger = isCompact || !showNav;
  const showAsideTrigger = isNarrow || !showAside;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background",
        className,
      )}
    >
      {showNavTrigger || showAsideTrigger ? (
        <div className="flex items-center gap-2 border-b px-3 py-2">
          {showNavTrigger ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                isCompact ? openCourseNavSheet() : setShowNav(true)
              }
            >
              <PanelLeft className="size-4" />
              {t("viewer.courseMaterial")}
            </Button>
          ) : null}
          {isCompact ? (
            <div className="min-w-0 flex-1 truncate text-sm font-medium">
              {curriculum.title}
            </div>
          ) : (
            <div className="min-w-0 flex-1" />
          )}
          {showAsideTrigger ? (
            <Button
              type="button"
              variant={isCompact ? "ghost" : "outline"}
              size={isCompact ? "icon-sm" : "sm"}
              onClick={() =>
                isNarrow ? openCourseAsideSheet() : setShowAside(true)
              }
              aria-label={t("viewer.overview")}
            >
              <PanelRight className="size-4" />
              {!isCompact ? t("viewer.overview") : null}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!isCompact ? (
          <aside
            aria-hidden={!showNav}
            className={cn(
              "flex shrink-0 flex-col overflow-hidden bg-muted/40 transition-[width] duration-300 ease-in-out",
              showNav ? "w-64 border-e xl:w-80" : "w-0",
            )}
          >
            <div className="flex h-full w-64 min-w-64 flex-col xl:w-80 xl:min-w-80">
              <CourseNav
                title={curriculum.title}
                description={curriculum.description}
                modules={modules}
                selectedItemId={selectedItemId}
                openAccordionId={openAccordionId}
                onSelectItem={selectItem}
                onClose={() => setShowNav(false)}
              />
            </div>
          </aside>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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
          <aside
            aria-hidden={!showAside}
            className={cn(
              "flex shrink-0 flex-col overflow-hidden bg-muted/20 transition-[width] duration-300 ease-in-out",
              showAside ? "w-[26.25rem] border-s" : "w-0",
            )}
          >
            <div className="flex h-full w-[26.25rem] min-w-[26.25rem] flex-col">
              <CourseAside
                curriculum={curriculum}
                modules={modules}
                onClose={() => setShowAside(false)}
              />
            </div>
          </aside>
        ) : null}
      </div>

      {courseNavSheet}
      {courseAsideSheet}
    </div>
  );
};
