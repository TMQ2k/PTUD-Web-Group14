import { SortAsc, Clock, DollarSign } from "lucide-react";

const FilterPanel = ({ sortBy, isActive, onSortChange, onStatusChange }) => {
  const sortOptions = [
    { value: "endtime_desc", label: "Sắp kết thúc", icon: Clock },
    { value: "price_asc", label: "Giá tăng dần", icon: DollarSign },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sort By */}
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <SortAsc className="w-4 h-4 text-purple-600" />
            Sắp xếp theo
          </label>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium 
                             transition-all border-2 ${
                               isSelected
                                 ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-md scale-105"
                                 : "bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                             }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
