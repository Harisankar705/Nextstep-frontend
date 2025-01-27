import { useState } from "react"
import { likePost } from "../../../services/commonService"
import toast from "react-hot-toast"
import { ThumbsUp } from 'lucide-react'
import { useSocket } from "../../../SocketContext"

export const Like = ({
    postId,
    initialLikes = 0,
    initiallyLiked = false,
    onLikeCountChange,
    currentUser,
    post
}: {
    postId: string;
    currentUser:any,
    post:any
    initialLikes?: number;
    initiallyLiked?: boolean;
    onLikeCountChange?:(count:number)=>void
}) => {
    const [isLiked, setIsLiked] = useState(initiallyLiked)
    const [likeCount, setLikeCount] = useState(initialLikes)
    const [loading, setLoading] = useState(false)
    const {socket}=useSocket()

    const handleToggleLike = async () => {
        if (loading) return
        setLoading(true)
        try {
            const response = await likePost(postId)
            setIsLiked(response.data.isLiked)
            const newLikeCount=response.data.isLiked?likeCount+1:likeCount-1
            setLikeCount(newLikeCount)
            onLikeCountChange?.(newLikeCount)

            if(socket && !isLiked && currentUser && post)
            {
                console.log('in newnotification')
                socket.emit("newNotification",{
                    recipient:post.userId,
                    recipientModel:post.userRole==='employer'?"Employer":"User",
                    sender:currentUser._id,
                    type:"post_like",
                    content:`${currentUser.companyName || currentUser.firstName}liked your post`,
                    link:`/posts/${postId}`
                })
            }
        } catch (error) {
            toast.error("Failed to update like")
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggleLike}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${isLiked
                    ? "text-purple-500 hover:bg-purple-500/10"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
        >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span>Like</span>
        </button>
    )
}

