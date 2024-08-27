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

/**
 * Parse id64 system addresses into boxel data.
 * 
 * Every system in Elite: Dangerous has a unique 64-bit identifier called an id64.
 * This is64 contains all the spatial and heirarichal information about the system,
 * including its position in the galaxy, the sector within the galaxy, and the boxel
 * within the sector.
 * 
 * @param id64 
 * @returns 
 */
export function getBoxelDataFromId64(id64: number) {
  const id64BigInt = BigInt(id64);

  function unpackAndShift(value: bigint, bits: bigint) {
    return [(value >> bits), value & (2n ** bits - 1n)];
  };

  let lenUsed = 0n;
  // The meta-coordinate, affects the size of other components
  const [i1, mc]      = unpackAndShift(id64BigInt, 3n); lenUsed += 3n; // mc = 0-7 for a-h

  // 3D cartesian coordinates with sectors and boxels indicating different levels
  // of spatial granularity (e.g. sectors are larger and boxels are smaller subdivisions).
  const [i2, boxelZ]  = unpackAndShift(i1, 7n - mc); lenUsed += 7n - mc;
  const [i3, sectorZ] = unpackAndShift(i2, 7n); lenUsed += 7n;
  const [i4, boxelY]  = unpackAndShift(i3, 7n - mc); lenUsed += 7n - mc;
  const [i5, sectorY] = unpackAndShift(i4, 6n); lenUsed += 6n;
  const [i6, boxelX]  = unpackAndShift(i5, 7n - mc); lenUsed += 7n - mc;
  const [i7, sectorX] = unpackAndShift(i6, 7n); lenUsed += 7n;

  // Shift the remainder of the 64-bit identifier
  const [i9, n2]      = unpackAndShift(i7, 55n - lenUsed);

  // Use the final 9 bits to determine the identifier for the bodies and entities
  // within the star system.
  const [i8, bodyId]  = unpackAndShift(i9, 9n);

  // Boxel size is calculated based on mc
  const boxelSize = 10n * (2n ** mc);

  // Return the parsed data
  return JSON.stringify({
    mc: Number(mc),
    boxel_size: Number(boxelSize),
    sector_x: Number(sectorX),
    sector_y: Number(sectorY),
    sector_z: Number(sectorZ),
    boxel_x: Number(boxelX),
    boxel_y: Number(boxelY),
    boxel_z: Number(boxelZ),
    n2: Number(n2),
    body_id: Number(bodyId),
  });
};