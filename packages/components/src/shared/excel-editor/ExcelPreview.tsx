import { cn, useTheme } from "@qlp/ui";
import { excelEditorPreviewLayout, type ExcelEditorCell } from "./utils";
import {
  documentExcelColorScheme,
  readExcelThemeTokens,
  resolveExcelCellColors,
  type ExcelCellPaint,
  type ExcelColorScheme,
  type ExcelThemeTokens,
} from "./theme";
import "./excel-editor.css";
import React from "react";

function useExcelPreviewPalette() {
  const { resolvedTheme } = useTheme();
  const [scheme, setScheme] = React.useState<ExcelColorScheme>(() =>
    documentExcelColorScheme(),
  );

  React.useEffect(() => {
    const apply = () => setScheme(documentExcelColorScheme());
    apply();
    const root = document.documentElement;
    const observer = new MutationObserver(apply);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, [resolvedTheme]);

  const tokens = React.useMemo(
    () => readExcelThemeTokens(scheme),
    [scheme],
  );

  return { isDark: scheme === "dark", tokens };
}

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
    fontWeight: cell.bold ? 700 : header ? 500 : undefined,
    fontStyle: cell.italic ? "italic" : undefined,
    textDecoration: decorations || undefined,
    textAlign: cell.align,
    verticalAlign: cell.verticalAlign,
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
  return (
    <div
      role={header ? "columnheader" : "cell"}
      className={cn(
        "excel-editor-preview-cell min-w-0",
        header && "excel-editor-preview-header",
        paint.inkFollowsTheme && "text-foreground",
      )}
      style={style}
    >
      {cell.text}
    </div>
  );
}

export function ExcelPreview({
  className,
  content,
}: {
  className?: string;
  content?: string;
}) {
  const { isDark, tokens } = useExcelPreviewPalette();
  const layout = excelEditorPreviewLayout(content);
  if (!layout) return null;
  const { grid, columnWidthPercents } = layout;

  return (
    <div
      className={cn(
        "excel-editor-preview w-full min-w-0 max-w-full overflow-x-auto rounded-md border",
        className,
      )}
    >
      <div
        role="table"
        className="excel-editor-preview-grid w-full min-w-0"
        style={{
          gridTemplateColumns: columnWidthPercents
            .map((width) => `minmax(0, ${width}fr)`)
            .join(" "),
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} role="row" className="contents">
            {row.map((cell, cellIndex) => (
              <PreviewCell
                key={cellIndex}
                cell={cell}
                header={rowIndex === 0}
                isDark={isDark}
                tokens={tokens}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
