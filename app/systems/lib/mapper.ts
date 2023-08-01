import {
  System,
  SystemCelestial,
  MappedSystemCelestial
} from '../../lib/interfaces/System';

import {
  SOL_RADIUS_IN_KM
} from '../../lib/consts';
import { escapeRegExp } from '../../lib/util';

export default class SystemMap
{
  detail: System;
  name: string;
  stars: MappedSystemCelestial[];
  planets: MappedSystemCelestial[];
  objectsInSystem: MappedSystemCelestial[];

  constructor (system: System) {
    this.detail = system;
    
    let { name = '', bodies: _bodies } = this.detail;

    this.name = this.getSystemObjectName(name);

    // For this to work we need to to treat "Stars" that are more like Planets
    // (e.g. Class Y Brown Dawrf Stars or Class T Tauri Stars) that orbit other
    // stars as if they were regular planets.
    //
    // Let's use our own classification system (stored in ._type) to preserve the
    // base SystemCelestial's type.
    let bodies = this.#findStarsOrbitingOtherStarsLikePlanets(_bodies || []);
    
    // Squash duplicate entries to prevent two celestials with the different names
    // and the same body id from appearing in the map.
    bodies = this.#getUniqueObjectsByProperty(bodies, 'body_id');

    this.stars = bodies.filter((body: MappedSystemCelestial) => body._type === 'Star');
    this.planets = bodies.filter((body: MappedSystemCelestial) => body._type === 'Planet');
    this.objectsInSystem = bodies.sort((a: MappedSystemCelestial, b: MappedSystemCelestial) => (a.body_id - b.body_id));

    // Object to contain celestials that are not directly orbiting a star.
    // There can be multiple "Null" objects around which planets orbit, so
    // let's consolidate them into under Null objet with ID 0.
    this.stars.push({
      body_id: 0,
      name: 'Additional Objects',
      description: 'Objects not directly orbiting a star',
      type: 'Null',
      _type: 'Null',
      _children: []
    });

    this.map();
  }

  #getUniqueObjectsByProperty(arrayOfSystemObjects: MappedSystemCelestial[], key: string) {
    const systemObjectsBy64BitId: Record<string, MappedSystemCelestial> = {};

