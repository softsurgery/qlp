import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  EditorFieldProps,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumStore } from "../hooks/stores/useCurriculumStore";
import { CurriculumStatus } from "@qlp/api-client";
import { slugify } from "../utils";

interface UseCreateCurriculumFormStructureProps {
  curriculumStore: CurriculumStore;
}

export const useCreateCurriculumFormStructure = ({
  curriculumStore,
}: UseCreateCurriculumFormStructureProps) => {
  const { t } = useTranslation("curriculum");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
    error: getError(curriculumStore.createDtoErrors?.title),
    props: {
      value: curriculumStore.createDto.title || "",
      onChange: (value) => {
        curriculumStore.setNested("createDto.title", value);
        curriculumStore.setNested("createDto.slug", slugify(value)); // auto-generate slug
        curriculumStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  const slugField: Field<TextFieldProps> = {
    id: "slug",
    label: t("fields.slug"),
    variant: FieldVariant.TEXT,
    placeholder: t("fields.slugPlaceholder"),
    description: t("fields.slugDescription"),
    error: getError(curriculumStore.createDtoErrors?.slug),
    props: {
      value: curriculumStore.createDto.slug || "",
      onChange: (value) => {
        curriculumStore.setNested("createDto.slug", value);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: t("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
    error: getError(curriculumStore.createDtoErrors?.description),
    props: {
      height: 500,
      value: curriculumStore.createDto.description || "",
      onChange: (value: string) => {
        curriculumStore.setNested("createDto.description", value);
      },
    },
  };

  const statusField: Field<SelectFieldProps> = {
    id: "status",
    label: t("fields.status"),
    variant: FieldVariant.SELECT,
    required: true,
    description: t("fields.statusDescription"),
    error: getError(curriculumStore.createDtoErrors?.status),
    props: {
      options: Object.values(CurriculumStatus).map((status) => ({
        label: t(`status.${status}`),
        value: status,
      })),
      value: curriculumStore.createDto.status,
      onValueChange: (value) => {
        curriculumStore.set("createDto", {
          ...curriculumStore.createDto,
          status: value as CurriculumStatus,
        });
      },
    },
  };

  const createCurriculumFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [
          { fields: [titleField, slugField] },
          { fields: [descriptionField] },
        ],
      },
    ],
  };

  return { createCurriculumFormStructure };
};
