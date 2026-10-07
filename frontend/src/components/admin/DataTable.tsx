import { type ReactNode } from "react";
import Spinner from "../../components/ui/Spinner";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading: boolean;
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

function DataTable<T>({ columns, data, isLoading, rowKey, emptyMessage = "No records found." }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#ece1d0] shadow-[0_2px_16px_rgba(61,5,12,0.06)]">
      <table className="w-full text-sm">
        <thead className="bg-cream-deep/60 border-b border-sand">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="border-b border-sand last:border-0 hover:bg-cream-deep/50">
              {columns.map((col, idx) => (
                <td key={idx} className="px-4 py-3">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
