import React from "react";
import { Spinner } from "@qlp/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import { useApp } from "@qlp/contexts";
import { useDnDService, useQueryReorder } from "@qlp/hooks";
import { Button, cn } from "@qlp/ui";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { CurriculumModuleItem } from "./CurriculumModuleItem";
import { toast } from "sonner";
import { useCurriculumModules } from "../../hooks";
import { useCurriculumModuleStore } from "../../hooks/stores/useCurriculumModuleStore";
import { useCurriculumModuleCreateSheet } from "./modals/CurriculumModuleCreateSheet";
import { useCurriculumModuleDeleteDialog } from "./modals/CurriculumModuleDeleteDialog";

export interface CurriculumModulesProps {
  className?: string;
  curriculumId: string;
}

export function CurriculumModules({
  className,
  curriculumId,
}: CurriculumModulesProps) {
  const { t: tCommon } = useTranslation("curriculum-common");
    const { t: tGlobal } = useTranslation("global");
  const { t: tModule } = useTranslation("curriculum-module");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin"
      ? baseApi.adminCurriculumModules
      : baseApi.curriculumModules;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { modules: loadedModules, isModulesPending: isLoading } =
    useCurriculumModules({ id: curriculumId, join: "createdBy" });

  const [modules, setModules] = React.useState<ResponseCurriculumModuleDto[]>(
    [],
  );

  const { createCurriculumModuleSheet, openCreateCurriculumModuleSheet } =
    useCurriculumModuleCreateSheet({ curriculumId });
  const curriculumModuleStore = useCurriculumModuleStore();

  React.useEffect(() => {
    const sorted = [...loadedModules].sort(
      (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
    );
    setModules(sorted);
  }, [loadedModules]);

  const { handleReorder } = useQueryReorder<ResponseCurriculumModuleDto>({
    queryKey: ["curriculum-modules", curriculumId],
    reorderFn: (updates) => api.reorder(updates),
    errorMessage: tCommon("errors.saveFailed"),
  });

  const { mutate: deleteModuleMutation, isPending: isDeletionPending } =
    useMutation({
      mutationFn: async (moduleId: string) => {
        return api.remove(moduleId);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["curriculum-modules", curriculumId],
        });
        toast.success(tGlobal("commands.deleted"));
      },
      onError: () => {
        toast.error(tCommon("errors.deleteFailed"));
      },
    });

  const { deleteCurriculumModuleDialog, openDeleteCurriculumModuleDialog } =
    useCurriculumModuleDeleteDialog({
      representation: curriculumModuleStore.response?.title,
      deleteModule: () => {
        if (curriculumModuleStore.response) {
          deleteModuleMutation(curriculumModuleStore.response.id);
        }
      },
      isDeletionPending,
      resetModule: () => curriculumModuleStore.set("response", undefined),
    });

  const dndService = useDnDService<ResponseCurriculumModuleDto>({
    items: modules,
    setItems: setModules,
    getId: (item) => item.id,
    onReorder: handleReorder,
    renderChild: (item, _, { isFirst, isLast, moveUp, moveDown }) => (
      <CurriculumModuleItem
        module={item}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
        onEdit={() =>
          navigate(`/curriculum/${curriculumId}/modules/${item.id}/edit`)
        }
        onDelete={(m) => {
          curriculumModuleStore.set("response", m);
          openDeleteCurriculumModuleDialog();
        }}
      />
    ),
    createNewItem: () => {
      openCreateCurriculumModuleSheet();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
          <h3 className="text-lg font-semibold">{tModule("modules")}</h3>
          <p className="text-sm text-muted-foreground">
            {tModule("modulesDescription")}
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
        onDragEnd={dndService.handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {dndService.items.map((item) => (
              <React.Fragment key={item.id}>{item.child}</React.Fragment>
            ))}
            {dndService.items.length === 0 && (
              <div className="text-muted-foreground text-sm py-8 text-center border rounded-lg border-dashed">
                {tModule("noModules")}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {createCurriculumModuleSheet}
      {deleteCurriculumModuleDialog}
    </div>
  );
}
