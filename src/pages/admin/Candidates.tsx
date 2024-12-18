import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { Candidate, UserCandidate } from "../../types/Candidate"; 
import { getUser, toogleStatus } from "../../services/adminService";

const role = 'user';
const Candidates = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getUser(role);  
                const mappedData: Candidate[] = data.map((candidate: any) => ({
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
            await toogleStatus(id, role);
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

    return (
        <div className="flex h-screen">
            <SideBar />
            <div className="flex-1">
                <SearchBar />
                <div className="bg-white rounded-lg">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ID</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">NAME</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">EMAIL</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">STATUS</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((candidate) => (
                                <tr key={candidate.id} className="border-b border-gray-100">
                                    <td className="px-6 py-4 text-sm text-gray-600">{candidate.id}</td>
                                    
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {isUserCandidate(candidate)
                                            ? `${candidate.firstName} ${candidate.secondName}`
                                            : 'N/A'} 
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{candidate.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{candidate.status}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(candidate.id)}
                                            className={`px-4 py-1 rounded-full text-sm ${candidate.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'}`}
                                        >
                                            {candidate.status === 'Active' ? 'Block' : 'Unblock'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Candidates;
