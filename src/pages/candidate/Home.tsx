import { Bookmark, MoreHorizontal, Users } from "lucide-react";
import Navbar from "../../utils/Navbar";
import { useState } from "react";
import { CreatePost } from "./CreatePost/CreatePost";
import { PostInput } from "./CreatePost/PostInput";
import { useSelector } from "react-redux";
import { UserCandidate } from "../../types/Candidate";

const Skelton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
);
const LeftSideBar = ({
  icon: Icon,
  children,
}: {
  icon: any;
  children: React.ReactNode;
}) => (
  <a
    href="#"
    className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
  >
    <Icon className="h-6 w-6" />
    <span className="text-sm font-medium">{children}</span>
  </a>
);



const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const currentUser=useSelector((state:{user:UserCandidate})=>state.user)
  const profilePicture=currentUser.profilePicture

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <div className="w-full sm:w-[360px] fixed left-0  top-16  h-[calc(100vh-64px)] p-4 overflow-y-auto bg-gray-100 z-0">
          <div className="space-y-2">
            <div className="items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden"></div>
            </div>
            <LeftSideBar icon={Users}>Friends</LeftSideBar>
            <LeftSideBar icon={Bookmark}>Saved</LeftSideBar>
          </div>
        </div>

        <main className="flex-1 ml-0 sm:ml-[360px] mr-0 sm:mr-[360px] p-4">
          <PostInput onClick={() => setShowCreatePost(true)} profilePicture={profilePicture}/>
          <CreatePost isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} role='user ' />




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

export default Home;