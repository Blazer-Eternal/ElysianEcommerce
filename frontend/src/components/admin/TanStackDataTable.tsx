import React, { useMemo, useState } from "react";

// Inlined from @tanstack/table-core so the whole @tanstack/react-table family
// can be dropped from the bundle (this type was its only import).
type SortingState = Array<{ id: string; desc: boolean }>;

interface Column {
  id?: string;
  accessorKey?: string;
  header?: string;
  cell?: (info: any) => React.ReactNode;
}

interface TanStackDataTableProps<TData = any> {
  data: TData[];
  columns: Column[];
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onCreate?: () => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  viewMode?: "table" | "card";
  onViewModeChange?: (mode: "table" | "card") => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  exportTitle?: string; // Add custom export title
  couponMap?: Map<string, string>; // Add coupon lookup map
  productsData?: any[]; // Add products data for category exports
}

export const TanStackDataTable = React.forwardRef<
  HTMLDivElement,
  TanStackDataTableProps<any>
>(
  (
    {
      data,
      columns,
      onEdit,
      onDelete,
      onCreate,
      searchTerm = "",
      onSearchChange,
      viewMode = "table",
      onViewModeChange,
      pageSize = 10,
      onPageSizeChange,
      exportTitle = "Data Report",
      couponMap,
      productsData = [],
    },
    ref
  ) => {
    const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search term
    const filteredData = useMemo(() => {
      if (!searchTerm) return data;
      
      return data.filter((row: any) => {
        return Object.values(row).some((value: any) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }, [data, searchTerm]);

    // Sort data
    const sortedData = useMemo(() => {
      if (sorting.length === 0) return filteredData;

      const sorted = [...filteredData].sort((a: any, b: any) => {
        for (const sort of sorting) {
          const aValue = a[sort.id];
          const bValue = b[sort.id];

          if (aValue < bValue) {
            return sort.desc ? 1 : -1;
          }
          if (aValue > bValue) {
            return sort.desc ? -1 : 1;
          }
        }
        return 0;
      });

      return sorted;
    }, [filteredData, sorting]);

    // Calculate pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, sortedData.length);
    const paginatedData = useMemo(() => {
      return sortedData.slice(startIndex, endIndex);
    }, [sortedData, startIndex, endIndex]);

    // Helper function to flatten nested objects for export
    const flattenValue = (value: any, columnHeader?: string, rowData?: any): string => {
      if (value === null || value === undefined) return "—";
      
      // Special handling for coupon IDs in orders export
      if (columnHeader === "Coupon" && couponMap && typeof value === "string" && value.match(/^[0-9a-f]{24}$/)) {
        return couponMap.get(value) || value; // Return coupon code or ID as fallback
      }
      
      // Special handling for products count in category exports
      if (columnHeader === "Products" && rowData && rowData._id) {
        // Check if this category is a parent (no parent_id)
        const isParentCategory = !rowData.parent_id || rowData.parent_id === null || rowData.parent_id === undefined || rowData.parent_id === "";
        
        if (isParentCategory) {
          return "↓ Parent";
        }
        
        // This is a subcategory, count its products using productsData
        const categoryId = rowData._id;
        const count = productsData.filter((p: any) => {
          let catId = "";
          if (typeof p.category_id === "object" && p.category_id !== null) {
            catId = p.category_id._id || p.category_id.toString();
          } else if (typeof p.category_id === "string") {
            catId = p.category_id;
          }
          return catId === categoryId;
        }).length;
        return count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : "0 products";
      }
      
      if (typeof value === "object") {
        // For objects, try to extract common name/code/title fields
        if (value.name) return value.name;
        if (value.code) return value.code;
        if (value.email) return value.email;
        if (value.title) return value.title;
        // Fallback to JSON string
        return JSON.stringify(value);
      }
      return String(value);
    };

    // Export functions
    const exportToCSV = async () => {
      const flatData = sortedData.map((row: any) => {
        const result: Record<string, unknown> = {};
        columns.forEach((col: any) => {
          if (col.accessorKey) {
            result[col.header || col.accessorKey] = flattenValue(row[col.accessorKey], col.header, row);
          }
        });
        return result;
      });

      // Dynamic import: papaparse is only fetched when the user actually exports.
      const Papa = (await import("papaparse")).default;
      const csv = Papa.unparse(flatData);
      const link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      link.download = `${exportTitle.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.csv`;
      link.click();
    };

    const exportToExcel = async () => {
      const flatData = sortedData.map((row: any) => {
        const result: Record<string, unknown> = {};
        columns.forEach((col: any) => {
          if (col.accessorKey) {
            result[col.header || col.accessorKey] = flattenValue(row[col.accessorKey], col.header, row);
          }
        });
        return result;
      });

      // Dynamic import: xlsx is a large dependency - fetched only on export.
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(flatData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, exportTitle);
      XLSX.writeFile(wb, `${exportTitle.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.xlsx`);
    };

    const copyToClipboard = async () => {
      const flatData = sortedData.map((row: any) => {
        const result: Record<string, unknown> = {};
        columns.forEach((col: any) => {
          if (col.accessorKey) {
            result[col.header || col.accessorKey] = flattenValue(row[col.accessorKey], col.header, row);
          }
        });
        return result;
      });

      // Dynamic import: papaparse is only fetched when the user actually copies.
      const Papa = (await import("papaparse")).default;
      const csv = Papa.unparse(flatData);
      navigator.clipboard.writeText(csv);
      alert("Data copied to clipboard!");
    };

    const handlePrint = () => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const flatData = sortedData.map((row: any) => {
        const result: Record<string, unknown> = {};
        columns.forEach((col: any) => {
          if (col.accessorKey) {
            result[col.header || col.accessorKey] = flattenValue(row[col.accessorKey], col.header, row);
          }
        });
        return result;
      });

      const columnHeaders = columns.map((col: any) => col.header).join("</th><th>");
      const pageSize_print = 20;
      const totalPages_print = Math.ceil(flatData.length / pageSize_print);

      let htmlContent = `
        <html>
          <head>
            <title>${exportTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; color: #0e7c85; }
              .page-info { text-align: center; color: #666; font-size: 12px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th { background-color: #0e7c85; color: white; padding: 10px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
              td { padding: 8px; border: 1px solid #ddd; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              tr:hover { background-color: #f0f0f0; }
              .page-break { page-break-after: always; }
              .timestamp { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>${exportTitle}</h1>
      `;

      // Create tables for each page
      for (let page = 0; page < totalPages_print; page++) {
        const pageData = flatData.slice(page * pageSize_print, (page + 1) * pageSize_print);
        const startNum = page * pageSize_print + 1;
        const endNum = Math.min((page + 1) * pageSize_print, flatData.length);

        htmlContent += `
          <div class="page-info">Page ${page + 1} of ${totalPages_print} | Showing rows ${startNum} to ${endNum}</div>
          <table>
            <thead>
              <tr><th>${columnHeaders}</th></tr>
            </thead>
            <tbody>
        `;

        pageData.forEach((row: Record<string, unknown>) => {
          const rowHtml = Object.values(row)
            .map((val) => `<td>${val !== null && val !== undefined ? val : "—"}</td>`)
            .join("");
          htmlContent += `<tr>${rowHtml}</tr>`;
        });

        htmlContent += `
            </tbody>
          </table>
        `;

        if (page < totalPages_print - 1) {
          htmlContent += `<div class="page-break"></div>`;
        }
      }

      htmlContent += `
            <div class="timestamp">Generated on ${new Date().toLocaleString()}</div>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    return (
      <div ref={ref} className="w-full space-y-6">
        {/* Toolbar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={onCreate}
                className="px-4 py-2 bg-[#0e7c85] text-white rounded-lg hover:bg-[#0a5f66] transition-colors font-semibold"
              >
                New
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  Export ▼
                </button>
                <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={copyToClipboard}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-800"
                  >
                    Copy
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-800"
                  >
                    Excel
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-800"
                  >
                    CSV
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold text-gray-800"
                  >
                    Print
                  </button>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange?.("table")}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    viewMode === "table"
                      ? "bg-white text-gray-900"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => onViewModeChange?.("card")}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    viewMode === "card"
                      ? "bg-white text-gray-900"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Card
                </button>
              </div>
            </div>
          </div>

          {/* Search and Page Size */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85] flex-1 min-w-50"
            />
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e7c85]"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-[#0e7c85]/5 to-cyan-600/5 border-b border-gray-200">
                  {columns.map((column: any) => (
                    <th
                      key={column.id || column.accessorKey}
                      onClick={() => {
                        const id = column.id || column.accessorKey;
                        const existingSort = sorting.find((s) => s.id === id);
                        if (existingSort) {
                          setSorting([{ id, desc: !existingSort.desc }]);
                        } else {
                          setSorting([{ id, desc: false }]);
                        }
                      }}
                      className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-[#0e7c85]/10 transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.header}</span>
                        <span className="text-xs">
                          {sorting.find((s) => s.id === (column.id || column.accessorKey))
                            ? sorting.find((s) => s.id === (column.id || column.accessorKey))?.desc
                              ? "↓"
                              : "↑"
                            : "↕"}
                        </span>
                      </div>
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row: any, rowIndex: number) => (
                  <tr key={row._id ?? rowIndex} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    {columns.map((column: any) => {
                      const columnId = column.id || column.accessorKey;
                      const value = row[columnId];
                      return (
                        <td key={columnId} className="px-4 py-3 text-sm text-gray-700">
                          {column.cell ? column.cell({ row: { original: row }, getValue: () => value, renderValue: () => value } as any) : String(value)}
                        </td>
                      );
                    })}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-sm flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (confirm("Delete this item?")) {
                                onDelete(row);
                              }
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Card View */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((row: any, rowIndex: number) => (
              <div
                key={row._id ?? rowIndex}
                className="glass rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all hover-lift card-container bg-linear-to-br from-white/40 to-white/20"
              >
                <div className="space-y-3">
                  {columns.map((column: any) => {
                    const columnId = column.id || column.accessorKey;
                    const value = row[columnId];
                    return (
                      <div key={columnId}>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {column.header}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {column.cell ? column.cell({ row: { original: row }, getValue: () => value, renderValue: () => value } as any) : String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {(onEdit || onDelete) && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/20">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm("Delete this item?")) {
                            onDelete(row);
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} •
            Showing {paginatedData.length} of {sortedData.length}
            rows
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors font-semibold"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
);

TanStackDataTable.displayName = "TanStackDataTable";

export default TanStackDataTable;
