import { twMerge } from "tailwind-merge";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { formatCustomDate } from "../../utils/DateTimeCalculation";
import { IoChevronDownOutline, IoChevronUp } from "react-icons/io5";
import default_avatar_image from "../../../public/images/default/default_avatar.jfif";

const CommentItem = ({ comment, comments, addReply, userRole, isTopBidder, isShowReplying=true }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplying, setShowReplying] = useState(isShowReplying);

  const handleReply = (text) => {
    addReply(text, comment?.comment_id);
    setIsReplying(false);
  };

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="shrink-0">
        <img
          className="w-10 h-10 rounded-full object-cover outline-2 outline-offset-2 outline-blue-400"
          src={comment?.user_avatar_url || default_avatar_image}
          alt={comment?.username}
        />
      </div>

      <div className="grow">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className={twMerge("font-semibold", isTopBidder ? "text-orange-600" : "text-blue-600")}>
            {comment?.username}
          </span>
          <span className="text-sm text-gray-500">{formatCustomDate(comment?.posted_at)}</span>
        </div>

        {/* Body */}
        <p className="text-gray-700 leading-relaxed mb-2">{comment?.content}</p>

        {/* Actions */}
        <div className="flex flex-row items-center gap-4 mb-4">
          {userRole !== "guest" && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className={twMerge("text-sm font-medium text-gray-500  transition", 
                isTopBidder ? "hover:text-orange-600" : "hover:text-blue-600"
              )}
            >
              Phản hồi
            </button>
          )}
          {comment?.replies?.length > 0  && (
            <button
              onClick={() => setShowReplying(!showReplying)}
              className={twMerge("flex flex-row gap-1 items-center text-sm font-medium text-gray-500 transition", 
                isTopBidder ? "hover:text-orange-600" : "hover:text-blue-600"
              )}
            >
              
              {showReplying ? "Đóng" : "Hiện"} phản hồi
              {showReplying ? <IoChevronUp/> : <IoChevronDownOutline className="size-4"/>}
            </button>
          )}
        </div>

        {/* Reply Form (Conditional) */}
        {isReplying && userRole !== "guest" && (
          <div className="mb-6">
            <CommentForm
              submitLabel="Reply"
              handleSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
    
        {showReplying && comment?.replies && comment?.replies?.length > 0 && (
          <div className="pl-6 border-l-2 border-gray-100 space-y-6">
            {comment?.replies?.map((_, i, arr) => (
              <CommentItem
                key={arr[arr.length - 1 - i]}
                comment={comments?.find((c) => c?.comment_id === arr[arr.length - 1 - i])}
                addReply={addReply}
                comments={comments}
                userRole={userRole}
              />
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default CommentItem;
