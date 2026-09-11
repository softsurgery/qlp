import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumStore } from "../hooks/stores/useCurriculumStore";
import { slugify } from "../utils";

interface UseUpdateCurriculumFormStructureProps {
  curriculumStore: CurriculumStore;
}

export const useUpdateCurriculumFormStructure = ({
  curriculumStore,
}: UseUpdateCurriculumFormStructureProps) => {
  const { t } = useTranslation("curriculum");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
    error: getError(curriculumStore.updateDtoErrors?.title),
    props: {
      value: curriculumStore.updateDto.title || "",
      onChange: (value) => {
        curriculumStore.setNested("updateDto.title", value);
        curriculumStore.setNested("updateDto.slug", slugify(value)); // auto-generate slug
        curriculumStore.setNested("updateDtoErrors.title", []);
      },
    },
  };

  const slugField: Field<TextFieldProps> = {
    id: "slug",
    label: t("fields.slug"),
    variant: FieldVariant.TEXT,
    placeholder: t("fields.slugPlaceholder"),
    description: t("fields.slugDescription"),
    error: getError(curriculumStore.updateDtoErrors?.slug),
    props: {
      value: curriculumStore.updateDto.slug || "",
      onChange: (value) => {
        curriculumStore.setNested("updateDto.slug", value);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: t("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
    error: getError(curriculumStore.updateDtoErrors?.description),
    props: {
      height: 500,
      value: curriculumStore.updateDto.description || "",
      onChange: (value: string) => {
        curriculumStore.setNested("updateDto.description", value);
      },
    },
  };

  const updateCurriculumFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [
          { fields: [titleField, slugField] },
          { fields: [descriptionField] },
        ],
      },
    ],
  };

  return { updateCurriculumFormStructure };
};
