import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, cn, useDialog } from "@qlp/ui";
import { FormBuilder } from "@qlp/form-builder";
import { ExamQuestionType, type ExamQuestion } from "@qlp/api-client";
import { GripVertical, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChoiceQuestionEditor } from "./ChoiceQuestionEditor";
import { TextareaQuestionEditor } from "./TextareaQuestionEditor";
import { SliderQuestionEditor } from "./SliderQuestionEditor";
import { useQuestionItemFormStructure } from "./forms/useQuestionItemFormStructure";

export interface SortableQuestionCardProps {
  question: ExamQuestion;
  index: number;
  totalQuestions: number;
  disabled?: boolean;
  onUpdate: (patch: Partial<ExamQuestion>) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onUpdateOption: (optionIndex: number, value: string) => void;
  onRemoveOption: (optionIndex: number) => void;
  onToggleMultiChoiceAnswer: (optionValue: string) => void;
  className?: string;
}

export const SortableQuestionCard: React.FC<SortableQuestionCardProps> = ({
  question,
  index,
  disabled,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onToggleMultiChoiceAnswer,
  className,
}) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const { t: tGlobal } = useTranslation("global");
  const itemId = question.id || `question-${index}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const isSingleChoice = question.type === ExamQuestionType.SingleChoice;
  const isMultiChoice = question.type === ExamQuestionType.MultipleChoice;
  const isTextarea = question.type === ExamQuestionType.Textarea;
  const isSlider = question.type === ExamQuestionType.Slider;

  const { questionFormStructure } = useQuestionItemFormStructure({
    question,
    itemId,
    disabled,
    onUpdate,
  });

  const {
    DialogFragment: deleteQuestionDialog,
    openDialog: openDeleteQuestionDialog,
    closeDialog: closeDeleteQuestionDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tCommon("dialogs.deleteQuestion.title", {
          n: index + 1,
          defaultValue: `Delete Question Q${index + 1}`,
        })}
      </div>
    ),
    description: tCommon("dialogs.deleteQuestion.description", {
      defaultValue:
        "Are you sure you want to delete this question? This action cannot be undone.",
    }),
    children: (
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => closeDeleteQuestionDialog()}
        >
          {tGlobal("commands.cancel", { defaultValue: "Cancel" })}
        </Button>
        <Button
          type="button"
          onClick={() => {
            onRemove();
            closeDeleteQuestionDialog();
          }}
        >
          {tGlobal("commands.delete", { defaultValue: "Delete" })}
        </Button>
      </div>
    ),
    className: "w-[450px]",
  });

  return (
    <>
      <Card
        id={`question-card-${itemId}`}
        ref={setNodeRef}
        style={style}
        className={cn(
          "p-4 flex flex-col gap-4 relative bg-background border hover:border-primary/50 transition-colors",
          isDragging && "shadow-lg border-primary",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <div
              className="cursor-grab active:cursor-grabbing text-muted-foreground p-1 rounded hover:bg-muted transition-colors"
              {...attributes}
              {...listeners}
              title={tCommon("editor.dragToReorder", {
                defaultValue: "Drag to reorder",
              })}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <p className="font-semibold">
              {tCommon("editor.questionN", {
                n: index + 1,
                defaultValue: `Q${index + 1}`,
              })}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={openDeleteQuestionDialog}
              disabled={disabled}
              title={tCommon("editor.deleteQuestion", {
                defaultValue: "Delete Question",
              })}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Fields FormBuilder */}
        <FormBuilder structure={questionFormStructure} />

        {/* Type Specific Controls */}
        {(isSingleChoice || isMultiChoice) && (
          <ChoiceQuestionEditor
            question={question}
            index={index}
            disabled={disabled}
            onAddOption={onAddOption}
            onUpdateOption={onUpdateOption}
            onRemoveOption={onRemoveOption}
            onToggleMultiChoiceAnswer={onToggleMultiChoiceAnswer}
            onUpdateAnswer={(answer) => onUpdate({ answer })}
          />
        )}

        {isTextarea && (
          <TextareaQuestionEditor
            question={question}
            disabled={disabled}
            onUpdateAnswer={(answer) => onUpdate({ answer })}
          />
        )}

        {isSlider && (
          <SliderQuestionEditor
            question={question}
            disabled={disabled}
            onUpdate={onUpdate}
          />
        )}
      </Card>
      {deleteQuestionDialog}
    </>
  );
};
