import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { FormBuilder, type FormStructure } from "@qlp/form-builder";
import { Button } from "@qlp/ui";
import { CurriculumStatus, type CreateCurriculumDto } from "@qlp/api-client";
import { slugify } from "../utils";
import { descriptionField, slugField, statusField, titleField } from "./fields";

interface CreateCurriculumFormProps {
  pending?: boolean;
  onCancel: () => void;
  onSubmit: (dto: CreateCurriculumDto) => void;
}

export function CreateCurriculumForm({
  pending,
  onCancel,
  onSubmit,
}: CreateCurriculumFormProps) {
  const { t } = useTranslation("curriculum");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(CurriculumStatus.Draft);
  const [titleError, setTitleError] = useState<string>();

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setTitleError(undefined);
    if (!slugTouched) setSlug(slugify(value));
  };

  const structure: FormStructure = {
    fieldsets: [
      {
        rows: [
          { fields: [titleField(t, title, handleTitleChange, titleError)] },
          { fields: [slugField(t, slug, (value) => {
            setSlugTouched(true);
            setSlug(value);
          })] },
          { fields: [descriptionField(t, description, setDescription)] },
          { fields: [statusField(t, status, (value) => setStatus(value as CurriculumStatus))] },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <FormBuilder structure={structure} />
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
          {t("cancel")}
        </Button>
        <Button
          type="button"
          disabled={pending}
          onClick={() => {
            if (!title.trim()) {
              setTitleError(t("errors.titleRequired"));
              return;
            }
            onSubmit({
              title: title.trim(),
              slug: slug.trim() || undefined,
              description: description.trim() || undefined,
              status,
            });
          }}
        >
          <Save className="size-4" />
          {pending ? t("saving") : t("create")}
        </Button>
      </div>
    </div>
  );
}
