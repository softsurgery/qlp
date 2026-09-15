import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qlp/ui";
import {
  parseMaterialTable,
  stringifyMaterialTable,
  type MaterialTableData,
} from "../../utils/material-table";

interface MaterialTableEditorProps {
  content?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (content: string) => void;
}

function updateTable(
  table: MaterialTableData,
  recipe: (next: MaterialTableData) => void,
) {
  const next: MaterialTableData = {
    columns: [...table.columns],
    rows: table.rows.map((row) => [...row]),
  };
  recipe(next);
  return stringifyMaterialTable(next);
}

export function MaterialTableEditor({
  content,
  disabled,
  readOnly,
  onChange,
}: MaterialTableEditorProps) {
  const { t } = useTranslation("curriculum");
  const table = parseMaterialTable(content);
  const locked = disabled || readOnly;

  const setColumn = (index: number, value: string) => {
    if (locked) return;
    onChange?.(
      updateTable(table, (next) => {
        next.columns[index] = value;
      }),
    );
  };

  const setCell = (rowIndex: number, columnIndex: number, value: string) => {
    if (locked) return;
    onChange?.(
      updateTable(table, (next) => {
        next.rows[rowIndex][columnIndex] = value;
      }),
    );
  };

  const addColumn = () => {
    if (locked) return;
    onChange?.(
      updateTable(table, (next) => {
        next.columns.push("");
        next.rows.forEach((row) => row.push(""));
      }),
    );
  };

  const removeColumn = (index: number) => {
    if (locked || table.columns.length <= 1) return;
    onChange?.(
      updateTable(table, (next) => {
        next.columns.splice(index, 1);
        next.rows.forEach((row) => row.splice(index, 1));
      }),
    );
  };

  const addRow = () => {
    if (locked) return;
    onChange?.(
      updateTable(table, (next) => {
        next.rows.push(next.columns.map(() => ""));
      }),
    );
  };

  const removeRow = (index: number) => {
    if (locked || table.rows.length <= 1) return;
    onChange?.(
      updateTable(table, (next) => {
        next.rows.splice(index, 1);
      }),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column, index) => (
                <TableHead
                  key={`column-${index}`}
                  className="min-w-36 align-top"
                >
                  {readOnly ? (
                    <span className="font-medium">
                      {column || t("columnN", { n: index + 1 })}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Input
                        value={column}
                        disabled={disabled}
                        placeholder={t("columnN", { n: index + 1 })}
                        onChange={(event) =>
                          setColumn(index, event.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={disabled || table.columns.length <= 1}
                        onClick={() => removeColumn(index)}
                        title={t("removeColumn", "Remove column")}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">
                          {t("removeColumn", "Remove column")}
                        </span>
                      </Button>
                    </div>
                  )}
                </TableHead>
              ))}
              {!readOnly ? <TableHead className="w-10" /> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {row.map((cell, columnIndex) => (
                  <TableCell key={`cell-${rowIndex}-${columnIndex}`}>
                    {readOnly ? (
                      <span className="whitespace-pre-wrap">{cell}</span>
                    ) : (
                      <Input
                        value={cell}
                        disabled={disabled}
                        onChange={(event) =>
                          setCell(rowIndex, columnIndex, event.target.value)
                        }
                      />
                    )}
                  </TableCell>
                ))}
                {!readOnly ? (
                  <TableCell className="w-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={disabled || table.rows.length <= 1}
                      onClick={() => removeRow(rowIndex)}
                      title={t("removeRow", "Remove row")}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">
                        {t("removeRow", "Remove row")}
                      </span>
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!readOnly ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addRow}
          >
            <Plus className="size-4" />
            {t("addRow", "Add row")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addColumn}
          >
            <Plus className="size-4" />
            {t("addColumn", "Add column")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
