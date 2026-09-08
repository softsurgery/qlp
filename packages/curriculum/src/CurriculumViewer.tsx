import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Music,
  Pencil,
  Video,
} from "lucide-react";
import { Spinner } from "@qlp/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qlp/ui";
import type { CurriculumResource } from "@qlp/api-client";
import { StatusBadge, VersionBadge } from "./StatusBadge";
import { useCurriculumChrome } from "./useCurriculumChrome";

const materialIcons: Record<string, typeof FileText> = {
  video: Video,
  document: FileText,
  audio: Music,
  text: FileText,
  link: LinkIcon,
};

interface CurriculumViewerProps {
  api: CurriculumResource;
  basePath: string;
  curriculumId: string;
  version?: number;
  canEdit?: boolean;
  revealAnswers?: boolean;
}

export function CurriculumViewer({
  api,
  basePath,
  curriculumId,
  version,
  canEdit = true,
  revealAnswers = false,
}: CurriculumViewerProps) {
  const { t } = useTranslation("curriculum");
  const navigate = useNavigate();

  const treeQuery = useQuery({
    queryKey: ["curriculum", "tree", curriculumId, version],
    queryFn: () => api.findTree(curriculumId, version),
  });

  const tree = treeQuery.data;

  useCurriculumChrome(
    tree?.title || t("viewer.title"),
    tree?.description || t("description"),
    [
      { title: t("title"), href: basePath },
      { title: tree?.title || t("viewer.title") },
    ],
    true,
  );

  if (treeQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!tree) {
    return <p className="text-sm text-muted-foreground">{t("loadError")}</p>;
  }

  const lessonCount = tree.modules.reduce((sum, module) => sum + (module.lessons?.length ?? 0), 0);
  const examCount = tree.modules.reduce((sum, module) => sum + (module.exams?.length ?? 0), 0);
  const materialCount = tree.modules.reduce(
    (sum, module) =>
      sum +
      (module.lessons ?? []).reduce(
        (lessonSum, lesson) => lessonSum + (lesson.materials?.length ?? 0),
        0,
      ),
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(basePath)}>
            <ArrowLeft className="size-4" />
            {t("back")}
          </Button>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">{tree.title}</h2>
            <p className="font-mono text-sm text-muted-foreground">{tree.slug}</p>
            {tree.description && (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{tree.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={tree.status} />
            <VersionBadge version={tree.version} isLatest={tree.isLatest} />
          </div>
        </div>
        {canEdit && (
          <Button onClick={() => navigate(`${basePath}/${curriculumId}/edit`)}>
            <Pencil className="size-4" />
            {t("edit")}
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("editor.modules")} value={tree.modules.length} />
        <Stat label={t("editor.lessons")} value={lessonCount} />
        <Stat label={t("editor.materials")} value={materialCount} />
        <Stat label={t("editor.exams")} value={examCount} />
      </div>

      {tree.modules.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("viewer.noModules")}</CardTitle>
            <CardDescription>{t("viewer.noModulesHint")}</CardDescription>
          </CardHeader>
          {canEdit && (
            <CardContent>
              <Button onClick={() => navigate(`${basePath}/${curriculumId}/edit`)}>
                {t("edit")}
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={tree.modules.map((module) => module.id)}
          className="space-y-3"
        >
          {tree.modules.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id} className="rounded-xl border px-4">
              <AccordionTrigger>
                <div className="flex flex-col text-start">
                  <span className="font-semibold">
                    {moduleIndex + 1}. {module.title}
                  </span>
                  {module.description && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {module.description}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pb-4">
                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <BookOpen className="size-4" />
                    {t("editor.lessons")}
                  </h3>
                  {(module.lessons ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">{t("viewer.noLessons")}</p>
                  )}
                  {(module.lessons ?? []).map((lesson, lessonIndex) => (
                    <Card key={lesson.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          {lessonIndex + 1}. {lesson.title}
                        </CardTitle>
                        {lesson.description && (
                          <CardDescription>{lesson.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {(lesson.materials ?? []).length === 0 && (
                          <p className="text-sm text-muted-foreground">{t("viewer.noMaterials")}</p>
                        )}
                        {(lesson.materials ?? []).map((material) => {
                          const Icon = materialIcons[material.type] ?? FileText;
                          const href =
                            material.type === "link" || material.content?.startsWith("http")
                              ? material.content
                              : undefined;
                          return (
                            <div
                              key={material.id}
                              className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                            >
                              <Icon className="mt-0.5 size-4 text-muted-foreground" />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium">{material.title}</p>
                                  <Badge variant="outline">{t(`materialType.${material.type}`)}</Badge>
                                </div>
                                {material.description && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {material.description}
                                  </p>
                                )}
                                {href ? (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                  >
                                    {href}
                                    <ExternalLink className="size-3" />
                                  </a>
                                ) : (
                                  material.content && (
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                                      {material.content}
                                    </p>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))}
                </section>

                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <ClipboardList className="size-4" />
                    {t("editor.exams")}
                  </h3>
                  {(module.exams ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">{t("viewer.noExams")}</p>
                  )}
                  {(module.exams ?? []).map((exam) => (
                    <Card key={exam.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{exam.title}</CardTitle>
                        {exam.description && <CardDescription>{exam.description}</CardDescription>}
                        <div className="flex flex-wrap gap-2">
                          {exam.durationMinutes != null && (
                            <Badge variant="outline">
                              {t("viewer.duration", { minutes: exam.durationMinutes })}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {t("viewer.passing", { score: exam.passingScore })}
                          </Badge>
                          <Badge variant="outline">
                            {t("viewer.questions", { count: exam.questions?.length ?? 0 })}
                          </Badge>
                          <VersionBadge version={exam.version} isLatest={exam.isLatest} />
                        </div>
                      </CardHeader>
                      {revealAnswers && (
                        <CardContent className="space-y-3">
                          {(exam.questions ?? []).length === 0 && (
                            <p className="text-sm text-muted-foreground">{t("editor.noQuestions")}</p>
                          )}
                          {(exam.questions ?? []).map((question, index) => (
                            <div key={question.id} className="rounded-lg border p-3">
                              <p className="font-medium">
                                {index + 1}. {question.prompt}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {t(`questionType.${question.type}`)} · {question.points}{" "}
                                {t("fields.points").toLowerCase()}
                              </p>
                              {question.options?.length ? (
                                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
                                  {question.options.map((option) => (
                                    <li
                                      key={option}
                                      className={
                                        option === question.answer ? "font-medium text-primary" : undefined
                                      }
                                    >
                                      {option}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              {question.answer && (
                                <p className="mt-2 text-sm">
                                  {t("fields.answer")}: {question.answer}
                                </p>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </section>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="py-4">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
