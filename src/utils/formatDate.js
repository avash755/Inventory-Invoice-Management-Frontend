export function formatDate(input) {
  if (!input) return "—";
  const d = new Date(input);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(input) {
  if (!input) return "—";
  const d = new Date(input);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}