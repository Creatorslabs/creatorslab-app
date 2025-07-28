export const parseCount = (str: string): number => {
  if (!str) return 0;
  if (str.endsWith("M")) return parseFloat(str) * 1_000_000;
  if (str.endsWith("K")) return parseFloat(str) * 1_000;

  return parseInt(str);
};

export const calculateTrendingScore = (task: any) => {
  const likes = parseCount(task.likes);
  const comments = parseCount(task.comments);
  const shares = parseCount(task.shares);
  const participation = task.participationCount || 0;

  return likes * 1 + comments * 2 + shares * 3 + participation * 2;
};
