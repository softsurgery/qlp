import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, History, Pencil, CircleDot, PanelRight } from "lucide-react";
import {
  CurriculumStatus,
  type ResponseCurriculumDto,
  type ResponseCurriculumModuleDto,
} from "@qlp/api-client";
import { identifyUser } from "@qlp/lib";
import { Button, cn } from "@qlp/ui";
import { formatShortDate, moduleLessons, moduleExams } from "../utils";

interface CourseAsideProps {
  className?: string;
  curriculum: ResponseCurriculumDto;
  modules: ResponseCurriculumModuleDto[];
  onClose?: () => void;
}

export const CourseAside = ({
  curriculum,
  modules,
  className,
  onClose,
}: CourseAsideProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
    const { t: tModule } = useTranslation("curriculum-module");
    const { t: tLesson } = useTranslation("curriculum-lesson");
    const { t: tGlobal } = useTranslation("global");
  const navigate = useNavigate();
  const published =
    curriculum.status === CurriculumStatus.Published ||
    curriculum.status === "published";
  const lessonCount = modules.reduce(
    (sum, module) => sum + moduleLessons(module).length,
    0,
  );
  const examCount = modules.reduce(
    (sum, module) => sum + moduleExams(module).length,
    0,
  );
  const created = formatShortDate(curriculum.createdAt);
  const updated = formatShortDate(curriculum.updatedAt);
  const owner = curriculum.owner;
  const ownerName = owner ? identifyUser(owner) : null;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4",
        className,
      )}
    >
      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold">{tCommon("viewer.overview")}</h3>
          {onClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-me-1.5 -mt-1.5 shrink-0"
              onClick={onClose}
              aria-label={tCommon("viewer.close")}
            >
              <PanelRight className="size-4" />
            </Button>
          ) : null}
        </div>
        <div
          className={cn(
            "mt-3 rounded-lg p-3 text-sm",
            published
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
              : "bg-muted text-muted-foreground",
          )}
        >
          <p className="font-semibold">
            {published
              ? tCommon("viewer.publishedBannerTitle")
              : tCommon("viewer.draftBannerTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            {published ? tCommon("viewer.publishedBanner") : tCommon("viewer.draftBanner")}
          </p>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">
              {tCommon("columns.status")}
            </dt>
            <dd className="font-medium">
              {tCommon(`status.${curriculum.status}` as "status.draft")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {tCommon("columns.version")}
            </dt>
            <dd className="font-medium">
              {tCommon("viewer.versionLabel", { version: curriculum.version })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{tModule("modules")}</dt>
            <dd className="font-medium">
              {tCommon("viewer.modules", { count: modules.length })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{tLesson("lessons")}</dt>
            <dd className="font-medium">
              {tCommon("viewer.lessons", { count: lessonCount })}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">
              {tCommon("editor.exams")}
            </dt>
            <dd className="font-medium">
              {tCommon("viewer.exams", { count: examCount })}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold">{tCommon("viewer.timeline")}</h3>
        <ol className="mt-4 space-y-4 border-s-2 border-dashed border-border ps-4">
          {created ? (
            <li className="relative">
              <CircleDot className="absolute -start-[1.4rem] top-0.5 size-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {tCommon("viewer.startDate")}
              </p>
              <p className="text-sm font-medium">{created}</p>
            </li>
          ) : null}
          {updated ? (
            <li className="relative">
              <Calendar className="absolute -start-[1.4rem] top-0.5 size-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {tCommon("viewer.updatedDate")}
              </p>
              <p className="text-sm font-medium">{updated}</p>
            </li>
          ) : null}
          {ownerName ? (
            <li className="relative">
              <CircleDot className="absolute -start-[1.4rem] top-0.5 size-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {tCommon("columns.owner")}
              </p>
              <p className="text-sm font-medium">{ownerName}</p>
            </li>
          ) : null}
        </ol>
      </section>

      <section className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate(`/curriculum/${curriculum.id}/edit`)}
        >
          <Pencil className="size-4" />
          {tGlobal("edit")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate(`/curriculum/${curriculum.id}/versions`)}
        >
          <History className="size-4" />
          {tGlobal("history")}
        </Button>
      </section>
    </div>
  );
};
