import { useTranslation } from "react-i18next";
import { type ExamQuestion } from "@qlp/api-client";
import { cn } from "@qlp/ui";

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
  return (
    <li className={cn("text-sm", className)}>
      <p className="font-medium">
        {tCommon("editor.questionN", { n: index + 1 })} · {question.prompt}
      </p>
      {question.options?.length ? (
        <ul className="mt-2 space-y-1 ps-4 text-muted-foreground">
          {question.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      ) : null}
      {revealAnswers && question.answer ? (
        <p className="mt-2 text-xs font-medium text-primary">
          {tCommon("viewer.correctAnswer", { answer: question.answer })}
        </p>
      ) : null}
    </li>
  );
};
