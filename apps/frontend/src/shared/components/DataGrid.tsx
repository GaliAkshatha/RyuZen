import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";

import { cn } from "@/utils/cn";
import { Input } from "@/shared/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/Table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/Pagination";
import { EmptyState } from "@/shared/components/EmptyState";
import { SkeletonRows } from "@/shared/components/SkeletonLoader";
import {
  filterRows,
  sortRows,
  paginateRows,
  type SortDirection,
} from "@/shared/components/dataGridUtils";

export interface DataGridColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
  /** Required for a column to actually sort — the raw comparable value, separate from its rendered display. */
  sortValue?: (row: T) => string | number;
  className?: string;
}

export interface DataGridProps<T> {
  data: T[];
  columns: DataGridColumn<T>[];
  getRowId: (row: T) => string;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  /** How to derive searchable text from a row — defaults to JSON.stringify if omitted. */
  getSearchableText?: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataGrid<T>({
  data,
  columns,
  getRowId,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = "Search…",
  getSearchableText,
  isLoading = false,
  emptyTitle = "No results",
  emptyDescription,
  onRowClick,
  className,
}: DataGridProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterRows(data, searchable ? search : "", getSearchableText),
    [data, search, searchable, getSearchableText],
  );

  const sorted = useMemo(() => {
    const column = columns.find((c) => c.key === sortKey);
    return sortRows(filtered, column?.sortValue, sortDirection);
  }, [filtered, sortKey, sortDirection, columns]);

  const { pageRows, pageCount, currentPage } = useMemo(
    () => paginateRows(sorted, page, pageSize),
    [sorted, page, pageSize],
  );

  function handleSort(column: DataGridColumn<T>) {
    if (!column.sortable) return;

    if (sortKey !== column.key) {
      setSortKey(column.key);
      setSortDirection("asc");
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortKey(null);
      setSortDirection(null);
    } else {
      setSortDirection("asc");
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {searchable && (
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search table"
          />
        </div>
      )}

      {isLoading ? (
        <SkeletonRows rows={pageSize > 5 ? 5 : pageSize} />
      ) : sorted.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.sortable && "cursor-pointer select-none",
                      column.className,
                    )}
                    onClick={() => handleSort(column)}
                    aria-sort={
                      sortKey === column.key
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {column.header}
                      {column.sortable &&
                        (sortKey === column.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                        ))}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={currentPage === 1}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
                {Array.from({ length: pageCount }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setPage((p) => Math.min(pageCount, p + 1));
                    }}
                    aria-disabled={currentPage === pageCount}
                    className={cn(currentPage === pageCount && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
