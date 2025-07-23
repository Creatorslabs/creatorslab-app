export const formatDate = (date?: Date): string => {
  if (!date) return "No expiration";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const getTimeRemaining = (expiration?: Date): string => {
  if (!expiration) return "No expiration Date";

  const now = new Date();
  const exp = new Date(expiration);
  const diff = exp.getTime() - now.getTime();

  if (diff <= 0) return "Task Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `Ending in ${minutes}m`;
};