    // Loop through objects and assign them a timestamp based on date discovered
    //
    // The EDSM API sometimes returns data for multiple planets in a system
    // with the same body id.
    //
    // The purpose of this is to de-dupe duplicate planets from the EDSM data
    // by only using the most recent data for an object.
    arrayOfSystemObjects.forEach((systemObject: MappedSystemCelestial) => {
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
        prunedArrayOfSystemObjects.map((item: MappedSystemCelestial) => [item[key], item])
      ).values()
    ];
  }

  #findStarsOrbitingOtherStarsLikePlanets (_bodies: SystemCelestial[]) {
    const bodies = JSON.parse(JSON.stringify(_bodies));

    const starsOrbitingStarsLikePlanets: MappedSystemCelestial[] = [];

    bodies.forEach((body: MappedSystemCelestial, i: number) => {
      // There are cases where the main star in a system has a null id64 value...
      // See https://github.com/EDSM-NET/FrontEnd/issues/506
      if (body.type === 'Star' && body.body_id === null) body.body_id = 0;

      body._type = body.type;

      // Only applies to stars
      if (body.type !== 'Star') return;

      // Never applies to main stars
      if (body.is_main_star === true) return;

      // If star doesn't have any non-null parent objects (i.e. it's not
      // orbiting a planet or a star) then don't re-classify it.
      if (this.#getNearestNotNullParent(body) === null) return;

      // Change each tpe from 'Star' to 'Planet'
      body._type = 'Planet';

      // Add a standard radius property based on its solar radius
      body.radius = body.solar_radius * SOL_RADIUS_IN_KM;

      // Save the id of this body for the loop below
      starsOrbitingStarsLikePlanets.push(body.body_id);
    });

    // Update the 'parent' reference to each object orbiting 'star'
    // from orbiting a 'Star' to a 'Planet' so it's plotted correctly
    bodies.forEach((body: SystemCelestial, i: number) => {
      (body.parents ?? []).forEach((parent: SystemCelestial, i: number) => {
        const [k, v] = Object.entries(parent)[0];
        if (starsOrbitingStarsLikePlanets.includes(v) && body.parents) {
          body.parents[i] = { Planet: v };
        }
      });
    });
    
    return bodies;
  }

  #getNearestNotNullParent(body: SystemCelestial) {
    let nonNullParent = null;
    
    (body.parents || []).every((parent: SystemCelestial) => {
      const [k, v] = Object.entries(parent)[0];
      if (k !== 'Null') {
        nonNullParent = v;
        return false;
      }
      return true;
    });

    return nonNullParent;
  }

  map () {
    for (const systemObject of this.objectsInSystem) {
      if (!systemObject._type) {
        systemObject._type = systemObject.type;
      }
      
      systemObject.name = this.getSystemObjectName(systemObject.name);
      systemObject.label = this.getSystemObjectLabelFromSystemObject(systemObject)
    }

    this.stars.forEach(star => {
      this.plotObjectsAroundStar(star);
    });
  }

  plotObjectsAroundStar (star: MappedSystemCelestial) {
    star._children = this.getChildren(star, true).map((itemInOrbit, i) => {
      itemInOrbit._children = this.getChildren(itemInOrbit, false);

      itemInOrbit._children
        .sort((a: MappedSystemCelestial, b: MappedSystemCelestial) => (a.body_id - b.body_id))
        .map((subItemInOrbit: MappedSystemCelestial) => subItemInOrbit);

      return itemInOrbit;
    });

    return star;
  }

  getChildren (targetBody: MappedSystemCelestial, immediateChildren = true, filter = ['Planet']) {
    const children = [];
    if (! targetBody._type) {
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

            if (key === 'Star') inOrbitAroundStars.push(parent[key]);
            if (key === 'Planet') inOrbitAroundPlanets.push(parent[key]);
            if (key === 'Null') inOrbitAroundNull.push(parent[key]);
          }
        }
      }

      if (!systemObject.parents) {
        continue;
      }

      const nearestNonNullParent = this.#getNearestNotNullParent(systemObject);
      
      if ( primaryOrbitType === 'Null' && nearestNonNullParent === null) {
        primaryOrbit = 0;
      }

      if (targetBody._type === 'Star' && inOrbitAroundStars.includes(targetBody.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === targetBody.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      } else if (targetBody._type === 'Planet' && inOrbitAroundPlanets.includes(targetBody.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === targetBody.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      } else if (targetBody._type === 'Null' && primaryOrbitType === 'Null') {
        if (immediateChildren === true && primaryOrbit === targetBody.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      }
    }
    return children;
  }

  getSystemObjectLabelFromSystemObject (systemObject: MappedSystemCelestial) {
    if (systemObject._type && systemObject._type === 'Planet') {
      return systemObject.name
        // Next line is special case handling for renamed systems in Witch Head
        // Sector, it needs to be ahead of the line that strips the name as
        // some systems in Witch Head have bodies that start with name name of
        // the star as well but some don't (messy!)
        .replace(/Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+) /i, '')
        .replace(new RegExp(`^${escapeRegExp(this.name)} `, 'i'), '')
        .trim()
    } else if (systemObject._type && systemObject._type === 'Star') {
      let systemObjectLabel = systemObject.name || ''
      // If the label contains 'Witch Head Sector' but does not start with it
      // then it is a renamed system and the Witch Head Sector bit is stripped
      if (systemObjectLabel.match(/Witch Head Sector/i) && !systemObjectLabel.match(/^Witch Head Sector/i)) {
       systemObjectLabel = systemObjectLabel.replace(/ Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+)/i, '').trim()
      }
      return systemObjectLabel
    } else {
      return systemObject.name
    }
  }

  getSystemObjectName (systemObjectName: string) {
    return systemObjectName;
  }
}
