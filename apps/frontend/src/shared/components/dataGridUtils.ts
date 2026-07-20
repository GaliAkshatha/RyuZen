export type SortDirection = "asc" | "desc" | null;

/**
 * Pure functions used by DataGrid.tsx, kept in their own file (rather
 * than co-located in the component file) so the algorithms are cleanly
 * independently testable without simulating clicks/typing through a
 * rendered component, and so DataGrid.tsx only exports components
 * (avoiding a react-refresh warning from mixing component + non-component
 * exports in one file).
 */
export function filterRows<T>(
  data: T[],
  search: string,
  getSearchableText?: (row: T) => string,
): T[] {
  if (!search.trim()) return data;

  const query = search.trim().toLowerCase();
  return data.filter((row) => {
    const text = getSearchableText ? getSearchableText(row) : JSON.stringify(row);
    return text.toLowerCase().includes(query);
  });
}

export function sortRows<T>(
  data: T[],
  sortValue: ((row: T) => string | number) | undefined,
  direction: SortDirection,
): T[] {
  if (!sortValue || !direction) return data;

  const copy = [...data];
  copy.sort((a, b) => {
    const av = sortValue(a);
    const bv = sortValue(b);
    if (av < bv) return direction === "asc" ? -1 : 1;
    if (av > bv) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return copy;
}

export function paginateRows<T>(
  data: T[],
  page: number,
  pageSize: number,
): { pageRows: T[]; pageCount: number; currentPage: number } {
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const pageRows = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return { pageRows, pageCount, currentPage };
}
