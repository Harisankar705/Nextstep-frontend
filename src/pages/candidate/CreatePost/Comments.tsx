import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { commentPost, getComments } from "../../../services/commonService";
import { getProfilePictureURL } from "../../../utils/ImageUtils";
import { Comment } from "../../../types/Candidate";

const Comments = ({ postId,onCommentCountChange }: { postId: string,onCommentCountChange?:(count:number)=>void }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await getComments(postId);
            if (Array.isArray(response.data)) {
                setComments(response.data);
                onCommentCountChange?.(response.data.length)
            } else {
                console.warn("Comments data is not in the expected format:", response.data);
                setComments([]);
            }
        } catch (error) {
            toast.error("Failed to load comments");
            console.error("Error fetching comments:", error);
        }
    };

    // Fetch comments when the component mounts
    useEffect(() => {
        fetchComments();
    }, [postId,onCommentCountChange]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            setLoading(true);
            try {
                const response = await commentPost(postId, comment);
                // Optionally, you can fetch comments again to get the latest state
                await fetchComments(); // Re-fetch comments after adding a new one
                setNewComment("");
                onCommentCountChange

                toast.success("Comment added successfully!");
            } catch (error) {
                toast.error("Failed to add comment!");
                console.error("Error adding comment:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post"}
                </button>
            </form>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {comments.map((comment) => (
                    <div key={comment._id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            {comment.userId && (
                                <img
                                    src={getProfilePictureURL(comment.userId.profilePicture)}
                                    alt={comment.userId.firstName}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <div>
                                <p className="font-medium text-white">
                                    {comment.userId
                                        ? `${comment.userId.firstName} ${comment.userId.secondName}`
                                        : "Unknown User"}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-200">{comment.comment}</p>
                    </div>
                ))}
            </div>
            <p className="text-gray-400">{comments.length} comments</p> {/* Display comment count */}
        </div>
    );
};

export default Comments;