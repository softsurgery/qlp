import React from "react";
import { Spinner } from "@qlp/components";
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
import { type ResponseCurriculumExamDto } from "@qlp/api-client";
import { CurriculumExamItem } from "./CurriculumExamItem";
import { toast } from "sonner";
import { useCurriculumExams } from "../../hooks";
import { useCurriculumExamStore } from "../../hooks/stores/useCurriculumExamStore";
import { useCurriculumExamCreateSheet } from "./modals/CurriculumExamCreateSheet";
import { useCurriculumExamDeleteDialog } from "./modals/CurriculumExamDeleteDialog";

export interface CurriculumExamsProps {
  className?: string;
  curriculumId: string;
  moduleId: string;
}

export function CurriculumExams({
  className,
  curriculumId,
  moduleId,
}: CurriculumExamsProps) {
  const { t: tCommon } = useTranslation("curriculum-common");
  const { t: tGlobal } = useTranslation("global");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumExams
      : baseApi.curriculumExams;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { exams: loadedExams, isExamsPending: isLoading } = useCurriculumExams({
    moduleId,
    join: "createdBy",
  });

  const [exams, setExams] = React.useState<ResponseCurriculumExamDto[]>([]);

  const { createCurriculumExamSheet, openCreateCurriculumExamSheet } =
    useCurriculumExamCreateSheet({ curriculumId, moduleId });
  const curriculumExamStore = useCurriculumExamStore();

  React.useEffect(() => {
    const sorted = [...loadedExams].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    );
    setExams(sorted);
  }, [loadedExams]);

  const { mutate: updateExamOrder } = useMutation({
    mutationFn: async (updates: { id: string; sortOrder: number }[]) => {
      return api.reorder(updates);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["curriculum-exams", moduleId],
      });
    },
    onError: () => {
      toast.error(tCommon("errors.saveFailed"));
    },
  });

  const { mutate: deleteExamMutation, isPending: isDeletionPending } =
    useMutation({
      mutationFn: async (examId: string) => {
        return api.remove(examId);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["curriculum-exams", moduleId],
        });
        toast.success(tGlobal("commands.deleted"));
      },
      onError: () => {
        toast.error(tCommon("errors.deleteFailed"));
      },
    });

  const { deleteCurriculumExamDialog, openDeleteCurriculumExamDialog } =
    useCurriculumExamDeleteDialog({
      representation: curriculumExamStore.response?.title,
      deleteExam: () => {
        if (curriculumExamStore.response) {
          deleteExamMutation(curriculumExamStore.response.id);
        }
      },
      isDeletionPending,
      resetExam: () => curriculumExamStore.set("response", undefined),
    });

  const moveExam = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= exams.length) return;
    const newExams = arrayMove(exams, index, targetIndex);
    setExams(newExams);
    const updates = newExams.map((ex, i) => ({
      id: ex.id,
      sortOrder: i,
    }));
    if (updates.length > 0) {
      updateExamOrder(updates);
    }
  };

  const dndService = useDnDService<ResponseCurriculumExamDto>({
    items: exams,
    setItems: setExams,
    getId: (item) => item.id,
    renderChild: (item, index) => (
      <CurriculumExamItem
        exam={item}
        isFirst={index === 0}
        isLast={index === exams.length - 1}
        onMoveUp={() => moveExam(index, "up")}
        onMoveDown={() => moveExam(index, "down")}
        onEdit={() =>
          navigate(
            `/curriculum/${curriculumId}/modules/${moduleId}/exams/${item.id}/edit`,
          )
        }
        onDelete={(exam) => {
          curriculumExamStore.set("response", exam);
          openDeleteCurriculumExamDialog();
        }}
      />
    ),
    createNewItem: () => {
      openCreateCurriculumExamSheet();
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
      const oldIndex = exams.findIndex((exam) => exam.id === active.id);
      const newIndex = exams.findIndex((exam) => exam.id === over.id);

      dndService.handleDragEnd(event);

      const newExams = arrayMove(exams, oldIndex, newIndex);

      const updates = newExams.map((exam, index) => ({
        id: exam.id,
        sortOrder: index,
      }));

      if (updates.length > 0) {
        updateExamOrder(updates);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center p-6 text-sm text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{tCommon("editor.exams")}</h3>
          <p className="text-sm text-muted-foreground">
            {tCommon("editor.examsDescription")}
          </p>
        </div>
        <Button
          size="sm"
          onClick={dndService.createNewItem}
          variant="secondary"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>{tGlobal("commands.create")}</span>
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndWrapper}
      >
        <SortableContext
          items={exams.map((exam) => exam.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {dndService.items.map((item) => (
              <React.Fragment key={item.id}>{item.child}</React.Fragment>
            ))}
            {dndService.items.length === 0 && (
              <div className="text-muted-foreground text-sm py-8 text-center border rounded-lg border-dashed">
                {tCommon("editor.noExams")}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {createCurriculumExamSheet}
      {deleteCurriculumExamDialog}
    </div>
  );
}
