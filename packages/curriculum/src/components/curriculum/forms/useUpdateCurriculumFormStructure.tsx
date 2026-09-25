import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
  SelectFieldProps,
  SelectOption,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumStore } from "../../../hooks/stores/useCurriculumStore";
import { slugify } from "@qlp/lib";

interface UseUpdateCurriculumFormStructureProps {
  curriculumStore: CurriculumStore;
  appType?: "admin" | "web";
  ownerOptions?: SelectOption[];
  disabled?: boolean;
}

export const useUpdateCurriculumFormStructure = ({
  curriculumStore,
  appType,
  ownerOptions,
  disabled,
}: UseUpdateCurriculumFormStructureProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
    error: getError(curriculumStore.updateDtoErrors?.title),
    props: {
      disabled,
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
    label: tCommon("fields.slug"),
    variant: FieldVariant.TEXT,
    placeholder: tCommon("fields.slugPlaceholder"),
    description: tCommon("fields.slugDescription"),
    error: getError(curriculumStore.updateDtoErrors?.slug),
    props: {
      disabled,
      value: curriculumStore.updateDto.slug || "",
      onChange: (value) => {
        curriculumStore.setNested("updateDto.slug", value);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
    error: getError(curriculumStore.updateDtoErrors?.description),
    props: {
      disabled,
      height: 500,
      value: curriculumStore.updateDto.description || "",
      onChange: (value: string) => {
        curriculumStore.setNested("updateDto.description", value);
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
      curriculumStore.updateDtoErrors?.ownerId as string[] | undefined,
    ),
    props: {
      disabled,
      options: ownerOptions || [],
      value: curriculumStore.updateDto.ownerId,
      onValueChange: (value) => {
        curriculumStore.set("updateDto", {
          ...curriculumStore.updateDto,
          ownerId: value,
        });
      },
    },
  };

  const updateCurriculumFormStructure: FormStructure = {
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

  return { updateCurriculumFormStructure };
};
