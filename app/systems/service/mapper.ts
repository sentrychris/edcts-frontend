import {
  System,
  SystemCelestial,
  MappedSystemCelestial
} from '../../interfaces/System';

const SOLAR_RADIUS = 696340;

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

    this.stars = bodies.filter((body: MappedSystemCelestial) => body?.type === 'Star');
    this.planets = bodies.filter((body: MappedSystemCelestial) => body?.type === 'Planet');
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
      systemObjectWithTimestamp.timestamp = systemObject?.discovered_at;

      // This should never happen
      if (!systemObjectWithTimestamp.hasOwnProperty('id64')) {
        return console.log('#getUniqueObjectsByProperty error - systemObject does not have id64 property', systemObject);
      }

      if (systemObjectsBy64BitId[systemObjectWithTimestamp.id64]) {
        if (Date.parse(systemObjectWithTimestamp.timestamp) > Date.parse(systemObjectsBy64BitId[systemObjectWithTimestamp.id64]?.discovered_at)) {
          systemObjectsBy64BitId[systemObjectWithTimestamp.id64] = systemObjectWithTimestamp;
        }
      } else {
        systemObjectsBy64BitId[systemObjectWithTimestamp.id64] = systemObjectWithTimestamp;
      }
    });

    console.log({ systemObjectsBy64BitId });

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
      body.radius = body.solar_radius * SOLAR_RADIUS;

      starsOrbitingStarsLikePlanets.push(body.body_id);
    });


    bodies.forEach((body: SystemCelestial, i: number) => {
      (body?.parents ?? []).forEach((parent: SystemCelestial, i: number) => {
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
    
    (body?.parents || []).every((parent: SystemCelestial) => {
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
      if (!systemObject.type) systemObject.type = systemObject.type;
      
      systemObject.name = this.getSystemObjectName(systemObject.name);
    }

    let maxViewBoxWidth = 2000;
    this.stars.forEach(star => {
      this.plotObjectsAroundStar(star);
      if (star._viewBox && star._viewBox[2] > maxViewBoxWidth) maxViewBoxWidth = star._viewBox[2];
    });

    this.stars.forEach(star => {
      if (star._viewBox) star._viewBox[2] = maxViewBoxWidth;
    });
  }

  plotObjectsAroundStar (star: MappedSystemCelestial) {
    const MIN_R = 800;
    const MAX_R = 2000;
    const SUB_MIN_R = 800;
    const SUB_MAX_R = 2000;
    const R_DIVIDER = 10;
    const X_SPACING = 600;
    const Y_SPACING = 600;
    const RING_X_SPACING_FACTOR = 0.8;

    star._xMax = 0;
    star._yMax = 0;
    star._xOffset = 0;
    star._yOffset = 0;


    star._children = this.getChildren(star, true).map((itemInOrbit, i) => {

      const MAIN_PLANET_MIN_R = MIN_R;

      itemInOrbit._children = this.getChildren(itemInOrbit, false);

      itemInOrbit._r = itemInOrbit.radius / R_DIVIDER;
      if (itemInOrbit._r < MAIN_PLANET_MIN_R) itemInOrbit._r = MAIN_PLANET_MIN_R;
      if (itemInOrbit._r > MAX_R) itemInOrbit._r = MAX_R;

      if (itemInOrbit._r <= MAIN_PLANET_MIN_R) itemInOrbit._small = true;

      itemInOrbit._y = 0;
      itemInOrbit.orbitsStar = true;

      const itemXSpacing = itemInOrbit.rings ? itemInOrbit._r / RING_X_SPACING_FACTOR : X_SPACING;
      if (star._xMax) itemInOrbit._x = star._xMax + itemXSpacing + itemInOrbit._r;

      const newYmax = itemInOrbit._r + X_SPACING;
      if (star._yOffset && newYmax > star._yOffset) star._yOffset = newYmax;

      let newXmax = (itemInOrbit.rings)
        ? (itemInOrbit._x ? itemInOrbit._x : 0) + itemInOrbit._r + itemXSpacing
        : (itemInOrbit._x ? itemInOrbit._x : 0) + itemInOrbit._r;

      if (itemInOrbit._children.length > 0 && star._xMax) newXmax = star._xMax;
      if (star._xMax && newXmax > star._xMax) star._xMax = newXmax;

      itemInOrbit._yMax = itemInOrbit._r + (Y_SPACING / 2);

      itemInOrbit._children
        .sort((a: MappedSystemCelestial, b: MappedSystemCelestial) => (a.body_id - b.body_id))
        .map((subItemInOrbit: MappedSystemCelestial) => {
          subItemInOrbit._r = subItemInOrbit.radius / R_DIVIDER;
          if (subItemInOrbit._r < SUB_MIN_R) subItemInOrbit._r = SUB_MIN_R;
          if (subItemInOrbit._r > SUB_MAX_R) subItemInOrbit._r = SUB_MAX_R;

          if (subItemInOrbit._r <= SUB_MIN_R) subItemInOrbit._small = true;

          subItemInOrbit._x = itemInOrbit._x;
          subItemInOrbit._y = (itemInOrbit._yMax ? itemInOrbit._yMax : 0) + subItemInOrbit._r + Y_SPACING;
          itemInOrbit._yMax = subItemInOrbit._y ? subItemInOrbit._y + subItemInOrbit._r : undefined;
          subItemInOrbit.orbitsStar = false;

          return subItemInOrbit;
        });

      if (star._yMax && itemInOrbit._yMax > star._yMax) star._yMax = itemInOrbit._yMax;
      return itemInOrbit;
    });

    star.numberOfPlanets = star._children.filter((x: MappedSystemCelestial) => x.type === 'Planet').length;
    star._children.forEach((child: MappedSystemCelestial) => {
     if (star.numberOfPlanets) star.numberOfPlanets += child._children.filter((x: MappedSystemCelestial) => x.type === 'Planet').length;
    });

    star._xMax += X_SPACING;
    star._yMax += Y_SPACING;

    star._maxObjectsInOrbit = 0;
    star._children.forEach((objectInOrbit: MappedSystemCelestial) => {
      if (star._maxObjectsInOrbit && objectInOrbit._children.length > star._maxObjectsInOrbit) { star._maxObjectsInOrbit = objectInOrbit._children.length; }
    });

    star._viewBox = [
      0,
      parseInt(`-${star._yOffset}`),
      star._xMax + star._xOffset + 1500,
      star._yMax + star._yOffset
    ];
    return star;
  }

  getBodyById (body_id: number) {
    return this?.objectsInSystem?.filter(body => body.body_id === body_id);
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
        return Math.abs(targetDistanceToArrival - ob2?.distance_to_arrival ?? 0) < Math.abs(targetDistanceToArrival - ob1?.distance_to_arrival ?? 0)
          ? ob2
          : ob1;
      });
  }

  getChildren (targetBody: MappedSystemCelestial, immediateChildren = true, filter = ['Planet']) {
    const children = [];
    if (!targetBody?.type) return [];

    for (const systemObject of this.objectsInSystem) {
      if (filter?.length && !filter.includes(systemObject?.type)) continue;

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

      if (!systemObject.parents) continue;

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
      } else if (immediateChildren === false) {
        // TODO do nothing
      }
    }
    return children;
  }

  getSystemObjectName (systemObjectName: string) {
    return systemObjectName;
  }
}
