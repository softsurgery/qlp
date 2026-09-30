import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { type ResponseCurriculumLessonMaterialDto } from "@qlp/api-client";
import {
  HtmlContent,
  ExcelEditor,
  hasExcelEditorContent,
} from "@qlp/components";
import { useApp } from "@qlp/contexts";
import { useUploadSrc } from "@qlp/hooks";
import { cn, Video } from "@qlp/ui";
import { hasRichText, isHttpUrl, materialKind } from "../utils";

interface CourseMaterialPreviewProps {
  className?: string;
  material: ResponseCurriculumLessonMaterialDto;
}

export const CourseMaterialPreview = ({
  className,
  material,
}: CourseMaterialPreviewProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const { api: baseApi } = useApp();
  const uploadApi = baseApi.upload;
  const { data: src } = useUploadSrc(
    uploadApi && material.storageId ? { id: material.storageId } : null,
    uploadApi,
  );
  const kind = materialKind(material.type);
  const mediaSrc =
    src || (isHttpUrl(material.content) ? material.content : undefined);
  const showTable = kind === "table" && hasExcelEditorContent(material.content);

  return (
    <div className={cn("w-full min-w-0", className)}>
      {hasRichText(material.description) ? (
        <HtmlContent
          html={material.description}
          className={cn("mb-3", showTable && "pt-1")}
        />
      ) : null}
      {showTable ? (
        <ExcelEditor
          key={material.id}
          content={material.content}
          readOnly
          className="w-full"
        />
      ) : (
        <div>
          {kind === "video" && mediaSrc ? (
            <Video
              src={mediaSrc}
              title={material.title}
              className="w-full rounded-md"
            />
          ) : null}
          {kind === "audio" && mediaSrc ? (
            <audio src={mediaSrc} controls className="w-full" />
          ) : null}
          {mediaSrc && (kind === "link" || kind === "reading") ? (
            <a
              href={mediaSrc}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-3.5" />
              {tCommon("viewer.openResource")}
            </a>
          ) : null}
          {kind === "text" ||
          (!mediaSrc && kind !== "table" && hasRichText(material.content)) ? (
            isHttpUrl(material.content) ? (
              <a
                href={material.content}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" />
                {tCommon("viewer.openResource")}
              </a>
            ) : (
              <HtmlContent html={material.content} />
            )
          ) : null}
          {!mediaSrc &&
          !hasRichText(material.content) &&
          !hasRichText(material.description) ? (
            <p className="text-sm text-muted-foreground">
              {tCommon("viewer.noMaterials")}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};
