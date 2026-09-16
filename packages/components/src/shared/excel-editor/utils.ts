import { strFromU8, unzipSync } from "fflate";
import {
  BooleanNumber,
  HorizontalAlign,
  LocaleType,
  VerticalAlign,
  WrapStrategy,
  type ICellData,
  type IStyleData,
  type IWorkbookData,
} from "@univerjs/presets";

export type ExcelEditorRange = {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
};

export type ExcelEditorData = {
  format: "univer";
  snapshot: IWorkbookData;
  range: ExcelEditorRange;
};

const WRAP_STYLE: IStyleData = { tb: WrapStrategy.WRAP };
const WIDE_RANGE: ExcelEditorRange = {
  startRow: 0,
  endRow: 199,
  startCol: 0,
  endCol: 51,
};

type FortuneCell = {
  r: number;
  c: number;
  v?: unknown;
};

type FortuneSheet = {
  name?: string;
  celldata?: FortuneCell[];
  data?: unknown[][];
};

export function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function colToLetter(index: number) {
  let position = Math.max(0, index) + 1;
  let letter = "";
  while (position > 0) {
    const remainder = (position - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    position = Math.floor((position - 1) / 26);
  }
  return letter;
}

export function letterToCol(value: string) {
  const letter = value.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(letter)) return null;
  let index = 0;
  for (const character of letter) {
    index = index * 26 + (character.charCodeAt(0) - 64);
  }
  return index - 1;
}

export function cellAddress(row: number, col: number) {
  return `${colToLetter(col)}${row + 1}`;
}

function parseA1(value: string) {
  const match = /^([A-Z]+)(\d+)$/i.exec(value.trim());
  if (!match) return null;
  const col = letterToCol(match[1]);
  const row = Number(match[2]) - 1;
  if (col == null || !Number.isInteger(row) || row < 0) return null;
  return { row, col };
}

export function defaultExcelEditorRange(): ExcelEditorRange {
  return { startRow: 0, endRow: 9, startCol: 0, endCol: 3 };
}

export function normalizeRange(
  range?: Partial<ExcelEditorRange> | null,
): ExcelEditorRange {
  const defaults = defaultExcelEditorRange();
  let startRow = Number.isFinite(range?.startRow)
    ? Math.max(0, Math.floor(range!.startRow!))
    : defaults.startRow;
  let endRow = Number.isFinite(range?.endRow)
    ? Math.max(0, Math.floor(range!.endRow!))
    : defaults.endRow;
  let startCol = Number.isFinite(range?.startCol)
    ? Math.max(0, Math.floor(range!.startCol!))
    : defaults.startCol;
  let endCol = Number.isFinite(range?.endCol)
    ? Math.max(0, Math.floor(range!.endCol!))
    : defaults.endCol;
  if (endRow < startRow) [startRow, endRow] = [endRow, startRow];
  if (endCol < startCol) [startCol, endCol] = [endCol, startCol];
  return { startRow, endRow, startCol, endCol };
}

function matrixToCelldata(data: unknown[][]): FortuneCell[] {
  const cells: FortuneCell[] = [];
  data.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell != null) cells.push({ r, c, v: cell });
    });
  });
  return cells;
}

function fortuneCells(sheet: FortuneSheet): FortuneCell[] {
  if (Array.isArray(sheet.celldata) && sheet.celldata.length > 0) {
    return sheet.celldata;
  }
  if (Array.isArray(sheet.data)) return matrixToCelldata(sheet.data);
  return [];
}

function inferRangeFromCells(
  cells: Array<{ r?: number; c?: number; row?: number; col?: number }>,
): ExcelEditorRange {
  let maxRow = 0;
  let maxCol = 0;
  for (const cell of cells) {
    maxRow = Math.max(maxRow, cell.row ?? cell.r ?? 0);
    maxCol = Math.max(maxCol, cell.col ?? cell.c ?? 0);
  }
  const defaults = defaultExcelEditorRange();
  return normalizeRange({
    startRow: 0,
    startCol: 0,
    endRow: Math.max(defaults.endRow, maxRow),
    endCol: Math.max(defaults.endCol, maxCol),
  });
}

