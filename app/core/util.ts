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

  /**
   * Unpacks a value and shifts it to the right by a number of bits.
   *
   * Returns a tuple with two elements, the first element is the value
   * shifted to the right by the number of bits, and the second element
   * is the value masked with 2^bits - 1, this part captures the lower bits.
   *
   * @param value
   * @param bits
   * @returns
   */
  const rshift = (value: bigint, bits: bigint) => {
    return [
      value >> bits, // shtift the value to the right by bits
      value & (2n ** bits - 1n), // mask the value with 2^bits - 1
    ];
  };

  let used = 0n;
  // The meta-coordinate, affects the size of other components, encoded in 3 bits
  const [i1, mc] = rshift(id64BigInt, 3n);
  used += 3n; // mc = 0-7 for a-h

  // 3D cartesian coordinates with sectors and boxels, encoded in 7-bit chunks
  // minus the meta-coordinate for the boxel.
  const [i2, boxelZ] = rshift(i1, 7n - mc);
  used += 7n - mc;
  const [i3, sectorZ] = rshift(i2, 7n);
  used += 7n;
  const [i4, boxelY] = rshift(i3, 7n - mc);
  used += 7n - mc;
  const [i5, sectorY] = rshift(i4, 6n);
  used += 6n;
  const [i6, boxelX] = rshift(i5, 7n - mc);
  used += 7n - mc;
  const [i7, sectorX] = rshift(i6, 7n);
  used += 7n;

  // Shift the remainder of the 64-bit identifier
  const [i9, n2] = rshift(i7, 55n - used);

  // Use the final 9 bits to determine the identifier for the bodies and entities
  // within the star system.
  const [i8, bodyId] = rshift(i9, 9n);

  // Boxel size is calculated based on mc
  const boxelSize = 10n * 2n ** mc;

  // Return the parsed data
  return {
    metaCoordinate: Number(mc),
    boxel: {
      size: Number(boxelSize),
      x: Number(boxelX),
      y: Number(boxelY),
      z: Number(boxelZ),
    },
    sector: {
      x: Number(sectorX),
      y: Number(sectorY),
      z: Number(sectorZ),
    },
    n2: Number(n2),
    body_id: Number(bodyId),
  };
}
