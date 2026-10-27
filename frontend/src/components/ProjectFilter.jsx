import { SearchIcon, CloseIcon } from "./Icons";

export function ProjectFilter({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  counts,
}) {
  const filterOptions = [
    { id: "ALL", label: "All Projects", count: counts.all },
    { id: "Not Started", label: "Not Started", count: counts.notStarted },
    { id: "In Progress", label: "In Progress", count: counts.inProgress },
    { id: "Completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="filter-controls-container">
      {/* Status Filter Tabs */}
      <div className="filter-tabs-wrapper">
        <div className="filter-tabs">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`filter-tab ${activeFilter === opt.id ? "active" : ""}`}
              onClick={() => onFilterChange(opt.id)}
            >
              <span>{opt.label}</span>
              <span className={`tab-count ${activeFilter === opt.id ? "active" : ""}`}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="search-bar">
        <span className="search-icon">
          <SearchIcon size={16} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or description..."
          className="search-input"
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange("")}
            title="Clear search"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