function documentFromFortune(
  sheets: FortuneSheet[],
  range?: Partial<ExcelEditorRange>,
): ExcelEditorData {
  const named = sheets.map((sheet, index) => ({
    name: sheet.name || `Sheet${index + 1}`,
    cells: fortuneCells(sheet).map(fortuneToEditorCell),
  }));
  return {
    format: "univer",
    snapshot: sheetsToSnapshot(named),
    range: range ? normalizeRange(range) : inferRangeFromCells(named.flatMap((sheet) => sheet.cells)),
  };
}

function legacyToDocument(value: {
  columns: unknown[];
  rows: unknown[];
}): ExcelEditorData {
  const columns = value.columns.map((column) => String(column ?? ""));
  const rows = value.rows.map((row) =>
    Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : [],
  );
  const cells: FortuneCell[] = [];
  columns.forEach((column, c) => {
    if (!column.trim()) return;
    cells.push({ r: 0, c, v: { v: column, m: column } });
  });
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, c) => {
      if (!cell.trim()) return;
      cells.push({ r: rowIndex + 1, c, v: { v: cell, m: cell } });
    });
  });
  return documentFromFortune([{ name: "Sheet1", celldata: cells }]);
}

export function emptyExcelEditor(): ExcelEditorData {
  return {
    format: "univer",
    snapshot: emptySnapshot(),
    range: defaultExcelEditorRange(),
  };
}

export function parseExcelEditor(content?: string | null): ExcelEditorData {
  if (!content) return emptyExcelEditor();
  try {
    const parsed = JSON.parse(content) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return documentFromFortune(parsed as FortuneSheet[]);
    }
    if (parsed && typeof parsed === "object") {
      const document = parsed as {
        format?: string;
        snapshot?: IWorkbookData;
        xlsx?: string;
        sheets?: FortuneSheet[];
        range?: Partial<ExcelEditorRange>;
        columns?: unknown[];
        rows?: unknown[];
      };
      if (document.snapshot && typeof document.snapshot === "object") {
        return {
          format: "univer",
          snapshot: withDefaultWrap(document.snapshot),
          range: document.range
            ? normalizeRange(document.range)
            : defaultExcelEditorRange(),
        };
      }
      if (typeof document.xlsx === "string" && document.xlsx.length > 0) {
        return {
          format: "univer",
          snapshot: xlsxToSnapshot(base64ToBytes(document.xlsx)),
          range: document.range
            ? normalizeRange(document.range)
            : defaultExcelEditorRange(),
        };
      }
      if (Array.isArray(document.sheets) && document.sheets.length > 0) {
        return documentFromFortune(document.sheets, document.range);
      }
      if (Array.isArray(document.columns) && Array.isArray(document.rows)) {
        return legacyToDocument({
          columns: document.columns,
          rows: document.rows,
        });
      }
    }
    return emptyExcelEditor();
  } catch {
    return emptyExcelEditor();
  }
}

export function stringifyExcelEditor(data: ExcelEditorData): string {
  return JSON.stringify({
    format: "univer",
    snapshot: data.snapshot,
    range: normalizeRange(data.range),
  });
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function sharedStringsFromXml(xml: string) {
  const values: string[] = [];
  const items = xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/gi);
  for (const item of items) {
    const texts = [...item[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gi)];
    values.push(decodeXmlEntities(texts.map((match) => match[1]).join("")));
  }
  return values;
}

function inRange(row: number, col: number, range: ExcelEditorRange) {
  return (
    row >= range.startRow &&
    row <= range.endRow &&
    col >= range.startCol &&
    col <= range.endCol
  );
}

