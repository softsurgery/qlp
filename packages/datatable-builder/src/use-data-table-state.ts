import { useCallback, useMemo, useState } from "react";

interface UseDataTableStateOptions {
  order?: boolean;
  sortKey?: string;
  page?: number;
  size?: number;
}

export function useDataTableState(
  _tableId: string,
  options: UseDataTableStateOptions = {},
) {
  const [page, setPage] = useState(options.page ?? 1);
  const [size, setSize] = useState(options.size ?? 10);
  const [sortDetails, setSortDetails] = useState({
    order: options.order ?? true,
    sortKey: options.sortKey ?? "id",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );

  const defaultSort = useMemo(
    () => ({
      order: options.order ?? true,
      sortKey: options.sortKey ?? "id",
    }),
    [options.order, options.sortKey],
  );

  const hasActiveFiltersOrSort = useMemo(
    () =>
      Boolean(searchTerm) ||
      Object.keys(columnFilters).length > 0 ||
      sortDetails.sortKey !== defaultSort.sortKey ||
      sortDetails.order !== defaultSort.order,
    [columnFilters, defaultSort.order, defaultSort.sortKey, searchTerm, sortDetails],
  );

  const clearFiltersAndSort = useCallback(() => {
    setSearchTerm("");
    setColumnFilters({});
    setSortDetails(defaultSort);
    setPage(1);
  }, [defaultSort]);

  return {
    page,
    setPage,
    size,
    setSize,
    sortDetails,
    setSortDetails,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,
    tableReset: {
      hasActiveFiltersOrSort,
      clearFiltersAndSort,
    },
  };
}
