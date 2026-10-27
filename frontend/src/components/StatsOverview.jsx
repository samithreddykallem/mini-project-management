import { FolderIcon, ClockIcon, CheckCircleIcon } from "./Icons";

export function StatsOverview({ counts, activeFilter, onFilterChange }) {
  const cards = [
    {
      id: "ALL",
      title: "Total Projects",
      count: counts.all,
      icon: <FolderIcon size={20} />,
      colorClass: "stat-all",
    },
    {
      id: "Not Started",
      title: "Not Started",
      count: counts.notStarted,
      icon: <span className="stat-indicator not-started" />,
      colorClass: "stat-not-started",
    },
    {
      id: "In Progress",
      title: "In Progress",
      count: counts.inProgress,
      icon: <ClockIcon size={20} />,
      colorClass: "stat-in-progress",
    },
    {
      id: "Completed",
      title: "Completed",
      count: counts.completed,
      icon: <CheckCircleIcon size={20} />,
      colorClass: "stat-completed",
    },
  ];

  return (
    <div className="stats-overview-grid">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;
        return (
          <div
            key={card.id}
            className={`stat-card ${card.colorClass} ${isSelected ? "selected" : ""}`}
            onClick={() => onFilterChange(card.id)}
            role="button"
            tabIndex={0}
            title={`Filter by ${card.title}`}
          >
            <div className="stat-card-header">
              <span className="stat-title">{card.title}</span>
              <span className="stat-icon-wrap">{card.icon}</span>
            </div>
            <div className="stat-count">{card.count}</div>
          </div>
        );
      })}
    </div>
  );
}