const DEFAULT_THEME = [
  "FFFFFF",
  "000000",
  "E7E6E6",
  "44546A",
  "4472C4",
  "ED7D31",
  "A5A5A5",
  "FFC000",
  "5B9BD5",
  "70AD47",
  "0563C1",
  "954F72",
];

export type ExcelEditorCellStyle = {
  color?: string;
  background?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  wrap?: boolean;
  fontSize?: number;
  fontFamily?: string;
};

export type ExcelEditorCell = ExcelEditorCellStyle & {
  text: string;
  formula?: string;
};

function emptySnapshot(): IWorkbookData {
  const sheetId = "sheet-1";
  return {
    id: "workbook",
    name: "Workbook",
    appVersion: "qlp",
    locale: LocaleType.EN_US,
    styles: {},
    sheetOrder: [sheetId],
    defaultStyle: WRAP_STYLE,
    sheets: {
      [sheetId]: {
        id: sheetId,
        name: "Sheet1",
        rowCount: 100,
        columnCount: 26,
        cellData: {},
        rowData: {},
        columnData: {},
        mergeData: [],
        defaultStyle: WRAP_STYLE,
      },
    },
  };
}

function withDefaultWrap(snapshot: IWorkbookData): IWorkbookData {
  return {
    ...snapshot,
    defaultStyle: { ...WRAP_STYLE, ...(snapshot.defaultStyle as IStyleData | undefined) },
  };
}

function fortuneToEditorCell(cell: FortuneCell): ExcelEditorCell & { row: number; col: number } {
  const raw = cell.v;
  const object =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
  const formula =
    object && typeof object.f === "string" && object.f.trim()
      ? object.f.trim()
      : undefined;
  const value = object ? (object.v ?? object.m) : raw;
  return {
    row: cell.r,
    col: cell.c,
    text: value == null ? "" : String(value),
    formula,
  };
}

function styleToUniver(cell: ExcelEditorCell): IStyleData {
  const style: IStyleData = { ...WRAP_STYLE };
  if (cell.color && cell.color !== "transparent") style.cl = { rgb: cell.color };
  if (cell.background && cell.background !== "transparent") {
    style.bg = { rgb: cell.background };
  }
  if (cell.bold) style.bl = BooleanNumber.TRUE;
  if (cell.italic) style.it = BooleanNumber.TRUE;
  if (cell.underline) style.ul = { s: BooleanNumber.TRUE };
  if (cell.strikethrough) style.st = { s: BooleanNumber.TRUE };
  if (cell.align === "left") style.ht = HorizontalAlign.LEFT;
  if (cell.align === "center") style.ht = HorizontalAlign.CENTER;
  if (cell.align === "right") style.ht = HorizontalAlign.RIGHT;
  if (cell.verticalAlign === "top") style.vt = VerticalAlign.TOP;
  if (cell.verticalAlign === "middle") style.vt = VerticalAlign.MIDDLE;
  if (cell.verticalAlign === "bottom") style.vt = VerticalAlign.BOTTOM;
  if (cell.wrap === false) style.tb = WrapStrategy.OVERFLOW;
  if (cell.fontSize) style.fs = cell.fontSize;
  if (cell.fontFamily) style.ff = cell.fontFamily;
  return style;
}

