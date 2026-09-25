import React from "react";
import {
  FieldVariant,
  type FormStructure,
  type Field,
  type TextFieldProps,
  type SelectFieldProps,
  type NumberFieldProps,
} from "@qlp/form-builder";
import { ExamQuestionType, type ExamQuestion } from "@qlp/api-client";
import { useTranslation } from "react-i18next";

export interface UseQuestionItemFormStructureProps {
  question: ExamQuestion;
  itemId: string;
  disabled?: boolean;
  onUpdate: (patch: Partial<ExamQuestion>) => void;
}

export const useQuestionItemFormStructure = ({
  question,
  itemId,
  disabled,
  onUpdate,
}: UseQuestionItemFormStructureProps) => {
  const { t: tCommon } = useTranslation("curriculum-common");

  const promptField: Field<TextFieldProps> = React.useMemo(
    () => ({
      id: `prompt-${itemId}`,
      label: tCommon("fields.prompt", { defaultValue: "Question Prompt" }),
      variant: FieldVariant.TEXT,
      placeholder: tCommon("fields.promptPlaceholder", {
        defaultValue: "Enter question prompt...",
      }),
      description: tCommon("fields.promptDescription", {
        defaultValue: "Enter the main prompt or question text for learners.",
      }),
      wrapperClassName: "md:col-span-6",
      props: {
        value: question.prompt,
        onChange: (val) => onUpdate({ prompt: val }),
        disabled,
      },
    }),
    [itemId, question.prompt, disabled, onUpdate, tCommon],
  );

  const typeField: Field<SelectFieldProps> = React.useMemo(
    () => ({
      id: `type-${itemId}`,
      label: tCommon("fields.type", { defaultValue: "Question Type" }),
      variant: FieldVariant.SELECT,
      placeholder: tCommon("fields.questionTypePlaceholder", {
        defaultValue: "Select question type...",
      }),
      description: tCommon("fields.questionTypeDescription", {
        defaultValue:
          "Select the format of the question (Choice, Textarea, or Slider).",
      }),
      wrapperClassName: "md:col-span-4",
      props: {
        value: question.type,
        onValueChange: (val) => onUpdate({ type: val as ExamQuestionType }),
        disabled,
        options: [
          {
            label: tCommon("questionType.single_choice", {
              defaultValue: "Single Choice",
            }),
            value: ExamQuestionType.SingleChoice,
          },
          {
            label: tCommon("questionType.multiple_choice", {
              defaultValue: "Multiple Choice",
            }),
            value: ExamQuestionType.MultipleChoice,
          },
          {
            label: tCommon("questionType.textarea", {
              defaultValue: "Textarea (Open Answer)",
            }),
            value: ExamQuestionType.Textarea,
          },
          {
            label: tCommon("questionType.slider", {
              defaultValue: "Slider Range",
            }),
            value: ExamQuestionType.Slider,
          },
        ],
      },
    }),
    [itemId, question.type, disabled, onUpdate, tCommon],
  );

  const pointsField: Field<NumberFieldProps> = React.useMemo(
    () => ({
      id: `points-${itemId}`,
      label: tCommon("fields.points", { defaultValue: "Points" }),
      variant: FieldVariant.NUMBER,
      placeholder: tCommon("fields.pointsPlaceholder", { defaultValue: "1" }),
      description: tCommon("fields.pointsDescription", {
        defaultValue: "Points value awarded for this question.",
      }),
      wrapperClassName: "md:col-span-2",
      props: {
        value: question.points ?? 1,
        min: 0,
        onChange: (val) => onUpdate({ points: val ?? 0 }),
        disabled,
      },
    }),
    [itemId, question.points, disabled, onUpdate, tCommon],
  );

  const questionFormStructure: FormStructure = React.useMemo(
    () => ({
      fieldsets: [
        {
          rows: [
            {
              className: "grid grid-cols-1 md:grid-cols-12 gap-3",
              fields: [promptField, typeField, pointsField],
            },
          ],
        },
      ],
    }),
    [promptField, typeField, pointsField],
  );

  return { questionFormStructure };
};
