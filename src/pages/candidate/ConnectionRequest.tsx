import { useSelector } from "react-redux"
import { Requests, UserCandidate } from "../../types/Candidate"
import Navbar from "../../utils/Navbar"
import { getProfilePictureURL } from "../../utils/ImageUtils"
import { UserCheck, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { followBack, getConnections, getPendingRequests, toggleFollow } from "../../services/commonService"
import { useNavigate } from "react-router-dom"

export const ConnectionRequest = () => {
    const navigate =useNavigate()
    const [requests, setRequests] = useState<Requests[]>([])
    const [isFollowedBack, setIsFollowedBack] = useState(false)
    const [activeTab, setActiveTab] = useState<'requests' | 'connections'>('requests')
    const [connections, setConnections] = useState<Requests[]>([])
    const [error, setError] = useState('')
    const currentUser = useSelector((state: { user: UserCandidate }) => state.user)

    const handleViewProfile = (id: string) => {
        navigate(`/candidate-profile/${id}`); 
    }

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getPendingRequests()
                if (!response) {
                    toast.error("Error occured while loading the page")
                }
                const data: Requests[] = response.data;
                setRequests(data);
                const connection=await getConnections()
                setConnections(connection.data.data)
                console.error("Expected an array but got:", connection.data);

            } catch (error) {
                const errorMessage = (error as Error).message || "Error occurred while fetching requests";

                setError(errorMessage)
                toast.error("Error occured while fetching requests")
            }
        }
        fetchRequests()
    }, [])
    
    const handleAccept = async (connectionId: string) => {
        await followBack(connectionId)
        setIsFollowedBack(true)
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <div className="w-full sm:w-[360px] fixed left-0 top-16 h-[calc(100vh-64px)] p-4 overflow-y-auto bg-gray-100 z-0">
                    <div className="space-y-2">
                        <div className="items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={getProfilePictureURL(currentUser.profilePicture)} alt={currentUser.firstName} className="w-full h-full object-cover" />

                            </div>
                        </div>
                        <button onClick={() => setActiveTab('connections')}
                            className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg transition-colors w-full ${activeTab === 'connections' ? 'bg-gray-200' : 'hover-bg-gray-200'
                                }`}>
                            <UserCheck className='h-6 w-6' />
                            <span className="text-sm font-medium">All Connections</span>
                        </button>
                        <button onClick={() => setActiveTab('requests')}
                            className={`flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg transition-colors w-full ${activeTab === 'requests' ? 'bg-gray-200' : 'hover-bg-gray-200'
                                }`}>
                            <UserPlus className='h-6 w-6' />
                            <span className="text-sm font-medium">Connection Requests</span>
                            {requests.length > 0 && (
                                <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-1 rounded-full">{requests.length}</span>
                            )}
                        </button>

                    </div>

                </div>
            </div>
            <main className="flex-1 ml-0 sm:ml-[360px] mr-0 sm:mr-[360px] p-4">
                <div className="bg-gray-900 rounded-lg shadow p-6">
                    <h2 className="text-2xl text-white font-bold mb-4">
                        {activeTab === 'requests' ? 'Connection Requests' : 'Your Connections'}
                    </h2>

                    {activeTab === 'requests' ? (
                        requests.length === 0 ? (
                            <p className="text-center text-gray-400">No pending requests</p>
                        ) : (
                            <ul className="space-y-4">
                                {requests.map((request) => (
                                    <li key={request._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img
                                                    src={getProfilePictureURL(request.followerId.profilePicture)}
                                                    alt={request.followerId.firstName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {request.followerId.firstName} {request.followerId.secondName}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    @{request.followerId.firstName}{request.followerId.secondName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewProfile(request.followerId._id)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => handleAccept(request._id)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                                            >
                                                <UserPlus className="h-4 w-4" />
                                                {isFollowedBack ? "Following" : "Follow Back"}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        // Connections List
                        <ul className="space-y-4">
                            {connections.map((connection) => (
                                <li key={connection.followerId.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img
                                                src={getProfilePictureURL(connection.followerId.profilePicture)}
                                                alt={connection.followerId.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">
                                                {connection.followerId.firstName} {connection.followerId.secondName}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                @{connection.followerId.firstName}{connection.followerId.secondName}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewProfile(connection.followerId._id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        View Profile
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>


    )
}
