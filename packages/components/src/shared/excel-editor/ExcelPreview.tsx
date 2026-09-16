import type { CSSProperties } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from "@qlp/ui";
import { excelEditorToGrid, type ExcelEditorCell } from "./utils";

function previewCellStyle(cell: ExcelEditorCell, header?: boolean): CSSProperties {
  const decorations = [
    cell.underline ? "underline" : "",
    cell.strikethrough ? "line-through" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return {
    color:
      cell.color && cell.color !== "transparent" ? cell.color : undefined,
    backgroundColor:
      cell.background && cell.background !== "transparent"
        ? cell.background
        : undefined,
    fontWeight: cell.bold ? 700 : header ? 400 : undefined,
    fontStyle: cell.italic ? "italic" : undefined,
    textDecoration: decorations || undefined,
    textAlign: cell.align,
    verticalAlign: cell.verticalAlign,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    fontSize: cell.fontSize ? `${cell.fontSize}pt` : undefined,
    fontFamily: cell.fontFamily,
  };
}

function PreviewCell({
  cell,
  header,
}: {
  cell: ExcelEditorCell;
  header?: boolean;
}) {
  const style = previewCellStyle(cell, header);
  const className = cell.color ? undefined : "text-foreground";
  if (header) {
    return (
      <TableHead className={className} style={style}>
        {cell.text}
      </TableHead>
    );
  }
  return (
    <TableCell className={className} style={style}>
      {cell.text}
    </TableCell>
  );
}

export function ExcelPreview({
  className,
  content,
}: {
  className?: string;
  content?: string;
}) {
  const grid = excelEditorToGrid(content);
  if (grid.length === 0) return null;
  const [header, ...rows] = grid;

  return (
    <div className={cn("overflow-x-auto rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {header.map((cell, index) => (
              <PreviewCell key={index} cell={cell} header />
            ))}
          </TableRow>
        </TableHeader>
        {rows.length > 0 ? (
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-transparent">
                {row.map((cell, cellIndex) => (
                  <PreviewCell key={cellIndex} cell={cell} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : null}
      </Table>
    </div>
  );
}
