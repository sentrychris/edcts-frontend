import type { Schedule } from "@/core/interfaces/Schedule";

export const getStatusText = (schedule: Schedule) => {
  const { status } = schedule;
  if (status.boarding) return "BOARDING OPEN";
  if (status.departed) return "DEPARTED";
  if (status.arrived) return "ARRIVED";
  if (status.cancelled) return "CANCELLED";

  return "NOT READY";
};

export const renderStatusText = (value: Schedule | string) => {
  const status = typeof value === "string" ? value : getStatusText(value);

  return (
    <p
      className={
        status === "DEPARTED"
          ? "text-glow__blue"
          : status === "NOT READY"
            ? "text-glow__orange"
            : status === "CANCELLED"
              ? "text-red-300"
              : "text-green-200"
      }
    >
      {status}
    </p>
  );
};
