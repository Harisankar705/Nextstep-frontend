import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { commentPost, getComments } from "../../../services/commonService";
import { Comment, Employer, PostType, UserCandidate } from "../../../types/Candidate";
const Comments = ({
  postId,
  onCommentCountChange,
  currentUser,
}: {
  postId: string; 
  onCommentCountChange?: (count: number) => void;
  currentUser: UserCandidate|Employer|null;
  post: PostType;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      if (Array.isArray(response.data)) {
        setComments(response.data);
        onCommentCountChange?.(response.data.length);
      } else {
        toast.error("Failed to load comments")
        setComments([]);
      }
    } catch (error) {
      toast.error("Failed to load comments");
    }
  };
  useEffect(() => {
    fetchComments();
  }, [postId, onCommentCountChange]);
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.trim()&&currentUser) {
      setLoading(true);
      try {
       const response=await commentPost(postId,comment)
       console.log("REPONSE OF COMMENT",response)
        setNewComment("");
        onCommentCountChange?.(comments.length+1)
        toast.success("Comment added successfully!");
       
       
      } catch (error) {
        toast.error("Failed to add comment!");
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
              {comment.commentor ? (
                comment.commentor.profilePicture ? (
                <img
                  src={comment.commentor.profilePicture}
                  alt={comment.commentor.firstName}
                  className="w-8 h-8 rounded-full"
                />
              ):(
                comment.commentor.logo && (
                    <img src={comment.commentor.logo}
                    className="w-8 h-8 rounded-full"/>
                )
            )
        ):(
            <div className="w-8 h-8 rounded-full bg-gray-600"/>
              )}
              <div>
              <p className="font-medium text-white">
                  {comment.commentor
                    ? comment.commentor.firstName && comment.commentor.secondName
                      ? `${comment.commentor.firstName} ${comment.commentor.secondName}`
                      : comment.commentor.companyName || "Unknown User"
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
      <p className="text-gray-400">{comments.length} comments</p>
    </div>
  );
};
export default Comments;
