import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostType, UserCandidate } from "../../types/Candidate";
import { PostInput } from "../candidate/CreatePost/PostInput";
import { CreatePost } from "../candidate/CreatePost/CreatePost";
import SideBar from "./SideBar";
import Post from "../candidate/Post";
import { fetchUserPosts } from "../../services/authService";
import toast from "react-hot-toast";
export const Skelton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);
const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);

  const currentUser = useSelector(
    (state: { user: UserCandidate }) => state.user
  );
  const logo = currentUser.logo;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchUserPosts();
        console.log('response',response)
        setPosts(response.posts);
      } catch (error) {
        toast.error("Failed to get posts");
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className=" min-h-screen bg-[#1A1D2B] text-white">
                  <SideBar />
      <div className="flex">
        <main className="flex-1 ml-0 sm:ml-[320px] mr-0 sm:mr-[320px] p-4">
          <PostInput
            onClick={() => setShowCreatePost(true)}
            companyLogo={logo}          />
          <CreatePost
            isOpen={showCreatePost}
            onClose={() => setShowCreatePost(false)}
            role="employer"
          />
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
export default Feed;
