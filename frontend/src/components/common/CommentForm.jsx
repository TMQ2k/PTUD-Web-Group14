import { twMerge } from "tailwind-merge";
import { useState } from "react";

const CommentForm = ({ submitLabel, handleSubmit, initialText = "", onCancel, isTopBidder }) => {
  const [text, setText] = useState(initialText);
  const isTextDisabled = text.length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <textarea
        className={twMerge("w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none  focus:ring-1  resize-none transition duration-200 ease-in-out", 
          isTopBidder ? "focus:border-orange-500 focus:ring-orange-500" : "focus:border-blue-500 focus:ring-blue-500"
        )}
        placeholder="Write your comment..."
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isTextDisabled}
          className={twMerge("px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition",
            isTopBidder ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700 "
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;