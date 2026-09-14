import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { useApp } from "@qlp/contexts";
import { useDnDService } from "@qlp/hooks";
import { Button, cn } from "@qlp/ui";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type ResponseCurriculumLessonDto } from "@qlp/api-client";
import { CurriculumLessonItem } from "./CurriculumLessonItem";
import { toast } from "sonner";
import { useCurriculumLessons } from "../../hooks";
import { useCurriculumLessonStore } from "../../hooks/stores/useCurriculumLessonStore";
import { useCurriculumLessonCreateSheet } from "./modals/CurriculumLessonCreateSheet";
import { useCurriculumLessonDeleteDialog } from "./modals/CurriculumLessonDeleteDialog";

export interface CurriculumLessonsProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
}

export function CurriculumLessons({
  className,
  curriculumId,
  moduleId,
}: CurriculumLessonsProps) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("curriculum");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { lessons: loadedLessons, isLessonsPending: isLoading } =
    useCurriculumLessons({ moduleId, join: "createdBy" });

  const [lessons, setLessons] = React.useState<ResponseCurriculumLessonDto[]>(
    [],
  );

  const { createCurriculumLessonSheet, openCreateCurriculumLessonSheet } =
    useCurriculumLessonCreateSheet({ curriculumId, moduleId });
  const curriculumLessonStore = useCurriculumLessonStore();

  React.useEffect(() => {
    const sorted = [...loadedLessons].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    );
    setLessons(sorted);
  }, [loadedLessons]);

  const { mutate: updateLessonOrder } = useMutation({
    mutationFn: async (updates: { id: string; sortOrder: number }[]) => {
      return api.reorderLessons(updates);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-lessons", moduleId],
      });
    },
    onError: () => {
      toast.error(tCommon("errors.saveFailed", "Failed to update order"));
    },
  });

  const { mutate: deleteLessonMutation, isPending: isDeletionPending } =
    useMutation({
      mutationFn: async (lessonId: string) => {
        return api.removeLesson(lessonId);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["curriculum-lessons", moduleId],
        });
        toast.success(tCommon("commands.deleted", "Deleted successfully"));
      },
      onError: () => {
        toast.error(tCommon("errors.deleteFailed", "Failed to delete lesson"));
      },
    });

  const { deleteCurriculumLessonDialog, openDeleteCurriculumLessonDialog } =
    useCurriculumLessonDeleteDialog({
      representation: curriculumLessonStore.response?.title,
      deleteLesson: () => {
        if (curriculumLessonStore.response) {
          deleteLessonMutation(curriculumLessonStore.response.id);
        }
      },
      isDeletionPending,
      resetLesson: () => curriculumLessonStore.set("response", undefined),
    });

  const dndService = useDnDService<ResponseCurriculumLessonDto>({
    items: lessons,
    setItems: setLessons,
    getId: (item) => item.id,
    renderChild: (item) => (
      <CurriculumLessonItem
        lesson={item}
        onEdit={() =>
          navigate(
            `/curriculum/${curriculumId}/modules/${moduleId}/lessons/${item.id}/edit`,
          )
        }
        onDelete={(lesson) => {
          curriculumLessonStore.set("response", lesson);
          openDeleteCurriculumLessonDialog();
        }}
      />
    ),
    createNewItem: () => {
      openCreateCurriculumLessonSheet();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEndWrapper = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex((lesson) => lesson.id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson.id === over.id);

      dndService.handleDragEnd(event);

      const newLessons = arrayMove(lessons, oldIndex, newIndex);

      const updates = newLessons.map((lesson, index) => ({
        id: lesson.id,
        sortOrder: index,
      }));

      if (updates.length > 0) {
        updateLessonOrder(updates);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{t("lessons", "Lessons")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("lessonsDescription", "Manage the lessons for this module.")}
          </p>
        </div>
        <Button
          size="sm"
          onClick={dndService.createNewItem}
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>{tCommon("commands.create", "Create")}</span>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndWrapper}
      >
        <SortableContext
          items={lessons.map((lesson) => lesson.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {dndService.items.map((item) => (
              <React.Fragment key={item.id}>{item.child}</React.Fragment>
            ))}
            {dndService.items.length === 0 && (
              <div className="text-muted-foreground text-sm py-8 text-center border rounded-lg border-dashed">
                {t("noLessons", "No lessons found. Create one to get started.")}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {createCurriculumLessonSheet}
      {deleteCurriculumLessonDialog}
    </div>
  );
}
