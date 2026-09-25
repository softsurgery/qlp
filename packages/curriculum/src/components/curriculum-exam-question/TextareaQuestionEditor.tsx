import React from "react";
import { Label, Textarea } from "@qlp/ui";
import { type ExamQuestion } from "@qlp/api-client";
import { useTranslation } from "react-i18next";

export interface TextareaQuestionEditorProps {
  question: ExamQuestion;
  disabled?: boolean;
  onUpdateAnswer: (answer: string) => void;
}

export const TextareaQuestionEditor: React.FC<TextareaQuestionEditorProps> = ({
  question,
  disabled,
  onUpdateAnswer,
}) => {
  const { t: tCommon } = useTranslation("curriculum-common");

  return (
    <div className="flex flex-col gap-1.5 mt-2 bg-muted/30 p-3 rounded-md border border-border">
      <Label className="text-xs font-semibold text-muted-foreground">
        {tCommon("editor.modelAnswer", {
          defaultValue: "Model / Correct Reference Answer (Optional)",
        })}
      </Label>
      <Textarea
        value={question.answer || ""}
        onChange={(e) => onUpdateAnswer(e.target.value)}
        placeholder={tCommon("editor.modelAnswerPlaceholder", {
          defaultValue: "Enter expected or model answer for grading reference...",
        })}
        rows={3}
        disabled={disabled}
        className="bg-background"
      />
    </div>
  );
};
