import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  ChevronDown,
  Clapperboard,
  FileText,
  Mic,
  Plus,
  Table2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useApp } from "@qlp/contexts";
import { useDnDService } from "@qlp/hooks";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from "@qlp/ui";
import {
  MaterialType,
  type CreateCurriculumMaterialDto,
  type ResponseCurriculumLessonMaterialDto,
  type ServerErrorResponse,
  type UpdateCurriculumMaterialDto,
} from "@qlp/api-client";
import { useCurriculumLessonMaterials } from "../../hooks";
import { errorMessage } from "../../utils";
import {
  emptyMaterialTable,
  stringifyMaterialTable,
} from "../../utils/material-table";
import { CurriculumLessonMaterialItem } from "./CurriculumLessonMaterialItem";
import { useCurriculumLessonMaterialDeleteDialog } from "../curriculum-lesson/modals/CurriculumLessonMaterialDeleteDialog";

export interface CurriculumLessonMaterialsProps {
  className?: string;
  lessonId: string;
  moduleId: string;
  disabled?: boolean;
}

const MATERIAL_BLOCKS = [
  {
    type: MaterialType.Text,
    icon: FileText,
    labelKey: "materialEditor" as const,
  },
  {
    type: MaterialType.Video,
    icon: Clapperboard,
    labelKey: "materialVideo" as const,
  },
  { type: MaterialType.Audio, icon: Mic, labelKey: "materialAudio" as const },
  {
    type: MaterialType.Table,
    icon: Table2,
    labelKey: "materialTable" as const,
  },
];

