import {
  System,
  SystemCelestial,
  MappedSystemCelestial
} from '../../lib/interfaces/System';

import {
  SOL_RADIUS_IN_KM
} from '../../lib/consts';

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

    let bodies = this.#findStarsOrbitingOtherStarsLikePlanets(_bodies || []);
    bodies = this.#getUniqueObjectsByProperty(bodies, 'body_id');

    this.stars = bodies.filter((body: MappedSystemCelestial) => body.type === 'Star');
    this.planets = bodies.filter((body: MappedSystemCelestial) => body.type === 'Planet');
    this.objectsInSystem = bodies.sort((a: MappedSystemCelestial, b: MappedSystemCelestial) => (a.body_id - b.body_id));

    this.stars.push({
      body_id: 0,
      name: 'Additional Objects',
      description: 'Objects not directly orbiting a star',
      type: 'Null',
      _type: 'Null',
      _children: []
    });

    this.init();
  }

  #getUniqueObjectsByProperty(arrayOfSystemObjects: MappedSystemCelestial[], key: string) {
    const systemObjectsBy64BitId: Record<string, MappedSystemCelestial> = {};

    arrayOfSystemObjects.forEach((systemObject: MappedSystemCelestial) => {
      const systemObjectWithTimestamp = JSON.parse(JSON.stringify(systemObject));
      systemObjectWithTimestamp.timestamp = systemObject.discovered_at;

      // This should never happen
      if (!systemObjectWithTimestamp.hasOwnProperty('id64')) {
        return console.log('#getUniqueObjectsByProperty error - systemObject does not have id64 property', systemObject);
      }

      if (systemObjectsBy64BitId[systemObjectWithTimestamp.id64]) {
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

    bodies.forEach((body: SystemCelestial, i: number) => {
      if (body.type === 'Star' && body.body_id === null) body.body_id = 0;

      body.type = body.type;

      if (body.type !== 'Star') return;
      if (body.is_main_star === true) return;
      if (this.#getNearestNotNullParent(body) === null) return;

      body.type = 'Planet';
      body.radius = body.solar_radius * SOL_RADIUS_IN_KM;

      starsOrbitingStarsLikePlanets.push(body.body_id);
    });


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

  init () {
    for (const systemObject of this.objectsInSystem) {
      if (!systemObject.type) {
        systemObject.type = systemObject.type;
      }
      
      systemObject.name = this.getSystemObjectName(systemObject.name);
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

  getBodyById (body_id: number) {
    return this.objectsInSystem.filter(body => body.body_id === body_id);
  }

  getNearestPlanet (systemObject: SystemCelestial) {
    const targetDistanceToArrival = systemObject.distance_to_arrival;
    const planets = this.objectsInSystem.filter(body => body.type === 'Planet');
    if (planets.length === 0) return null;
    return planets.reduce((ob1, ob2) => {
        return Math.abs(targetDistanceToArrival - ob2.distance_to_arrival) < Math.abs(targetDistanceToArrival - ob1.distance_to_arrival)
          ? ob2
          : ob1;
      });
  }

  getNearestLandablePlanet (systemObject: SystemCelestial) {
    const targetDistanceToArrival = systemObject.distance_to_arrival;
    const landablePlanets = this.objectsInSystem.filter(body => body.type === 'Planet' && body.is_landable);
    if (landablePlanets.length === 0) return null;
    return landablePlanets.reduce((ob1, ob2) => {
        return Math.abs(targetDistanceToArrival - ob2.distance_to_arrival) < Math.abs(targetDistanceToArrival - ob1.distance_to_arrival)
          ? ob2
          : ob1;
      });
  }

  getNearestStar(systemObject: SystemCelestial) {
    const targetDistanceToArrival = systemObject.distance_to_arrival;
    const stars = this.objectsInSystem.filter(body => body.type === 'Star');
    if (stars.length === 0) return null;
    if (stars.length === 1) return stars[0];
    return stars.reduce((ob1, ob2) => {
        return Math.abs(targetDistanceToArrival - ob2.distance_to_arrival ?? 0) < Math.abs(targetDistanceToArrival - ob1.distance_to_arrival ?? 0)
          ? ob2
          : ob1;
      });
  }

  getChildren (targetBody: MappedSystemCelestial, immediateChildren = true, filter = ['Planet']) {
    const children = [];
    if (! targetBody.type) {
      return [];
    }

    for (const systemObject of this.objectsInSystem) {
      if (filter.length && !filter.includes(systemObject.type)) {
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

      if (targetBody.type === 'Star' && inOrbitAroundStars.includes(targetBody.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === targetBody.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      } else if (targetBody.type === 'Planet' && inOrbitAroundPlanets.includes(targetBody.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === targetBody.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      } else if (targetBody.type === 'Null' && primaryOrbitType === 'Null') {
        if (immediateChildren === true && primaryOrbit === targetBody.body_id) {
          children.push(systemObject);
        } else if (immediateChildren === false) {
          children.push(systemObject);
        }
      }
    }
    return children;
  }

  getSystemObjectName (systemObjectName: string) {
    return systemObjectName;
  }
}
