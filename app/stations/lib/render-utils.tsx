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