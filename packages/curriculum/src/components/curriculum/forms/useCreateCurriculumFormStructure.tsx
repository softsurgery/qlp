import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  EditorFieldProps,
  TextFieldProps,
  SelectOption,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumStore } from "../../../hooks/stores/useCurriculumStore";
import { CurriculumStatus } from "@qlp/api-client";
import { slugify } from "@qlp/lib";

interface UseCreateCurriculumFormStructureProps {
  curriculumStore: CurriculumStore;
  appType?: "admin" | "web";
  ownerOptions?: SelectOption[];
}

export const useCreateCurriculumFormStructure = ({
  curriculumStore,
  appType,
  ownerOptions,
}: UseCreateCurriculumFormStructureProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
    error: getError(curriculumStore.createDtoErrors?.title),
    props: {
      value: curriculumStore.createDto.title || "",
      onChange: (value) => {
        curriculumStore.setNested("createDto.title", value);
        curriculumStore.setNested("createDto.slug", slugify(value));
        curriculumStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  const slugField: Field<TextFieldProps> = {
    id: "slug",
    label: tCommon("fields.slug"),
    variant: FieldVariant.TEXT,
    placeholder: tCommon("fields.slugPlaceholder"),
    description: tCommon("fields.slugDescription"),
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
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
    error: getError(curriculumStore.createDtoErrors?.description),
    props: {
      height: 500,
      value: curriculumStore.createDto.description || "",
      onChange: (value: string) => {
        curriculumStore.setNested("createDto.description", value);
      },
    },
  };

  const ownerField: Field<SelectFieldProps> = {
    id: "ownerId",
    label: tCommon("fields.owner"),
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: tCommon("fields.ownerPlaceholder"),
    description: tCommon(
      "fields.ownerDescription"
    ),
    error: getError(
      curriculumStore.createDtoErrors?.ownerId as string[] | undefined,
    ),
    props: {
      options: ownerOptions || [],
      value: curriculumStore.createDto.ownerId,
      onValueChange: (value) => {
        curriculumStore.set("createDto", {
          ...curriculumStore.createDto,
          ownerId: value,
        });
      },
    },
  };

  const createCurriculumFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [
          { fields: [titleField, slugField] },
          ...(appType === "admin" ? [{ fields: [ownerField] }] : []),
          { fields: [descriptionField] },
        ],
      },
    ],
  };

  return { createCurriculumFormStructure };
};
