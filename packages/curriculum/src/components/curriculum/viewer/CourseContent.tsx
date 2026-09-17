import React from "react";
import { useTranslation } from "react-i18next";
import {
  Clapperboard,
  ClipboardList,
  ExternalLink,
  FileText,
  Headphones,
  Link2,
  Loader2,
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
  moduleItemId,
  moduleOutline,
  outlineItemId,
  sortByOrder,
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

interface CourseContentProps {
  curriculumTitle: string;
  modules: ResponseCurriculumModuleDto[];
  lesson?: ResponseCurriculumLessonDto;
  material?: ResponseCurriculumLessonMaterialDto;
  exam?: ResponseCurriculumExamDto;
  module?: ResponseCurriculumModuleDto;
  isMaterialsPending?: boolean;
  revealAnswers?: boolean;
  onSelectItem: (itemId: string, lessonId?: string) => void;
}

export function CourseContent({
  curriculumTitle,
  modules,
  lesson,
  material,
  exam,
  module,
  isMaterialsPending,
  revealAnswers,
  onSelectItem,
}: CourseContentProps) {
  const [storedWidth, setStoredWidth] = useLocalStorage<ContentWidth>(
    CONTENT_WIDTH_STORAGE_KEY,
    "narrow",
  );
  const contentWidth = isContentWidth(storedWidth) ? storedWidth : "narrow";
  const widthClass =
    CONTENT_WIDTHS.find((option) => option.id === contentWidth)?.className ??
    "mx-auto w-full max-w-3xl";

  return (
    <div className="w-full">
      {material || exam || lesson ? (
        <div className="flex justify-end px-4 pt-4 sm:px-8">
          <ContentWidthSwitch value={contentWidth} onChange={setStoredWidth} />
        </div>
      ) : null}
      <div
        className={cn(
          widthClass,
          "px-4 pb-10 pt-4 transition-[max-width] duration-200 sm:px-8",
        )}
      >
        {isMaterialsPending && !material && !lesson ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : material ? (
          <MaterialBlock material={material} />
        ) : exam ? (
          <ExamMaterials exam={exam} revealAnswers={revealAnswers} />
        ) : lesson ? (
          <LessonMaterials lesson={lesson} isPending={isMaterialsPending} />
        ) : module ? (
          <ModuleLessons module={module} onSelectItem={onSelectItem} />
        ) : (
          <CourseModules
            title={curriculumTitle}
            modules={modules}
            onSelectItem={onSelectItem}
          />
        )}
      </div>
    </div>
  );
}

function CourseModules({
  title,
  modules,
  onSelectItem,
}: {
  title: string;
  modules: ResponseCurriculumModuleDto[];
  onSelectItem: (itemId: string, lessonId?: string) => void;
}) {
  const { t } = useTranslation("curriculum");
  const ordered = sortByOrder(modules);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("viewer.selectModule")}
        </p>
      </div>
      {ordered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("viewer.noModules")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ordered.map((module, index) => {
            const outline = moduleOutline(module);
            const lessonCount = outline.filter((entry) => entry.kind === "lesson").length;
            const examCount = outline.filter((entry) => entry.kind === "exam").length;
            const meta =
              outline.length === 0
                ? t("viewer.emptyModule")
                : [
                    lessonCount
                      ? t("viewer.lessons", { count: lessonCount })
                      : null,
                    examCount
                      ? t("viewer.exams", { count: examCount })
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" • ");
            return (
              <li key={module.id}>
                <OutlineRow
                  title={module.title}
                  meta={meta}
                  index={index + 1}
                  onClick={() => onSelectItem(moduleItemId(module.id))}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ModuleLessons({
  module,
  onSelectItem,
}: {
  module: ResponseCurriculumModuleDto;
  onSelectItem: (itemId: string, lessonId?: string) => void;
}) {
  const { t } = useTranslation("curriculum");
  const outline = moduleOutline(module);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{module.title}</h1>
        {hasRichText(module.description) ? (
          <HtmlContent html={module.description} className="mt-3" />
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("viewer.selectLesson")}
          </p>
        )}
      </div>
      {outline.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("viewer.emptyModule")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {outline.map((entry) => {
            const itemId = outlineItemId(entry);
            if (entry.kind === "exam") {
              return (
                <li key={itemId}>
                  <OutlineRow
                    title={entry.exam.title}
                    meta={t("editor.exam")}
                    icon={<ClipboardList className="size-4" />}
                    onClick={() => onSelectItem(itemId)}
                  />
                </li>
              );
            }
            return (
              <li key={itemId}>
                <OutlineRow
                  title={entry.lesson.title}
                  meta={t("editor.lesson")}
                  onClick={() => onSelectItem(itemId)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function LessonMaterials({
  lesson,
  isPending,
}: {
  lesson: ResponseCurriculumLessonDto;
  isPending?: boolean;
}) {
  const { t } = useTranslation("curriculum");
  const materials = lessonMaterials(lesson);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
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
        <p className="text-sm text-muted-foreground">{t("viewer.noMaterials")}</p>
      ) : (
        materials.map((material) => (
          <MaterialBlock key={material.id} material={material} />
        ))
      )}
    </div>
  );
}

function OutlineRow({
  title,
  meta,
  icon,
  index,
  onClick,
}: {
  title: string;
  meta?: string;
  icon?: React.ReactNode;
  index?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border bg-card px-4 py-3 text-start transition-colors hover:bg-muted/50"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground">
        {icon ?? index ?? <FileText className="size-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{title}</span>
        {meta ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function ExamMaterials({
  exam,
  revealAnswers,
}: {
  exam: ResponseCurriculumExamDto;
  revealAnswers?: boolean;
}) {
  const { t } = useTranslation("curriculum");
  const questions = exam.questions || [];

  return (
    <div className="flex flex-col gap-6">
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
        <p className="text-sm text-muted-foreground">{t("editor.noQuestions")}</p>
      ) : (
        <ol className="flex flex-col gap-6">
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

function MaterialBlock({
  material,
}: {
  material: ResponseCurriculumLessonMaterialDto;
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
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{material.title}</h2>
          <p className="text-xs text-muted-foreground">{typeLabel}</p>
        </div>
      </div>
      <MaterialPreview material={material} />
    </section>
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
    <div className="w-full min-w-0">
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
