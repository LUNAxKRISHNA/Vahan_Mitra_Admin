import { useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';
import EmptyState from './EmptyState';

export default function DataTable({ columns, data, pageSize = 8, searchable = false, searchValue = '' }) {
  const [sorting, setSorting]   = useState([]);
  const [globalFilter, setGF]   = useState(searchValue);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: searchValue || globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGF,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-0">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="table-base">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={clsx(header.column.getCanSort() && 'cursor-pointer select-none')}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="flex flex-col">
                          <ChevronUp   size={10} className={clsx(header.column.getIsSorted() === 'asc'  ? 'text-teal-600' : 'text-slate-300')} />
                          <ChevronDown size={10} className={clsx(header.column.getIsSorted() === 'desc' ? 'text-teal-600' : 'text-slate-300')} />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title="No records found" description="Try adjusting your search or filters." />
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > pageSize && (
        <div className="flex items-center justify-between px-2 pt-4 text-xs text-navy-500">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} &nbsp;·&nbsp; {table.getFilteredRowModel().rows.length} rows
          </span>
          <div className="flex items-center gap-1">
            <PagBtn onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft size={13} /></PagBtn>
            <PagBtn onClick={() => table.previousPage()}  disabled={!table.getCanPreviousPage()}><ChevronLeft  size={13} /></PagBtn>
            <PagBtn onClick={() => table.nextPage()}      disabled={!table.getCanNextPage()}><ChevronRight size={13} /></PagBtn>
            <PagBtn onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight size={13} /></PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-lg flex items-center justify-center
                 hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-navy-600"
    >
      {children}
    </button>
  );
}
