import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../utils/Spinner";
import Post from "./Post";
import { getSavedPost } from "../../services/commonService";
import { PostType } from "../../types/Candidate";

export const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getSavedPost();
        setSavedPosts(posts);
      } catch (error) {
        toast.error("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedPosts();
  }, []);

  
  const handleUnsavePost = (postId: string) => {
    
    setSavedPosts(prevPosts => prevPosts.filter(p => p._id !== postId));
  };

  if (isLoading) return <Spinner loading={true} />;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Saved Posts</h1>
      {savedPosts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          <p>No saved posts!</p>
          <p className="text-sm mt-2">Posts you will save will appear here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPosts.map((savedPost) => (
            <Post key={savedPost._id} post={savedPost} onUnsave={handleUnsavePost} />
          ))}
        </div>
      )}
    </div>
  );
};
