import { useTranslation } from "react-i18next";
import { ExamQuestionType, type ExamQuestion } from "@qlp/api-client";
import { Badge, Textarea, cn } from "@qlp/ui";

interface CourseExamQuestionBlockProps {
  className?: string;
  question: ExamQuestion;
  index: number;
  revealAnswers?: boolean;
}

export const CourseExamQuestionBlock = ({
  className,
  question,
  index,
  revealAnswers,
}: CourseExamQuestionBlockProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const isSingleChoice = question.type === ExamQuestionType.SingleChoice;
  const isMultiChoice = question.type === ExamQuestionType.MultipleChoice;
  const isTextarea = question.type === ExamQuestionType.Textarea;
  const isSlider = question.type === ExamQuestionType.Slider;

  const selectedAnswers = question.answer
    ? question.answer.split(",").map((s) => s.trim())
    : [];

  return (
    <li
      className={cn(
        "text-sm border rounded-lg p-4 bg-card flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base">
          {tCommon("editor.questionN", { n: index + 1 })} · {question.prompt}
        </p>
        <div className="flex items-center gap-2">
          {question.points ? (
            <Badge variant="outline" className="text-xs">
              {question.points} {question.points === 1 ? "pt" : "pts"}
            </Badge>
          ) : null}
          <Badge variant="secondary" className="text-xs uppercase font-mono">
            {question.type}
          </Badge>
        </div>
      </div>

      {/* Single choice & Multi choice rendering */}
      {(isSingleChoice || isMultiChoice || question.options?.length) && (
        <ul className="space-y-2 ps-2 text-foreground">
          {question.options?.map((option, optIdx) => {
            const isSelected = selectedAnswers.includes(option);
            return (
              <li
                key={optIdx}
                className={cn(
                  "flex items-center gap-2 p-2 rounded border transition-colors",
                  isSelected && revealAnswers
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border bg-muted/30",
                )}
              >
                <input
                  type={isMultiChoice ? "checkbox" : "radio"}
                  checked={isSelected && revealAnswers}
                  readOnly
                  disabled
                  className="accent-primary"
                />
                <span>{option}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Textarea rendering */}
      {isTextarea && (
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Type your response here..."
            disabled
            rows={3}
            className="bg-muted/20 cursor-not-allowed"
          />
        </div>
      )}

      {/* Slider rendering */}
      {isSlider && (
        <div className="flex flex-col gap-2 p-3 border rounded bg-muted/20">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Min: {question.min ?? 0}</span>
            <span>Max: {question.max ?? 100}</span>
          </div>
          <input
            type="range"
            min={question.min ?? 0}
            max={question.max ?? 100}
            step={question.step ?? 1}
            value={Number(question.answer) || (question.min ?? 0)}
            disabled
            className="w-full accent-primary cursor-not-allowed"
          />
          {revealAnswers && question.answer && (
            <div className="text-xs text-center font-medium text-primary">
              Target Value: {question.answer}
            </div>
          )}
        </div>
      )}

      {revealAnswers && question.answer && !isSlider && (
        <p className="mt-1 text-xs font-semibold text-primary">
          {tCommon("viewer.correctAnswer", { answer: question.answer })}
        </p>
      )}
    </li>
  );
};
