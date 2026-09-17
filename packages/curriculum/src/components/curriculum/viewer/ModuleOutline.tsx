import React from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  ChevronDown,
  Clapperboard,
  ClipboardList,
  ExternalLink,
  FileText,
  Headphones,
  Link2,
  ListChecks,
  Table2,
} from "lucide-react";
import {
  HtmlContent,
  ExcelEditor,
  hasExcelEditorContent,
} from "@qlp/components";
import { useApp } from "@qlp/contexts";
import { useLocalStorage, useUploadSrc } from "@qlp/hooks";
import {
  type ExamQuestion,
  type ResponseCurriculumExamDto,
  type ResponseCurriculumLessonDto,
  type ResponseCurriculumLessonMaterialDto,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from "@qlp/ui";
import {
  hasRichText,
  isHttpUrl,
  lessonMaterials,
  materialKind,
  moduleMaterialStats,
  moduleOutline,
} from "./utils";

type ContentWidth = "full" | "wide" | "narrow";

const CONTENT_WIDTHS: {
  id: ContentWidth;
  className: string;
  barClassName: string;
  labelKey: "viewer.widthFull" | "viewer.widthWide" | "viewer.widthNarrow";
}[] = [
  {
    id: "full",
    className: "w-full",
    barClassName: "w-5",
    labelKey: "viewer.widthFull",
  },
  {
    id: "wide",
    className: "mx-auto w-full max-w-5xl",
    barClassName: "w-3.5",
    labelKey: "viewer.widthWide",
  },
  {
    id: "narrow",
    className: "mx-auto w-full max-w-3xl",
    barClassName: "w-2",
    labelKey: "viewer.widthNarrow",
  },
];

const CONTENT_WIDTH_STORAGE_KEY = "qlp.curriculum.viewer.contentWidth";

function isContentWidth(value: unknown): value is ContentWidth {
  return value === "full" || value === "wide" || value === "narrow";
}

interface ModuleOutlineProps {
  module: ResponseCurriculumModuleDto;
  moduleIndex: number;
  revealAnswers?: boolean;
  activeItemId?: string;
  onActiveItemChange: (id: string) => void;
}

export function ModuleOutline({
  module,
  moduleIndex,
  revealAnswers,
  activeItemId,
  onActiveItemChange,
}: ModuleOutlineProps) {
  const { t } = useTranslation("curriculum");
  const stats = moduleMaterialStats(module);
  const outline = moduleOutline(module);
  const [showDescription, setShowDescription] = React.useState(false);
  const [storedWidth, setStoredWidth] = useLocalStorage<ContentWidth>(
    CONTENT_WIDTH_STORAGE_KEY,
    "narrow",
  );
  const contentWidth = isContentWidth(storedWidth) ? storedWidth : "narrow";
  const widthClass =
    CONTENT_WIDTHS.find((option) => option.id === contentWidth)?.className ??
    "mx-auto w-full max-w-3xl";
  const hasDescription = hasRichText(module.description);

  return (
    <div className="w-full">
      <div className="flex justify-end px-4 pt-4 sm:px-8">
        <ContentWidthSwitch value={contentWidth} onChange={setStoredWidth} />
      </div>
      <div
        className={cn(
          widthClass,
          "px-4 pb-6 pt-2 transition-[max-width] duration-200 sm:px-8",
        )}
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("viewer.moduleTitle", { n: moduleIndex + 1, title: module.title })}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {stats.videos > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Clapperboard className="size-3.5" />
              {t("viewer.videosCount", { count: stats.videos })}
            </span>
          ) : null}
          {stats.readings > 0 ? (
            <>
              {stats.videos > 0 ? <span aria-hidden>•</span> : null}
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-3.5" />
                {t("viewer.readingsCount", { count: stats.readings })}
              </span>
            </>
          ) : null}
          {stats.assessments > 0 ? (
            <>
              {stats.videos > 0 || stats.readings > 0 ? (
                <span aria-hidden>•</span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="size-3.5" />
                {t("viewer.assessmentsCount", { count: stats.assessments })}
              </span>
            </>
          ) : null}
        </div>

        {hasDescription ? (
          <div className="mt-4">
            <HtmlContent
              html={module.description}
              className={cn(!showDescription && "line-clamp-4")}
            />
            <button
              type="button"
              className="mt-2 text-sm font-medium text-primary hover:underline"
              onClick={() => setShowDescription((open) => !open)}
            >
              {showDescription
                ? t("viewer.hideDescription")
                : t("viewer.showDescription")}
            </button>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col divide-y">
          {outline.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("viewer.emptyModule")}
            </p>
          ) : (
            outline.map((entry) =>
              entry.kind === "lesson" ? (
                <LessonGroup
                  key={entry.id}
                  lesson={entry.lesson}
                  activeItemId={activeItemId}
                  onActiveItemChange={onActiveItemChange}
                />
              ) : (
                <ExamGroup
                  key={entry.id}
                  exam={entry.exam}
                  revealAnswers={revealAnswers}
                  activeItemId={activeItemId}
                  onActiveItemChange={onActiveItemChange}
                />
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ContentWidthSwitch({
  value,
  onChange,
}: {
  value: ContentWidth;
  onChange: (width: ContentWidth) => void;
}) {
  const { t } = useTranslation("curriculum");

  return (
    <TooltipProvider delayDuration={300}>
      <div
        role="radiogroup"
        aria-label={t("viewer.contentWidth")}
        className="inline-flex items-center rounded-md border bg-background p-0.5"
      >
        {CONTENT_WIDTHS.map((option) => {
          const selected = option.id === value;
          return (
            <Tooltip key={option.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={t(option.labelKey)}
                  onClick={() => onChange(option.id)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "bg-muted text-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block h-3 rounded-[2px] border-2 border-current",
                      option.barClassName,
                    )}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent hideArrow side="bottom" sideOffset={6}>
                {t(option.labelKey)}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function LessonGroup({
  lesson,
  activeItemId,
  onActiveItemChange,
}: {
  lesson: ResponseCurriculumLessonDto;
  activeItemId?: string;
  onActiveItemChange: (id: string) => void;
}) {
  const { t } = useTranslation("curriculum");
  const materials = lessonMaterials(lesson);
  const [open, setOpen] = React.useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="py-2">
      <div className="flex items-center justify-between gap-3 py-2">
        <h2 className="text-base font-semibold">{lesson.title}</h2>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
          >
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
            <span className="sr-only">
              {open ? t("viewer.hideDescription") : t("viewer.showDescription")}
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {hasRichText(lesson.description) ? (
        <HtmlContent html={lesson.description} className="pb-2" />
      ) : null}
      <CollapsibleContent>
        {materials.length === 0 ? (
          <p className="py-3 ps-9 text-sm text-muted-foreground">
            {t("viewer.noMaterials")}
          </p>
        ) : (
          <ul className="flex flex-col">
            {materials.map((material) => (
              <li key={material.id}>
                <MaterialRow
                  material={material}
                  active={activeItemId === `material:${material.id}`}
                  onSelect={() => onActiveItemChange(`material:${material.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ExamGroup({
  exam,
  revealAnswers,
  activeItemId,
  onActiveItemChange,
}: {
  exam: ResponseCurriculumExamDto;
  revealAnswers?: boolean;
  activeItemId?: string;
  onActiveItemChange: (id: string) => void;
}) {
  const { t } = useTranslation("curriculum");
  const [open, setOpen] = React.useState(true);
  const active = activeItemId === `exam:${exam.id}`;
  const questions = exam.questions || [];

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="py-2">
      <div className="flex items-center justify-between gap-3 py-2">
        <h2 className="text-base font-semibold">{exam.title}</h2>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
          >
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
            <span className="sr-only">
              {open ? t("viewer.hideDescription") : t("viewer.showDescription")}
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-2 py-3 text-start",
            active ? "bg-primary/10" : "hover:bg-muted/60",
          )}
        >
          <button
            type="button"
            onClick={() => onActiveItemChange(`exam:${exam.id}`)}
            className="flex min-w-0 flex-1 items-center gap-3 text-start"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ClipboardList className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{exam.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {[
                  t("editor.exam"),
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
              </span>
            </span>
          </button>
          {active ? (
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => onActiveItemChange(`exam:${exam.id}`)}
            >
              {t("viewer.open")}
            </Button>
          ) : null}
        </div>
        {active ? (
          <div className="mb-3 ms-11 rounded-md border bg-card p-4">
            <HtmlContent html={exam.description} className="mb-3" />
            {questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("editor.noQuestions")}
              </p>
            ) : (
              <ol className="flex flex-col gap-4">
                {questions.map((question, index) => (
                  <ExamQuestionBlock
                    key={question.id || index}
                    question={question}
                    index={index}
                    revealAnswers={revealAnswers}
                  />
                ))}
              </ol>
            )}
          </div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}

function MaterialRow({
  material,
  active,
  onSelect,
}: {
  material: ResponseCurriculumLessonMaterialDto;
  active: boolean;
  onSelect: () => void;
}) {
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
    <div>
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-2 py-3 text-start",
          active ? "bg-primary/10" : "hover:bg-muted/60",
        )}
      >
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-3 text-start"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{material.title}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {typeLabel}
            </span>
          </span>
        </button>
        {active ? (
          <Button size="sm" className="shrink-0" onClick={onSelect}>
            {t("viewer.open")}
          </Button>
        ) : null}
      </div>
      {active ? <MaterialPreview material={material} /> : null}
    </div>
  );
}

function MaterialPreview({
  material,
}: {
  material: ResponseCurriculumLessonMaterialDto;
}) {
  const { t } = useTranslation("curriculum");
  const { api: baseApi } = useApp();
  const uploadApi = baseApi.upload;
  const { data: src } = useUploadSrc(
    uploadApi && material.storageId ? { id: material.storageId } : null,
    uploadApi,
  );
  const kind = materialKind(material.type);
  const mediaSrc =
    src || (isHttpUrl(material.content) ? material.content : undefined);
  const showTable =
    kind === "table" && hasExcelEditorContent(material.content);

  return (
    <div className="mt-3 w-full min-w-0">
      {hasRichText(material.description) ? (
        <HtmlContent
          html={material.description}
          className={cn("mb-3 ms-11 px-4", showTable && "pt-4")}
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
        <div className="ms-11 p-4 pt-0">
          {kind === "video" && mediaSrc ? (
            <video src={mediaSrc} controls className="w-full rounded-md" />
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
              {t("viewer.openResource")}
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
                {t("viewer.openResource")}
              </a>
            ) : (
              <HtmlContent html={material.content} />
            )
          ) : null}
          {!mediaSrc &&
          !hasRichText(material.content) &&
          !hasRichText(material.description) ? (
            <p className="text-sm text-muted-foreground">
              {t("viewer.noMaterials")}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ExamQuestionBlock({
  question,
  index,
  revealAnswers,
}: {
  question: ExamQuestion;
  index: number;
  revealAnswers?: boolean;
}) {
  const { t } = useTranslation("curriculum");
  return (
    <li className="text-sm">
      <p className="font-medium">
        {t("editor.questionN", { n: index + 1 })} · {question.prompt}
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
          {t("viewer.correctAnswer", { answer: question.answer })}
        </p>
      ) : null}
    </li>
  );
}
