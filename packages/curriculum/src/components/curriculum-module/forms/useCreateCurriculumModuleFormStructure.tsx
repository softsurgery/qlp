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
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
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
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
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
