export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getDeadlineStatus(deadlineString, currentStatus) {
  if (!deadlineString) return null;
  if (currentStatus === "Completed") {
    return { text: "Completed", type: "completed" };
  }

  const parts = deadlineString.split("-");
  let deadlineDate;
  if (parts.length === 3) {
    deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
  } else {
    deadlineDate = new Date(deadlineString);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      text: overdueDays === 1 ? "1 day overdue" : `${overdueDays} days overdue`,
      type: "overdue",
    };
  } else if (diffDays === 0) {
    return { text: "Due today", type: "due-soon" };
  } else if (diffDays === 1) {
    return { text: "Due tomorrow", type: "due-soon" };
  } else if (diffDays <= 7) {
    return { text: `${diffDays} days left`, type: "due-soon" };
  } else {
    return { text: `${diffDays} days left`, type: "on-track" };
  }
}

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultDeadlineString() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

