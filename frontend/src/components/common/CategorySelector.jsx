const CategorySelector = ({ selected, onToggle, error, categories }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          // Check if this specific category is currently chosen
          const isActive = selected.includes(cat.category_id);

          return (
            <button
              key={cat.category_id}
              type="button" // Important: Prevents form submission
              onClick={() => onToggle(cat.category_id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all border duration-400
                ${
                  isActive
                    ? "border-blue-200 bg-linear-to-b from-blue-400 to-purple-600 scale:102 text-white shadow-lg scale-105 "
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 duration-900"
                }
              `}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default CategorySelector;