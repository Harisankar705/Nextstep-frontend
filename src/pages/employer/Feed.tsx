import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { UserCandidate } from "../../types/Candidate";
import { PostInput } from "../candidate/CreatePost/PostInput";
import { CreatePost } from "../candidate/CreatePost/CreatePost";
import SideBar from "./SideBar";
export const Skelton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);
const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const currentUser = useSelector(
    (state: { user: UserCandidate }) => state.user
  );
  const logo = currentUser.logo;
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Skelton className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <Skelton className="h-4 w-32 mb-2" />
                  <Skelton className="h-3 w-24" />
                </div>
                <button className="text-gray-500">
                  <MoreHorizontal className="h-6 w-6" />
                </button>
              </div>
              <Skelton className="w-full h-full" />
              <div className="flex gap-2">
                <Skelton className="h-8 w-20" />
                <Skelton className="h-8 w-20" />
                <Skelton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
export default Feed;
