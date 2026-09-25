import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Clapperboard,
  FileText,
  GripVertical,
  Mic,
  Save,
  Table2,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Spinner } from "@qlp/components";
import { FieldBuilder, FieldVariant } from "@qlp/form-builder";
import {
  MaterialType,
  type ResponseCurriculumLessonMaterialDto,
  type UpdateCurriculumMaterialDto,
} from "@qlp/api-client";
import {
  ExcelEditor,
  emptyExcelEditor,
  stringifyExcelEditor,
} from "@qlp/components";
import { Button, Input, cn } from "@qlp/ui";
import { useTranslation } from "react-i18next";
import { MaterialMediaField } from "./MaterialMediaField";
import { MaterialFileField } from "./MaterialFileField";

export interface CurriculumLessonMaterialItemProps {
  className?: string;
  material: ResponseCurriculumLessonMaterialDto;
  original?: ResponseCurriculumLessonMaterialDto;
  disabled?: boolean;
  isSaving?: boolean;
  onChange: (patch: Partial<ResponseCurriculumLessonMaterialDto>) => void;
  onSave: (dto: UpdateCurriculumMaterialDto) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
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
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: CurriculumLessonMaterialItemProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
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
      id={`material-${material.id}`}
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-3 p-3 bg-background border hover:border-primary/50 transition-all duration-300 ease-in-out",
        isDragging && "shadow-lg border-primary z-20 scale-[1.01]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
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
          <div className="flex flex-col gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 transition-all active:scale-75"
              disabled={isFirst || disabled}
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp?.();
              }}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 transition-all active:scale-75"
              disabled={isLast || disabled}
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown?.();
              }}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <Input
          value={material.title}
          disabled={disabled}
          className="h-8 flex-1"
          placeholder={tCommon("fields.titlePlaceholder")}
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
            <Spinner size="small" />
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
          <ExcelEditor
            key={material.id}
            content={
              material.content || stringifyExcelEditor(emptyExcelEditor())
            }
            disabled={disabled}
            onChange={(content) => onChange({ content })}
            enableFragmentation
          />
        ) : material.type === MaterialType.Document ? (
          <MaterialFileField
            storageId={material.storageId}
            storage={material.storage}
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
        ) : (
          <FieldBuilder
            field={{
              id: `material-editor-${material.id}`,
              variant: FieldVariant.EDITOR,
              placeholder: tCommon("fields.contentPlaceholder"),
              props: {
                autoHeight: true,
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
