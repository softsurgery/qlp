import React from "react";
import { createPortal } from "react-dom";
import { Maximize, Minimize } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, cn, useTheme } from "@qlp/ui";
import type { IWorkbookData } from "@univerjs/presets";
import { ExcelPreview } from "./ExcelPreview";
import { ExcelFragmentFields } from "./ExcelFragmentFields";
import { UniverWorkbook } from "./UniverWorkbook";
import "./excel-editor.css";
import {
  colToLetter,
  normalizeRange,
  parseExcelEditor,
  stringifyExcelEditor,
  type ExcelEditorData,
  type ExcelEditorRange,
} from "./utils";

export interface ExcelEditorProps {
  className?: string;
  content?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (content: string) => void;
  height?: string;
  enableFragmentation?: boolean;
}

export function ExcelEditor({
  className,
  content,
  disabled,
  readOnly,
  onChange,
  height = "680px",
  enableFragmentation,
}: ExcelEditorProps) {
  if (readOnly) {
    return (
      <ExcelPreview
        className={cn("w-full min-w-0", className)}
        content={content}
      />
    );
  }

  return (
    <ExcelEditorWorkspace
      className={className}
      height={height}
      content={content}
      disabled={disabled}
      onChange={onChange}
      enableFragmentation={enableFragmentation}
    />
  );
}

function ExcelEditorWorkspace({
  className,
  content,
  disabled,
  onChange,
  height,
  enableFragmentation,
}: Omit<ExcelEditorProps, "readOnly">) {
  const { t, i18n } = useTranslation("excel-editor");
  const { resolvedTheme } = useTheme();
  const fieldId = React.useId();
  const editable = !disabled;
  const isDark = resolvedTheme === "dark";
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const parsedRef = React.useRef(parseExcelEditor(content));
  const [range, setRange] = React.useState(parsedRef.current.range);
  const [startColText, setStartColText] = React.useState(
    colToLetter(parsedRef.current.range.startCol),
  );
  const [endColText, setEndColText] = React.useState(
    colToLetter(parsedRef.current.range.endCol),
  );
  const [startRowText, setStartRowText] = React.useState(
    String(parsedRef.current.range.startRow + 1),
  );
  const [endRowText, setEndRowText] = React.useState(
    String(parsedRef.current.range.endRow + 1),
  );
  const [viewerKey, setViewerKey] = React.useState(0);
  const lastSerializedRef = React.useRef(
    stringifyExcelEditor(parsedRef.current),
  );

  const syncRangeFields = (next: ExcelEditorRange) => {
    setRange(next);
    setStartColText(colToLetter(next.startCol));
    setEndColText(colToLetter(next.endCol));
    setStartRowText(String(next.startRow + 1));
    setEndRowText(String(next.endRow + 1));
  };

  const commit = (next: Partial<ExcelEditorData>) => {
    const document: ExcelEditorData = {
      format: "univer",
      snapshot: next.snapshot ?? parsedRef.current.snapshot,
      range: normalizeRange(next.range ?? parsedRef.current.range),
    };
    const serialized = stringifyExcelEditor(document);
    parsedRef.current = document;
    if (serialized === lastSerializedRef.current) return;
    lastSerializedRef.current = serialized;
    syncRangeFields(document.range);
    if (!editable) return;
    onChange?.(serialized);
  };

  const commitRef = React.useRef(commit);
  commitRef.current = commit;

  const handleSnapshot = React.useCallback((snapshot: IWorkbookData) => {
    commitRef.current({ snapshot });
  }, []);

  const commitRange = (patch: Partial<ExcelEditorRange>) => {
    commit({ range: { ...range, ...patch } });
  };

  React.useEffect(() => {
    const next = parseExcelEditor(content);
    const serialized = stringifyExcelEditor(next);
    if (serialized === lastSerializedRef.current) return;
    parsedRef.current = next;
    lastSerializedRef.current = serialized;
    syncRangeFields(next.range);
    setViewerKey((value) => value + 1);
  }, [content]);

  const toggleFullscreen = () => {
    setIsFullscreen((open) => !open);
  };

  React.useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen]);

  const editor = (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden border bg-background excel-editor-shell",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-muted/40 px-2 py-1">
        {enableFragmentation && editable ? (
          <ExcelFragmentFields
            fieldId={fieldId}
            startColText={startColText}
            endColText={endColText}
            startRowText={startRowText}
            endRowText={endRowText}
            disabled={disabled}
            setStartColText={setStartColText}
            setEndColText={setEndColText}
            setStartRowText={setStartRowText}
            setEndRowText={setEndRowText}
            commitRange={commitRange}
          />
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="ms-auto"
          onClick={toggleFullscreen}
          title={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
        >
          {isFullscreen ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize className="size-4" />
          )}
          <span className="sr-only">
            {isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          </span>
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <UniverWorkbook
          key={`${isFullscreen ? "full" : "inline"}-${viewerKey}`}
          getSnapshot={() => parsedRef.current.snapshot}
          editable={editable}
          isDark={isDark}
          isFullscreen={isFullscreen}
          locale={i18n.language}
          onSnapshot={handleSnapshot}
        />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {isFullscreen ? (
        <div
          className={cn("w-full rounded-md border bg-muted/20", className)}
          style={{ height }}
        />
      ) : (
        <div className={cn("w-full", className)} style={{ height }}>
          {editor}
        </div>
      )}
      {isFullscreen
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex flex-col bg-background p-3">
              {editor}
            </div>,
            document.body,
          )
        : null}
    </React.Fragment>
  );
}
