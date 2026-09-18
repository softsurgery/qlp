import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Edit2 } from "lucide-react";
import {
  Card,
  Button,
  Badge,
  cn,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@qlp/ui";
import { type ResponseCurriculumModuleDto } from "@qlp/api-client";
import { useTranslation } from "react-i18next";
import { identifyUser, identifyUserAvatar } from "@qlp/lib";
import { useUploadSrc } from "@qlp/hooks";
import { useApp } from "@qlp/contexts";

export interface CurriculumModuleItemProps {
  module: ResponseCurriculumModuleDto;
  onEdit?: (module: ResponseCurriculumModuleDto) => void;
  onDelete?: (module: ResponseCurriculumModuleDto) => void;
  className?: string;
}

export function CurriculumModuleItem({
  module,
  onEdit,
  onDelete,
  className,
}: CurriculumModuleItemProps) {
  const { api: baseApi } = useApp();
  const { t: tGlobal } = useTranslation("global");

  const createdBy = module.createdBy;
  const { data: createdByAvatarSrc } = useUploadSrc(
    baseApi.upload
      ? (createdBy?.picture ??
          (createdBy?.pictureId ? { id: createdBy?.pictureId } : null))
      : null,
    baseApi.upload,
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-row items-center p-3 mb-2 gap-3 group bg-background border hover:border-primary/50 transition-colors",
        isDragging && "shadow-lg border-primary",
        className,
      )}
    >
      <div
        className="cursor-grab active:cursor-grabbing text-muted-foreground p-1 rounded hover:bg-muted"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex flex-col flex-1 gap-2">
        <div className="flex-1 flex flex-col min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg truncate">{module.title}</h4>
            <Badge className="uppercase font-semibold">
              <span className="text-xs">{module.status || "draft"}</span>
            </Badge>
          </div>
          {module.description && (
            <div
              className="line-clamp-2 text-sm text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: module.description }}
            />
          )}
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit?.(module)}
          title={tGlobal("commands.edit")}
        >
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete?.(module)}
          title={tGlobal("commands.delete")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </Card>
  );
}
