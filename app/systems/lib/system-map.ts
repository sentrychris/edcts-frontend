import { System } from '../../lib/interfaces/System';
import {
  CelestialBody,
  MappedCelestialBody,
  CelestialBodyParent,
} from '../../lib/interfaces/Celestial';
import {
  MEGASHIPS,
  SPACE_STATIONS,
  SURFACE_PORTS,
  PLANETARY_OUTPOSTS,
  PLANETARY_BASES,
  SETTLEMENTS,
  SOL_RADIUS_IN_KM,
  CelestialBodyType,
} from '../../lib/constants/celestial';
import {
  MIN_RADIUS,
  MAX_RADIUS,
  SUB_MIN_RADIUS,
  SUB_MAX_RADIUS,
  RADIUS_DIVIDER,
} from '../../lib/constants/math';

import { escapeRegExp } from '../../lib/util';
import { Station, MappedStation } from '../../lib/interfaces/Station';

type MapKeyType = keyof MappedCelestialBody;

export default class SystemMap
{
  detail: System;
  name: string;

  stars: MappedCelestialBody[];
  planets: MappedCelestialBody[];

  spaceStations: Station[];
  planetaryOutposts: Station[];
  planetaryPorts: Station[];
  settlements: Station[];
  megaships: Station[];

  objectsInSystem: MappedCelestialBody[];

  constructor(system: System) {
    this.detail = system;
    
    let { name = '', bodies: _bodies, stations = [] } = this.detail;

    this.name = this.getNameFromSystemObject(name);

    // For this to work we need to to treat "Stars" that are more like Planets
    // (e.g. Class Y Brown Dawrf Stars or Class T Tauri Stars) that orbit other
    // stars as if they were regular planets.
    //
    // Let's use our own classification system (stored in ._type) to preserve the
    // base SystemCelestialBody's type.
    let bodies = this.#findStarsOrbitingOtherStarsLikePlanets(_bodies || []);
    
    // Squash duplicate entries to prevent two bodies with the different names
    // and the same body id from appearing in the map.
    bodies = this.#getUniqueObjectsByProperty(bodies, 'body_id');

    stations = stations.filter((c: Station) => !c.name.toLowerCase().startsWith('rescue ship - '));

    this.stars = bodies.filter((c: MappedCelestialBody) => c._type === CelestialBodyType.Star);
    this.planets = bodies.filter((c: MappedCelestialBody) => c._type === CelestialBodyType.Planet);

    this.spaceStations = stations.filter((s: Station) => SPACE_STATIONS.includes(s.type));
    this.planetaryOutposts = stations.filter((s: Station) => PLANETARY_OUTPOSTS.includes(s.type));
    this.planetaryPorts = stations.filter((s: Station) => SURFACE_PORTS.includes(s.type));
    this.settlements = stations.filter((s: Station) => SETTLEMENTS.includes(s.type));
    this.megaships = stations.filter((s: Station) => MEGASHIPS.includes(s.type));
    
    this.objectsInSystem = bodies.concat(stations).sort((a: MappedCelestialBody, b: MappedCelestialBody) => (a.body_id - b.body_id));

    // Object to contain bodies that are not directly orbiting a star.
    // There can be multiple "Null" objects around which planets orbit, so
    // let's consolidate them into under Null objet with ID 0.
    this.stars.push({
      body_id: 0,
      distance_to_arrival: -1,
      name: 'Additional Objects',
      type: CelestialBodyType.Null,
      _type: CelestialBodyType.Null,
      _label: 'Additional Objects',
      _description: 'Objects not directly orbiting a star',
      _r: 0,
      _small: false,
      _orbits_star: false,
      _children: [],
    });

    this.map();
  }

