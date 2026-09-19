import React from "react";
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
import { Button } from "@qlp/ui";
import { ExamQuestionType, type ExamQuestion } from "@qlp/api-client";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SortableQuestionCard } from "./SortableQuestionCard";

export interface CurriculumExamQuestionEditorProps {
  questions: ExamQuestion[];
  onChange: (questions: ExamQuestion[]) => void;
  disabled?: boolean;
}

export const CurriculumExamQuestionEditor = ({
  questions,
  onChange,
  disabled = false,
}: CurriculumExamQuestionEditorProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const addedQuestionIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (addedQuestionIdRef.current) {
      const targetId = addedQuestionIdRef.current;
      addedQuestionIdRef.current = null;

      setTimeout(() => {
        const el = document.getElementById(`question-card-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          const promptInput = el.querySelector<
            HTMLInputElement | HTMLTextAreaElement
          >("input, textarea");
          if (promptInput) {
            promptInput.focus();
          }
        }
      }, 50);
    }
  }, [questions]);

  const items = React.useMemo(() => {
    return questions.map((q, idx) => ({
      ...q,
      id: q.id || `q-${idx}`,
    }));
  }, [questions]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleAddQuestion = () => {
    const newId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    addedQuestionIdRef.current = newId;

    const defaultOpt1 = tCommon("editor.optionPlaceholder", {
      index: 1,
      defaultValue: "Option 1",
    });
    const defaultOpt2 = tCommon("editor.optionPlaceholder", {
      index: 2,
      defaultValue: "Option 2",
    });

    const newQuestion: ExamQuestion = {
      id: newId,
      prompt: "",
      type: ExamQuestionType.SingleChoice,
      options: [defaultOpt1, defaultOpt2],
      answer: defaultOpt1,
      points: 1,
    };
    const currentQuestions = questions ? [...questions] : [];
    onChange([...currentQuestions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateQuestion = (
    index: number,
    patch: Partial<ExamQuestion>,
  ) => {
    const updated = items.map((q, i) => {
      if (i !== index) return q;

      const newQuestion = { ...q, ...patch };

      if (patch.type && patch.type !== q.type) {
        if (
          patch.type === ExamQuestionType.SingleChoice ||
          patch.type === ExamQuestionType.MultipleChoice
        ) {
          const defaultOpt1 = tCommon("editor.optionPlaceholder", {
            index: 1,
            defaultValue: "Option 1",
          });
          const defaultOpt2 = tCommon("editor.optionPlaceholder", {
            index: 2,
            defaultValue: "Option 2",
          });
          newQuestion.options = q.options?.length
            ? q.options
            : [defaultOpt1, defaultOpt2];
          newQuestion.answer = newQuestion.options[0] || "";
        } else if (patch.type === ExamQuestionType.Slider) {
          newQuestion.min = q.min ?? 0;
          newQuestion.max = q.max ?? 100;
          newQuestion.step = q.step ?? 1;
          newQuestion.answer = String(newQuestion.min);
        } else if (patch.type === ExamQuestionType.Textarea) {
          newQuestion.answer = "";
        }
      }

      return newQuestion;
    });
    onChange(updated);
  };

  const handleAddOption = (questionIndex: number) => {
    const q = items[questionIndex];
    const currentOptions = q.options || [];
    const newOptionName = tCommon("editor.optionPlaceholder", {
      index: currentOptions.length + 1,
      defaultValue: `Option ${currentOptions.length + 1}`,
    });
    const newOptions = [...currentOptions, newOptionName];
    handleUpdateQuestion(questionIndex, { options: newOptions });
  };

  const handleUpdateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const q = items[questionIndex];
    const currentOptions = [...(q.options || [])];
    const oldValue = currentOptions[optionIndex];
    currentOptions[optionIndex] = value;

    let newAnswer = q.answer;
    if (q.type === ExamQuestionType.SingleChoice && q.answer === oldValue) {
      newAnswer = value;
    } else if (q.type === ExamQuestionType.MultipleChoice && q.answer) {
      const selectedAnswers = q.answer.split(",").map((s) => s.trim());
      const updatedAnswers = selectedAnswers.map((ans) =>
        ans === oldValue ? value : ans,
      );
      newAnswer = updatedAnswers.join(",");
    }

    handleUpdateQuestion(questionIndex, {
      options: currentOptions,
      answer: newAnswer,
    });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const q = items[questionIndex];
    const currentOptions = [...(q.options || [])];
    const removedValue = currentOptions[optionIndex];
    currentOptions.splice(optionIndex, 1);

    let newAnswer = q.answer;
    if (q.type === ExamQuestionType.SingleChoice && q.answer === removedValue) {
      newAnswer = currentOptions[0] || "";
    } else if (q.type === ExamQuestionType.MultipleChoice && q.answer) {
      const selectedAnswers = q.answer.split(",").map((s) => s.trim());
      const updatedAnswers = selectedAnswers.filter(
        (ans) => ans !== removedValue,
      );
      newAnswer = updatedAnswers.join(",");
    }

    handleUpdateQuestion(questionIndex, {
      options: currentOptions,
      answer: newAnswer,
    });
  };

  const handleToggleMultiChoiceAnswer = (
    questionIndex: number,
    optionValue: string,
  ) => {
    const q = items[questionIndex];
    const currentAnswers = q.answer
      ? q.answer
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const hasAnswer = currentAnswers.includes(optionValue);

    let newAnswers: string[];
    if (hasAnswer) {
      newAnswers = currentAnswers.filter((ans) => ans !== optionValue);
    } else {
      newAnswers = [...currentAnswers, optionValue];
    }

    handleUpdateQuestion(questionIndex, { answer: newAnswers.join(",") });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-semibold">
            {tCommon("editor.questions", { defaultValue: "Exam Questions" })}
          </h4>
          <p className="text-xs text-muted-foreground">
            {tCommon("editor.questionsHint", {
              defaultValue: "Add and drag to reorder questions for this exam.",
            })}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddQuestion}
          disabled={disabled}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>
            {tCommon("editor.addQuestion", { defaultValue: "Add Question" })}
          </span>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground bg-muted/10">
          {tCommon("editor.noQuestions", {
            defaultValue:
              "No questions added yet. Click 'Add Question' to start.",
          })}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((q) => q.id as string)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {items.map((question, index) => (
                <SortableQuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  totalQuestions={items.length}
                  disabled={disabled}
                  onUpdate={(patch) => handleUpdateQuestion(index, patch)}
                  onRemove={() => handleRemoveQuestion(index)}
                  onAddOption={() => handleAddOption(index)}
                  onUpdateOption={(optIdx, val) =>
                    handleUpdateOption(index, optIdx, val)
                  }
                  onRemoveOption={(optIdx) => handleRemoveOption(index, optIdx)}
                  onToggleMultiChoiceAnswer={(optVal) =>
                    handleToggleMultiChoiceAnswer(index, optVal)
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
