import { Badge } from "@qlp/ui";
import { useTranslation } from "react-i18next";
import { CurriculumStatus } from "@qlp/api-client";

const variants: Record<string, "secondary" | "default" | "outline"> = {
  [CurriculumStatus.Draft]: "secondary",
  [CurriculumStatus.Published]: "default",
  [CurriculumStatus.Archived]: "outline",
};

export function StatusBadge({ status }: { status?: string }) {
  const { t } = useTranslation("curriculum");
  if (!status) return null;
  return (
    <Badge variant={variants[status] ?? "secondary"}>
      {t(`status.${status}`, { defaultValue: status })}
    </Badge>
  );
}

export function VersionBadge({
  version,
  isLatest,
}: {
  version?: number;
  isLatest?: boolean;
}) {
  const { t } = useTranslation("curriculum");
  if (version == null) return null;
  return (
    <Badge variant="outline">
      {t("version", { version })}
      {isLatest ? ` · ${t("latest")}` : ""}
    </Badge>
  );
}
