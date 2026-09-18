import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  Button,
  Input,
  Label,
} from "@qlp/ui";
import type { ResponseMediaRoomDto } from "@qlp/api-client";

export interface MeetingFormValues {
  title: string;
  description?: string;
  hostId?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  maxParticipants: number;
}

interface MeetingFormProps {
  meeting?: ResponseMediaRoomDto;
  defaultStart?: Date;
  isPending?: boolean;
  onSubmit: (values: MeetingFormValues) => void;
  onCancel: () => void;
}

const toLocalInput = (value?: string | Date | null) => {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

export function MeetingForm({
  meeting,
  defaultStart,
  isPending,
  onSubmit,
  onCancel,
}: MeetingFormProps) {
  const { t } = useTranslation("meetings");

  const initial = useMemo<MeetingFormValues>(() => {
    const start = meeting?.scheduledStartAt ?? defaultStart;
    const end =
      meeting?.scheduledEndAt ??
      (defaultStart ? new Date(defaultStart.getTime() + 3600_000) : undefined);
    return {
      title: meeting?.title ?? "",
      description: meeting?.description ?? "",
      hostId: meeting?.hostId,
      scheduledStartAt: toLocalInput(start),
      scheduledEndAt: toLocalInput(end),
      maxParticipants: meeting?.maxParticipants ?? 0,
    };
  }, [meeting, defaultStart]);

  const [values, setValues] = useState<MeetingFormValues>(initial);
  useEffect(() => setValues(initial), [initial]);

  const set = <K extends keyof MeetingFormValues>(
    key: K,
    value: MeetingFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const invalidRange =
    Boolean(values.scheduledStartAt) &&
    Boolean(values.scheduledEndAt) &&
    new Date(values.scheduledEndAt as string) <=
      new Date(values.scheduledStartAt as string);

  const canSubmit = values.title.trim().length > 0 && !invalidRange && !isPending;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          ...values,
          title: values.title.trim(),
          scheduledStartAt: values.scheduledStartAt
            ? new Date(values.scheduledStartAt).toISOString()
            : undefined,
          scheduledEndAt: values.scheduledEndAt
            ? new Date(values.scheduledEndAt).toISOString()
            : undefined,
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="meeting-title">{t("form.title")}</Label>
        <Input
          id="meeting-title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={t("form.titlePlaceholder")}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meeting-description">{t("form.description")}</Label>
        <Input
          id="meeting-description"
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="meeting-start">{t("form.startsAt")}</Label>
          <Input
            id="meeting-start"
            type="datetime-local"
            value={values.scheduledStartAt ?? ""}
            onChange={(e) => set("scheduledStartAt", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meeting-end">{t("form.endsAt")}</Label>
          <Input
            id="meeting-end"
            type="datetime-local"
            value={values.scheduledEndAt ?? ""}
            onChange={(e) => set("scheduledEndAt", e.target.value)}
          />
        </div>
      </div>
      {invalidRange && (
        <p className="text-xs text-destructive">{t("form.invalidRange")}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="meeting-capacity">{t("form.capacity")}</Label>
        <Input
          id="meeting-capacity"
          type="number"
          min={0}
          value={values.maxParticipants}
          onChange={(e) => set("maxParticipants", Number(e.target.value) || 0)}
        />
        <p className="text-xs text-muted-foreground">{t("form.capacityHint")}</p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("actions.cancel")}
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {meeting ? t("actions.save") : t("actions.create")}
        </Button>
      </div>
    </form>
  );
}
