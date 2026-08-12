import { Search, ArrowUpDown, LayoutList, LayoutGrid } from "lucide-react";

const TableToolbar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortBy,
  onSortChange,
  sortOptions = [],
  viewMode,
  onViewModeChange,
  viewModeOptions = ["list", "grid"],
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-3">
        {sortOptions.length > 0 && (
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
        )}
        {viewModeOptions.length > 0 && (
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            {viewModeOptions.map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`p-2.5 ${
                  viewMode === mode
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {mode === "list" ? <LayoutList size={18} /> : <LayoutGrid size={18} />}
              </button>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default TableToolbar;
