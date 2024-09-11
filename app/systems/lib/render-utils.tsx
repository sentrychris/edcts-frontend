/**
 * Render security text according to the level
 * @param level - the security level
 * @param suffix - add a suffix
 * @returns
 */
export const renderSecurityText = (level: string = "None", suffix = "") => {
  return (
    <span
      className={
        "uppercase tracking-wide " +
        (level === "Medium"
          ? "text-orange-300"
          : ["Low", "Anarchy", "None", "No"].includes(level)
            ? "text-red-300"
            : "text-green-300")
      }
    >
      {level} {suffix}
    </span>
  );
};

/**
 * Render allegiance text according to the value
 * @param value - the allegiance value
 * @returns
 */
export const renderAllegianceText = (value: string = "None") => {
  return (
    <span
      className={
        "uppercase tracking-wide " +
        (["Federation", "Alliance"].includes(value)
          ? "text-glow__blue"
          : value === "Empire"
            ? "text-yellow-400"
            : ["Independent"].includes(value)
              ? "text-green-300"
              : "text-stone-300")
      }
    >
      {value}
    </span>
  );
};

export const stationIconByType = (type: string) => {
  let icon = "icarus-terminal-orbis-starport";
  if (type === "Coriolis Starport") {
    icon = "icarus-terminal-coriolis-starport";
  } else if (type === "Outpost") {
    icon = "icarus-terminal-outpost";
  } else if (type === "Asteroid base") {
    icon = "icarus-terminal-asteroid-base";
  } else if (type === "Ocellus Starport") {
    icon = "icarus-terminal-ocellus-starport";
  } else if (type === "Mega ship") {
    icon = "icarus-terminal-megaship";
  }

  return icon;
};
