import React from "react";
import { Spinner } from "@qlp/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  ChevronDown,
  Clapperboard,
  File,
  FileText,
  Mic,
  Plus,
  Table2,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { emptyExcelEditor, stringifyExcelEditor } from "@qlp/components";
import { useApp } from "@qlp/contexts";
import { useDnDService, useQueryReorder } from "@qlp/hooks";
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
  {
    type: MaterialType.Document,
    icon: File,
    labelKey: "materialDocument" as const,
  },
];

export const CurriculumLessonMaterials = ({
  className,
  lessonId,
  moduleId,
  disabled,
}: CurriculumLessonMaterialsProps) => {
  const { t: tMaterial } = useTranslation("curriculum-material");
  const { t: tCommon } = useTranslation("curriculum-common");
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
  const [addedMaterialId, setAddedMaterialId] = React.useState<string | null>(
    null,
  );

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

  React.useEffect(() => {
    if (addedMaterialId && materials.some((m) => m.id === addedMaterialId)) {
      setTimeout(() => {
        const element = document.getElementById(`material-${addedMaterialId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
      setAddedMaterialId(null);
    }
  }, [addedMaterialId, materials]);

  const invalidate = React.useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ["curriculum-lesson-materials", lessonId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["curriculum-lessons", moduleId],
    });
  }, [lessonId, moduleId, queryClient]);

  const { mutate: createMaterial, mutateAsync: createMaterialAsync } =
    useMutation({
      mutationFn: (dto: CreateCurriculumMaterialDto) =>
        api.createMaterial(lessonId, dto),
      onSuccess: (data) => {
        invalidate();
        setAddedMaterialId(data.id);
      },
      onError: (error: ServerErrorResponse) => {
        toast.error(errorMessage(error, tCommon("errors.saveFailed")));
      },
    });

  const batchUploadInputRef = React.useRef<HTMLInputElement>(null);
  const [isBatchUploading, setIsBatchUploading] = React.useState(false);

  const handleBatchUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !baseApi.upload) return;

    setIsBatchUploading(true);
    const filesArray = Array.from(files);

    // Clear input
    event.target.value = "";

    try {
      const uploads = await baseApi.upload.uploadFiles(
        filesArray,
        undefined,
        false,
      );

      const promises = uploads.map((upload: any, index: number) => {
        if (!upload) return Promise.resolve();
        const file = filesArray[index];
        let type = MaterialType.Document;
        if (file.type.startsWith("video/")) type = MaterialType.Video;
        else if (file.type.startsWith("audio/")) type = MaterialType.Audio;

        return createMaterialAsync({
          title: file.name,
          type,
          storageId: upload.id,
          sortOrder: materials.length + index,
        });
      });

      const results = await Promise.all(promises);
      const validResults = results.filter(Boolean);
      const lastCreated = validResults[validResults.length - 1];
      if (lastCreated) {
        setAddedMaterialId(lastCreated.id);
      }

      toast.success(tCommon("commands.saved", "Saved successfully"));
      invalidate();
    } catch (error) {
      toast.error(tCommon("errors.saveFailed", "Failed to upload file"));
    } finally {
      setIsBatchUploading(false);
    }
  };

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

  const { handleReorder } =
    useQueryReorder<ResponseCurriculumLessonMaterialDto>({
      queryKey: ["curriculum-materials", lessonId],
      reorderFn: (updates) => api.reorderMaterials(updates),
      errorMessage: tCommon("errors.saveFailed", "Failed to update order"),
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
    if (type === MaterialType.Text) return tMaterial("materialEditor");
    if (type === MaterialType.Video) return tMaterial("materialVideo");
    if (type === MaterialType.Audio) return tMaterial("materialAudio");
    if (type === MaterialType.Table) return tMaterial("materialTable");
    if (type === MaterialType.Document) return tMaterial("materialDocument");
    return tCommon("editor.newMaterial");
  };

  const addMaterial = (type: MaterialType) => {
    createMaterial({
      title: defaultTitle(type),
      type,
      content:
        type === MaterialType.Table
          ? stringifyExcelEditor(emptyExcelEditor())
          : undefined,
      sortOrder: materials.length,
    });
  };

  const dndService = useDnDService<ResponseCurriculumLessonMaterialDto>({
    items: materials,
    setItems: setMaterials,
    getId: (item) => item.id,
    onReorder: handleReorder,
    renderChild: (item, _, { isFirst, isLast, moveUp, moveDown }) => (
      <CurriculumLessonMaterialItem
        className="rounded-xl mb-2"
        material={item}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
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

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {tCommon("editor.materials")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tMaterial("materialsDescription")}
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
              <span>{tCommon("editor.addMaterial")}</span>
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
                  {tMaterial(block.labelKey)}
                </DropdownMenuItem>
              );
            })}
            {baseApi.upload && (
              <DropdownMenuItem
                onSelect={() => batchUploadInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                {tMaterial("materialBatchUpload")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={dndService.handleDragEnd}
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
                {tMaterial("noMaterials")}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={batchUploadInputRef}
        type="file"
        multiple
        className="hidden"
        disabled={disabled || isBatchUploading}
        onChange={handleBatchUpload}
      />

      {deleteCurriculumLessonMaterialDialog}
    </div>
  );
};
