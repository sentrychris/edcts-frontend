export function formatDate(datestr?: string) {
  if (!datestr) {
    return "0000-00-00 00:00";
  }

  return new Date(datestr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function escapeRegExp(text: string) {
  return text.replace(/[[\]{}()*+?.,\-\\^$|#\s]/g, "\\$&");
}

export function pluralizeTextFromArray(
  arr: any[],
  { singular, plural }: { singular: string; plural: string },
) {
  return arr.length === 1 ? singular : plural;
}

export function getCurrentEliteDate() {
  const date = new Date();
  const currentDay = date.toLocaleString("en-GB", { day: "numeric" });
  const currentMonth = date.toLocaleString("en-GB", { month: "short" }).toUpperCase();
  const currentYear = date.getFullYear() + 1286;

  return `${currentDay} ${currentMonth} ${currentYear}`;
}
