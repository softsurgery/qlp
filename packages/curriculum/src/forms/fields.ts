import type { TFunction } from "i18next";
import {
  CurriculumStatus,
  ExamQuestionType,
  MaterialType,
} from "@qlp/api-client";
import {
  FieldVariant,
  type Field,
  type NumberFieldProps,
  type SelectFieldProps,
  type TextareaFieldProps,
  type TextFieldProps,
} from "@qlp/form-builder";

export function statusOptions(t: TFunction) {
  return Object.values(CurriculumStatus).map((value) => ({
    label: t(`status.${value}`),
    value,
  }));
}

export function materialTypeOptions(t: TFunction) {
  return Object.values(MaterialType).map((value) => ({
    label: t(`materialType.${value}`),
    value,
  }));
}

export function questionTypeOptions(t: TFunction) {
  return Object.values(ExamQuestionType).map((value) => ({
    label: t(`questionType.${value}`),
    value,
  }));
}

export function titleField(
  t: TFunction,
  value: string,
  onChange: (value: string) => void,
  error?: string,
): Field<TextFieldProps> {
  return {
    id: "title",
    label: t("fields.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("fields.titlePlaceholder"),
    description: t("fields.titleDescription"),
    error,
    props: { value, onChange },
  };
}

export function slugField(
  t: TFunction,
  value: string,
  onChange: (value: string) => void,
): Field<TextFieldProps> {
  return {
    id: "slug",
    label: t("fields.slug"),
    variant: FieldVariant.TEXT,
    placeholder: t("fields.slugPlaceholder"),
    description: t("fields.slugDescription"),
    props: { value, onChange },
  };
}

export function descriptionField(
  t: TFunction,
  value: string,
  onChange: (value: string) => void,
): Field<TextareaFieldProps> {
  return {
    id: "description",
    label: t("fields.description"),
    variant: FieldVariant.TEXTAREA,
    placeholder: t("fields.descriptionPlaceholder"),
    description: t("fields.descriptionHint"),
    props: { value, onChange, rows: 4, resizable: true },
  };
}

export function statusField(
  t: TFunction,
  value: string,
  onChange: (value: string) => void,
): Field<SelectFieldProps> {
  return {
    id: "status",
    label: t("fields.status"),
    variant: FieldVariant.SELECT,
    description: t("fields.statusDescription"),
    props: {
      value,
      onValueChange: onChange,
      options: statusOptions(t),
    },
  };
}

export function sortOrderField(
  t: TFunction,
  value: number | undefined,
  onChange: (value: number | undefined) => void,
): Field<NumberFieldProps> {
  return {
    id: "sortOrder",
    label: t("fields.sortOrder"),
    variant: FieldVariant.NUMBER,
    description: t("fields.sortOrderDescription"),
    props: { value: value ?? 0, onChange, min: 0 },
  };
}
