import {
    CheckCircle,
    GraduationCap,
    Home,
    LucideMessageSquareText,
    UserCheck,
  } from "lucide-react";
  import { useEffect, useState } from "react";
  import Spinner from "../../utils/Spinner";
  import { useNavigate, useParams } from "react-router-dom";
  import Navbar from "../../utils/Navbar";
  import { PostType } from "../../types/Candidate";
  import { getUserPosts } from "../../services/authService";
  import { individualDetails } from "../../services/adminService";
  import toast from "react-hot-toast";
  import { checkFollowStatus, toggleFollow } from "../../services/commonService";
  import "primereact/resources/themes/saga-blue/theme.css";
  import "primereact/resources/primereact.min.css";
  import "primeicons/primeicons.css";
  import { ReusableConfirmDialog } from "../../utils/ConfirmDialog";
import SideBar from "./SideBar";
import Post from "../candidate/Post";
  
  const SearchProfile = () => {
    const { id: userId, role } = useParams();
  
    const navigate = useNavigate();
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          if (!userId) {
            toast.error("user id not found");
            return;
          }
  
          const [postResponse, details] = await Promise.all([
            getUserPosts(userId),
  
            individualDetails(userId, role as string),
          ]);
  
          setPosts(postResponse);
          const userDetails = details[0];
          setProfileData(userDetails);
          const followingStatus: boolean = await checkFollowStatus(
            userDetails._id
          );
  
          setIsFollowing(followingStatus);
        } catch (error) {
          toast.error("Error fetching posts");
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, [userId, navigate]);
  
    if (loading) {
      return (
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <Spinner loading={true} />
          </div>
        </div>
      );
    }
    if (!profileData) {
      return (
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <div className="text-center py-8">User not found</div>
        </div>
      );
    }
  
    const handleFollowToggle = async () => {
      if (isFollowing) {
        setDialogVisible(true);
      } else {
        try {
          const newFollowStatus = await toggleFollow(profileData._id);
          const isNowFollowing = newFollowStatus.data === true;
          setIsFollowing(isNowFollowing);
          toast.success(
            isNowFollowing
              ? "You are now following this user"
              : "You have unfollowed this user"
          );
        } catch (error) {
          toast.error("Failed to update follow status");
        }
      }
    };
  
    const handleDialogAccept = async () => {
      setDialogVisible(false);
      try {
        const newFollowStatus = await toggleFollow(profileData._id);
        const isNowFollowing = newFollowStatus.data === true;
        setIsFollowing(isNowFollowing);
        toast.success("You have unfollowed the user");
      } catch (error) {
        toast.error("Failed to update follow status");
      }
    };
    const handleMessageClick=()=>{
      navigate(`/messages/${userId}/${role}`);
  
    }
  
    const handleDialogReject = () => {
      setDialogVisible(false);
      toast.success("Unfollow cancelled");
    };
  
    if (loading) {
      return (
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <Spinner loading={true} />
          </div>
        </div>
      );
    }
    if (!profileData) {
      return (
        <div className="min-h-screen bg -black text-white">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-64px)]">
            <h2>User not found</h2>
          </div>
        </div>
      );
    }
  
    const profilePictureURL =
      role === "user"
        ? profileData.profilePicture
        : profileData.logo
  
    return (
      <div className="min-h-screen bg-black text-white flex">
        <SideBar />
        <div className="flex-1 overflow-auto relative ml-64">
        <div className="relative h-[350px] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-black opacity-90">
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="h-48 w-48 rounded-full border-4 border-black overflow-hidden -mt-20 mb-4 ml-10"></div>
          </div>
        </div>
  
        {/* Profile Body */}
        <div className="bg-black text-white pt-20 px-8">
          <div className="max-w-6xl mx-auto mr-9">
            <div className="relative inline-block h-48 w-48 rounded-full overflow-hidden border-4 border-black bg-gray-900 -mt-48 l-auto">
              <img
                src={profilePictureURL}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            {/* User Info */}
            <div className="flex justify-between items-start">
              <div className="text-center">
                <h1 className="text-3xl font-bold">
                  {role === "user"
                    ? `${profileData.firstName} ${profileData.secondName}`
                    : profileData.companyName}
                </h1>
  
                <p className="text-purple-400 mt-1">
                  {profileData.friends
                    ? `${profileData.friends.length} friends`
                    : "No friends"}
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition duration-300"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </button>
                <button className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition duration-300 ml-2" onClick={handleMessageClick}>
                  <LucideMessageSquareText className="mr-2 h-4 w-4"  />
                  Message
                </button>
              </div>
            </div>
            <ReusableConfirmDialog
              visible={isDialogVisible}
              onHide={() => setDialogVisible(false)}
              message="Are you sure you want to unfollow the user?"
              header="Unfollow Confirmation"
              onAccept={handleDialogAccept}
              onReject={handleDialogReject}
            />
  
            <div className="flex border-b border-gray-800 mt-8">
              {["Posts"].map((item) => (
                <button
                  key={item}
                  className={`px-4 py-4 text-sm font-medium ${
                    item === "Posts"
                      ? "text-purple-500 border-b-2 border-purple-500"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
              <div className="md:col-span-4 space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-white mb-3">Intro</h2>
                  <p className="text-center mb-4">{profileData.aboutMe}</p>
                  <button className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mb-4 transition duration-300"></button>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                      <span>
                        {profileData.education
                          ? profileData.education
                              .map(
                                (ed: { degree: string; institution: string }) =>
                                  `${ed.degree} at ${ed.institution}`
                              )
                              .join(", ")
                          : "No education details"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-gray-400" />
                      <span>{profileData.location || "No location"}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                                          <Users className="h-5 w-5 text-gray-400" />
                                          <span>{friends ? `${friends.length} friends` : 'No friends'}</span>
                                      </div> */}
                  </div>
                  <button className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 mt-4 transition duration-300">
                    Edit details
                  </button>
                </div>
              </div>
  
              {/* Main Content */}
              <div className="md:col-span-8 space-y-4">
                {/* Post Input */}
  
                {loading ? (
                  <Spinner loading={true} />
                ) : posts.length > 0 ? (
                  posts.map((post: PostType) => (
                    <Post
                      key={post._id}
                      post={post}
                      profilePicture={
                        role === "user"
                          ? profilePictureURL
                          : `${profileData.logo}`
                      }
                      userName={
                        role === "user"
                          ? `${profileData.firstName ?? ""} ${
                              profileData.secondName ?? ""
                            }`.trim()
                          : profileData.companyName ?? "Company Name Unavailable"
                      }
                      role={role}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No posts to display
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
  
  export default SearchProfile;
  