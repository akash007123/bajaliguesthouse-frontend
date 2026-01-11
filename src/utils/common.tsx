export const formatDate = (
  date: string | Date,
  locale: string = "en-GB"
): string => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
