import { ResponseCurriculumExamDto } from "@qlp/api-client";
import { HtmlContent } from "@qlp/components";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@qlp/ui";
import { CourseExamQuestionBlock } from "./CourseExamQuestionBlock";

interface CourseExamMaterialsProps {
  className?: string;
  exam: ResponseCurriculumExamDto;
  revealAnswers?: boolean;
}

export const CourseExamMaterials = ({
  className,
  exam,
  revealAnswers,
}: CourseExamMaterialsProps) => {
  const { t } = useTranslation("curriculum");
  const questions = exam.questions || [];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClipboardList className="size-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            {t("editor.exam")}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {exam.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {[
            questions.length
              ? t("viewer.questions", { count: questions.length })
              : null,
            exam.durationMinutes
              ? t("viewer.duration", { minutes: exam.durationMinutes })
              : null,
            exam.passingScore != null
              ? t("viewer.passing", { score: exam.passingScore })
              : null,
          ]
            .filter(Boolean)
            .join(" • ")}
        </p>
        <HtmlContent html={exam.description} className="mt-3" />
      </div>
      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("editor.noQuestions")}
        </p>
      ) : (
        <ol className="flex flex-col gap-6">
          {questions.map((question, index) => (
            <CourseExamQuestionBlock
              key={question.id || index}
              question={question}
              index={index}
              revealAnswers={revealAnswers}
            />
          ))}
        </ol>
      )}
    </div>
  );
};
