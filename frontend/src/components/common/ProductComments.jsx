import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { commentApi } from "../../api/comment.api";
import { FourSquare } from "react-loading-indicators";

export default function ProductComments({ productId }) {
  const { userData } = useSelector((state) => state.user);
  const website_link =
    import.meta.env.WEBSITE_BASE_URL || "http://localhost:3000/products";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([
    // {
    //   comment_id: 1,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [2],
    // },
    // {
    //   comment_id: 2,
    //   user_id: 2,
    //   username: "Sarah Cornor",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=2",
    //   content:
    //     "Totally agree. The recursive component part was tricky but useful.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: 1,
    //   replies: [],
    // },
    // {
    //   comment_id: 3,
    //   user_id: 2,
    //   username: "Sarah Cornor",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=2",
    //   content:
    //     "It's fine",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 3,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 4,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 5,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 6,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 7,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 8,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },{
    //   comment_id: 9,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
    // {
    //   comment_id: 10,
    //   user_id: 1,
    //   username: "Alex Johnson",
    //   user_avatar_url: "https://i.pravatar.cc/150?u=1",
    //   content:
    //     "This is a great article! Really helped me understand React patterns.",
    //   posted_date: "2025-10-12T10:20:00Z",
    //   parent_id: null,
    //   replies: [],
    // },
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const respone = await commentApi.getAllComments(productId);
        console.log(respone.data);
        if (isMounted) {
          
          setComments(respone.data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddComment = async (content, parentId) => {
    const payload = {
      content: content,
      link_product: `${website_link}/${productId}`,
      parent_comment_id: parentId,
    };

    console.log("Payload: ", payload);

    //console.log(userData);
    const new_comment_id = (Math.max(0, ...comments.map((c) => c.comment_id)) + 1).toString();
    const newComment = {
      comment_id: new_comment_id,
      user_id: userData.id,
      username: userData.username,
      user_avatar_url: userData.avatar,
      content: content,
      posted_at: new Date(Date.now()).toLocaleString(),
      parent_id: parentId,
      replies: [],
    };

    console.log(newComment);

    // create new comment locally
    setComments((prevComments) => {
      const updatedComments = [...prevComments, newComment];

      if (parentId) {
        return updatedComments.map((comment) => {
          if (comment.comment_id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), new_comment_id]
            };
          }
          return comment;
        });
      }

      return updatedComments;
    });
    // post to api
    commentApi.postComment(productId, payload);
  };

  return (
    <>
      {loading && (<FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />)}
      {!loading && !error && (
        <div className="max-w-screen mx-auto p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-blue-600 mb-6">
            Comments ({comments.length})
          </h3>

          {/* Root Comment Form */}
          <div className="mb-8">
            <CommentForm
              submitLabel="Post Comment"
              handleSubmit={(text) => handleAddComment(text, null)}
            />
          </div>      

          {/* Render Root Comments */}
          <div className="space-y-6 py-4 px-2 max-h-100 overflow-auto overscroll-auto border-b border-r border-t border-blue-500">   
            {comments.map((comment, i, arr) => arr[arr.length - 1 - i].parent_id === null && (
              <CommentItem
                //id={arr[arr.length - 1 - i].comment_id}
                key={arr[arr.length - 1 - i].comment_id}
                comment={arr[arr.length - 1 - i]}
                comments={comments}
                addReply={handleAddComment}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