function styleFromUniver(style?: IStyleData | null): ExcelEditorCellStyle {
  if (!style) return { wrap: true };
  const color = style.cl?.rgb ?? undefined;
  const background = style.bg?.rgb ?? undefined;
  return {
    color: color && color !== "transparent" ? color : undefined,
    background:
      background && background !== "transparent" ? background : undefined,
    bold: style.bl === BooleanNumber.TRUE,
    italic: style.it === BooleanNumber.TRUE,
    underline: style.ul?.s === BooleanNumber.TRUE,
    strikethrough: style.st?.s === BooleanNumber.TRUE,
    align:
      style.ht === HorizontalAlign.LEFT
        ? "left"
        : style.ht === HorizontalAlign.CENTER
          ? "center"
          : style.ht === HorizontalAlign.RIGHT
            ? "right"
            : undefined,
    verticalAlign:
      style.vt === VerticalAlign.TOP
        ? "top"
        : style.vt === VerticalAlign.MIDDLE
          ? "middle"
          : style.vt === VerticalAlign.BOTTOM
            ? "bottom"
            : undefined,
    wrap: style.tb !== WrapStrategy.CLIP && style.tb !== WrapStrategy.OVERFLOW,
    fontSize: style.fs ?? undefined,
    fontFamily: style.ff ?? undefined,
  };
}

function sheetsToSnapshot(
  sheets: { name: string; cells: Array<ExcelEditorCell & { row: number; col: number }> }[],
): IWorkbookData {
  const workbook = emptySnapshot();
  const named = sheets.length > 0 ? sheets : [{ name: "Sheet1", cells: [] }];
  workbook.sheetOrder = [];
  workbook.sheets = {};
  named.forEach((sheet, index) => {
    const sheetId = `sheet-${index + 1}`;
    const cellData: IWorkbookData["sheets"][string]["cellData"] = {};
    let maxRow = 9;
    let maxCol = 25;
    for (const cell of sheet.cells) {
      maxRow = Math.max(maxRow, cell.row);
      maxCol = Math.max(maxCol, cell.col);
      const row = cellData[cell.row] ?? {};
      const next: ICellData = { s: styleToUniver(cell) };
      if (cell.formula) {
        next.f = cell.formula.startsWith("=") ? cell.formula : `=${cell.formula}`;
      }
      if (cell.text !== "") next.v = cell.text;
      row[cell.col] = next;
      cellData[cell.row] = row;
    }
    workbook.sheetOrder.push(sheetId);
    workbook.sheets[sheetId] = {
      id: sheetId,
      name: sheet.name || `Sheet${index + 1}`,
      rowCount: Math.max(100, maxRow + 1),
      columnCount: Math.max(26, maxCol + 1),
      cellData,
      rowData: {},
      columnData: {},
      mergeData: [],
      defaultStyle: WRAP_STYLE,
    };
  });
  return workbook;
}

function xlsxToSnapshot(bytes: Uint8Array): IWorkbookData {
  try {
    const cells = extractRangeCells(bytes, WIDE_RANGE);
    return sheetsToSnapshot([{ name: "Sheet1", cells }]);
  } catch {
    return emptySnapshot();
  }
}

function resolveCellStyle(
  snapshot: IWorkbookData,
  cell: ICellData,
  sheetStyle?: IStyleData | string | null,
): IStyleData {
  const fromId = (value?: IStyleData | string | null) => {
    if (value == null || typeof value === "boolean") return undefined;
    if (typeof value === "string") return snapshot.styles[value] ?? undefined;
    return value;
  };
  return {
    ...WRAP_STYLE,
    ...(fromId(snapshot.defaultStyle ?? undefined) ?? {}),
    ...(fromId(sheetStyle) ?? {}),
    ...(fromId(cell.s ?? undefined) ?? {}),
  };
}

function snapshotCellText(cell: ICellData): string {
  if (cell.v != null && String(cell.v).trim()) return String(cell.v);
  if (cell.f) return cell.f.startsWith("=") ? cell.f : `=${cell.f}`;
  return "";
}

function applyTint(hex: string, tint: number) {
  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
  return `#${channels
    .map((channel) => {
      const next =
        tint < 0
          ? Math.round(channel * (1 + tint))
          : Math.round(channel * (1 - tint) + 255 * tint);
      return Math.max(0, Math.min(255, next)).toString(16).padStart(2, "0");
    })
    .join("")}`;
}

