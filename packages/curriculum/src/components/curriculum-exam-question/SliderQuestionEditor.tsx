import React from "react";
import { Input, Label } from "@qlp/ui";
import { type ExamQuestion } from "@qlp/api-client";
import { Sliders } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface SliderQuestionEditorProps {
  question: ExamQuestion;
  disabled?: boolean;
  onUpdate: (patch: Partial<ExamQuestion>) => void;
}

export const SliderQuestionEditor: React.FC<SliderQuestionEditorProps> = ({
  question,
  disabled,
  onUpdate,
}) => {
  const { t: tCommon } = useTranslation("curriculum-common");

  return (
    <div className="flex flex-col gap-3 mt-2 bg-muted/30 p-3 rounded-md border border-border">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Sliders className="h-4 w-4" />
        <span>{tCommon("editor.sliderSettings")}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">
            {tCommon("editor.minVal", { defaultValue: "Min Value" })}
          </Label>
          <Input
            type="number"
            value={question.min ?? 0}
            onChange={(e) => onUpdate({ min: parseFloat(e.target.value) || 0 })}
            disabled={disabled}
            className="h-8 text-sm bg-background"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">
            {tCommon("editor.maxVal", { defaultValue: "Max Value" })}
          </Label>
          <Input
            type="number"
            value={question.max ?? 100}
            onChange={(e) =>
              onUpdate({ max: parseFloat(e.target.value) || 100 })
            }
            disabled={disabled}
            className="h-8 text-sm bg-background"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">
            {tCommon("editor.stepSize", { defaultValue: "Step Size" })}
          </Label>
          <Input
            type="number"
            value={question.step ?? 1}
            onChange={(e) =>
              onUpdate({ step: parseFloat(e.target.value) || 1 })
            }
            disabled={disabled}
            className="h-8 text-sm bg-background"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <div className="flex justify-between items-center text-xs">
          <Label className="text-xs font-medium">
            {tCommon("editor.targetValue", {
              defaultValue: "Target Value Answer",
            })}
          </Label>
          <span className="font-mono font-bold text-primary">
            {question.answer ?? question.min ?? 0}
          </span>
        </div>
        <input
          type="range"
          min={question.min ?? 0}
          max={question.max ?? 100}
          step={question.step ?? 1}
          value={Number(question.answer) || (question.min ?? 0)}
          onChange={(e) => onUpdate({ answer: e.target.value })}
          disabled={disabled}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </div>
  );
};
