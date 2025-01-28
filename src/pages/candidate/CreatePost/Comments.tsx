import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getComments } from "../../../services/commonService";
import { getCompanyLogo, getProfilePictureURL } from "../../../utils/ImageUtils";
import { Comment } from "../../../types/Candidate";
import { useSocket } from "../../../SocketContext";

const Comments = ({
  postId,
  onCommentCountChange,
  currentUser,
  post,
}: {
  postId: string;
  onCommentCountChange?: (count: number) => void;
  currentUser: any;
  post: any;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      console.log('fetchedcomments',response.data)
      if (Array.isArray(response.data)) {
        setComments(response.data);
        onCommentCountChange?.(response.data.length);
      } else {
        console.warn(
          "Comments data is not in the expected format:",
          response.data
        );
        setComments([]);
      }
    } catch (error) {
      toast.error("Failed to load comments");
      console.error("Error fetching comments:", error);
    }
  };
  console.log('comments',comments)

  useEffect(() => {
    fetchComments();
  }, [postId, onCommentCountChange]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setLoading(true);
      try {
        if (socket && currentUser && postId) {
          socket.emit("commentPost", {
            userId: currentUser._id,
            comment:comment,
            postId: postId,
            receipientId: post.userId,
            type: "comment_post",
            content: "liked your post",
            link: `/posts/${postId}`,
          });
        }
        
        await fetchComments();
        setNewComment("");
        onCommentCountChange;

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
              {comment.commentor ? (
                comment.commentor.profilePicture ? (
                <img
                  src={getProfilePictureURL(comment.commentor.profilePicture)}
                  alt={comment.commentor.firstName}
                  className="w-8 h-8 rounded-full"
                />
              ):(
                comment.commentor.logo && (
                    <img src={getCompanyLogo(comment.commentor.logo)}
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
