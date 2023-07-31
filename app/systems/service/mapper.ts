import { SystemCelestial } from '@/app/interfaces/System';

const USE_ICONS_FOR_PLANETS = false
const SHOW_LABELS = true
const NORMALIZE_VIEWBOX_WIDTH = true
const MIN_VIEWBOX_WIDTH = 20000

const SOLAR_RADIUS = 696340 // Size of Sol in km

function escapeRegExp (text: string) {
  return text.replace(/[[\]{}()*+?.,\-\\^$|#\s]/g, '\\$&')
}

export default class SystemMap
{
  detail: any;
  name: string;
  stars: Array<any>;
  planets: Array<any>;
  objectsInSystem: Array<any>;

  constructor (system: any) {
    this.detail = system
    let { name = '', bodies: _bodies } = this.detail
    this.name = this.getSystemObjectName(name)

    // On the map, we draw a system view for each Star in a system, as that's
    // a great way to organise the information to make it easy to read.
    //
    // However, for this to work we need to to treat "Stars" that are more like
    // Planets (e.g. Class Y Brown Dawrf Stars or Class T Tauri Stars) that 
    // orbit other stars as if they were regular planets.
    //
    // We use our own classification system (stored in .type) for the purpose
    // of deciding how we want to treat them for the purposes of the system map
    let bodies = this.#findStarsOrbitingOtherStarsLikePlanets(_bodies || [])

    // Squash duplicate entries (e.g. Rhea system, where Rhea 4 is now Forsyth),
    // or you end up with two planets with different names and the same body id
    // on the map
    bodies = this.#getUniqueObjectsByProperty(bodies, 'body_id')

    this.stars = bodies.filter((body: SystemCelestial) => body?.type === 'Star')
    this.planets = bodies.filter((body: SystemCelestial) => body?.type === 'Planet')
    this.objectsInSystem = bodies.sort((a: SystemCelestial, b: SystemCelestial) => (a.body_id - b.body_id))

    // This object will be used to contain all on the map not directly oribiting
    // a star. There can be multiple 'Null' objects around which planets orbit
    // but we consolodate them all around one Null object with ID 0.
    this.stars.push({
      body_id: 0,
      name: 'Additional Objects',
      description: 'Objects not directly orbiting a star',
      type: 'Null',
      _type: 'Null',
      _children: []
    })

    this.init()
  }

  #getUniqueObjectsByProperty(arrayOfSystemObjects: any, key: any) {
    const systemObjectsBy64BitId: any = {}

    arrayOfSystemObjects.forEach((systemObject: SystemCelestial) => {
      const systemObjectWithTimestamp = JSON.parse(JSON.stringify(systemObject))
      systemObjectWithTimestamp.timestamp = systemObject?.discovered_at

      // This should never happen
      if (!systemObjectWithTimestamp.hasOwnProperty('id64')) {
        return console.log('#getUniqueObjectsByProperty error - systemObject does not have id64 property', systemObject)
      }

      if (systemObjectsBy64BitId[systemObjectWithTimestamp.id64]) {
        // If this item is newer, replace it with the one we already have
        if (Date.parse(systemObjectWithTimestamp.timestamp) > Date.parse(systemObjectsBy64BitId[systemObjectWithTimestamp.id64]?.discovery?.date)) {
          systemObjectsBy64BitId[systemObjectWithTimestamp.id64] = systemObjectWithTimestamp
        }
      } else {
        systemObjectsBy64BitId[systemObjectWithTimestamp.id64] = systemObjectWithTimestamp
      }
    })

    const prunedArrayOfSystemObjects = [
      ...Object.keys(systemObjectsBy64BitId).map(id64 => systemObjectsBy64BitId[id64])
    ]

    return [...new Map(prunedArrayOfSystemObjects.map(item => [item[key], item])).values()]
  }

  #findStarsOrbitingOtherStarsLikePlanets (_bodies: SystemCelestial[]) {
    const bodies = JSON.parse(JSON.stringify(_bodies))

    const starsOrbitingStarsLikePlanets: Array<any> = []

    bodies.forEach((body: SystemCelestial, i: number) => {
      if (body.type === 'Star' && body.body_id === null) body.body_id = 0

      body.type = body.type

      // Only applies to stars
      if (body.type !== 'Star') return

      // Never applies to main stars (the Mizar or Castor systems are listed as
      // having a parent object that doesn't actually exist, this check catches
      // that exception).
      if (body.is_main_star === true) return

      // If Star doesn't have any non-null parent objects (i.e. it's not 
      // orbiting a planet or star) then we still treat it as one of the
      // "main stars" and don't reclassify it as a Planet for the system map
      if (this.#getNearestNotNullParent(body) === null) return

      // Change each _type from 'Star' to 'Planet')
      body.type = 'Planet'

      // Add a standard radius property (based on it's Solar radius)
      // This property is required to be able to draw the body on a map
      body.radius = body.solar_radius * SOLAR_RADIUS

      // Save the ID of this Body for the loop below...
      starsOrbitingStarsLikePlanets.push(body.body_id)
    })

    // Update the 'parent' reference to each object orbiting 'star' from
    // orbiting a 'Star' to a 'Planet' so it's plotted correctly.
    bodies.forEach((body: SystemCelestial, i: number) => {
      (body?.parents ?? []).forEach((parent: SystemCelestial, i: number) => {
        const [k, v] = Object.entries(parent)[0]
        if (starsOrbitingStarsLikePlanets.includes(v) && body.parents) {
          body.parents[i] = { Planet: v }
        }
      })
    })
    
    return bodies
  }

  #getNearestNotNullParent(body: SystemCelestial) {
    let nonNullParent = null
    ;(body?.parents || []).every((parent: SystemCelestial) => {
      const [k, v] = Object.entries(parent)[0]
      if (k !== 'Null') {
        nonNullParent = v
        return false
      }
      return true
    })
    return nonNullParent
  }

  init () {
    for (const systemObject of this.objectsInSystem) {
      if (!systemObject.type) systemObject.type = systemObject.type
      
      systemObject.name = this.getSystemObjectName(systemObject.name)
      systemObject.label = this.getSystemObjectLabelFromSystemObject(systemObject)
    }

    // Calculate position to draw items on map
    let maxViewBoxWidth = MIN_VIEWBOX_WIDTH
    this.stars.forEach(star => {
      this.plotObjectsAroundStar(star)
      if (star._viewBox[2] > maxViewBoxWidth) maxViewBoxWidth = star._viewBox[2]
    })

    if (NORMALIZE_VIEWBOX_WIDTH) {
      this.stars.forEach(star => {
        star._viewBox[2] = maxViewBoxWidth
      })
    }
  }

  plotObjectsAroundStar (star: any) {
    // If USE_ICONS_FOR_PLANETS is set, use alternate metrics
    const MIN_R = USE_ICONS_FOR_PLANETS ? 800 : 800
    const MAX_R = USE_ICONS_FOR_PLANETS ? 800 : 2000
    const SUB_MIN_R = USE_ICONS_FOR_PLANETS ? 800 : 800
    const SUB_MAX_R = USE_ICONS_FOR_PLANETS ? 800 : 2000
    const R_DIVIDER = USE_ICONS_FOR_PLANETS ? 1 : 10
    const X_SPACING = USE_ICONS_FOR_PLANETS ? 1 : 600
    const Y_SPACING = USE_ICONS_FOR_PLANETS ? 1 : 600
    const MIN_LABEL_X_SPACING = SHOW_LABELS ? 5000 : 0
    const RING_X_SPACING_FACTOR = 0.8
    const Y_LABEL_OFFSET = SHOW_LABELS ? 800 : 0

    star._xMax = 0
    star._yMax = 0
    star._xOffset = 0
    star._yOffset = 0

    // let previousItemInOrbit = null
    // Get each objects directly orbiting star
    star._children = this.getChildren(star, true).map((itemInOrbit, i) => {
      // Ensure planets are always drawn slightly larger than their moons
      const MAIN_PLANET_MIN_R = MIN_R

      itemInOrbit._children = this.getChildren(itemInOrbit, false)

      itemInOrbit._r = itemInOrbit.radius / R_DIVIDER
      if (itemInOrbit._r < MAIN_PLANET_MIN_R) itemInOrbit._r = MAIN_PLANET_MIN_R
      if (itemInOrbit._r > MAX_R) itemInOrbit._r = MAX_R

      // Set attribute on smaller planets so we can select a different setting
      // on front end that will render them better
      if (itemInOrbit._r <= MAIN_PLANET_MIN_R) itemInOrbit._small = true

      itemInOrbit._y = 0
      itemInOrbit.orbitsStar = true

      // If this item (or the previous object) has rings, account for that
      // by makign sure there is more horizontal space between objects so that
      // the rings won't overlap when drawn.
      const itemXSpacing = (itemInOrbit.rings && !USE_ICONS_FOR_PLANETS) ? itemInOrbit._r / RING_X_SPACING_FACTOR : X_SPACING
      itemInOrbit._x = star._xMax + itemXSpacing + itemInOrbit._r

      const newYmax = itemInOrbit._r + X_SPACING
      if (newYmax > star._yOffset) star._yOffset = newYmax

      // If object has children,
      let newXmax = (itemInOrbit.rings) ? itemInOrbit._x + itemInOrbit._r + itemXSpacing : itemInOrbit._x + itemInOrbit._r
      if (itemInOrbit._children.length > 0 && (newXmax - star._xMax) < MIN_LABEL_X_SPACING) newXmax = star._xMax + MIN_LABEL_X_SPACING
      if (newXmax > star._xMax) star._xMax = newXmax

      // Initialize Y max with planet radius
      itemInOrbit._yMax = itemInOrbit._r + (Y_SPACING / 2)

      // Get every object that directly or indirectly orbits this item
      itemInOrbit._children
        //.sort((a, b) => (a.distanceToArrival - b.distanceToArrival))
        .sort((a: SystemCelestial, b: SystemCelestial) => (a.body_id - b.body_id))
        .map((subItemInOrbit: any) => {
          subItemInOrbit._r = subItemInOrbit.radius / R_DIVIDER
          if (subItemInOrbit._r < SUB_MIN_R) subItemInOrbit._r = SUB_MIN_R
          if (subItemInOrbit._r > SUB_MAX_R) subItemInOrbit._r = SUB_MAX_R

          // Set attribute on smaller planets so we can select a different setting
          // on front end that will render them better
          if (subItemInOrbit._r <= SUB_MIN_R) subItemInOrbit._small = true

          // Use parent X co-ords to plot on same vertical plane as parent
          subItemInOrbit._x = itemInOrbit._x

          // Use radius of current object to calclulate cumulative Y pos
          subItemInOrbit._y = itemInOrbit._yMax + subItemInOrbit._r + Y_SPACING

          // New Y max is  previous Y max plus current object radius plus spacing
          itemInOrbit._yMax = subItemInOrbit._y + subItemInOrbit._r

          subItemInOrbit.orbitsStar = false

          return subItemInOrbit
        })

      if (itemInOrbit._yMax > star._yMax) star._yMax = itemInOrbit._yMax

      // previousItemInOrbit = itemInOrbit
      return itemInOrbit
    })
    // Used by UI
    star.numberOfPlanets = star._children.filter((x: SystemCelestial) => x.type === 'Planet').length
    star._children.forEach((child: any) => {
      star.numberOfPlanets += child._children.filter((x: SystemCelestial) => x.type === 'Planet').length
    })

    // If last item had rings, add padding to avoid clipping them on the edge
    // star._xMax += previousItemInOrbit?.rings ? previousItemInOrbit._r / RING_X_SPACING_FACTOR : X_SPACING
    star._xMax += X_SPACING
    star._yMax += Y_SPACING

    // This will be used to track the maxium number number of objects orbiting
    // it that any planet in the system has. This is useful for knowing how
    // to constrain the height (or not) when drawning maps.
    star._maxObjectsInOrbit = 0
    star._children.forEach((objectInOrbit: any) => {
      if (objectInOrbit._children.length > star._maxObjectsInOrbit) { star._maxObjectsInOrbit = objectInOrbit._children.length }
    })

    star._yOffset += Y_LABEL_OFFSET
    star._viewBox = [
      0,
      parseInt(`-${star._yOffset}`),
      star._xMax + star._xOffset + 1500,
      star._yMax + star._yOffset
    ]
    return star
  }

  getBodyById (body_id: number) {
    return this?.objectsInSystem?.filter(body => body.body_id === body_id)
  }

  getNearestPlanet (systemObject: SystemCelestial) {
    const targetDistanceToArrival = systemObject.distance_to_arrival
    const planets = this.objectsInSystem.filter(body => body.type === 'Planet')
    if (planets.length === 0) return null
    return planets.reduce((ob1, ob2) => {
        return Math.abs(targetDistanceToArrival - ob2.distanceToArrival) < Math.abs(targetDistanceToArrival - ob1.distanceToArrival)
          ? ob2
          : ob1
      })
  }

  getNearestLandablePlanet (systemObject: SystemCelestial) {
    const targetDistanceToArrival = systemObject.distance_to_arrival
    const landablePlanets = this.objectsInSystem.filter(body => body.type === 'Planet' && body.isLandable)
    if (landablePlanets.length === 0) return null
    return landablePlanets.reduce((ob1, ob2) => {
        return Math.abs(targetDistanceToArrival - ob2.distanceToArrival) < Math.abs(targetDistanceToArrival - ob1.distanceToArrival)
          ? ob2
          : ob1
      })
  }

  getNearestStar(systemObject: SystemCelestial) {
    const targetDistanceToArrival = systemObject.distance_to_arrival
    const stars = this.objectsInSystem.filter(body => body.type === 'Star')
    if (stars.length === 0) return null
    if (stars.length === 1) return stars[0]
    return stars.reduce((ob1, ob2) => {
        return Math.abs(targetDistanceToArrival - ob2?.distanceToArrival ?? 0) < Math.abs(targetDistanceToArrival - ob1?.distanceToArrival ?? 0)
          ? ob2
          : ob1
      })
  }

  getChildren (targetBody: SystemCelestial, immediateChildren = true, filter = ['Planet']) {
    const children = []
    if (!targetBody?.type) return []

    for (const systemObject of this.objectsInSystem) {
      // By default only get Planets and Starports
      if (filter?.length && !filter.includes(systemObject?.type)) continue

      const inOrbitAroundStars = []
      const inOrbitAroundPlanets = []
      const inOrbitAroundNull = []
      let primaryOrbit = null
      let primaryOrbitType = null

      if (systemObject.parents) {
        for (const parent of systemObject.parents) {
          for (const key of Object.keys(parent)) {
            if (primaryOrbit === null) primaryOrbit = parent[key]
            if (primaryOrbitType === null) primaryOrbitType = key

            if (key === 'Star') inOrbitAroundStars.push(parent[key])
            if (key === 'Planet') inOrbitAroundPlanets.push(parent[key])
            if (key === 'Null') inOrbitAroundNull.push(parent[key])
          }
        }
      }

      if (!systemObject.parents) continue

      const nearestNonNullParent = this.#getNearestNotNullParent(systemObject)
      
      // Some systems to have multiple Null points round which bodies orbit.
      // We noramlize these all into one Null orbit (Body ID 0) to allow the map
      // to better visualize bodies that are not orbiting any specific star.
      // This ONLY applies to bodies that are not also orbiting another body.
      if ( primaryOrbitType === 'Null' && nearestNonNullParent === null) {
        primaryOrbit = 0
      }

      if (targetBody.type === 'Star' && inOrbitAroundStars.includes(targetBody.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === targetBody.body_id) {
          children.push(systemObject)
        } else if (immediateChildren === false) {
          children.push(systemObject)
        }
      } else if (targetBody.type === 'Planet' && inOrbitAroundPlanets.includes(targetBody.body_id)) {
        if (immediateChildren === true && nearestNonNullParent === targetBody.body_id) {
          children.push(systemObject)
        } else if (immediateChildren === false) {
          children.push(systemObject)
        }
      } else if (targetBody.type === 'Null' && primaryOrbitType === 'Null') {
        if (immediateChildren === true && primaryOrbit === targetBody.body_id) {
          children.push(systemObject)
        } else if (immediateChildren === false) {
          children.push(systemObject)
        }
      } else if (immediateChildren === false) {
        // TODO do nothing
      }
    }
    return children
  }

  getSystemObjectLabelFromSystemObject (systemObject: SystemCelestial) {
    if (systemObject.type && systemObject.type === 'Planet') {
      return systemObject.name
        // Next line is special case handling for renamed systems in Witch Head
        // Sector, it needs to be ahead of the line that strips the name as
        // some systems in Witch Head have bodies that start with name name of
        // the star as well but some don't (messy!)
        .replace(/Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+) /i, '')
        .replace(new RegExp(`^${escapeRegExp(this.name)} `, 'i'), '')
        .trim()
    } else if (systemObject.type && systemObject.type === 'Star') {
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
    // If the name contains 'Witch Head Sector' but does not start with it
    // then it is a renamed system and the Witch Head Sector bit is stripped
    if (systemObjectName.match(/Witch Head Sector/i) && !systemObjectName.match(/^Witch Head Sector/i)) {
     return systemObjectName.replace(/ Witch Head Sector ([A-z0-9\-]+) ([A-z0-9\-]+)/i, '').trim()
    }
    return systemObjectName
  }
}
