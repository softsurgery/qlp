import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumModuleStore } from "../../../hooks/stores/useCurriculumModuleStore";

interface UseUpdateCurriculumModuleFormStructureProps {
  curriculumModuleStore: CurriculumModuleStore;
}

export const useUpdateCurriculumModuleFormStructure = ({
  curriculumModuleStore,
}: UseUpdateCurriculumModuleFormStructureProps) => {
  const { t } = useTranslation("curriculum");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("fields.title", "Title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
    error: getError(curriculumModuleStore.updateDtoErrors?.title),
    props: {
      value: curriculumModuleStore.updateDto.title || "",
      onChange: (value) => {
        curriculumModuleStore.setNested("updateDto.title", value);
        curriculumModuleStore.setNested("updateDtoErrors.title", []);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: t("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
    error: getError(curriculumModuleStore.updateDtoErrors?.description),
    props: {
      height: 300,
      value: curriculumModuleStore.updateDto.description || "",
      onChange: (value: string) => {
        curriculumModuleStore.setNested("updateDto.description", value);
      },
    },
  };

  const updateCurriculumModuleFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [{ fields: [titleField] }, { fields: [descriptionField] }],
      },
    ],
  };

  return { updateCurriculumModuleFormStructure };
};
