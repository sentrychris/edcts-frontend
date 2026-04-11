export interface SystemDistance {
  id: number;
  id64: number;
  name: string;
  coords: {
    x: number;
    y: number;
    z: number;
  };
  distance: number;
  slug: string;
}
