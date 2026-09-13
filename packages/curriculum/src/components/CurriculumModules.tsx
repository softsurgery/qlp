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
import { type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { CurriculumModuleItem } from "./CurriculumModuleItem";
import { CreateCurriculumModuleForm } from "./curriculum-module/forms/CreateCurriculumModuleForm";
import { useSheet } from "@qlp/ui";
import { toast } from "sonner";
import { useCurriculum } from "../hooks";

export interface CurriculumModulesProps {
  className?: string;
  curriculumId: string;
}

export function CurriculumModules({
  className,
  curriculumId,
}: CurriculumModulesProps) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("curriculum");
  const { api: baseApi, appType } = useApp();
  const api =
    appType === "admin" ? baseApi.adminCurriculum : baseApi.curriculum;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { curriculum: treeData, isCurriculumPending: isLoading } =
    useCurriculum({ id: curriculumId, join: "owner,createdBy" });

  const [modules, setModules] = React.useState<ResponseCurriculumModuleDto[]>(
    [],
  );

  const {
    SheetFragment: CreateModuleSheet,
    openSheet: openCreateModuleSheet,
    closeSheet: closeCreateModuleSheet,
  } = useSheet({
    title: t("createModule", "Create Module"),
    className: "flex flex-col sm:max-w-[70vw] p-0 overflow-hidden h-full",
    children: (
      <div className="flex-1 overflow-hidden p-6 pt-2">
        <CreateCurriculumModuleForm
          curriculumId={curriculumId}
          onSuccess={() => closeCreateModuleSheet()}
          onCancel={() => closeCreateModuleSheet()}
        />
      </div>
    ),
  });

  React.useEffect(() => {
    if (treeData?.modules) {
      const sorted = [...treeData.modules].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
      );
      setModules(sorted);
    }
  }, [treeData?.modules]);

  const { mutate: updateModuleOrder } = useMutation({
    mutationFn: async (updates: { id: string; sortOrder: number }[]) => {
      return api.reorderModules(updates);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["curriculum", curriculumId, "tree"],
      });
    },
    onError: () => {
      toast.error(tCommon("errors.saveFailed", "Failed to update order"));
    },
  });

  const { mutate: deleteModuleMutation } = useMutation({
    mutationFn: async (moduleId: string) => {
      return api.removeModule(moduleId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["curriculum", curriculumId, "tree"],
      });
      toast.success(tCommon("commands.deleted", "Deleted successfully"));
    },
    onError: () => {
      toast.error(tCommon("errors.deleteFailed", "Failed to delete module"));
    },
  });

  const dndService = useDnDService<ResponseCurriculumModuleDto>({
    items: modules,
    setItems: setModules,
    getId: (item) => item.id,
    renderChild: (item) => (
      <CurriculumModuleItem
        module={item}
        onEdit={() =>
          navigate(`/curriculum/${curriculumId}/modules/${item.id}/edit`)
        }
        onDelete={(m) => {
          if (confirm("Are you sure you want to delete this module?")) {
            deleteModuleMutation(m.id);
          }
        }}
      />
    ),
    createNewItem: () => {
      openCreateModuleSheet();
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
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      dndService.handleDragEnd(event);

      const newModules = arrayMove(modules, oldIndex, newIndex);

      const updates = newModules.map((mod, index) => ({
        id: mod.id,
        sortOrder: index,
      }));

      if (updates.length > 0) {
        updateModuleOrder(updates);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center p-6 text-sm text-muted-foreground">
        Loading modules...
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{t("modules", "Modules")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("modulesDescription", "Manage the modules for this curriculum.")}
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
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {dndService.items.map((item) => (
              <React.Fragment key={item.id}>{item.child}</React.Fragment>
            ))}
            {dndService.items.length === 0 && (
              <div className="text-muted-foreground text-sm py-8 text-center border rounded-lg border-dashed">
                {t("noModules", "No modules found. Create one to get started.")}
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {CreateModuleSheet}
    </div>
  );
}