  map() {
    for (const systemObject of this.objectsInSystem) {
      if (!systemObject._type) {
        systemObject._type = systemObject.type;
      }
      
      systemObject.name = this.getNameFromSystemObject(systemObject.name);
      systemObject._label = this.getLabelFromSystemObject(systemObject);

      const isStation = SPACE_STATIONS.concat(PLANETARY_BASES)
        .concat(MEGASHIPS)
        .includes(systemObject.type);

      // Begin mapping stations
      if (!systemObject.parents && systemObject.type && isStation) {
        // TODO Station overlap for the MappedCelestialBody interface
        const stationObject = (<unknown>systemObject as MappedStation);

        const nearestStar = this.#getNearestStar(stationObject);
        const nearestPlanet = this.#getNearestPlanet(stationObject);
        const nearestPlanetParentType = nearestPlanet?.parents?.[0]
          ? Object.keys(nearestPlanet.parents[0])[0]
          : CelestialBodyType.Null;

        // If the parent of the planet is a star (or null) then set it as the main
        // body this station orbits, unless the nearest planet is orbiting another
        // larger planet, in which assign that instead
        const parentBodyId = (nearestPlanetParentType === CelestialBodyType.Star
          || nearestPlanetParentType === CelestialBodyType.Null
        )
          ? (nearestPlanet as CelestialBody).body_id
          : nearestPlanet?.parents?.[0]?.['Planet'] ?? null;
        
        // If the object doesn't have a nearby planet, then assume it's orbiting a star,
        // For example, Asterope, which has 3 stars, 0 planets, 1 Megaship and a Coriolis.
        stationObject.parents = parentBodyId === null ? nearestStar
          ? [{ [CelestialBodyType.Star]: nearestStar.body_id }]
          : [{ [CelestialBodyType.Null]: 0 }]
          : [{ [CelestialBodyType.Planet]: parentBodyId }];

        const shipServices = [];
        const otherServices = [];

        if (stationObject.has_shipyard) otherServices.push('Shipyard');
        if (stationObject.has_outfitting) otherServices.push('Outfitting');
        if (stationObject.has_market) otherServices.push('Market');

        if (stationObject.other_services) {
          if (stationObject.other_services.includes('Repair')) shipServices.push('Repair');
          if (stationObject.other_services.includes('Refuel')) shipServices.push('Refuel');
          if (stationObject.other_services.includes('Restock')) shipServices.push('Restock');
          if (stationObject.other_services.includes('Tuning')) shipServices.push('Tuning');
          
          for (const service of stationObject.other_services) {
            if (!shipServices.includes(service)) {
              otherServices.push(service);
            }
          }
        }

        stationObject._ship_services = shipServices.sort();
        stationObject._other_services = otherServices.sort();

        // If the object is a planetary port, outpost or settlement then add it to its parent
        if (PLANETARY_BASES.includes(stationObject.type) && stationObject.body?.id) {
          for (const parent of this.objectsInSystem) {
            if (parent.name === stationObject.body.name) {
              if (!parent._planetary_bases) {
                parent._planetary_bases = [];
              }

              parent._planetary_bases.push(stationObject);
            }
          }
        }
      }
    }

    this.stars.forEach(star => {
      this.#mapBodies(star);
    });
  }

  getNameFromSystemObject(systemObjectName: string) {
    return systemObjectName;
  }
  
