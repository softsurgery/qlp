import {
  Field,
  FieldVariant,
  FormStructure,
  EditorFieldProps,
  TextFieldProps,
  NumberFieldProps,
} from "@qlp/form-builder";
import { useTranslation } from "react-i18next";
import { CurriculumExamStore } from "../../../hooks/stores/useCurriculumExamStore";

interface UseUpdateCurriculumExamFormStructureProps {
  curriculumExamStore: CurriculumExamStore;
}

export const useUpdateCurriculumExamFormStructure = ({
  curriculumExamStore,
}: UseUpdateCurriculumExamFormStructureProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
    error: getError(curriculumExamStore.updateDtoErrors?.title),
    props: {
      value: curriculumExamStore.updateDto.title || "",
      onChange: (value) => {
        curriculumExamStore.setNested("updateDto.title", value);
        curriculumExamStore.setNested("updateDtoErrors.title", []);
      },
    },
  };

  const durationField: Field<NumberFieldProps> = {
    id: "durationMinutes",
    label: tCommon("fields.durationMinutes", { defaultValue: "Duration (Minutes)" }),
    variant: FieldVariant.NUMBER,
    placeholder: "30",
    description: tCommon("fields.durationHint", { defaultValue: "Exam duration in minutes" }),
    props: {
      value: curriculumExamStore.updateDto.durationMinutes ?? 30,
      onChange: (value) => {
        curriculumExamStore.setNested("updateDto.durationMinutes", value);
      },
    },
  };

  const passingScoreField: Field<NumberFieldProps> = {
    id: "passingScore",
    label: tCommon("fields.passingScore", { defaultValue: "Passing Score" }),
    variant: FieldVariant.NUMBER,
    placeholder: "60",
    description: tCommon("fields.passingScoreHint", { defaultValue: "Minimum score required to pass" }),
    props: {
      value: curriculumExamStore.updateDto.passingScore ?? 60,
      onChange: (value) => {
        curriculumExamStore.setNested("updateDto.passingScore", value);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
    error: getError(curriculumExamStore.updateDtoErrors?.description),
    props: {
      height: 200,
      value: curriculumExamStore.updateDto.description || "",
      onChange: (value: string) => {
        curriculumExamStore.setNested("updateDto.description", value);
      },
    },
  };

  const updateCurriculumExamFormStructure: FormStructure = {
    fieldsets: [
      {
        rows: [
          { fields: [titleField] },
          { fields: [durationField, passingScoreField] },
          { fields: [descriptionField] },
        ],
      },
    ],
  };

  return { updateCurriculumExamFormStructure };
};
