export const MEGASHIPS = [
  'Mega ship',
  'Fleet Carrier',
  'Installation',
  'Capital Ship Dock',
  'Carrier Construction Dock',
];

export const SPACE_STATIONS = [
  'Coriolis Starport',
  'Ocellus Starport',
  'Orbis Starport',
  'Asteroid base',
  'Outpost',
];

export const SURFACE_PORTS = [
  'Planetary Port',
  'Planetary Outpost',
  'Workshop',
];

export const PLANETARY_OUTPOSTS = [
  'Military Outpost',
  'Scientific Outpost',
  'Commercial Outpot',
  'Mining Outpost',
  'Industrial Outpost',
  'Civilian Outpost',
  'Planetary Settlement',
];

export const SETTLEMENTS = ['Odyssey Settlement'];

export const PLANETARY_BASES = SURFACE_PORTS
  .concat(PLANETARY_OUTPOSTS)
  .concat(SETTLEMENTS);

export const UNKNOWN_VALUE = 'Unknown';

export const SOL_RADIUS_IN_KM = 696340;

export enum CelestialBodyType {
  Star = 'Star',
  Planet = 'Planet',
  Null = 'Null',
}