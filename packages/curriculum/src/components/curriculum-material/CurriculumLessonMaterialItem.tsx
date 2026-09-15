import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Clapperboard,
  FileText,
  GripVertical,
  Loader2,
  Mic,
  Save,
  Table2,
  X,
} from "lucide-react";
import { FieldBuilder, FieldVariant } from "@qlp/form-builder";
import {
  MaterialType,
  type ResponseCurriculumLessonMaterialDto,
  type UpdateCurriculumMaterialDto,
} from "@qlp/api-client";
import { Button, Input, cn } from "@qlp/ui";
import { useTranslation } from "react-i18next";
import { MaterialMediaField } from "./MaterialMediaField";
import { MaterialTableEditor } from "./MaterialTableEditor";
import {
  stringifyMaterialTable,
  emptyMaterialTable,
} from "../../utils/material-table";

export interface CurriculumLessonMaterialItemProps {
  className?: string;
  material: ResponseCurriculumLessonMaterialDto;
  original?: ResponseCurriculumLessonMaterialDto;
  disabled?: boolean;
  isSaving?: boolean;
  onChange: (patch: Partial<ResponseCurriculumLessonMaterialDto>) => void;
  onSave: (dto: UpdateCurriculumMaterialDto) => void;
  onDelete: () => void;
}

function materialIcon(type?: string) {
  if (type === MaterialType.Video) return Clapperboard;
  if (type === MaterialType.Audio) return Mic;
  if (type === MaterialType.Table) return Table2;
  return FileText;
}

export const CurriculumLessonMaterialItem = ({
  className,
  material,
  original,
  disabled,
  isSaving,
  onChange,
  onSave,
  onDelete,
}: CurriculumLessonMaterialItemProps) => {
  const { t } = useTranslation("curriculum");
  const { t: tCommon } = useTranslation("common");
  const Icon = materialIcon(material.type);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: material.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const isDirty =
    material.title !== original?.title ||
    material.content !== original?.content ||
    material.storageId !== original?.storageId;

  const save = () => {
    onSave({
      title: material.title,
      content: material.content,
      storageId: material.storageId,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-3 p-3 bg-background border hover:border-primary/50 transition-colors",
        isDragging && "shadow-lg border-primary",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "cursor-grab rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing",
            disabled && "pointer-events-none opacity-50",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <Input
          value={material.title}
          disabled={disabled}
          className="h-8 flex-1"
          placeholder={t("fields.titlePlaceholder")}
          onChange={(event) => onChange({ title: event.target.value })}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 shrink-0"
          disabled={disabled || !isDirty || isSaving}
          onClick={save}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{tCommon("commands.save", "Save")}</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={disabled}
          onClick={onDelete}
          title={tCommon("commands.delete", "Delete")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">
            {tCommon("commands.delete", "Delete")}
          </span>
        </Button>
      </div>

      <div className="ps-9">
        {material.type === MaterialType.Video ? (
          <MaterialMediaField
            kind="video"
            storageId={material.storageId}
            disabled={disabled}
            onUploaded={({ storageId, filename }) => {
              onChange({ storageId, title: material.title || filename });
              onSave({
                storageId,
                title: material.title || filename,
                content: material.content,
              });
            }}
          />
        ) : material.type === MaterialType.Audio ? (
          <MaterialMediaField
            kind="audio"
            storageId={material.storageId}
            disabled={disabled}
            onUploaded={({ storageId, filename }) => {
              onChange({ storageId, title: material.title || filename });
              onSave({
                storageId,
                title: material.title || filename,
                content: material.content,
              });
            }}
          />
        ) : material.type === MaterialType.Table ? (
          <MaterialTableEditor
            content={
              material.content || stringifyMaterialTable(emptyMaterialTable())
            }
            disabled={disabled}
            onChange={(content) => onChange({ content })}
          />
        ) : (
          <FieldBuilder
            field={{
              id: `material-editor-${material.id}`,
              variant: FieldVariant.EDITOR,
              placeholder: t("fields.contentPlaceholder"),
              props: {
                height: 220,
                disabled,
                value: material.content || "",
                onChange: (value: string) => onChange({ content: value }),
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
