import React from "react";
import {
  Button,
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@qlp/ui";
import { ExamQuestionType, type ExamQuestion } from "@qlp/api-client";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ChoiceQuestionEditorProps {
  question: ExamQuestion;
  index: number;
  disabled?: boolean;
  onAddOption: () => void;
  onUpdateOption: (optionIndex: number, value: string) => void;
  onRemoveOption: (optionIndex: number) => void;
  onToggleMultiChoiceAnswer: (optionValue: string) => void;
  onUpdateAnswer: (answer: string) => void;
}

export const ChoiceQuestionEditor: React.FC<ChoiceQuestionEditorProps> = ({
  question,
  index,
  disabled,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onToggleMultiChoiceAnswer,
  onUpdateAnswer,
}) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const isSingleChoice = question.type === ExamQuestionType.SingleChoice;

  return (
    <div className="flex flex-col gap-2 mt-2 bg-muted/30 p-3 rounded-md border border-border">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground">
          {isSingleChoice
            ? tCommon("editor.optionsSingleChoice", {
                defaultValue: "Options (Select correct option)",
              })
            : tCommon("editor.optionsMultiChoice", {
                defaultValue: "Options (Check correct option(s))",
              })}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAddOption}
          disabled={disabled}
          className="h-7 text-xs gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>
            {tCommon("editor.addOption", { defaultValue: "Add Option" })}
          </span>
        </Button>
      </div>

      {isSingleChoice ? (
        <RadioGroup
          value={question.answer || ""}
          onValueChange={onUpdateAnswer}
          className="flex flex-col gap-2"
        >
          {(question.options || []).map((opt, optIndex) => (
            <div key={optIndex} className="flex items-center gap-2">
              <RadioGroupItem
                value={opt}
                id={`q-${index}-opt-${optIndex}`}
                disabled={disabled}
              />
              <Input
                value={opt}
                onChange={(e) => onUpdateOption(optIndex, e.target.value)}
                placeholder={tCommon("editor.optionPlaceholder", {
                  index: optIndex + 1,
                  defaultValue: `Option ${optIndex + 1}`,
                })}
                disabled={disabled}
                className="flex-1 h-8 text-sm bg-background"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onRemoveOption(optIndex)}
                disabled={disabled || (question.options || []).length <= 1}
                title={tCommon("editor.deleteOption")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt, optIndex) => {
            const selectedAnswers = question.answer
              ? question.answer.split(",").map((s) => s.trim())
              : [];
            const isChecked = selectedAnswers.includes(opt);

            return (
              <div key={optIndex} className="flex items-center gap-2">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => onToggleMultiChoiceAnswer(opt)}
                  disabled={disabled}
                />
                <Input
                  value={opt}
                  onChange={(e) => onUpdateOption(optIndex, e.target.value)}
                  placeholder={tCommon("editor.optionPlaceholder", {
                    index: optIndex + 1,
                    defaultValue: `Option ${optIndex + 1}`,
                  })}
                  disabled={disabled}
                  className="flex-1 h-8 text-sm bg-background"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveOption(optIndex)}
                  disabled={disabled || (question.options || []).length <= 1}
                  title={tCommon("editor.deleteOption")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
