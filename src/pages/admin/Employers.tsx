import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { Candidate, Employer } from "../../types/Candidate";
import { getUser, toogleStatus } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import { Eye, ShieldAlert, ShieldCheck } from "lucide-react";

const role = 'employer';
const Employers = () => {
    const [employers, setEmployers] = useState<Candidate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getUser<Employer>(role);
                const mappedData: Candidate[] = data.map((employer) => ({
                    ...employer,
                    id: employer._id,
                }));
                setEmployers(mappedData);
            } catch (error) {
                setError('Failed to load employers');
            }
        };
        fetchDetails();
    }, []);

    const toggleStatus = async (id: string | undefined) => {
        try {
            await toogleStatus(id as string, role);
            setEmployers(employers.map((employer) => {
                if (employer.id === id) {
                    return {
                        ...employer,
                        status: employer.status === "Active" ? "Inactive" : "Active",
                    };
                }
                return employer;
            }));
        } catch (error) {
            throw new Error("Error occurred while changing status");
        }
    };

    const handleViewDetails = (id: string | undefined) => {
        navigate(`/verifyemployer/${id}`);
    };

    const isEmployer = (employer: Candidate): employer is Employer => {
        return (employer as Employer).companyName !== undefined;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(employers.length / itemsPerPage);

    return (
        <div className="flex h-screen bg-slate-50">
            <SideBar />
            <div className="flex-1 overflow-hidden flex flex-col">
                <SearchBar />
                <div className="flex-1 overflow-auto p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">COMPANY</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">EMAIL</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">STATUS</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">ACTION</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((employer) => (
                                        <tr key={employer.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 font-mono">{employer.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                {isEmployer(employer) ? employer.companyName : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{employer.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${employer.status === 'Active' 
                                                        ? 'bg-emerald-50 text-emerald-700' 
                                                        : 'bg-red-50 text-red-700'}`}>
                                                    {employer.status === 'Active' ? (
                                                        <ShieldCheck className="w-3 h-3" />
                                                    ) : (
                                                        <ShieldAlert className="w-3 h-3" />
                                                    )}
                                                    {employer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(employer.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                                                        ${employer.status === 'Active' 
                                                              ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                                >
                                                    {employer.status === 'Active' ? 'Block' : 'Unblock'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleViewDetails(employer.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                        bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                            <div className="text-sm text-slate-600">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, employers.length)} of {employers.length} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 
                                        hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="text-sm font-medium text-slate-600">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 
                                        hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Employers;