function parseThemePalette(themeXml?: string) {
  if (!themeXml) return DEFAULT_THEME;
  const scheme = themeXml.match(
    /<(?:\w+:)?clrScheme\b[^>]*>([\s\S]*?)<\/(?:\w+:)?clrScheme>/i,
  )?.[1];
  if (!scheme) return DEFAULT_THEME;
  const colors = [...scheme.matchAll(/<(?:\w+:)?srgbClr\b[^>]*val="([^"]+)"/gi)]
    .map((match) => match[1].replace(/^#/, "").toUpperCase())
    .filter((value) => /^[0-9A-F]{6}$/.test(value));
  return colors.length >= 12 ? colors.slice(0, 12) : DEFAULT_THEME;
}

function colorFromAttrs(attrs: string, theme: string[]) {
  const rgb = attrs.match(/\brgb="([^"]+)"/i)?.[1];
  if (rgb) {
    const hex = rgb.replace(/^#/, "").toUpperCase();
    if (/^[0-9A-F]{8}$/.test(hex)) return `#${hex.slice(2)}`;
    if (/^[0-9A-F]{6}$/.test(hex)) return `#${hex}`;
  }
  const themeIndex = attrs.match(/\btheme="([^"]+)"/i)?.[1];
  if (themeIndex == null) return undefined;
  const index = Number(themeIndex);
  const base = theme[index];
  if (!base) return undefined;
  const tint = Number(attrs.match(/\btint="([^"]+)"/i)?.[1] ?? 0);
  return Number.isFinite(tint) && tint !== 0 ? applyTint(base, tint) : `#${base}`;
}

function parseXmlAttrs(tag: string) {
  const attrs: Record<string, string> = {};
  for (const match of tag.matchAll(/([:\w]+)="([^"]*)"/g)) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  return attrs;
}

function parseFonts(xml: string, theme: string[]): ExcelEditorCellStyle[] {
  const block = xml.match(/<(?:\w+:)?fonts\b[^>]*>([\s\S]*?)<\/(?:\w+:)?fonts>/i)?.[1] ?? "";
  return [...block.matchAll(/<(?:\w+:)?font\b([^>]*)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?font>)/gi)].map(
    (match) => {
      const inner = match[2] ?? "";
      const colorTag = inner.match(/<(?:\w+:)?color\b([^>]*)\/?>/i)?.[1] ?? "";
      const size = Number(inner.match(/<(?:\w+:)?sz\b[^>]*val="([^"]+)"/i)?.[1]);
      const name = inner.match(/<(?:\w+:)?name\b[^>]*val="([^"]+)"/i)?.[1];
      return {
        bold: /<(?:\w+:)?b\b/i.test(inner),
        italic: /<(?:\w+:)?i\b/i.test(inner),
        underline: /<(?:\w+:)?u\b/i.test(inner),
        strikethrough: /<(?:\w+:)?strike\b/i.test(inner),
        color: colorFromAttrs(colorTag, theme),
        fontSize: Number.isFinite(size) ? size : undefined,
        fontFamily: name,
      };
    },
  );
}

function parseFills(xml: string, theme: string[]): Array<string | undefined> {
  const block = xml.match(/<(?:\w+:)?fills\b[^>]*>([\s\S]*?)<\/(?:\w+:)?fills>/i)?.[1] ?? "";
  return [...block.matchAll(/<(?:\w+:)?fill\b[^>]*>([\s\S]*?)<\/(?:\w+:)?fill>/gi)].map(
    (match) => {
      const inner = match[1];
      if (!/patternType="solid"/i.test(inner)) return undefined;
      const colorTag =
        inner.match(/<(?:\w+:)?fgColor\b([^>]*)\/?>/i)?.[1] ??
        inner.match(/<(?:\w+:)?bgColor\b([^>]*)\/?>/i)?.[1] ??
        "";
      return colorFromAttrs(colorTag, theme);
    },
  );
}

