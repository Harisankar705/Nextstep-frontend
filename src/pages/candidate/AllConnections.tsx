import { useEffect, useState } from "react";
import { Connection, IEmployer } from "../../types/Employer";
import Spinner from "../../utils/Spinner";
import { followBack, getConnections, getPendingRequests } from "../../services/commonService";
import { UserCheck, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Requests, UserCandidate } from "../../types/Candidate";
import { useSelector } from "react-redux";
import Navbar from "../../utils/Navbar";
import SideBar from "../employer/SideBar";

export const AllConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Requests[]>([]);
  const [activeTab, setActiveTab] = useState<"requests" | "connections">("requests");
  const currentUser = useSelector((state: { user: UserCandidate }) => state.user);
  const currentEmployer=useSelector((state:{user:IEmployer})=>state.user)
  const role=currentUser.isAuthenticated?currentUser.role:currentEmployer.isAuthenticated?currentEmployer.role:null
  

  const fetchRequests = async () => {
    try {
      const response = await getPendingRequests();
      if (!response) {
        toast.error("Error occurred while loading requests");
        return;
      }
      setRequests(response.data);
    } catch (error) {
      console.log('ee',error)
      const errorMessage = (error as Error).message || "Error occurred while fetching requests";
      toast.error(errorMessage);
    }
  };

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await getConnections();
      setConnections(response.data.data);
    } catch (error) {
      console.error("Error fetching connections", error);
      toast.error("Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
    fetchRequests();
  }, []);

  const handleViewProfile = (id: string) => {
    navigate(`/candidate-profile/${id}/user`);
  };

  const handleAccept = async (connectionId: string) => {
    try {
      await followBack(connectionId);
      toast.success("Connection request accepted!");
      await fetchRequests();
      await fetchConnections();
    } catch (error) {
      toast.error("Failed to accept connection request");
    }
  };

  if (loading) {
    return <Spinner loading={true} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {role==='employer'?<SideBar/>:<Navbar/>}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
        <div
    className={`w-full md:w-64 flex-shrink-0 ${
      role === "employer" ? "ml-[200px]" : "" /* Moves it to the right for employers */
    }`}
  >            <div className="bg-gray-800 rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={role==='user'? currentUser.profilePicture :currentEmployer.logo}
                    alt={currentUser.firstName || "User"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {role==='user'? `${currentUser.firstName} ${currentUser.secondName}`:currentEmployer.companyName}
                  </h3>
                  <p className="text-sm text-gray-300">My Network</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("connections")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "connections"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <UserCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Connections</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    activeTab === "connections" 
                      ? "bg-white text-purple-700"
                      : "bg-gray-700 text-gray-300"
                  }`}>
                    {connections.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("requests")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "requests"
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm font-medium">Requests</span>
                  {requests.length > 0 && (
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      activeTab === "requests" 
                        ? "bg-white text-purple-700"
                        : "bg-gray-700 text-gray-300"
                    }`}>
                      {requests.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  {activeTab === "requests" ? "Connection Requests" : "Your Connections"}
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  {activeTab === "requests"
                    ? "Manage your pending connection requests"
                    : "People you're connected with"}
                </p>
              </div>

              <div className="p-6">
                {activeTab === "requests" ? (
                  requests.length === 0 ? (
                    <div className="text-center py-12">
                      <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-white">No pending requests</h3>
                      <p className="mt-2 text-sm text-gray-400">
                        When someone sends you a connection request, it will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div
                          key={request._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
                              <img
                                src={request.followerId?.profilePicture || "/default-avatar.png"}
                                alt={request.followerId?.firstName || "User"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/default-avatar.png";
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">
                                {request.followerId?.firstName || ""} {request.followerId?.secondName || ""}
                              </h4>
                              <p className="text-sm text-gray-300">
                                @{request.followerId?.firstName?.toLowerCase() || ""}
                                {request.followerId?.secondName?.toLowerCase() || ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleViewProfile(request.followerId._id)}
                              className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => handleAccept(request._id)}
                              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                              <UserPlus className="h-4 w-4" />
                              Follow Back
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : connections.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-white">No connections yet</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Start building your network by connecting with other professionals.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {connections.map((connection) => {
                      const user = connection.followerId;
                      return (
                        <div
                          key={connection._id}
                          className="bg-gray-700 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800">
                                {user?.role === "employer" ? (
                                  <img
                                    src={user?.logo || "/default-company.png"}
                                    alt={user?.companyName || "Company"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/default-company.png";
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={user?.profilePicture || "/default-avatar.png"}
                                    alt={`${user?.firstName || "User"}'s profile`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/default-avatar.png";
                                    }}
                                  />
                                )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {user?.role === "employer" ? "E" : "U"}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">
                                {user?.role === "employer"
                                  ? user?.companyName || "Company"
                                  : `${user?.firstName || "User"}`}
                              </h4>
                              <p className="text-sm text-gray-300">{user?.email || "No email"}</p>
                              <p className="text-xs text-purple-300 mt-1">
                                {user?.role === "employer" ? "Employer" : "Professional"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => handleViewProfile(user._id)}
                              className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllConnections;