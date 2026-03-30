import type { System } from "@/core/interfaces/System";
import type { Station, MappedStation } from "@/core/interfaces/Station";
import type {
  RawSystemBody,
  MappedSystemBody,
  SystemBodyParent,
} from "@/core/interfaces/SystemBody";
import {
  MEGASHIPS,
  SPACE_STATIONS,
  SURFACE_PORTS,
  PLANETARY_OUTPOSTS,
  PLANETARY_BASES,
  SETTLEMENTS,
  SystemBodyType,
} from "@/core/constants/system";
import { escapeRegExp } from "@/core/string-utils";

const RADIUS_MIN = 800;
const RADIUS_MAX = 1600;
const RADIUS_DIVIDER = 10;
const SOL_RADIUS_KM = 696340;
const SHIP_SERVICES = new Set(["Repair", "Refuel", "Restock", "Tuning"]);

export default class SystemMap {
  detail: System;
  name: string;

  stars: MappedSystemBody[];
  planets: MappedSystemBody[];

  stations: Station[];
  outposts: Station[];
  ports: Station[];
  settlements: Station[];
  megaships: Station[];

  items: MappedSystemBody[];

  constructor(system: System) {
    this.detail = system;
    this.name = system.name;

    const bodies = this.prepareBodies(system.bodies ?? []);
    const stations = (system.stations ?? []).filter(
      (s) => !s.name.toLowerCase().startsWith("rescue ship - "),
    );

    this.stars = bodies.filter((b) => b._type === SystemBodyType.Star);
    this.planets = bodies.filter((b) => b._type === SystemBodyType.Planet);

    this.stations = stations.filter((s) => SPACE_STATIONS.includes(s.type));
    this.outposts = stations.filter((s) => PLANETARY_OUTPOSTS.includes(s.type));
    this.ports = stations.filter((s) => SURFACE_PORTS.includes(s.type));
    this.settlements = stations.filter((s) => SETTLEMENTS.includes(s.type));
    this.megaships = stations.filter((s) => MEGASHIPS.includes(s.type));

    // Flat list of all bodies and stations used for lookups and length checks
    this.items = [...bodies, ...(stations as unknown as MappedSystemBody[])];

    // Synthetic node that collects bodies orbiting null barycenters with no star parent
    this.stars.push(this.createNullNode());

    this.stars.forEach((star) => this.buildChildren(star));
    this.assignStationParents(stations);
  }

  // ─── Body preparation ─────────────────────────────────────────────────────

  // Clone raw bodies, fix edge cases, reclassify binary stars, and deduplicate.
  private prepareBodies(rawBodies: RawSystemBody[]): MappedSystemBody[] {
    const bodies: MappedSystemBody[] = structuredClone(rawBodies).map((b) => ({
      ...b,
      body_id: b.body_id ?? 0,
      _type: b.type,
      _label: b.name,
    }));

    const reclassifiedIds = this.reclassifyBinaryStars(bodies);

    if (reclassifiedIds.size > 0) {
      this.updateParentReferences(bodies, reclassifiedIds);
    }

    const deduped = this.deduplicateByBodyId(bodies);
    deduped.forEach((body) => {
      body._label = this.buildLabel(body);
    });
    return deduped;
  }

  // Non-main stars that orbit other stars are treated as planets for mapping
  // purposes. Returns the set of body_ids that were reclassified.
  private reclassifyBinaryStars(bodies: MappedSystemBody[]): Set<number> {
    const reclassified = new Set<number>();
    for (const body of bodies) {
      if (
        body.type === SystemBodyType.Star &&
        !body.is_main_star &&
        this.firstNonNullParentId(body.parents) !== null
      ) {
        body._type = SystemBodyType.Planet;
        body.radius = body.solar_radius ? body.solar_radius * SOL_RADIUS_KM : SOL_RADIUS_KM;
        reclassified.add(body.body_id);
      }
    }
    return reclassified;
  }

  // Update parent references so bodies orbiting a reclassified binary star
  // reference it as a Planet parent instead of a Star parent.
  private updateParentReferences(bodies: MappedSystemBody[], reclassifiedIds: Set<number>): void {
    for (const body of bodies) {
      body.parents = (body.parents ?? []).map((parent) => {
        const [type, id] = Object.entries(parent)[0] as [string, number];
        return type === SystemBodyType.Star && reclassifiedIds.has(id)
          ? { [SystemBodyType.Planet]: id }
          : parent;
      });
    }
  }

  // Deduplicate bodies sharing the same body_id, keeping the most recently discovered.
  private deduplicateByBodyId(bodies: MappedSystemBody[]): MappedSystemBody[] {
    const seen = new Map<number, MappedSystemBody>();
    for (const body of bodies) {
      const existing = seen.get(body.body_id);
      if (
        !existing ||
        (body.discovered_at &&
          existing.discovered_at &&
          Date.parse(body.discovered_at) > Date.parse(existing.discovered_at))
      ) {
        seen.set(body.body_id, body);
      }
    }
    return [...seen.values()];
  }

  // ─── Hierarchy building ───────────────────────────────────────────────────

  // Recursively find and attach direct orbital children to a body, setting
  // their render properties along the way.
  private buildChildren(body: MappedSystemBody): void {
    body._children = this.planets
      .filter((candidate) => this.isDirectChild(candidate, body))
      .sort((a, b) => a.body_id - b.body_id)
      .map((child) => {
        child._orbits_star =
          body._type === SystemBodyType.Star || body._type === SystemBodyType.Null;
        child._r = this.clampRadius(child.radius);
        child._small = child._r <= RADIUS_MIN;
        this.buildChildren(child);
        return child;
      });
  }

  // Returns true if `candidate` is an immediate orbital child of `target`.
  //
  // A body is a direct child when:
  //   - its parents list contains `target` as the matching type
  //   - its first non-null parent equals `target.body_id` (i.e. `target` is the
  //     closest non-barycenter ancestor, not just a transitive star ancestor)
  //
  // For the Null node, we collect orphaned bodies whose entire parent chain
  // consists only of null barycenters (no star or planet parent at all).
  private isDirectChild(candidate: MappedSystemBody, target: MappedSystemBody): boolean {
    if (!candidate.parents?.length) return false;

    const firstNonNull = this.firstNonNullParentId(candidate.parents);
    const [primaryType] = Object.entries(candidate.parents[0])[0];

    switch (target._type) {
      case SystemBodyType.Star:
        return (
          candidate.parents.some((p) => p[SystemBodyType.Star] === target.body_id) &&
          firstNonNull === target.body_id
        );

      case SystemBodyType.Planet:
        return (
          candidate.parents.some((p) => p[SystemBodyType.Planet] === target.body_id) &&
          firstNonNull === target.body_id
        );

      case SystemBodyType.Null:
        return primaryType === SystemBodyType.Null && firstNonNull === null;
    }

    return false;
  }

  // ─── Station processing ───────────────────────────────────────────────────

  // Infer orbital parents for stations (which have none in the API response)
  // and compute their service lists.
  private assignStationParents(stations: Station[]): void {
    const actualStars = this.stars.filter((s) => s._type === SystemBodyType.Star);

    for (const raw of stations) {
      const station = raw as unknown as MappedStation;
      if (!station.body) continue;

      const nearestPlanet = this.nearestByDistance(this.planets, station.distance_to_arrival ?? 0);
      const nearestStar = this.nearestByDistance(actualStars, station.distance_to_arrival ?? 0);

      station.parents = this.inferStationParents(nearestPlanet, nearestStar);
      this.buildStationServices(station);

      // Attach planetary bases to their parent body for display in the body popover
      if (PLANETARY_BASES.includes(station.type) && station.body?.id) {
        const parentBody = this.items.find((item) => item.name === station.body?.name);
        if (parentBody) {
          parentBody._planetary_bases ??= [];
          parentBody._planetary_bases.push(station);
        }
      }
    }
  }