export const CurriculumLessonMaterials = ({
  className,
  lessonId,
  moduleId,
  disabled,
}: CurriculumLessonMaterialsProps) => {
  const { t } = useTranslation("curriculum");
  const { t: tCommon } = useTranslation("common");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumLessons
      : baseApi.curriculumLessons;
  const queryClient = useQueryClient();

  const { materials: loadedMaterials, isMaterialsPending: isLoading } =
    useCurriculumLessonMaterials({ lessonId });
  const [materials, setMaterials] = React.useState<
    ResponseCurriculumLessonMaterialDto[]
  >([]);
  const [materialToDelete, setMaterialToDelete] =
    React.useState<ResponseCurriculumLessonMaterialDto | null>(null);
  const [savingId, setSavingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sorted = [...loadedMaterials].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    );
    setMaterials((current) =>
      sorted.map((loaded) => {
        const local = current.find((item) => item.id === loaded.id);
        if (!local) return loaded;
        const isDirty =
          local.title !== loaded.title ||
          local.content !== loaded.content ||
          local.storageId !== loaded.storageId;
        if (!isDirty) return loaded;
        return {
          ...loaded,
          title: local.title,
          content: local.content,
          storageId: local.storageId,
        };
      }),
    );
  }, [loadedMaterials]);

  const invalidate = React.useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ["curriculum-lesson-materials", lessonId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["curriculum-lessons", moduleId],
    });
  }, [lessonId, moduleId, queryClient]);

  const { mutate: createMaterial } = useMutation({
    mutationFn: (dto: CreateCurriculumMaterialDto) =>
      api.createMaterial(lessonId, dto),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
  });

  const { mutate: updateMaterial } = useMutation({
    mutationFn: ({
      materialId,
      dto,
    }: {
      materialId: string;
      dto: UpdateCurriculumMaterialDto;
    }) => api.updateMaterial(materialId, dto),
    onMutate: ({ materialId }) => {
      setSavingId(materialId);
    },
    onSuccess: () => {
      toast.success(tCommon("commands.saved", "Saved successfully"));
      invalidate();
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(errorMessage(error, tCommon("errors.saveFailed")));
    },
    onSettled: () => {
      setSavingId(null);
    },
  });

  const { mutate: updateMaterialOrder } = useMutation({
    mutationFn: (updates: { id: string; sortOrder: number }[]) =>
      api.reorderMaterials(updates),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      toast.error(tCommon("errors.saveFailed", "Failed to update order"));
    },
  });

  const { mutate: deleteMaterialMutation, isPending: isDeletionPending } =
    useMutation({
      mutationFn: (materialId: string) => api.removeMaterial(materialId),
      onSuccess: () => {
        invalidate();
        toast.success(tCommon("commands.deleted", "Deleted successfully"));
      },
      onError: () => {
        toast.error(tCommon("errors.deleteFailed", "Failed to delete"));
      },
    });

  const {
    deleteCurriculumLessonMaterialDialog,
    openDeleteCurriculumLessonMaterialDialog,
  } = useCurriculumLessonMaterialDeleteDialog({
    representation: materialToDelete?.title,
    deleteMaterial: () => {
      if (materialToDelete) {
        deleteMaterialMutation(materialToDelete.id);
      }
    },
    isDeletionPending,
    resetMaterial: () => setMaterialToDelete(null),
  });

  const defaultTitle = (type: MaterialType) => {
    if (type === MaterialType.Text) return t("materialEditor", "Editor");
    if (type === MaterialType.Video) return t("materialVideo", "Video");
    if (type === MaterialType.Audio)
      return t("materialAudio", "Voice recording");
    if (type === MaterialType.Table) return t("materialTable", "Table");
    return t("editor.newMaterial", "New material");
  };

  const addMaterial = (type: MaterialType) => {
    createMaterial({
      title: defaultTitle(type),
      type,
      content:
        type === MaterialType.Table
          ? stringifyMaterialTable(emptyMaterialTable())
          : undefined,
      sortOrder: materials.length,
    });
  };

  const dndService = useDnDService<ResponseCurriculumLessonMaterialDto>({
    items: materials,
    setItems: setMaterials,
    getId: (item) => item.id,
    renderChild: (item) => (
      <CurriculumLessonMaterialItem
        className="rounded-xl mb-2"
        material={item}
        original={loadedMaterials.find((loaded) => loaded.id === item.id)}
        disabled={disabled}
        isSaving={savingId === item.id}
        onChange={(patch) =>
          setMaterials((current) =>
            current.map((material) =>
              material.id === item.id ? { ...material, ...patch } : material,
            ),
          )
        }
        onSave={(dto) => updateMaterial({ materialId: item.id, dto })}
        onDelete={() => {
          setMaterialToDelete(item);
          openDeleteCurriculumLessonMaterialDialog();
        }}
      />
    ),
    createNewItem: () => addMaterial(MaterialType.Text),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEndWrapper = (event: DragEndEvent) => {
    const { active, over } = event;
    if (disabled || !over || active.id === over.id) return;

    const oldIndex = materials.findIndex(
      (material) => material.id === active.id,
    );
    const newIndex = materials.findIndex((material) => material.id === over.id);

    dndService.handleDragEnd(event);

    const next = arrayMove(materials, oldIndex, newIndex);
    const updates = next.map((material, index) => ({
      id: material.id,
      sortOrder: index,
    }));
    if (updates.length > 0) {
      updateMaterialOrder(updates);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        {t("viewer.loading", "Loading...")}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {t("editor.materials", "Materials")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              "materialsDescription",
              "Add and reorder the content blocks for this lesson.",
            )}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
              <span>{t("editor.addMaterial")}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {MATERIAL_BLOCKS.map((block) => {
              const Icon = block.icon;
              return (
                <DropdownMenuItem
                  key={block.type}
                  onSelect={() => addMaterial(block.type)}
                >
                  <Icon className="h-4 w-4" />
                  {t(block.labelKey, defaultTitle(block.type))}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndWrapper}
      >
        <SortableContext
          items={materials.map((material) => material.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {dndService.items.map((item) => (
              <React.Fragment key={item.id}>{item.child}</React.Fragment>
            ))}
            {dndService.items.length === 0 && (
              <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                {t(
                  "noMaterials",
                  "No materials yet. Add an editor, video, recording, or table.",
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {deleteCurriculumLessonMaterialDialog}
    </div>
  );
};
