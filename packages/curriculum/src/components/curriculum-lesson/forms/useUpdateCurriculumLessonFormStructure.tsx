import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumLessonStore } from "../../../hooks/stores/useCurriculumLessonStore";

interface UseUpdateCurriculumLessonFormStructureProps {
  curriculumLessonStore: CurriculumLessonStore;
}

export const useUpdateCurriculumLessonFormStructure = ({
  curriculumLessonStore,
}: UseUpdateCurriculumLessonFormStructureProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
    error: getError(curriculumLessonStore.updateDtoErrors?.title),
    props: {
      value: curriculumLessonStore.updateDto.title || "",
      onChange: (value) => {
        curriculumLessonStore.setNested("updateDto.title", value);
        curriculumLessonStore.setNested("updateDtoErrors.title", []);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
    error: getError(curriculumLessonStore.updateDtoErrors?.description),
    props: {
      height: 300,
      value: curriculumLessonStore.updateDto.description || "",
      onChange: (value: string) => {
        curriculumLessonStore.setNested("updateDto.description", value);
      },
    },
  };

  const updateCurriculumLessonFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [{ fields: [titleField] }, { fields: [descriptionField] }],
      },
    ],
  };

  return { updateCurriculumLessonFormStructure };
};
