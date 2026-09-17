import { useTranslation } from "react-i18next";
import {
  Clapperboard,
  FileText,
  Headphones,
  Link2,
  Table2,
} from "lucide-react";
import { type ResponseCurriculumLessonMaterialDto } from "@qlp/api-client";
import { cn } from "@qlp/ui";
import { materialKind } from "../utils";
import { CourseMaterialPreview } from "./CourseMaterialPreview";

interface CourseMaterialBlockProps {
  className?: string;
  material: ResponseCurriculumLessonMaterialDto;
}

export const CourseMaterialBlock = ({
  className,
  material,
}: CourseMaterialBlockProps) => {
  const { t } = useTranslation("curriculum");
  const kind = materialKind(material.type);
  const Icon =
    kind === "video"
      ? Clapperboard
      : kind === "audio"
        ? Headphones
        : kind === "link"
          ? Link2
          : kind === "table"
            ? Table2
            : FileText;
  const typeLabel = t(`materialType.${material.type}` as "materialType.video", {
    defaultValue: material.type,
  });

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{material.title}</h2>
          <p className="text-xs text-muted-foreground">{typeLabel}</p>
        </div>
      </div>
      <CourseMaterialPreview material={material} />
    </section>
  );
};
