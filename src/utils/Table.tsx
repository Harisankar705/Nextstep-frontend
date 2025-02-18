import React from 'react';

interface TableProps<T> {
    data: T[];
    columns: { header: string; accessor: keyof T }[];
    renderActions: (item: T) => React.ReactNode;
}

const Table = <T,>({ data, columns, renderActions }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                        {columns.map((column) => (
                            <th key={column.accessor as string} className="px-6 py-4 text-left text-xs font-semibold text-slate-600">
                                {column.header}
                            </th>
                        ))}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            {columns.map((column) => (
                                <td key={column.accessor as string} className="px-6 py-4 text-sm text-slate-600">
                                    {item[column.accessor]}
                                </td>
                            ))}
                            <td className="px-6 py-4">
                                {renderActions(item)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;