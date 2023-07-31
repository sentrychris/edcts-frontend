export const MEGASHIPS = [
  'Mega ship',
  // 'Fleet Carrier', // Ignore fleet carriers for now
  'Installation',
  'Capital Ship Dock',
  'Carrier Construction Dock'
];

export const SPACE_STATIONS = [
  'Coriolis Starport',
  'Ocellus Starport',
  'Orbis Starport',
  'Asteroid base',
  'Outpost'
];

// Ports with services like shipyards
export const SURFACE_PORTS = [
  'Planetary Port',
  'Planetary Outpost',
  'Workshop'
];

// Bases in Horizons
export const PLANETARY_OUTPOSTS = [
  'Military Outpost',
  'Scientific Outpost',
  'Commercial Outpot',
  'Mining Outpost',
  'Industrial Outpost',
  'Civilian Outpost',
  'Planetary Settlement'
];

// Bases in Odyssey
export const SETTLEMENTS = ['Odyssey Settlement'];

// All types of ground facility
export const PLANETARY_BASES = SURFACE_PORTS.concat(PLANETARY_OUTPOSTS).concat(SETTLEMENTS);

export const UNKNOWN_VALUE = 'Unknown';

export const SOL_RADIUS_IN_KM = 696340;