  getLabelFromSystemObject(systemObject: MappedCelestialBody | MappedStation) {
    if (systemObject._type && systemObject._type === CelestialBodyType.Planet) {
      return systemObject.name
        // Next line is special case handling for renamed systems in Witch Head
        // Sector, it needs to be ahead of the line that strips the name as
        // some systems in Witch Head have bodies that start with name name of
        // the star as well but some don't (messy!)
        .replace(/Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+) /i, '')
        .replace(new RegExp(`^${escapeRegExp(this.name)} `, 'i'), '')
        .trim();
    } else if (systemObject._type && systemObject._type === CelestialBodyType.Star) {
      let systemObjectLabel = systemObject.name || '';
      // If the label contains 'Witch Head Sector' but does not start with it
      // then it is a renamed system and the Witch Head Sector bit is stripped
      if (systemObjectLabel.match(/Witch Head Sector/i) && !systemObjectLabel.match(/^Witch Head Sector/i)) {
       systemObjectLabel = systemObjectLabel.replace(/ Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+)/i, '').trim();
      }
      return systemObjectLabel;
    } else {
      return systemObject.name;
    }
  }

  #mapBodies(star: MappedCelestialBody) {
    // Get each objects directly orbiting star
    star._children = this.#getOrbitingBodies(star, true).map((itemInOrbit, i) => {
      const MAIN_PLANET_MIN_R = MIN_RADIUS;

      // Get each objects directly orbiting this object
      itemInOrbit._children = this.#getOrbitingBodies(itemInOrbit, false);

      itemInOrbit._r = itemInOrbit.radius
        ? itemInOrbit.radius / RADIUS_DIVIDER
        : MIN_RADIUS;
      
      if (itemInOrbit._r < MAIN_PLANET_MIN_R) {
        itemInOrbit._r = MAIN_PLANET_MIN_R;
      }

      if (itemInOrbit._r > MAX_RADIUS) {
        itemInOrbit._r = MAX_RADIUS;
      }

      if (itemInOrbit._r <= MAIN_PLANET_MIN_R) {
        itemInOrbit._small = true;
      }

      itemInOrbit._orbits_star = true;

      // Get every object that directly or indirectly orbits this object
      itemInOrbit._children
        .sort((a: MappedCelestialBody, b: MappedCelestialBody) => (a.body_id - b.body_id))
        .map((subItemInOrbit: MappedCelestialBody) => {
          subItemInOrbit._r = subItemInOrbit.radius
            ? subItemInOrbit.radius / RADIUS_DIVIDER
            : MIN_RADIUS;

          if (subItemInOrbit._r < SUB_MIN_RADIUS) {
            subItemInOrbit._r = SUB_MIN_RADIUS;
          }

          if (subItemInOrbit._r > SUB_MAX_RADIUS) {
            subItemInOrbit._r = SUB_MAX_RADIUS;
          }

          // Set attribute on smaller planets so we can select a different setting
          // on front end that will render them better
          if (subItemInOrbit._r <= SUB_MIN_RADIUS) subItemInOrbit._small = true;

          subItemInOrbit._orbits_star = false;

          return subItemInOrbit;
        });

      return itemInOrbit;
    });

    return star;
  }

  #getNearestStar(stationObject: MappedStation) {
    const doa = stationObject.distance_to_arrival;
    const stars = this.objectsInSystem.filter(body => body._type === 'Star');
    if (!doa || stars.length === 0) {
      return null;
    }

    if (stars.length === 1) {
      return stars[0];
    }

    return stars.reduce((a, b) => {
      return Math.abs(doa - b?.distance_to_arrival ?? 0) < Math.abs(doa - a?.distance_to_arrival ?? 0)
        ? b
        : a;
    });
  }

  #getNearestPlanet(stationObject: MappedStation) {
    const doa = stationObject.distance_to_arrival;
    const planets = this.objectsInSystem.filter(body => body._type === 'Planet');

    if (!doa || planets.length === 0) {
      return null;
    }

    return planets.reduce((a, b) => {
      return Math.abs(doa - b.distance_to_arrival) < Math.abs(doa - a.distance_to_arrival)
        ? b
        : a;
    });
  }

  #getNearestNotNullParent(body: MappedCelestialBody) {
    let nonNullParent = null;

    (body.parents || []).every((parent: CelestialBodyParent) => {
      const [k, v] = Object.entries(parent)[0];
      if (k !== CelestialBodyType.Null) {
        nonNullParent = v;
        return false;
      }
      return true;
    });

    return nonNullParent;
  }

  #getOrbitingBodies(target: MappedCelestialBody, immediateChildren = true, filter = [CelestialBodyType.Planet]) {
    const children = [];
    if (! target._type) {
      return [];
    }

    for (const systemObject of this.objectsInSystem) {
      const type = <CelestialBodyType>systemObject._type;
      if (filter.length && !filter.includes(type)) {
        continue;
      }

      const inOrbitAroundStars = [];
      const inOrbitAroundPlanets = [];
      const inOrbitAroundNull = [];
      let primaryOrbit = null;
      let primaryOrbitType = null;

      if (systemObject.parents) {
        for (const parent of systemObject.parents) {
          for (const key of Object.keys(parent)) {
            if (primaryOrbit === null) primaryOrbit = parent[<CelestialBodyType>key];
            if (primaryOrbitType === null) primaryOrbitType = key;

            if (key === CelestialBodyType.Star) inOrbitAroundStars.push(parent[key]);
            if (key === CelestialBodyType.Planet) inOrbitAroundPlanets.push(parent[key]);
            if (key === CelestialBodyType.Null) inOrbitAroundNull.push(parent[key]);
          }
        }
      }

      if (!systemObject.parents) {
        continue;
      }

      const nearestNonNullParent = this.#getNearestNotNullParent(systemObject);
      
      // Some systems have multiple Null points around which bodies orbit.
      // Normalize these all into one Null orbit with body ID 0.
      // This only applies to bodies that are not also orbiting another body.
      if (primaryOrbitType === CelestialBodyType.Null && nearestNonNullParent === null) {
        primaryOrbit = 0;
      }

      if (target._type === CelestialBodyType.Star && inOrbitAroundStars.includes(target.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === target.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      } else if (target._type === CelestialBodyType.Planet && inOrbitAroundPlanets.includes(target.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === target.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      } else if (target._type === CelestialBodyType.Null && primaryOrbitType === CelestialBodyType.Null) {
        if (immediateChildren === true && primaryOrbit === target.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      }
    }
    return children;
  }

  #findStarsOrbitingOtherStarsLikePlanets (_bodies: CelestialBody[]) {
    const bodies = JSON.parse(JSON.stringify(_bodies));
    const starsOrbitingStarsLikePlanets: number[] = [];

    bodies.forEach((body: MappedCelestialBody, i: number) => {
      // There are cases where the main star in a system has a null id64 value...
      // See https://github.com/EDSM-NET/FrontEnd/issues/506
      if (body.type === CelestialBodyType.Star && body.body_id === null) body.body_id = 0;

      body._type = body.type;

      // Only applies to stars
      if (body.type !== CelestialBodyType.Star) {
        return;
      }

      // Never applies to main stars
      if (body.is_main_star && body.is_main_star === 1) {
        return;
      }

      // If star doesn't have any non-null parent objects (i.e. it's not
      // orbiting a planet or a star) then don't re-classify it.
      if (this.#getNearestNotNullParent(body) === null) {
        return;
      }

      // Change each tpe from CelestialBodyType.Star to CelestialBodyType.Planet
      body._type = CelestialBodyType.Planet;

      // Add a standard radius property based on its solar radius
      body.radius = body.solar_radius ? body.solar_radius * SOL_RADIUS_IN_KM : SOL_RADIUS_IN_KM;

      // Save the id of this body for the loop below
      starsOrbitingStarsLikePlanets.push(body.body_id);
    });

    // Update the 'parent' reference to each object orbiting CelestialBodyType.Star
    // from orbiting a CelestialBodyType.Star to a CelestialBodyType.Planet so it's plotted correctly
    bodies.forEach((body: CelestialBody, i: number) => {
      (body.parents ?? []).forEach((parent: CelestialBodyParent, i: number) => {
        const [k, v] = Object.entries(parent)[0];
        if (starsOrbitingStarsLikePlanets.includes(v) && body.parents) {
          body.parents[i] = { Planet: v };
        }
      });
    });
    
    return bodies;
  }

  #getUniqueObjectsByProperty(arrayOfSystemObjects: MappedCelestialBody[], key: MapKeyType) {
    const systemObjectsBy64BitId: Record<string, MappedCelestialBody> = {};

    // Loop through objects and assign them a timestamp based on date discovered
    //
    // The EDSM API sometimes returns data for multiple planets in a system
    // with the same body id.
    //
    // The purpose of this is to de-dupe duplicate planets from the EDSM data
    // by only using the most recent data for an object.
    arrayOfSystemObjects.forEach((systemObject: MappedCelestialBody) => {
      const systemObjectWithTimestamp = JSON.parse(JSON.stringify(systemObject));
      systemObjectWithTimestamp._timestamp = systemObject.discovered_at;

      // This should never happen
      // TODO: It happened... see https://github.com/EDSM-NET/FrontEnd/issues/506
      if (!systemObjectWithTimestamp.hasOwnProperty('id64')) {
        return console.error('#getUniqueObjectsByProperty error - systemObject does not have id64 property', systemObject);
      }

      if (systemObjectsBy64BitId[systemObjectWithTimestamp.id64]) {
        // If this item is newer, replace it with the one we already have
        const systemObjectDiscoveredAt = systemObjectsBy64BitId[systemObjectWithTimestamp.id64].discovered_at;
        if (systemObjectDiscoveredAt && Date.parse(systemObjectWithTimestamp._timestamp) > Date.parse(systemObjectDiscoveredAt)) {
          systemObjectsBy64BitId[systemObjectWithTimestamp.id64] = systemObjectWithTimestamp;
        }
      } else {
        systemObjectsBy64BitId[systemObjectWithTimestamp.id64] = systemObjectWithTimestamp;
      }
    });

    const prunedArrayOfSystemObjects = [
      ...Object.keys(systemObjectsBy64BitId).map((id64: string) => systemObjectsBy64BitId[id64])
    ];

    return [
      ...new Map(
        prunedArrayOfSystemObjects.map((item: MappedCelestialBody) => [item[key], item])
      ).values()
    ];
  }
}
