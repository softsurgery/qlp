import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@qlp/ui";
import type { VersionedEntity } from "@qlp/api-client";
import { VersionBadge } from "./StatusBadge";

interface VersionHistoryProps<T extends VersionedEntity> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  load: () => Promise<T[]>;
  queryKey: unknown[];
  onSelect?: (item: T) => void;
}

export function VersionHistory<T extends VersionedEntity>({
  open,
  onOpenChange,
  load,
  queryKey,
  onSelect,
}: VersionHistoryProps<T>) {
  const { t } = useTranslation("curriculum");
  const query = useQuery({
    queryKey,
    queryFn: load,
    enabled: open,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("history")}</SheetTitle>
          <SheetDescription>{t("historyHint")}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-2">
          {(query.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">{t("noVersions")}</p>
          )}
          {(query.data ?? []).map((item) => (
            <button
              key={`${item.id}-${item.version}`}
              type="button"
              className="flex items-center justify-between rounded-md border p-3 text-left hover:bg-accent"
              onClick={() => onSelect?.(item)}
            >
              <div className="space-y-1">
                <VersionBadge version={item.version} isLatest={item.isLatest} />
                {item.updatedAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
              {onSelect && (
                <Button type="button" size="sm" variant="ghost">
                  {t("view")}
                </Button>
              )}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