function parseCellXfs(xml: string): Array<{
  fontId: number;
  fillId: number;
  applyFont: boolean;
  applyFill: boolean;
  applyAlignment: boolean;
  align?: ExcelEditorCellStyle["align"];
  verticalAlign?: ExcelEditorCellStyle["verticalAlign"];
  wrap: boolean;
}> {
  const block =
    xml.match(/<(?:\w+:)?cellXfs\b[^>]*>([\s\S]*?)<\/(?:\w+:)?cellXfs>/i)?.[1] ?? "";
  return [...block.matchAll(/<(?:\w+:)?xf\b([^>]*)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?xf>)/gi)].map(
    (match) => {
      const attrs = parseXmlAttrs(match[1] ?? "");
      const alignment = match[2]?.match(/<(?:\w+:)?alignment\b([^>]*)\/?>/i)?.[1] ?? "";
      const alignAttrs = parseXmlAttrs(alignment);
      const horizontal = alignAttrs.horizontal;
      const vertical = alignAttrs.vertical;
      return {
        fontId: Number(attrs.fontid ?? 0),
        fillId: Number(attrs.fillid ?? 0),
        applyFont: attrs.applyfont === "1",
        applyFill: attrs.applyfill === "1",
        applyAlignment: attrs.applyalignment === "1",
        align:
          horizontal === "left" || horizontal === "center" || horizontal === "right"
            ? horizontal
            : undefined,
        verticalAlign:
          vertical === "top"
            ? "top"
            : vertical === "center"
              ? "middle"
              : vertical === "bottom"
                ? "bottom"
                : undefined,
        wrap: alignAttrs.wraptext === "1",
      };
    },
  );
}

function styleFromXf(
  styleId: number | undefined,
  fonts: ExcelEditorCellStyle[],
  fills: Array<string | undefined>,
  xfs: ReturnType<typeof parseCellXfs>,
): ExcelEditorCellStyle {
  if (styleId == null || !xfs[styleId]) return {};
  const xf = xfs[styleId];
  const font = fonts[xf.fontId] ?? {};
  const background = fills[xf.fillId];
  return {
    ...((xf.applyFont || xf.fontId > 0) ? font : {}),
    background,
    align: xf.align,
    verticalAlign: xf.verticalAlign,
    wrap: xf.wrap || undefined,
  };
}

function cellDisplayText(
  attrs: string,
  body: string,
  shared: string[],
): string {
  const type = attrs.match(/\bt="([^"]+)"/i)?.[1]?.toLowerCase();
  if (type === "inlineStr" || type === "str") {
    const text = [...body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/gi)]
      .map((match) => decodeXmlEntities(match[1]))
      .join("");
    if (text) return text;
    const fallback = body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/i)?.[1];
    return fallback ? decodeXmlEntities(fallback) : "";
  }
  const raw = body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/i)?.[1];
  if (raw == null || raw === "") {
    const formula = body.match(/<f\b[^>]*>([\s\S]*?)<\/f>/i)?.[1];
    return formula ? `=${decodeXmlEntities(formula)}` : "";
  }
  const decoded = decodeXmlEntities(raw);
  if (type === "s") return shared[Number(decoded)] ?? "";
  if (type === "b") return decoded === "1" ? "TRUE" : "FALSE";
  return decoded;
}

