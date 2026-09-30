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

interface UseCreateCurriculumExamFormStructureProps {
  curriculumExamStore: CurriculumExamStore;
}

export const useCreateCurriculumExamFormStructure = ({
  curriculumExamStore,
}: UseCreateCurriculumExamFormStructureProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");
  const getError = (err?: string[]) => err?.[0];

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: tCommon("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tCommon("fields.titlePlaceholder"),
    description: tCommon("fields.titleDescription"),
    error: getError(curriculumExamStore.createDtoErrors?.title),
    props: {
      value: curriculumExamStore.createDto.title || "",
      onChange: (value) => {
        curriculumExamStore.setNested("createDto.title", value);
        curriculumExamStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  const durationField: Field<NumberFieldProps> = {
    id: "durationMinutes",
    label: tCommon("fields.durationMinutes", {
      defaultValue: "Duration (Minutes)",
    }),
    variant: FieldVariant.NUMBER,
    placeholder: "30",
    description: tCommon("fields.durationHint", {
      defaultValue: "Exam duration in minutes",
    }),
    props: {
      value: curriculumExamStore.createDto.durationMinutes ?? 30,
      onChange: (value) => {
        curriculumExamStore.setNested("createDto.durationMinutes", value);
      },
    },
  };

  const passingScoreField: Field<NumberFieldProps> = {
    id: "passingScore",
    label: tCommon("fields.passingScore", { defaultValue: "Passing Score" }),
    variant: FieldVariant.NUMBER,
    placeholder: "60",
    description: tCommon("fields.passingScoreHint", {
      defaultValue: "Minimum score required to pass",
    }),
    props: {
      value: curriculumExamStore.createDto.passingScore ?? 60,
      onChange: (value) => {
        curriculumExamStore.setNested("createDto.passingScore", value);
      },
    },
  };

  const descriptionField: Field<EditorFieldProps> = {
    id: "description",
    label: tCommon("fields.description"),
    variant: FieldVariant.EDITOR,
    placeholder: tCommon("fields.descriptionPlaceholder"),
    description: tCommon("fields.descriptionHint"),
    error: getError(curriculumExamStore.createDtoErrors?.description),
    props: {
      height: 200,
      value: curriculumExamStore.createDto.description || "",
      onChange: (value: string) => {
        curriculumExamStore.setNested("createDto.description", value);
      },
    },
  };

  const createCurriculumExamFormStructure: FormStructure = {
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

  return { createCurriculumExamFormStructure };
};
