import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { Candidate, UserCandidate } from "../../types/Candidate"; 
import { getUser, toogleStatus } from "../../services/adminService";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";

const role = 'user';

const Candidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getUser(role);
                const mappedData: Candidate[] = data.map((candidate) => ({
                    ...candidate,
                    id: candidate._id,
                }));
                setCandidates(mappedData);
            } catch (error) {
                setError('Failed to load candidates');
            }
        };
        fetchDetails();
    }, []);

    const toggleStatus = async (id: string) => {
        try {
            console.log('in toggle')
            const response=await toogleStatus(id, role);
            console.log("TOOGLERESPONSE",response)
            setCandidates(candidates.map((candidate) => {
                if (candidate.id === id) {
                    return {
                        ...candidate,
                        status: candidate.status === "Active" ? "Inactive" : "Active",
                    };
                }
                return candidate;
            }));
        } catch (error) {
            throw new Error("Failed to toggle status");
        }
    };

    const isUserCandidate = (candidate: Candidate): candidate is UserCandidate => {
        return (candidate as UserCandidate).firstName !== undefined;
    };

    const totalPages = Math.ceil(candidates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCandidates = candidates.slice(startIndex, startIndex + itemsPerPage);

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
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">NAME</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">EMAIL</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">STATUS</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCandidates.map((candidate) => (
                                        <tr key={candidate.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 font-mono">{candidate.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {isUserCandidate(candidate)
                                                            ? `${candidate.firstName} ${candidate.secondName}`
                                                            : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{candidate.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${candidate.status === 'Active' 
                                                        ? 'bg-emerald-50 text-emerald-700' 
                                                        : 'bg-red-50 text-red-700'}`}>
                                                    {candidate.status === 'Active' ? (
                                                        <ShieldCheck className="w-3 h-3" />
                                                    ) : (
                                                        <ShieldAlert className="w-3 h-3" />
                                                    )}
                                                    {candidate.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(candidate.id as string)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                                                        ${candidate.status === 'Active' 
                                                            ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                                >
                                                    {candidate.status === 'Active' ? 'Block' : 'Unblock'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                            <div className="text-sm text-slate-600">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, candidates.length)} of {candidates.length} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
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
                                    onClick={() => setCurrentPage(currentPage + 1)}
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

export default Candidates;