  private inferStationParents(
    nearestPlanet: MappedSystemBody | null,
    nearestStar: MappedSystemBody | null,
  ): SystemBodyParent[] {
    if (!nearestPlanet) {
      return nearestStar
        ? [{ [SystemBodyType.Star]: nearestStar.body_id }]
        : [{ [SystemBodyType.Null]: 0 }];
    }

    const [parentType] = Object.entries(nearestPlanet.parents?.[0] ?? {})[0] ?? [
      SystemBodyType.Null,
    ];
    const isOrbitingStar =
      parentType === SystemBodyType.Star || parentType === SystemBodyType.Null;

    const parentBodyId = isOrbitingStar
      ? nearestPlanet.body_id
      : (nearestPlanet.parents?.[0]?.[SystemBodyType.Planet] ?? null);

    if (parentBodyId !== null) {
      return [{ [SystemBodyType.Planet]: parentBodyId }];
    }

    return nearestStar
      ? [{ [SystemBodyType.Star]: nearestStar.body_id }]
      : [{ [SystemBodyType.Null]: 0 }];
  }

  private buildStationServices(station: MappedStation): void {
    const shipServices: string[] = [];
    const otherServices: string[] = [];

    if (station.has_shipyard) otherServices.push("Shipyard");
    if (station.has_outfitting) otherServices.push("Outfitting");
    if (station.has_market) otherServices.push("Market");

    for (const service of station.other_services ?? []) {
      if (SHIP_SERVICES.has(service)) {
        shipServices.push(service);
      } else if (!otherServices.includes(service)) {
        otherServices.push(service);
      }
    }

    station._ship_services = shipServices.sort();
    station._other_services = otherServices.sort();
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  // Clamp a body's physical radius (km) into the display radius range.
  private clampRadius(radius?: number | null): number {
    if (!radius) return RADIUS_MIN;
    return Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, radius / RADIUS_DIVIDER));
  }

  // Build the short display label for a body by stripping the system name prefix.
  private buildLabel(body: MappedSystemBody): string {
    if (body._type === SystemBodyType.Planet) {
      return body.name
        .replace(/Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+) /i, "")
        .replace(new RegExp(`^${escapeRegExp(this.name)} `, "i"), "")
        .trim();
    }

    if (body._type === SystemBodyType.Star) {
      const isRenamedWitchHead =
        /Witch Head Sector/i.test(body.name) && !/^Witch Head Sector/i.test(body.name);
      return isRenamedWitchHead
        ? body.name.replace(/ Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+)/i, "").trim()
        : body.name;
    }

    return body.name;
  }

  // Returns the body_id of the first non-Null parent, or null if there is none.
  private firstNonNullParentId(parents?: SystemBodyParent[] | null): number | null {
    for (const parent of parents ?? []) {
      const [type, id] = Object.entries(parent)[0] as [string, number];
      if (type !== SystemBodyType.Null) return id;
    }
    return null;
  }

  // Find the element in `items` whose distance_to_arrival is closest to `dta`.
  private nearestByDistance<T extends { distance_to_arrival: number }>(
    items: T[],
    dta: number,
  ): T | null {
    if (!dta || items.length === 0) return null;
    if (items.length === 1) return items[0];
    return items.reduce((nearest, item) =>
      Math.abs(dta - item.distance_to_arrival) < Math.abs(dta - nearest.distance_to_arrival)
        ? item
        : nearest,
    );
  }

  private createNullNode(): MappedSystemBody {
    return {
      body_id: 0,
      distance_to_arrival: -1,
      name: "Additional Objects",
      type: SystemBodyType.Null,
      _type: SystemBodyType.Null,
      _label: "Additional Objects",
      _description: "Objects not directly orbiting a star",
      _r: 0,
      _small: false,
      _orbits_star: false,
      _children: [],
      slug: "",
    };
  }
}
