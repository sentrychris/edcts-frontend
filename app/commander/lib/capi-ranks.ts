const combatRanks = [
  "Harmless",
  "Mostly Harmless",
  "Novice",
  "Competent",
  "Expert",
  "Master",
  "Dangerous",
  "Deadly",
  "Elite",
];

const tradeRanks = [
  "Penniless",
  "Mostly Penniless",
  "Peddler",
  "Dealer",
  "Merchant",
  "Broker",
  "Entrepreneur",
  "Tycoon",
  "Elite",
];

const exploreRanks = [
  "Aimless",
  "Mostly Aimless",
  "Scout",
  "Surveyor",
  "Trailblazer",
  "Pathfinder",
  "Ranger",
  "Pioneer",
  "Elite",
];

const cqcRanks = [
  "Helpless",
  "Mostly Helpless",
  "Amateur",
  "Semi-Professional",
  "Professional",
  "Champion",
  "Hero",
  "Legend",
  "Elite",
];

const empireRanks = [
  "None",
  "Outsider",
  "Serf",
  "Master",
  "Squire",
  "Knight",
  "Lord",
  "Baron",
  "Viscount",
  "Count",
  "Earl",
  "Marquis",
  "Duke",
  "Prince",
  "King",
];

const federationRanks = [
  "None",
  "Recruit",
  "Cadet",
  "Midshipman",
  "Petty Officer",
  "Chief Petty Officer",
  "Warrant Officer",
  "Ensign",
  "Lieutenant",
  "Lt. Commander",
  "Post Commander",
  "Post Captain",
  "Rear Admiral",
  "Vice Admiral",
  "Admiral",
];

const soldierRanks = [
  "Defenceless",
  "Mostly Defenceless",
  "Rookie",
  "Soldier",
  "Gunslinger",
  "Warrior",
  "Gladiator",
  "Deadeye",
  "Elite",
];

const exobiologistRanks = [
  "Directionless",
  "Mostly Directionless",
  "Compiler",
  "Collector",
  "Cataloguer",
  "Taxonomist",
  "Ecologist",
  "Geneticist",
  "Elite",
];

const rankMaps: Record<string, string[]> = {
  combat: combatRanks,
  trade: tradeRanks,
  explore: exploreRanks,
  cqc: cqcRanks,
  empire: empireRanks,
  federation: federationRanks,
  soldier: soldierRanks,
  exobiologist: exobiologistRanks,
};

export function getRankLabel(category: string, value: number): string {
  const map = rankMaps[category];
  if (!map) {
    return `Rank ${value}`;
  }

  return map[value] ?? `Rank ${value}`;
}

export function getRankProgress(category: string, value: number): number {
  const map = rankMaps[category];
  if (!map || map.length <= 1) {
    return 0;
  }

  return Math.round((value / (map.length - 1)) * 100);
}
