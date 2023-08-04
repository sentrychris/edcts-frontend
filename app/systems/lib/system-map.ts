import { System } from '../../lib/interfaces/System';
import {
  CelestialBody,
  MappedCelestialBody,
  CelestialBodyParent,
} from '../../lib/interfaces/Celestial';

import {
  SOL_RADIUS_IN_KM,
  CelestialBodyType,
} from '../../lib/constants/celestial';

import { escapeRegExp } from '../../lib/util';

export default class SystemMap
{
  detail: System;
  name: string;
  stars: MappedCelestialBody[];
  objectsInSystem: MappedCelestialBody[];

  constructor(system: System) {
    this.detail = system;
    
    let { name = '', bodies: _bodies } = this.detail;

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

    this.stars = bodies.filter((c: MappedCelestialBody) => c._type === CelestialBodyType.Star);
    this.objectsInSystem = bodies.sort((a: MappedCelestialBody, b: MappedCelestialBody) => (a.body_id - b.body_id));

    // Object to contain bodies that are not directly orbiting a star.
    // There can be multiple "Null" objects around which planets orbit, so
    // let's consolidate them into under Null objet with ID 0.
    this.stars.push({
      body_id: 0,
      name: 'Additional Objects',
      description: 'Objects not directly orbiting a star',
      type: CelestialBodyType.Null,
      _type: CelestialBodyType.Null,
      _children: []
    });

    this.map();
  }

  map() {
    for (const systemObject of this.objectsInSystem) {
      if (!systemObject._type) {
        systemObject._type = systemObject.type;
      }
      
      systemObject.name = this.getNameFromSystemObject(systemObject.name);
      systemObject.label = this.getLabelFromSystemObject(systemObject);
    }

    this.stars.forEach(star => {
      this.mapBodies(star);
    });
  }

  mapBodies(star: MappedCelestialBody) {
    // Get each objects directly orbiting star
    star._children = this.getChildren(star, true).map((itemInOrbit, i) => {
      // Get each objects directly orbiting this object
      itemInOrbit._children = this.getChildren(itemInOrbit, false);

      // Get every object that directly or indirectly orbits this object
      itemInOrbit._children
        .sort((a: MappedCelestialBody, b: MappedCelestialBody) => (a.body_id - b.body_id))
        .map((subItemInOrbit: MappedCelestialBody) => subItemInOrbit);

      return itemInOrbit;
    });

    return star;
  }

  getChildren(target: MappedCelestialBody, immediateChildren = true, filter = [CelestialBodyType.Planet]) {
    const children = [];
    if (! target._type) {
      return [];
    }

    for (const systemObject of this.objectsInSystem) {
      if (filter.length && !filter.includes(systemObject._type)) {
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
            if (primaryOrbit === null) primaryOrbit = parent[key];
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

  getLabelFromSystemObject(systemObject: MappedCelestialBody) {
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

  getNameFromSystemObject(systemObjectName: string) {
    return systemObjectName;
  }

  #getUniqueObjectsByProperty(arrayOfSystemObjects: MappedCelestialBody[], key: string) {
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
      systemObjectWithTimestamp.timestamp = systemObject.discovered_at;

      // This should never happen
      // TODO: It happened... see https://github.com/EDSM-NET/FrontEnd/issues/506
      if (!systemObjectWithTimestamp.hasOwnProperty('id64')) {
        return console.log('#getUniqueObjectsByProperty error - systemObject does not have id64 property', systemObject);
      }

      if (systemObjectsBy64BitId[systemObjectWithTimestamp.id64]) {
        // If this item is newer, replace it with the one we already have
        if (Date.parse(systemObjectWithTimestamp.timestamp) > Date.parse(systemObjectsBy64BitId[systemObjectWithTimestamp.id64].discovered_at)) {
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

  #findStarsOrbitingOtherStarsLikePlanets (_bodies: CelestialBody[]) {
    const bodies = JSON.parse(JSON.stringify(_bodies));
    const starsOrbitingStarsLikePlanets: number[] = [];

    bodies.forEach((body: MappedCelestialBody, i: number) => {
      // There are cases where the main star in a system has a null id64 value...
      // See https://github.com/EDSM-NET/FrontEnd/issues/506
      if (body.type === CelestialBodyType.Star && body.body_id === null) body.body_id = 0;

      body._type = body.type;

      // Only applies to stars
      if (body.type !== CelestialBodyType.Star) return;

      // Never applies to main stars
      if (body.is_main_star === true) return;

      // If star doesn't have any non-null parent objects (i.e. it's not
      // orbiting a planet or a star) then don't re-classify it.
      if (this.#getNearestNotNullParent(body) === null) return;

      // Change each tpe from CelestialBodyType.Star to CelestialBodyType.Planet
      body._type = CelestialBodyType.Planet;

      // Add a standard radius property based on its solar radius
      body.radius = body.solar_radius * SOL_RADIUS_IN_KM;

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
}
