import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Maximize, Minimize } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Input, Label, cn, useTheme } from "@qlp/ui";
import type { IWorkbookData } from "@univerjs/presets";
import { ExcelPreview } from "./ExcelPreview";
import { UniverWorkbook } from "./UniverWorkbook";
import {
  colToLetter,
  letterToCol,
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
}

export function ExcelEditor({
  className,
  content,
  disabled,
  readOnly,
  onChange,
}: ExcelEditorProps) {
  if (readOnly) {
    return <ExcelPreview className={className} content={content} />;
  }

  return (
    <ExcelEditorWorkspace
      className={className}
      content={content}
      disabled={disabled}
      onChange={onChange}
    />
  );
}

function ExcelEditorWorkspace({
  className,
  content,
  disabled,
  onChange,
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
  const lastSerializedRef = useRef(stringifyExcelEditor(parsedRef.current));

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

  const commitRef = useRef(commit);
  commitRef.current = commit;

  const handleSnapshot = useCallback((snapshot: IWorkbookData) => {
    commitRef.current({ snapshot });
  }, []);

  const commitRange = (patch: Partial<ExcelEditorRange>) => {
    commit({ range: { ...range, ...patch } });
  };

  useEffect(() => {
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

  useEffect(() => {
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
        "flex h-full min-h-0 w-full flex-col overflow-hidden border bg-background",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-muted/40 px-2 py-1">
        {editable ? (
          <>
            <div className="flex items-center gap-1">
              <Label
                htmlFor={`${fieldId}-start-col`}
                className="text-xs font-normal text-muted-foreground"
              >
                {t("startCol")}
              </Label>
              <Input
                id={`${fieldId}-start-col`}
                value={startColText}
                disabled={disabled}
                className="h-7 w-14 px-1.5 text-xs uppercase"
                onChange={(event) => {
                  const value = event.target.value.toUpperCase();
                  setStartColText(value);
                  const index = letterToCol(value);
                  if (index != null) commitRange({ startCol: index });
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Label
                htmlFor={`${fieldId}-end-col`}
                className="text-xs font-normal text-muted-foreground"
              >
                {t("endCol")}
              </Label>
              <Input
                id={`${fieldId}-end-col`}
                value={endColText}
                disabled={disabled}
                className="h-7 w-14 px-1.5 text-xs uppercase"
                onChange={(event) => {
                  const value = event.target.value.toUpperCase();
                  setEndColText(value);
                  const index = letterToCol(value);
                  if (index != null) commitRange({ endCol: index });
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Label
                htmlFor={`${fieldId}-start-row`}
                className="text-xs font-normal text-muted-foreground"
              >
                {t("startRow")}
              </Label>
              <Input
                id={`${fieldId}-start-row`}
                type="number"
                min={1}
                value={startRowText}
                disabled={disabled}
                className="h-7 w-16 px-1.5 text-xs"
                onChange={(event) => {
                  const value = event.target.value;
                  setStartRowText(value);
                  const row = Number(value);
                  if (Number.isInteger(row) && row >= 1) {
                    commitRange({ startRow: row - 1 });
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              <Label
                htmlFor={`${fieldId}-end-row`}
                className="text-xs font-normal text-muted-foreground"
              >
                {t("endRow")}
              </Label>
              <Input
                id={`${fieldId}-end-row`}
                type="number"
                min={1}
                value={endRowText}
                disabled={disabled}
                className="h-7 w-16 px-1.5 text-xs"
                onChange={(event) => {
                  const value = event.target.value;
                  setEndRowText(value);
                  const row = Number(value);
                  if (Number.isInteger(row) && row >= 1) {
                    commitRange({ endRow: row - 1 });
                  }
                }}
              />
            </div>
          </>
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
    <>
      {isFullscreen ? (
        <div
          className={cn(
            "h-[480px] w-full rounded-md border bg-muted/20",
            className,
          )}
        />
      ) : (
        <div className={cn("h-[480px] w-full", className)}>{editor}</div>
      )}
      {isFullscreen
        ? createPortal(
            <div className="fixed inset-0 z-[200] flex flex-col bg-background p-3">
              {editor}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
