import { cn, Input, Label } from "@qlp/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { letterToCol, type ExcelEditorRange } from "./utils";

type FragmentFieldKey = "startCol" | "endCol" | "startRow" | "endRow";

interface ExcelFragmentFieldsProps {
  className?: string;
  fieldId: string;
  startColText: string;
  endColText: string;
  startRowText: string;
  endRowText: string;
  disabled?: boolean;
  setStartColText: (value: string) => void;
  setEndColText: (value: string) => void;
  setStartRowText: (value: string) => void;
  setEndRowText: (value: string) => void;
  commitRange: (patch: Partial<ExcelEditorRange>) => void;
}

export function ExcelFragmentFields({
  className,
  fieldId,
  startColText,
  endColText,
  startRowText,
  endRowText,
  disabled,
  setStartColText,
  setEndColText,
  setStartRowText,
  setEndRowText,
  commitRange,
}: ExcelFragmentFieldsProps) {
  const { t } = useTranslation("excel-editor");
  const fields: Array<{
    key: FragmentFieldKey;
    value: string;
    setValue: (value: string) => void;
    kind: "col" | "row";
  }> = [
    {
      key: "startCol",
      value: startColText,
      setValue: setStartColText,
      kind: "col",
    },
    {
      key: "endCol",
      value: endColText,
      setValue: setEndColText,
      kind: "col",
    },
    {
      key: "startRow",
      value: startRowText,
      setValue: setStartRowText,
      kind: "row",
    },
    {
      key: "endRow",
      value: endRowText,
      setValue: setEndRowText,
      kind: "row",
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {fields.map((field) => (
        <div key={field.key} className="flex items-center gap-1">
          <Label
            htmlFor={`${fieldId}-${field.key}`}
            className="text-xs font-normal text-muted-foreground"
          >
            {t(field.key)}
          </Label>
          <Input
            id={`${fieldId}-${field.key}`}
            type={field.kind === "row" ? "number" : undefined}
            min={field.kind === "row" ? 1 : undefined}
            value={field.value}
            disabled={disabled}
            className={
              field.kind === "col"
                ? "h-7 w-14 px-1.5 text-xs uppercase"
                : "h-7 w-16 px-1.5 text-xs"
            }
            onChange={(event) => {
              if (field.kind === "col") {
                const value = event.target.value.toUpperCase();
                field.setValue(value);
                const index = letterToCol(value);
                if (index != null) commitRange({ [field.key]: index });
                return;
              }
              const value = event.target.value;
              field.setValue(value);
              const row = Number(value);
              if (Number.isInteger(row) && row >= 1) {
                commitRange({ [field.key]: row - 1 });
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
