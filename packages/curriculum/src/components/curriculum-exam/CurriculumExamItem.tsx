import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Edit2, Clock, HelpCircle } from "lucide-react";
import { Card, Button, Badge, cn } from "@qlp/ui";
import { type ResponseCurriculumExamDto } from "@qlp/api-client";
import { useTranslation } from "react-i18next";

export interface CurriculumExamItemProps {
  exam: ResponseCurriculumExamDto;
  onEdit?: (exam: ResponseCurriculumExamDto) => void;
  onDelete?: (exam: ResponseCurriculumExamDto) => void;
  className?: string;
}

export function CurriculumExamItem({
  exam,
  onEdit,
  onDelete,
  className,
}: CurriculumExamItemProps) {
  const { t: tGlobal } = useTranslation("global");
  const { t: tCommon } = useTranslation("curriculum-common");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exam.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const questionCount = exam.questions?.length || 0;

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

      <div className="flex flex-col flex-1 gap-1">
        <div className="flex-1 flex flex-col min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg truncate">{exam.title}</h4>
            <Badge className="uppercase font-semibold">
              <span className="text-xs">{exam.status || "draft"}</span>
            </Badge>
          </div>
          {exam.description && (
            <div
              className="line-clamp-1 text-sm text-muted-foreground mt-1"
              dangerouslySetInnerHTML={{ __html: exam.description }}
            />
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            {tCommon("viewer.questions", { count: questionCount })}
          </span>
          {exam.durationMinutes ? (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tCommon("viewer.duration", { minutes: exam.durationMinutes })}
            </span>
          ) : null}
          {exam.passingScore != null ? (
            <span>
              {tCommon("viewer.passing", { score: exam.passingScore })}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit?.(exam)}
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
          onClick={() => onDelete?.(exam)}
          title={tGlobal("commands.delete")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </Card>
  );
}
