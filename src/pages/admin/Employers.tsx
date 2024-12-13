import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { getUser, toogleStatus } from "../../services/authService";
import { Candidate, Employer, UserCandidate } from "../../types/Candidate";

const role = 'employer';
const Employers = () => {
    const [employers, setEmployers] = useState<Candidate[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getUser(role);
                const mappedData: Candidate[] = data.map((employer: any) => ({
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

    const toggleStatus = async (id: string) => {
        try {
            await toogleStatus(id, role);
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
           throw new Error("Error occured while changing status")
        }
    }

    const isEmployer = (employer: Candidate): employer is Employer=> {
        return (employer as Employer).companyName !== undefined;
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
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">COMPANY</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">EMAIL</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">STATUS</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employers.map((employer) => (
                                <tr key={employer.id} className="border-b border-gray-100">
                                    <td className="px-6 py-4 text-sm text-gray-600">{employer.id}</td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {isEmployer(employer)
                                            ? `${employer.companyName}`
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{employer.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{employer.status}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(employer.id)}
                                            className={`px-4 py-1 rounded-full text-sm ${employer.status === 'Active' ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'}`}
                                        >
                                            {employer.status === 'Active' ? 'Block' : 'Unblock'}
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

export default Employers;
