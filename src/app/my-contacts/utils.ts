export const getPageNumbers = (
  current: number,
  total: number,
  maxVisible: number = 5
) => {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(current - half, 1);
  let end = start + maxVisible - 1;

  if (end > total) {
    end = total;
    start = Math.max(end - maxVisible + 1, 1);
  }
  const pages = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis");
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < total) {
    if (end < total - 1) pages.push("ellipsis");
    pages.push(total);
  }
  return pages;
};

export const calculateDaysSinceCreation = (createDate: string) => {
  const create = new Date(createDate);
  const now = new Date();
  create.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - create.getTime()) / (1000 * 60 * 60 * 24));
};
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return null;
  }
  return new Date(dateString).toLocaleDateString("en-US");
};
