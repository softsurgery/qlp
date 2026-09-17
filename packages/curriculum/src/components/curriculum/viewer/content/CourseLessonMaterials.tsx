import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { type ResponseCurriculumLessonDto } from "@qlp/api-client";
import { HtmlContent } from "@qlp/components";
import { cn } from "@qlp/ui";
import { hasRichText, lessonMaterials } from "../utils";
import { CourseMaterialBlock } from "./CourseMaterialBlock";

interface CourseLessonMaterialsProps {
  className?: string;
  lesson: ResponseCurriculumLessonDto;
  isPending?: boolean;
}

export const CourseLessonMaterials = ({
  className,
  lesson,
  isPending,
}: CourseLessonMaterialsProps) => {
  const { t } = useTranslation("curriculum");
  const materials = lessonMaterials(lesson);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {lesson.title}
        </h1>
        {hasRichText(lesson.description) ? (
          <HtmlContent html={lesson.description} className="mt-3" />
        ) : null}
      </div>
      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <span className="sr-only">{t("viewer.loading")}</span>
        </div>
      ) : materials.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("viewer.noMaterials")}
        </p>
      ) : (
        materials.map((material) => (
          <CourseMaterialBlock key={material.id} material={material} />
        ))
      )}
    </div>
  );
};
