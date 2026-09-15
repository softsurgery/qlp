export interface MaterialTableData {
  columns: string[];
  rows: string[][];
}

export function emptyMaterialTable(): MaterialTableData {
  return {
    columns: ["", ""],
    rows: [
      ["", ""],
      ["", ""],
    ],
  };
}

function normalizeRow(row: unknown, columnCount: number): string[] {
  const cells = Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : [];
  while (cells.length < columnCount) cells.push("");
  return cells.slice(0, columnCount);
}

export function parseMaterialTable(content?: string | null): MaterialTableData {
  if (!content) return emptyMaterialTable();
  try {
    const parsed = JSON.parse(content) as Partial<MaterialTableData>;
    const columns =
      Array.isArray(parsed.columns) && parsed.columns.length > 0
        ? parsed.columns.map((column) => String(column ?? ""))
        : emptyMaterialTable().columns;
    const rows =
      Array.isArray(parsed.rows) && parsed.rows.length > 0
        ? parsed.rows.map((row) => normalizeRow(row, columns.length))
        : [columns.map(() => "")];
    return { columns, rows };
  } catch {
    return emptyMaterialTable();
  }
}

export function stringifyMaterialTable(table: MaterialTableData): string {
  return JSON.stringify(table);
}

export function hasTableContent(content?: string | null) {
  const table = parseMaterialTable(content);
  return (
    table.columns.some((column) => column.trim().length > 0) ||
    table.rows.some((row) => row.some((cell) => cell.trim().length > 0))
  );
}
