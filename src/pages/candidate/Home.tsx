import { Bookmark, Users } from "lucide-react";
import Navbar from "../../utils/Navbar";
import { useEffect, useState } from "react";
import { CreatePost } from "./CreatePost/CreatePost";
import { PostInput } from "./CreatePost/PostInput";
import { useSelector } from "react-redux";
import { PostType, UserCandidate } from "../../types/Candidate";
import toast from "react-hot-toast";
import Post from "./Post";
import { fetchUserPosts } from "../../services/authService";

const LeftSideBar = ({
  icon: Icon,
  children,
}: {
  icon:React.ElementType,
  children: React.ReactNode;
}) => (
  <a
    href="/saved"
    className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  >
    <Icon className="h-6 w-6" />
    <span className="text-sm font-medium">{children}</span>
  </a>
);
const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUser = useSelector((state: { user: UserCandidate }) => state.user);
  const [posts, setPosts] = useState<PostType[]>([]);
  const profilePicture = currentUser.profilePicture;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchUserPosts();
        setPosts(response.posts);
      } catch (error) {
        toast.error("Failed to get posts");
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <button 
        className="sm:hidden p-4" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <div className="flex">
        <div className={`w-full sm:w-[360px] fixed top-16 h-[calc(100vh-64px)] p-4 overflow-y-auto bg-black z-10 transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}>
          <div className="space-y-2">
            <LeftSideBar icon={Users}>Friends</LeftSideBar>
            <LeftSideBar icon={Bookmark}>Saved</LeftSideBar>
          </div>
        </div>

        <main className="flex-1 ml-0 sm:ml-[360px] mr-0 sm:mr-[360px] p-4">
          <PostInput onClick={() => setShowCreatePost(true)} profilePicture={profilePicture} />
          <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} role="user" />
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                profilePicture={post.userId.profilePicture}
                userName={`${post?.userId.firstName} ${post.userId.secondName}`}
                role={post.userType}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">No posts available!</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;