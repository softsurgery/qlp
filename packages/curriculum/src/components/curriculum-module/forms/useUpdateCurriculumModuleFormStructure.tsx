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
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
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
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
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
