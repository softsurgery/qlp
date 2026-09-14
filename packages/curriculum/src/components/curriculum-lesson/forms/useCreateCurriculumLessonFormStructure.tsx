import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumLessonStore } from "../../../hooks/stores/useCurriculumLessonStore";

interface UseCreateCurriculumLessonFormStructureProps {
  curriculumLessonStore: CurriculumLessonStore;
}

export const useCreateCurriculumLessonFormStructure = ({
  curriculumLessonStore,
}: UseCreateCurriculumLessonFormStructureProps) => {
  const { t } = useTranslation("curriculum");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("fields.title", "Title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
    error: getError(curriculumLessonStore.createDtoErrors?.title),
    props: {
      value: curriculumLessonStore.createDto.title || "",
      onChange: (value) => {
        curriculumLessonStore.setNested("createDto.title", value);
        curriculumLessonStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: t("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
    error: getError(curriculumLessonStore.createDtoErrors?.description),
    props: {
      height: 300,
      value: curriculumLessonStore.createDto.description || "",
      onChange: (value: string) => {
        curriculumLessonStore.setNested("createDto.description", value);
      },
    },
  };

  const createCurriculumLessonFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [{ fields: [titleField] }, { fields: [descriptionField] }],
      },
    ],
  };

  return { createCurriculumLessonFormStructure };
};
