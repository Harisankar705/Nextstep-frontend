import { useSelector } from "react-redux";
import { PostComponentProps } from "../../types/Candidate";
import { Bookmark, MapPin, MessageSquare, Share2, ThumbsUp, X } from 'lucide-react';
import { getCompanyLogo, getPostImageURL, getProfilePictureURL } from "../../utils/ImageUtils";
import { useEffect, useState } from "react";
import { getRelativeTime } from "../../utils/relativeTime";
import { Like } from "./CreatePost/Like";
import Comments from "./CreatePost/Comments";
import { checkSavedStatus, interactionCount, savePost } from "../../services/commonService";
import toast from "react-hot-toast";
import { SharePost } from "./CreatePost/SharePost";
const Post:React.FC<PostComponentProps>=({ post,
    profilePicture,
    userName,
    onUnsave,
    role
})=> 
    {
    const [timeAgo, setTimeAgo] = useState(getRelativeTime(post.createdAt));
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(0)
    const [likeCount, setLikeCount] = useState(0)
    const [likedByUser, setLikedByUser] = useState(false)
    const [isSaved,setIsSaved]=useState(false)
    const [isShareModalOpen,setIsShareModalOpen]=useState(false)
    useEffect(() => {
        const isRecent =
            new Date().getTime() - new Date(post.createdAt).getTime() < 360000;
        if (isRecent) {
            const interval = setInterval(() => {
                setTimeAgo(getRelativeTime(post.createdAt));
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [post.createdAt]);
    useEffect(()=>{
        const isPostSaved=async()=>{
            try {
                const savedStatus=await checkSavedStatus(post._id)
                setIsSaved(savedStatus)
            } catch (error) {
                console.error("Failed to fetch saved status",error)
            }
        }
        isPostSaved()
    },[post._id])
    useEffect(() => {
        setLikedByUser(post.likedByUser?? false);
    }, [post])
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsCommentsOpen(false);
            }
        };
        if (isCommentsOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isCommentsOpen]);
    const handleSavePost=async()=>{
        try {
            const result=await savePost(post._id)
            const savedStatus = result.message.toLowerCase().includes('saved');
            setIsSaved((prevState)=>!prevState)
            if(savedStatus && onUnsave)
            {
                onUnsave(post._id)
            }
            toast.success(result.message)
        } catch (error) {
            toast.error("Failed to save post")
        }
    }
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await interactionCount(post._id)
                setCommentCount(response.commentCount)
                setLikeCount(response.likeCount)
            } catch (error) {
                toast.error("Error occured while fetching comment")
                console.error("Error occured while fetching comment", error)
            }
        }
        fetchCount()
    }, [post._id])
    console.log('in post')
    const handleCommentCountchange = (newCount: number) => {
        setCommentCount(newCount)
    }
    const handleShareClose=()=>{
        setIsShareModalOpen(false)
    }
    const currentUser = useSelector((state: any) => state.user);
    const finalProfilePicture = profilePicture
    ? role === 'employer'
        ? getCompanyLogo(profilePicture)  
        : getProfilePictureURL(profilePicture) 
    : getProfilePictureURL(currentUser?.profilePicture);  
    const finalUserName = userName
        ? userName
        : `${currentUser?.firstName || "User"} ${currentUser?.lastName || ""}`;
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-md">
              {isShareModalOpen && (
            <SharePost isOpen={isShareModalOpen}
            onClose={handleShareClose}
            post={post}/>
        )}
            <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                        src={finalProfilePicture}
                        alt="Post"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium text-white">{finalUserName}</p>
                    <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{post.location}</span>
                        <span className="mx-1">•</span>
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </div>
            <p className="text-white mb-4">{post.text}</p>
            {post.image && post.image.length > 0 && (
                <div className="mt-4 space-y-2">
                    {post.image.map((image: string, index: number) => (
                        <div
                            key={index}
                            className="relative h-[400px] w-full overflow-hidden rounded-lg"
                        >
                            <img
                                src={getPostImageURL(image)}
                                alt={`Post image ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
            {post.background && (
                <div className={`p-4 rounded-lg mb-4 ${post.background}`}>
                    <p className="text-white">{post.text}</p>
                </div>
            )}
<div className="flex items-center justify-between border-t border-gray-800 pt-2">
<div className="flex items-center gap-1">
                    {likeCount }
                    <ThumbsUp className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-4">
                    <span>{commentCount} comments</span>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-gray-800 pt-2">
                <Like
                    postId={post._id}
                    initialLikes={likeCount}
                    initiallyLiked={post.likedByUser}
                    onLikeCountChange={(newCount) => setLikeCount(newCount)}
                    currentUser={currentUser}
                    post={post}
                />
                <button
                    onClick={() => setIsCommentsOpen(true)}
                    className="flex items-center gap-2 text-gray-400 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span>Comment</span>
                </button>
                <button onClick={()=>setIsShareModalOpen(true)} className="flex items-center gap-2 text-gray-400 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                </button>
                <button onClick={handleSavePost} className={`flex items-center gap-2 ${isSaved ?'text-gray-400 bg-purple-600':'text-gray-400 hover:bg-gray-800'}  px-4 py-2 rounded-lg transition-colors`}>
                    <Bookmark className={`w-5 h-5 ${isSaved?'fill-current':''}`} />
                    <span>{isSaved?"Saved":"Save"}</span>
                </button>
            </div>
            {isCommentsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="relative w-full max-w-lg max-h-[90vh] bg-gray-900 rounded-lg shadow-xl mx-4"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <h2 className="text-lg font-semibold text-white">Comments</h2>
                            <button
                                onClick={() => setIsCommentsOpen(false)}
                                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                            <Comments postId={post._id}
                                onCommentCountChange={handleCommentCountchange}
                                currentUser={currentUser}
                    post={post}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Post;
