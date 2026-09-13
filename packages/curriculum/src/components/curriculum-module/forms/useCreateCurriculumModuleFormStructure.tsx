import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";

interface UseCreateCurriculumModuleFormStructureProps {
  curriculumModuleStore: CurriculumModuleStore;
}

export const useCreateCurriculumModuleFormStructure = ({
  curriculumModuleStore,
}: UseCreateCurriculumModuleFormStructureProps) => {
  const { t } = useTranslation("curriculum");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("fields.title", "Title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
    error: getError(curriculumModuleStore.createDtoErrors?.title),
    props: {
      value: curriculumModuleStore.createDto.title || "",
      onChange: (value) => {
        curriculumModuleStore.setNested("createDto.title", value);
        curriculumModuleStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: t("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
    error: getError(curriculumModuleStore.createDtoErrors?.description),
    props: {
      height: 300,
      value: curriculumModuleStore.createDto.description || "",
      onChange: (value: string) => {
        curriculumModuleStore.setNested("createDto.description", value);
      },
    },
  };

  const createCurriculumModuleFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [{ fields: [titleField] }, { fields: [descriptionField] }],
      },
    ],
  };

  return { createCurriculumModuleFormStructure };
};
