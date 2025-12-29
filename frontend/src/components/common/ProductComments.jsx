import React, { useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { commentApi } from "../../api/comment.api";
import { FourSquare } from "react-loading-indicators";

const ProductComments = React.memo(({ productId }) => {
  const { userData } = useSelector((state) => state.user);
  const website_link =
    import.meta.env.WEBSITE_BASE_URL || "http://localhost:3000/products";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const role = userData?.role || "guest";

  useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      setLoading(true);
      setError(null);

      try {
        const respone = await commentApi.getAllComments(productId);
        //console.log(respone.data);
        if (isMounted) {
          setComments(respone.data);
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          setError(err);
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
    try {
      const payload = {
        content: content,
        link_product: `${website_link}/${productId}`,
        parent_comment_id: parentId,
      };

      const respone = await commentApi.postComment(productId, payload);
      //console.log(respone.data);
      setComments((prev) => {
        //console.log(respone.data);
        if (respone?.data) {
          return [...prev, respone.data];
        } else return [...prev];
      });
    } catch (err) {
      console.log("Post comment error: ", err.message);
    }
  };

  return (
    <>
      {/* {loading && (
        <div className="h-fit w-full mt-10 flex items-center justify-center">
          <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && (
        <div className="text-2xl font-bold text-red-500 text-center w-full">
          Can not get comments
        </div>
      )} */}
      {/*{!loading && !error && (
        <div className="max-w-screen mx-auto p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-blue-600 mb-6">
            Bình luận ({comments.length})
          </h3>

          
          <div className="mb-8">
            {role !== "guest" && (
              <CommentForm
                submitLabel="Đăng bình luận"
                handleSubmit={(text) => handleAddComment(text, null)}
              />
            )}
          </div>
          
          <div
            className="space-y-6 py-6 px-6 max-h-[500px] overflow-y-auto overscroll-contain
                bg-white rounded-xl border border-blue-100
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]                
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-blue-50
                [&::-webkit-scrollbar-thumb]:bg-blue-200
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-blue-400"
          >
            {comments.map(
              (_, i, arr) =>
                arr[arr.length - 1 - i].parent_id === null && (
                  <CommentItem
                    //id={arr[arr.length - 1 - i].comment_id}
                    key={arr[arr.length - 1 - i].comment_id}
                    comment={arr[arr.length - 1 - i]}
                    comments={comments}
                    addReply={handleAddComment}
                    userRole={role}
                  />
                )
            )}
          </div>
        </div>
      )} */}
      <Suspense
        fallback={
          <div className="h-fit w-full mt-10 flex items-center justify-center">
            <FourSquare color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
          </div>
        }
      >
        <div className="max-w-screen mx-auto p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-blue-600 mb-6">
            Bình luận ({comments.length})
          </h3>          
          <div className="mb-8">
            {role !== "guest" && (
              <CommentForm
                submitLabel="Đăng bình luận"
                handleSubmit={(text) => handleAddComment(text, null)}
              />
            )}
          </div>
          
          <div
            className="space-y-6 py-6 px-6 max-h-[500px] overflow-y-auto overscroll-contain
                bg-white rounded-xl border border-blue-100
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]                
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-blue-50
                [&::-webkit-scrollbar-thumb]:bg-blue-200
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-blue-400"
          >
            {comments.map(
              (_, i, arr) =>
                arr[arr.length - 1 - i].parent_id === null && (
                  <CommentItem                    
                    key={arr[arr.length - 1 - i].comment_id}
                    comment={arr[arr.length - 1 - i]}
                    comments={comments}
                    addReply={handleAddComment}
                    userRole={role}
                  />
                )
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
});

export default ProductComments;
