import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  useTheme,
} from "@qlp/ui";
import { excelEditorPreviewLayout, type ExcelEditorCell } from "./utils";
import {
  readExcelThemeTokens,
  resolveExcelCellColors,
  type ExcelCellPaint,
  type ExcelThemeTokens,
} from "./theme";
import "./excel-editor.css";
import React from "react";

function previewCellStyle(
  cell: ExcelEditorCell,
  header: boolean | undefined,
  paint: ExcelCellPaint,
): React.CSSProperties {
  const decorations = [
    cell.underline ? "underline" : "",
    cell.strikethrough ? "line-through" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return {
    color: paint.ink,
    backgroundColor: paint.paper,
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
  isDark,
  tokens,
}: {
  cell: ExcelEditorCell;
  header?: boolean;
  isDark: boolean;
  tokens: ExcelThemeTokens;
}) {
  const paint = resolveExcelCellColors(cell, isDark, tokens);
  const style = previewCellStyle(cell, header, paint);
  const className = paint.inkFollowsTheme ? "text-foreground" : undefined;
  if (header) {
    return (
      <TableHead
        className={cn(className, "whitespace-pre-wrap break-words")}
        style={style}
      >
        {cell.text}
      </TableHead>
    );
  }
  return (
    <TableCell
      className={cn(className, "whitespace-pre-wrap break-words")}
      style={style}
    >
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tokens = React.useMemo(() => readExcelThemeTokens(), [theme]);
  const layout = excelEditorPreviewLayout(content);
  if (!layout) return null;
  const { grid, columnWidthPercents, rowHeightPercents, totalHeightPx } =
    layout;
  const [header, ...rows] = grid;

  return (
    <div
      className={cn(
        "excel-editor-preview w-full min-w-0 max-w-full overflow-x-auto rounded-md border",
        className,
      )}
    >
      <Table
        className="w-full min-w-full table-fixed"
        style={{
          height: totalHeightPx > 0 ? `${totalHeightPx}px` : undefined,
        }}
      >
        <colgroup>
          {columnWidthPercents.map((width, index) => (
            <col key={index} style={{ width: `${width}%` }} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={{ height: `${rowHeightPercents[0]}%` }}
          >
            {header.map((cell, index) => (
              <PreviewCell
                key={index}
                cell={cell}
                header
                isDark={isDark}
                tokens={tokens}
              />
            ))}
          </TableRow>
        </TableHeader>
        {rows.length > 0 ? (
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-transparent"
                style={{ height: `${rowHeightPercents[rowIndex + 1]}%` }}
              >
                {row.map((cell, cellIndex) => (
                  <PreviewCell
                    key={cellIndex}
                    cell={cell}
                    isDark={isDark}
                    tokens={tokens}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        ) : null}
      </Table>
    </div>
  );
}
