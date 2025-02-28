import React from 'react';
import { useSelector } from "react-redux";
import { PostComponentProps } from "../../types/Candidate";
import { Bookmark, MapPin, MessageSquare, Share2, ThumbsUp, X, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, Pencil, ReceiptPoundSterling } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
import { getRelativeTime } from "../../utils/relativeTime";
import { Like } from "./CreatePost/Like";
import Comments from "./CreatePost/Comments";
import { checkSavedStatus, deletePost, interactionCount, savePost } from "../../services/commonService";
import toast from "react-hot-toast";
import { SharePost } from "./CreatePost/SharePost";
import { EditPost } from './CreatePost/Editpost';
import { Report } from './Report';

const Post: React.FC<PostComponentProps> = ({
    post,
    profilePicture,
    userName,
    onPostUpdate,
    onUnsave,
    role,
    onDelete,
    isAdmin=false
}) => {
    const [timeAgo, setTimeAgo] = useState(getRelativeTime(post.createdAt));
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(0)
    const [likeCount, setLikeCount] = useState(0)
    const [isSaved, setIsSaved] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [scale, setScale] = useState(1);
    const [isEditModalOpen,setIsEditModalOpen]=useState(false)
    const [isReportModalOpen,setIsReportModalOpen]=useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    console.log("PROFILEPICTURE",profilePicture)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setIsMoreMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    console.log("POST",post)

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

    useEffect(() => {
        const isPostSaved = async () => {
            try {
                const savedStatus = await checkSavedStatus(post._id)
                setIsSaved(savedStatus)
            } catch (error) {
                toast.error("Failed to fetch saved status")
            }
        }
        isPostSaved()
    }, [post._id])

   

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsCommentsOpen(false);
                setSelectedImageIndex(null);
                setScale(1);
                setIsMoreMenuOpen(false);
                setIsDeleteModalOpen(false);
            }
        };
        if (isCommentsOpen || selectedImageIndex !== null || isMoreMenuOpen || isDeleteModalOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isCommentsOpen, selectedImageIndex, isMoreMenuOpen, isDeleteModalOpen]);

    const handleSavePost = async () => {
        try {
            const result = await savePost(post._id)
            const savedStatus = result.message.toLowerCase().includes('saved');
            setIsSaved((prevState) => !prevState)
            if (savedStatus && onUnsave) {
                onUnsave(post._id)
            }
            toast.success(result.message)
        } catch (error) {
            toast.error("Failed to save post")
        }
    }

    const handleDeletePost = async () => {
        try {
            await deletePost(post._id)
            toast.success("Post deleted successfully!")
            if(onDelete) {
                onDelete(post._id)
            }
            
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete post")
        }
        setIsDeleteModalOpen(false)
        setIsMoreMenuOpen(false)
    }

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await interactionCount(post._id)
                setCommentCount(response.commentCount)
                setLikeCount(response.likeCount)
            } catch (error) {
                toast.error("Error occurred while fetching comment")
            }
        }
        fetchCount()
    }, [post._id])

    const handleCommentCountchange = (newCount: number) => {
        setCommentCount(newCount)
    }

    const handleShareClose = () => {
        setIsShareModalOpen(false)
    }

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setScale(1);
    }

    const handleCloseViewer = () => {
        setSelectedImageIndex(null);
        setScale(1);
    }

    const handlePrevImage = () => {
        if (selectedImageIndex !== null && post.image) {
            setSelectedImageIndex((prev) => 
                prev === 0 ? (post.image?.length||1) - 1 : (prev??0) - 1
            );
            setScale(1);
        }
    }
    const handleNextImage = () => {
        if (selectedImageIndex !== null && post.image) {
            setSelectedImageIndex((prev) => 
                prev === 0 ? (post.image?.length||1) - 1 : (prev??0) - 1
            );
            setScale(1);
        }
    }
    
    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.5, 3));
    }

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.5, 1));
    }

    const currentUser = useSelector((state: any) => state.user);
    const isPostOwner = currentUser?.user?._id === post?.userId?._id;

    const finalProfilePicture = profilePicture
    ? role === 'employer'
        ? profilePicture
        : profilePicture
    : currentUser?.profilePicture 
    const finalUserName = userName
    ? userName
    : currentUser 
      ? `${currentUser.firstName || "User "} ${currentUser .secondName || ""}`.trim()
      : "User ";
    
    const renderImageGrid = () => {
        if (!post.image || post.image.length === 0) return null;

        const imageCount = post.image.length;
        if (imageCount === 1) {
            return (
                <div 
                    className="relative h-[400px] w-full overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(0)}
                >
                    <img
                        src={post.image[0]}
                        alt="Post image"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            );
        }

        return (
            <div className={`grid gap-1 ${imageCount === 2 ? 'grid-cols-2' : 
                           imageCount === 3 ? 'grid-cols-2' :
                           'grid-cols-2'}`}>
                {post.image.map((image: string, index: number) => {
                    if (imageCount === 2) {
                        return (
                            <div 
                                key={index} 
                                className="relative h-[400px] overflow-hidden rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        );
                    }

                    if (imageCount === 3 && index === 0) {
                        return (
                            <div 
                                key={index} 
                                className="relative h-[400px] overflow-hidden rounded-lg col-span-2 cursor-pointer"
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        );
                    }

                    if (imageCount === 3) {
                        return (
                            <div 
                                key={index} 
                                className="relative h-[198px] overflow-hidden rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        );
                    }

                    if (imageCount >= 4 && index < 4) {
                        const isLastImage = index === 3 && imageCount > 4;
                        return (
                            <div 
                                key={index} 
                                className="relative h-[198px] overflow-hidden rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(index)}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {isLastImage && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">+{imageCount - 4}</span>
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        );
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-md">
            {!isAdmin && isShareModalOpen && (
                <SharePost isOpen={isShareModalOpen}
                    onClose={handleShareClose}
                    post={post} />
            )}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
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
                {isAdmin ? (
                    <button onClick={()=>setIsDeleteModalOpen(true)}
                    className='p-2 text-red-500 hover:bg-gray-800 rounded-full transition-colors'>
                        <Trash2 className='w-5 h-5'/>
                    </button>
                ):
                isPostOwner && (
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                            className="p-2 text-gray-400 hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {isMoreMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                                <button
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Post
                                </button>
                                <button
                                    onClick={()=>setIsEditModalOpen(true)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={()=>setIsReportModalOpen(true)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                                >
                                    <ReceiptPoundSterling className="w-4 h-4 mr-2" />
                                    Report 
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!isAdmin && isReportModalOpen && (
                <Report postId={post._id}   
                onClose={()=>setIsReportModalOpen(false)}
                role={role}/>
            )}
            <p className="text-white mb-4">{post.text}</p>
            {renderImageGrid()}
            {post.background && (
                <div className={`p-4 rounded-lg mb-4 ${post.background}`}>
                    <p className="text-white">{post.text}</p>
                </div>
            )}
            {!isAdmin && (
                <div className="flex items-center justify-between border-t border-gray-800 pt-2">
                <div className="flex items-center gap-1">
                    {likeCount}
                    <ThumbsUp className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-4">
                    <span>{commentCount} comments</span>
                </div>
            </div>
            )}
            
           {!isAdmin && (
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
<button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 text-gray-400 hover:bg-gray-800 px-6 py-2 rounded-lg transition-colors">
  <Share2 className="w-5 h-5" />
  <span>Share</span>
</button>
<button onClick={handleSavePost} className={`flex items-center gap-2 ${isSaved ? 'text-gray-400 bg-purple-600' : 'text-gray-400 hover:bg-gray-800'}  px-4 py-2 rounded-lg transition-colors`}>
  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
  <span>{isSaved ? "Saved" : "Save"}</span>
</button>
</div>
           )}
          
            {!isAdmin && isCommentsOpen && (
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
            {selectedImageIndex !== null && post.image && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={handleCloseViewer}
                            className="absolute top-4 right-4 p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 p-2 text-white hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                            <button
                                onClick={handleZoomOut}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                disabled={scale <= 1}
                            >
                                Zoom Out
                            </button>
                            <button
                                onClick={handleZoomIn}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                disabled={scale >= 3}
                            >
                                Zoom In
                            </button>
                        </div>
                        <div 
                            className="max-w-[90vw] max-h-[90vh] overflow-auto"
                            style={{
                                cursor: scale > 1 ? 'move' : 'default'
                            }}
                        >
                            <img
                                src={post.image[selectedImageIndex]}
                                alt={`Post image ${selectedImageIndex + 1}`}
                                className="transition-transform duration-200"
                                style={{
                                    transform: `scale(${scale})`,
                                    transformOrigin: 'center center'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {!isAdmin && isEditModalOpen && (
                <EditPost
                post={{
                    id:post._id,
                    text:post.text,
                    background:post.background,
                    location:post.location,
                    images:post.image
                }}
                role={role} 
                onPostUpdate={onPostUpdate}
                isOpen={isEditModalOpen}
                
                onClose={()=>setIsEditModalOpen(false)}/>


            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Delete Post</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone!</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;