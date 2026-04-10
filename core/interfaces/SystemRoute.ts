export interface SystemRouteWaypoint {
  jump: number;
  id: number;
  id64: number;
  name: string;
  coords: {
    x: number;
    y: number;
    z: number;
  };
  slug: string;
  distance: number;
  total_distance: number;
}
