// ReusableList.tsx
import React, { useEffect, useState } from 'react';
import { individualDetails } from '../services/adminService';

interface ReusableListProps<T> {
    role: string;
    columns: { header: string; accessor: keyof T }[];
    renderActions: (item: T) => React.ReactNode;
}

const ReusableList = <T,>({ role, columns, renderActions }: ReusableListProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await individualDetails <T>(role);
                const mappedData = data.map((item) => ({
                    ...item,
                    id: item._id, 
                }));
                setItems(mappedData);
            } catch (error) {
                setError('Failed to load items');
            }
        };
        fetchDetails();
    }, [role]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div>
            {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
            <Table data={currentItems} columns={columns} renderActions={renderActions} />
            {/* Pagination logic can be added here */}
        </div>
    );
};

export default ReusableList;