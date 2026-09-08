import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Save, Trash2 } from "lucide-react";
import { FormBuilder, FieldVariant, type FormStructure } from "@qlp/form-builder";
import { Button } from "@qlp/ui";
import {
  ExamQuestionType,
  MaterialType,
  type ExamQuestion,
  type ResponseCurriculumExamDto,
  type ResponseCurriculumLessonDto,
  type ResponseCurriculumLessonMaterialDto,
  type ResponseCurriculumModuleDto,
  type ResponseCurriculumTreeDto,
} from "@qlp/api-client";
import { VersionBadge } from "../StatusBadge";
import {
  descriptionField,
  materialTypeOptions,
  questionTypeOptions,
  slugField,
  sortOrderField,
  statusField,
  titleField,
} from "./fields";

interface PanelProps {
  pending?: boolean;
  onSave: () => void;
  onDelete?: () => void;
  extra?: ReactNode;
  structure: FormStructure;
}

function FormPanel({ pending, onSave, onDelete, extra, structure }: PanelProps) {
  const { t } = useTranslation("curriculum");
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card">
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <FormBuilder structure={structure} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3">
        {onDelete ? (
          <Button type="button" variant="ghost" className="text-destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
            {t("delete")}
          </Button>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap gap-2">
          {extra}
          <Button type="button" onClick={onSave} disabled={pending}>
            <Save className="size-4" />
            {pending ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CurriculumDetailsForm({
  tree,
  pending,
  onSave,
}: {
  tree: ResponseCurriculumTreeDto;
  pending?: boolean;
  onSave: (values: {
    title: string;
    slug: string;
    description: string;
    status: string;
  }) => void;
}) {
  const { t } = useTranslation("curriculum");
  const [title, setTitle] = useState(tree.title);
  const [slug, setSlug] = useState(tree.slug);
  const [description, setDescription] = useState(tree.description ?? "");
  const [status, setStatus] = useState(String(tree.status));
  const [titleError, setTitleError] = useState<string>();

  const structure: FormStructure = {
    includeHeader: true,
    title: { value: t("editor.curriculum") },
    description: { value: t("editor.curriculumHint") },
    fieldsets: [
      {
        rows: [
          { fields: [titleField(t, title, (value) => {
            setTitle(value);
            setTitleError(undefined);
          }, titleError), slugField(t, slug, setSlug)] },
          { fields: [descriptionField(t, description, setDescription)] },
          { fields: [statusField(t, status, setStatus)] },
        ],
      },
    ],
  };

  return (
    <FormPanel
      pending={pending}
      onSave={() => {
        if (!title.trim()) {
          setTitleError(t("errors.titleRequired"));
          return;
        }
        onSave({ title: title.trim(), slug: slug.trim(), description: description.trim(), status });
      }}
      structure={structure}
    />
  );
}

export function ModuleForm({
  module,
  pending,
  onSave,
  onDelete,
  onAddLesson,
  onAddExam,
}: {
  module: ResponseCurriculumModuleDto;
  pending?: boolean;
  onSave: (values: { title: string; description: string; sortOrder?: number }) => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onAddExam: () => void;
}) {
  const { t } = useTranslation("curriculum");
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description ?? "");
  const [sortOrder, setSortOrder] = useState<number | undefined>(module.sortOrder);
  const [titleError, setTitleError] = useState<string>();

  const structure: FormStructure = {
        includeHeader: true,
        title: { value: t("editor.module") },
        description: { value: t("editor.moduleHint") },
        fieldsets: [
          {
            includeHeader: false,
            component: <VersionBadge version={module.version} isLatest={module.isLatest} />,
        rows: [
          { fields: [titleField(t, title, (value) => {
            setTitle(value);
            setTitleError(undefined);
          }, titleError), sortOrderField(t, sortOrder, setSortOrder)] },
          { fields: [descriptionField(t, description, setDescription)] },
        ],
      },
    ],
  };

  return (
    <FormPanel
      pending={pending}
      onDelete={onDelete}
      onSave={() => {
        if (!title.trim()) {
          setTitleError(t("errors.titleRequired"));
          return;
        }
        onSave({ title: title.trim(), description: description.trim(), sortOrder });
      }}
      extra={
        <>
          <Button type="button" variant="outline" onClick={onAddLesson}>
            <Plus className="size-4" />
            {t("editor.addLesson")}
          </Button>
          <Button type="button" variant="outline" onClick={onAddExam}>
            <Plus className="size-4" />
            {t("editor.addExam")}
          </Button>
        </>
      }
      structure={structure}
    />
  );
}

export function LessonForm({
  lesson,
  pending,
  onSave,
  onDelete,
  onAddMaterial,
}: {
  lesson: ResponseCurriculumLessonDto;
  pending?: boolean;
  onSave: (values: { title: string; description: string; sortOrder?: number }) => void;
  onDelete: () => void;
  onAddMaterial: () => void;
}) {
  const { t } = useTranslation("curriculum");
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [sortOrder, setSortOrder] = useState<number | undefined>(lesson.sortOrder);
  const [titleError, setTitleError] = useState<string>();

  const structure: FormStructure = {
        includeHeader: true,
        title: { value: t("editor.lesson") },
        description: { value: t("editor.lessonHint") },
        fieldsets: [
          {
            includeHeader: false,
            component: <VersionBadge version={lesson.version} isLatest={lesson.isLatest} />,
        rows: [
          { fields: [titleField(t, title, (value) => {
            setTitle(value);
            setTitleError(undefined);
          }, titleError), sortOrderField(t, sortOrder, setSortOrder)] },
          { fields: [descriptionField(t, description, setDescription)] },
        ],
      },
    ],
  };

  return (
    <FormPanel
      pending={pending}
      onDelete={onDelete}
      onSave={() => {
        if (!title.trim()) {
          setTitleError(t("errors.titleRequired"));
          return;
        }
        onSave({ title: title.trim(), description: description.trim(), sortOrder });
      }}
      extra={
        <Button type="button" variant="outline" onClick={onAddMaterial}>
          <Plus className="size-4" />
          {t("editor.addMaterial")}
        </Button>
      }
      structure={structure}
    />
  );
}

export function MaterialForm({
  material,
  pending,
  onSave,
  onDelete,
}: {
  material: ResponseCurriculumLessonMaterialDto;
  pending?: boolean;
  onSave: (values: {
    title: string;
    description: string;
    type: string;
    content: string;
    sortOrder?: number;
  }) => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation("curriculum");
  const [title, setTitle] = useState(material.title);
  const [description, setDescription] = useState(material.description ?? "");
  const [type, setType] = useState(String(material.type));
  const [content, setContent] = useState(material.content ?? "");
  const [sortOrder, setSortOrder] = useState<number | undefined>(material.sortOrder);
  const [titleError, setTitleError] = useState<string>();
  const isUrl = type === MaterialType.Link || type === MaterialType.Video || type === MaterialType.Audio;

  const structure: FormStructure = {
        includeHeader: true,
        title: { value: t("editor.material") },
        description: { value: t("editor.materialHint") },
        fieldsets: [
          {
            includeHeader: false,
            component: <VersionBadge version={material.version} isLatest={material.isLatest} />,
        rows: [
          { fields: [titleField(t, title, (value) => {
            setTitle(value);
            setTitleError(undefined);
          }, titleError)] },
          {
            fields: [
              {
                id: "type",
                label: t("fields.type"),
                variant: FieldVariant.SELECT,
                description: t("fields.typeDescription"),
                props: {
                  value: type,
                  onValueChange: setType,
                  options: materialTypeOptions(t),
                },
              },
              sortOrderField(t, sortOrder, setSortOrder),
            ],
          },
          { fields: [descriptionField(t, description, setDescription)] },
          {
            fields: [
              isUrl
                ? {
                    id: "content",
                    label: t("fields.contentUrl"),
                    variant: FieldVariant.URL,
                    placeholder: "https://",
                    description: t("fields.contentUrlHint"),
                    props: { value: content, onChange: setContent },
                  }
                : {
                    id: "content",
                    label: t("fields.content"),
                    variant: FieldVariant.TEXTAREA,
                    placeholder: t("fields.contentPlaceholder"),
                    description: t("fields.contentHint"),
                    props: { value: content, onChange: setContent, rows: 6, resizable: true },
                  },
            ],
          },
        ],
      },
    ],
  };

  return (
    <FormPanel
      pending={pending}
      onDelete={onDelete}
      onSave={() => {
        if (!title.trim()) {
          setTitleError(t("errors.titleRequired"));
          return;
        }
        onSave({
          title: title.trim(),
          description: description.trim(),
          type,
          content: content.trim(),
          sortOrder,
        });
      }}
      structure={structure}
    />
  );
}

export function ExamForm({
  exam,
  pending,
  onSave,
  onDelete,
}: {
  exam: ResponseCurriculumExamDto;
  pending?: boolean;
  onSave: (values: {
    title: string;
    description: string;
    durationMinutes?: number;
    passingScore: number;
    questions: ExamQuestion[];
    sortOrder?: number;
  }) => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation("curriculum");
  const [title, setTitle] = useState(exam.title);
  const [description, setDescription] = useState(exam.description ?? "");
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(exam.durationMinutes);
  const [passingScore, setPassingScore] = useState<number | undefined>(exam.passingScore);
  const [sortOrder, setSortOrder] = useState<number | undefined>(exam.sortOrder);
  const [questions, setQuestions] = useState<ExamQuestion[]>(exam.questions ?? []);
  const [titleError, setTitleError] = useState<string>();

  const updateQuestion = (id: string, patch: Partial<ExamQuestion>) => {
    setQuestions((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const structure: FormStructure = {
    includeHeader: true,
    title: { value: t("editor.exam") },
    description: { value: t("editor.examHint") },
    fieldsets: [
      {
        includeHeader: true,
        title: { value: t("editor.examDetails") },
        description: { value: t("editor.examDetailsHint") },
        component: <VersionBadge version={exam.version} isLatest={exam.isLatest} />,
        rows: [
          { fields: [titleField(t, title, (value) => {
            setTitle(value);
            setTitleError(undefined);
          }, titleError)] },
          { fields: [descriptionField(t, description, setDescription)] },
          {
            fields: [
              {
                id: "duration",
                label: t("fields.duration"),
                variant: FieldVariant.NUMBER,
                description: t("fields.durationDescription"),
                props: { value: durationMinutes, onChange: setDurationMinutes, min: 0 },
              },
              {
                id: "passingScore",
                label: t("fields.passingScore"),
                variant: FieldVariant.NUMBER,
                description: t("fields.passingScoreDescription"),
                props: { value: passingScore, onChange: setPassingScore, min: 0, max: 100 },
              },
              sortOrderField(t, sortOrder, setSortOrder),
            ],
          },
        ],
      },
      {
        includeHeader: true,
        title: { value: t("editor.questions") },
        description: { value: t("editor.questionsHint", { count: questions.length }) },
        component: (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setQuestions((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  prompt: t("editor.newQuestion"),
                  type: ExamQuestionType.MultipleChoice,
                  options: ["A", "B"],
                  answer: "A",
                  points: 1,
                },
              ])
            }
          >
            <Plus className="size-4" />
            {t("editor.addQuestion")}
          </Button>
        ),
        rows: [
          {
            fields: [
              {
                id: "questions",
                label: t("editor.questions"),
                variant: FieldVariant.CUSTOM,
                props: {
                  includeLabel: false,
                  children: (
                    <div className="flex flex-col gap-4">
                      {questions.length === 0 && (
                        <p className="text-sm text-muted-foreground">{t("editor.noQuestions")}</p>
                      )}
                      {questions.map((question, index) => (
                        <QuestionCard
                          key={question.id}
                          index={index}
                          question={question}
                          onChange={(patch) => updateQuestion(question.id, patch)}
                          onRemove={() =>
                            setQuestions((current) => current.filter((item) => item.id !== question.id))
                          }
                        />
                      ))}
                    </div>
                  ),
                },
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <FormPanel
      pending={pending}
      onDelete={onDelete}
      onSave={() => {
        if (!title.trim()) {
          setTitleError(t("errors.titleRequired"));
          return;
        }
        onSave({
          title: title.trim(),
          description: description.trim(),
          durationMinutes,
          passingScore: passingScore ?? 0,
          questions,
          sortOrder,
        });
      }}
      structure={structure}
    />
  );
}

function QuestionCard({
  index,
  question,
  onChange,
  onRemove,
}: {
  index: number;
  question: ExamQuestion;
  onChange: (patch: Partial<ExamQuestion>) => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation("curriculum");
  const isChoice = question.type === ExamQuestionType.MultipleChoice;
  const isTrueFalse = question.type === ExamQuestionType.TrueFalse;

  const structure: FormStructure = {
    fieldsets: [
      {
        includeHeader: true,
        title: { value: t("editor.questionN", { n: index + 1 }) },
        component: (
          <Button type="button" variant="ghost" size="icon-sm" className="text-destructive" onClick={onRemove}>
            <Trash2 className="size-4" />
          </Button>
        ),
        rows: [
          {
            fields: [
              {
                id: `${question.id}-prompt`,
                label: t("fields.prompt"),
                variant: FieldVariant.TEXTAREA,
                required: true,
                props: { value: question.prompt, onChange: (value: string) => onChange({ prompt: value }), rows: 2 },
              },
            ],
          },
          {
            fields: [
              {
                id: `${question.id}-type`,
                label: t("fields.type"),
                variant: FieldVariant.SELECT,
                props: {
                  value: String(question.type),
                  onValueChange: (type: string) =>
                    onChange({
                      type,
                      options:
                        type === ExamQuestionType.TrueFalse
                          ? ["true", "false"]
                          : question.options,
                    }),
                  options: questionTypeOptions(t),
                },
              },
              {
                id: `${question.id}-points`,
                label: t("fields.points"),
                variant: FieldVariant.NUMBER,
                props: {
                  value: question.points,
                  min: 0,
                  onChange: (value: number | undefined) => onChange({ points: value ?? 0 }),
                },
              },
            ],
          },
          {
            fields: isChoice
              ? [
                  {
                    id: `${question.id}-options`,
                    label: t("fields.options"),
                    variant: FieldVariant.TEXTAREA,
                    description: t("fields.optionsHint"),
                    props: {
                      value: (question.options ?? []).join("\n"),
                      rows: 4,
                      onChange: (value: string) =>
                        onChange({
                          options: value
                            .split("\n")
                            .map((line) => line.trim())
                            .filter(Boolean),
                        }),
                    },
                  },
                ]
              : [],
          },
          {
            fields: [
              isTrueFalse
                ? {
                    id: `${question.id}-answer`,
                    label: t("fields.answer"),
                    variant: FieldVariant.SELECT,
                    props: {
                      value: question.answer,
                      onValueChange: (value: string) => onChange({ answer: value }),
                      options: [
                        { label: t("answer.true"), value: "true" },
                        { label: t("answer.false"), value: "false" },
                      ],
                    },
                  }
                : {
                    id: `${question.id}-answer`,
                    label: t("fields.answer"),
                    variant: FieldVariant.TEXT,
                    placeholder: t("fields.answerPlaceholder"),
                    props: { value: question.answer ?? "", onChange: (value: string) => onChange({ answer: value }) },
                  },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className="rounded-lg border bg-background p-4">
      <FormBuilder structure={structure} />
    </div>
  );
}
