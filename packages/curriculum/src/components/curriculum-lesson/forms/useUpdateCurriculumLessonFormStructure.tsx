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
  const { t } = useTranslation("curriculum");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("fields.title", "Title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
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
    label: t("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
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
