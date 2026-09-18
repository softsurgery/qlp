import React from "react";
import { useSheet, SheetTitle, Button } from "@qlp/ui";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CurriculumViewer } from "../viewer/CurriculumViewer";
import { useSearchParams } from "react-router-dom";

export interface CurriculumPreviewDialogProps {
  curriculumId: string;
  previewUrl: string;
  previewItem?: string;
  previewLesson?: string;
}

export const useCurriculumPreviewDialog = ({
  curriculumId,
  previewUrl,
  previewItem,
  previewLesson,
}: CurriculumPreviewDialogProps) => {
  const { t } = useTranslation("curriculum");
  const { t: tCommon } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    SheetFragment: previewDialog,
    openSheet: baseOpenPreviewDialog,
    closeSheet: closePreviewDialog,
    isOpen,
  } = useSheet({
    children: (isOpen) => (
      <>
        <SheetTitle className="sr-only">Preview</SheetTitle>
        <div className="flex items-center justify-between px-4 pt-3 border-b shrink-0 bg-background z-10">
          <h2 className="text-lg font-semibold">{t("preview", "Preview")}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(previewUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {tCommon("commands.openExternally", "Open Externally")}
          </Button>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {isOpen && <CurriculumViewer curriculumId={curriculumId} />}
        </div>
      </>
    ),
    className:
      "w-full max-w-[95vw] sm:max-w-[95vw] h-full p-0 flex flex-col overflow-hidden",
  });

  const openPreviewDialog = () => {
    if (previewItem || previewLesson) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (previewItem) next.set("item", previewItem);
          else next.delete("item");

          if (previewLesson) next.set("lesson", previewLesson);
          else next.delete("lesson");

          return next;
        },
        { replace: true },
      );
    }
    baseOpenPreviewDialog();
  };

  return {
    previewDialog,
    openPreviewDialog,
    closePreviewDialog,
  };
};