function extractRangeCells(bytes: Uint8Array, range: ExcelEditorRange) {
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes);
  } catch {
    return [];
  }
  const lookup = Object.fromEntries(
    Object.entries(files).map(([name, data]) => [
      name.replace(/\\/g, "/"),
      data,
    ]),
  );
  const sharedFile =
    lookup["xl/sharedStrings.xml"] ?? lookup["xl/SharedStrings.xml"];
  const shared = sharedFile ? sharedStringsFromXml(strFromU8(sharedFile)) : [];
  const theme = parseThemePalette(
    lookup["xl/theme/theme1.xml"]
      ? strFromU8(lookup["xl/theme/theme1.xml"])
      : undefined,
  );
  const stylesXml = lookup["xl/styles.xml"]
    ? strFromU8(lookup["xl/styles.xml"])
    : "";
  const fonts = parseFonts(stylesXml, theme);
  const fills = parseFills(stylesXml, theme);
  const xfs = parseCellXfs(stylesXml);
  const sheets = Object.keys(lookup)
    .filter((name) => /xl\/worksheets\/[^/]+\.xml$/i.test(name))
    .sort();
  const cells: (ExcelEditorCell & { row: number; col: number })[] = [];
  const sheetName = sheets[0];
  if (!sheetName) return cells;
  const xml = strFromU8(lookup[sheetName]);
  for (const cell of xml.matchAll(
    /<(?:\w+:)?c\b([^>]*)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/gi,
  )) {
    const attrs = cell[1];
    const body = cell[2] ?? "";
    const ref = attrs.match(/\br="([^"]+)"/i)?.[1];
    if (!ref) continue;
    const address = parseA1(ref);
    if (!address || !inRange(address.row, address.col, range)) continue;
    const styleId = Number(attrs.match(/\bs="([^"]+)"/i)?.[1]);
    const style = styleFromXf(
      Number.isFinite(styleId) ? styleId : undefined,
      fonts,
      fills,
      xfs,
    );
    cells.push({
      row: address.row,
      col: address.col,
      text: cellDisplayText(attrs, body, shared),
      ...style,
    });
  }
  return cells;
}

function cellHasVisibleStyle(cell: ExcelEditorCell) {
  return Boolean(
    cell.background ||
      cell.color ||
      cell.bold ||
      cell.italic ||
      cell.underline ||
      cell.strikethrough,
  );
}

export function excelEditorToGrid(content?: string | null): ExcelEditorCell[][] {
  const document = parseExcelEditor(content);
  const snapshot = document.snapshot;
  const range = document.range;
  const sheetId = snapshot.sheetOrder?.[0];
  const sheet = sheetId ? snapshot.sheets[sheetId] : Object.values(snapshot.sheets)[0];
  if (!sheet?.cellData) return [];
  const cells: (ExcelEditorCell & { row: number; col: number })[] = [];
  for (const [rowKey, row] of Object.entries(sheet.cellData)) {
    const rowIndex = Number(rowKey);
    if (!Number.isInteger(rowIndex) || !row) continue;
    for (const [colKey, cell] of Object.entries(row)) {
      const colIndex = Number(colKey);
      if (!Number.isInteger(colIndex) || !cell) continue;
      if (!inRange(rowIndex, colIndex, range)) continue;
      const style = resolveCellStyle(
        snapshot,
        cell,
        sheet.defaultStyle ?? undefined,
      );
      const text = snapshotCellText(cell);
      const value = { text, ...styleFromUniver(style) };
      if (!text.trim() && !cellHasVisibleStyle(value)) continue;
      cells.push({ row: rowIndex, col: colIndex, ...value });
    }
  }
  if (cells.length === 0) return [];
  const minRow = Math.min(...cells.map((cell) => cell.row));
  const maxRow = Math.max(...cells.map((cell) => cell.row));
  const minCol = Math.min(...cells.map((cell) => cell.col));
  const maxCol = Math.max(...cells.map((cell) => cell.col));
  const grid: ExcelEditorCell[][] = Array.from(
    { length: maxRow - minRow + 1 },
    () => Array.from({ length: maxCol - minCol + 1 }, () => ({ text: "" })),
  );
  for (const cell of cells) {
    const { row: _row, col: _col, ...value } = cell;
    grid[cell.row - minRow][cell.col - minCol] = value;
  }
  return grid;
}

export function hasExcelEditorContent(content?: string | null) {
  if (!content) return false;
  return excelEditorToGrid(content).some((row) =>
    row.some((cell) => cell.text.trim()),
  );
}
